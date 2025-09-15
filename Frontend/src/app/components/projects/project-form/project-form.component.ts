import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ProjectService } from '@shared/services/projects.service';
import { environment } from 'src/environments/environment';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-project-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './project-form.component.html'
})
export class ProjectFormComponent {
  form: FormGroup;
  users: any[] = []; // All users from backend
  private baseUrl = `${environment.apiUrl}/users`;
  constructor(
    private fb: FormBuilder,
    private projectService: ProjectService,
    private router: Router,
    private http: HttpClient
  ) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      dueDate: ['', Validators.required],
      usernames: [[]] // array of selected usernames
    });
  }

  ngOnInit() {
    this.http.get<{ data: { users: any[] } }>(this.baseUrl)
      .subscribe({
        next: (res) => {
          this.users = res.data.users.filter(u => !u.admin); // exclude admins
          console.log("All the users : ", this.users);
        },
        error: (err) => console.error('Failed to fetch users', err)
      });
  }

  submit() {
    if (this.form.invalid) return;

    const formData = new FormData();
    Object.entries(this.form.value).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((val) => formData.append(key, val));
      } else if (value) {
        formData.append(key, value as string);
      }
    });

    this.projectService.createProject(formData).subscribe({
      next: () => this.router.navigate(['/projects']),
      error: (err) => console.error(err)
    });
  }
}
