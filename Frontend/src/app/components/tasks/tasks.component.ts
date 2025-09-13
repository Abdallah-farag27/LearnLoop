import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TasksService } from '../../../app/services/tasks.service';
import { Task } from '../../../app/models/task.model';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {
  tasks: Task[] = [];
  newTask: Partial<Task> = { title: '', status: 'todo', users: [], dueDate: '', description: '' };
  selectedProjectId: string = '';
  editingTask: Task | null = null;
  editingTaskForm: Partial<Task> = { title: '', status: 'todo', users: [], dueDate: '', description: '' };

  constructor(private tasksService: TasksService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.selectedProjectId = this.route.snapshot.paramMap.get('projectId') || '';
    this.loadTasks();
  }

  loadTasks() {
    this.tasksService.getTasks(this.selectedProjectId).subscribe({
      next: response => {
        this.tasks = response.data.tasks || [];
        console.log('Tasks loaded:', this.tasks);
      },
      error: error => {
        console.error('Error loading tasks:', error);
        alert('Failed to load tasks: ' + (error.error?.message || error.message));
      }
    });
  }

  addTask() {
    console.log('Add task called with:', this.newTask);
    if (!this.newTask.title || !this.newTask.dueDate) {
      console.error('Missing required fields: title or dueDate');
      alert('Please fill title and due date');
      return;
    }

    this.tasksService.createTask(this.selectedProjectId, this.newTask).subscribe({
      next: response => {
        console.log('API Response:', response);
        this.tasks.push(response.data.task);
        this.newTask = { title: '', status: 'todo', users: [], dueDate: '', description: '' };
        console.log('Task added to array:', response.data.task);
        alert('Task added successfully!');
      },
      error: error => {
        console.error('Error adding task:', error);
        if (error.status === 0) {
          alert('Network Error: Backend not running on http://localhost:3000 or CORS issue. Check console for details.');
        } else if (error.status === 401) {
          alert('Unauthorized: Please login first. Token missing.');
        } else if (error.status === 400) {
          alert('Bad Request: Check required fields (title, dueDate).');
        } else {
          alert('Error adding task: ' + (error.error?.message || error.message));
        }
      }
    });
  }

  editTask(task: Task) {
    this.editingTask = task;
    this.editingTaskForm = { ...task };
    console.log('Editing task:', this.editingTask, this.editingTaskForm);
  }

  updateTask() {
    if (this.editingTask && this.editingTask._id) {
      this.tasksService.updateTask(this.selectedProjectId, this.editingTask._id, this.editingTaskForm).subscribe({
        next: response => {
          const index = this.tasks.findIndex(t => t._id === this.editingTask?._id);
          this.tasks[index] = response.data.task;
          this.editingTask = null;
          this.editingTaskForm = { title: '', status: 'todo', users: [], dueDate: '', description: '' };
          console.log('Task updated:', response.data.task);
          alert('Task updated successfully!');
        },
        error: error => {
          console.error('Error updating task:', error);
          alert('Error updating task: ' + (error.error?.message || error.message));
        }
      });
    } else {
      console.error('No task selected for update or _id missing');
    }
  }

  cancelEdit() {
    this.editingTask = null;
    this.editingTaskForm = { title: '', status: 'todo', users: [], dueDate: '', description: '' };
    console.log('Edit cancelled');
  }

  deleteTask(taskId: string) {
    this.tasksService.deleteTask(this.selectedProjectId, taskId).subscribe({
      next: () => {
        this.tasks = this.tasks.filter(t => t._id !== taskId);
        console.log('Task deleted:', taskId);
        alert('Task deleted successfully!');
      },
      error: error => {
        console.error('Error deleting task:', error);
        alert('Error deleting task: ' + (error.error?.message || error.message));
      }
    });
  }

  markAsDone(task: Task) {
    if (task._id) {
      const updateData = { status: 'done' as const };
      this.tasksService.updateTask(this.selectedProjectId, task._id, updateData).subscribe({
        next: response => {
          const index = this.tasks.findIndex(t => t._id === task._id);
          this.tasks[index] = response.data.task;
          console.log('Task marked as done:', response.data.task);
          alert('Task marked as done!');
        },
        error: error => {
          console.error('Error marking task as done:', error);
          alert('Error marking task as done: ' + (error.error?.message || error.message));
        }
      });
    } else {
      console.error('Task ID missing for mark as done');
    }
  }

  uploadFile(event: any, taskId: string) {
    const file = event.target.files[0];
    if (file) {
      this.tasksService.uploadTaskFile(this.selectedProjectId, taskId, file).subscribe({
        next: response => {
          console.log('File uploaded:', response);
          alert('File uploaded successfully!');
        },
        error: error => {
          console.error('Error uploading file:', error);
          alert('Error uploading file: ' + (error.error?.message || error.message));
        }
      });
    }
  }

  downloadFile(taskId: string) {
    this.tasksService.downloadTaskFile(this.selectedProjectId, taskId, true).subscribe({
      next: blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `task-${taskId}.file`;
        a.click();
        console.log('File downloaded:', taskId);
        alert('File downloaded successfully!');
      },
      error: error => {
        console.error('Error downloading file:', error);
        alert('Error downloading file: ' + (error.error?.message || error.message));
      }
    });
  }
}
