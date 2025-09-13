import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from '../../app/models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TasksService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getTasks(projectId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/projects/${projectId}/tasks`, { headers: this.getHeaders() });
  }

  createTask(projectId: string, taskData: Partial<Task>): Observable<any> {
    return this.http.post(`${this.apiUrl}/projects/${projectId}/tasks`, taskData, { headers: this.getHeaders() });
  }

  getTaskById(projectId: string, taskId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/projects/${projectId}/tasks/${taskId}`, { headers: this.getHeaders() });
  }

  updateTask(projectId: string, taskId: string, taskData: Partial<Task>): Observable<any> {
    return this.http.patch(`${this.apiUrl}/projects/${projectId}/tasks/${taskId}`, taskData, { headers: this.getHeaders() });
  }

  deleteTask(projectId: string, taskId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/projects/${projectId}/tasks/${taskId}`, { headers: this.getHeaders() });
  }

  uploadTaskFile(projectId: string, taskId: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.apiUrl}/projects/${projectId}/tasks/${taskId}/uploadfile`, formData, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      })
    });
  }

  downloadTaskFile(projectId: string, taskId: string, download: boolean = false): Observable<Blob> {
    const params = new HttpParams().set('download', download.toString());
    return this.http.get(`${this.apiUrl}/projects/${projectId}/tasks/${taskId}/file`, {
      headers: this.getHeaders(),
      params,
      responseType: 'blob'
    });
  }
}
