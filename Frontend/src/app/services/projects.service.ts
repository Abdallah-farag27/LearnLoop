import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, combineLatest, map, of, switchMap } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

// Define your interfaces
export interface Project {
  _id: string;
  title: string;
  description: string;
  admin: { _id: string; username: string };
  users: { _id: string; username: string }[];
  dueDate: string;
  img: string;
}

export interface User {
  _id: string;
  username: string;
  admin: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private apiUrl = `${environment.apiUrl}/projects`; // change if needed

  // ✅ State management
  private projectsSubject = new BehaviorSubject<Project[]>([]);
  projects$ = this.projectsSubject.asObservable();

  constructor(private http: HttpClient, private authService: AuthService) { }

  // --------------------
  // 🔹 PROJECT APIs
  // --------------------

  getAllProjects(): void {
    this.http.get<{ data: { projects: Project[] } }>(this.apiUrl)
      .subscribe({
        next: (res) => this.projectsSubject.next(res.data.projects),
        error: (err) => console.error('Error fetching projects:', err),
      });
  }

  getProjectById(id: string): Observable<Project> {
    return this.http.get<{ data: { project: Project } }>(`${this.apiUrl}/${id}`)
      .pipe(map(res => res.data.project));
  }

  createProject(projectData: FormData): Observable<Project> {
    return this.http.post<{ data: { project: Project } }>(this.apiUrl, projectData)
      .pipe(map(res => res.data.project));
  }

  updateProject(id: string, projectData: FormData): Observable<Project> {
    return this.http.patch<{ data: { project: Project } }>(`${this.apiUrl}/${id}`, projectData)
      .pipe(map(res => res.data.project));
  }

  deleteProject(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  addMember(projectId: string, username: string): Observable<Project> {
    return this.http.post<{ data: { project: Project } }>(
      `${this.apiUrl}/${projectId}/users`,
      { username }
    ).pipe(map(res => res.data.project));
  }

  removeMember(projectId: string, userId: string): Observable<Project> {
    return this.http.delete<{ data: { project: Project } }>(
      `${this.apiUrl}/${projectId}/users`,
      { body: { userId } }
    ).pipe(map(res => res.data.project));
  }

  // --------------------
  // 🔹 USER FILTER FUNCTION
  // --------------------

  getUsersFilteredByCurrent(): Observable<User[]> {
    return combineLatest([
      this.http.get<{ data: { users: User[] } }>('http://localhost:5000/api/users'),
      this.authService.currentUser$
    ]).pipe(
      map(([res, currentUser]) => {
        if (!currentUser) return [];
        return res.data.users.filter(u => u._id !== currentUser.id);
      })
    );
  }

  getProjectsByCurrentAdmin(): Observable<Project[]> {
    return this.authService.currentUser$.pipe(
      switchMap((currentUser) => {
        if (!currentUser) {
          return of([]); // no user logged in → return empty list
        }

        return this.http
          .get<{ data: { projects: Project[] } }>(this.apiUrl)
          .pipe(
            map((res) =>
              res.data.projects.filter(
                (p) => p.admin._id === currentUser.id
              )
            )
          );
      })
    );
  }

}
