import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap, map, catchError, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

export interface User {
  id: string;
  username: string;
  email: string;
  admin: boolean;
  img?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SignupPayload {
  username: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  public currentUser$ = new BehaviorSubject<User | null>(null);
  private baseUrl = `${environment.apiUrl}/users`;

  public isRefreshing = false;
  public tokenSubject = new BehaviorSubject<string | null>(null);

  constructor(private http: HttpClient, private router: Router) {
    const at = localStorage.getItem('access_token');
    const rt = localStorage.getItem('refresh_token');
    if (at) this.accessToken = at;
    if (rt) this.refreshToken = rt;
  }

  /** login with credentials */
  login(creds: { email: string; password: string }): Observable<User> {
    return this.http.post<any>(`${this.baseUrl}/login`, creds).pipe(
      switchMap(res => {
        if (res.accessToken) this.setAccessToken(res.accessToken);
        if (res.refreshToken) this.setRefreshToken(res.refreshToken);

        // fetch user by returned id
        return this.getUserById(res.id).pipe(
          tap(user => {
            console.log('Fetched user:', user);
            this.currentUser$.next(user); // now emits pure User object
          })
        );
      })
    );
  }

  /** refresh call */
  refreshTokenCall(): Observable<string> {
    return this.http.post<any>(`${this.baseUrl}/refreshtoken`, {
      refreshtoken: this.refreshToken
    }).pipe(
      tap(newToken => console.log('[AuthInterceptor] Token refreshed:', newToken)),
      tap(res => {
        if (res.accessToken) this.setAccessToken(res.accessToken);
      }),
      map(res => res.accessToken),
      catchError(err => throwError(() => err))
    );
  }


  /** fetch profile by id */
  getUserById(userId: string): Observable<User> {
    return this.http
      .get<{ status: string; data: { user: User } }>(`${this.baseUrl}/${userId}`)
      .pipe(
        map(res => res.data.user) // unwrap the user
      );
  }


  /** update user */
  updateUser(data: Partial<User>): Observable<User> {
    return this.http
      .patch<{ status: string; data: { user: User } }>(`${this.baseUrl}`, data)
      .pipe(
        // unwrap the backend response to return the actual User
        map(res => res.data.user),
        tap(updated => {
          this.currentUser$.next(updated);
        })
      );
  }

  /** set tokens */
  setAccessToken(token: string) {
    this.accessToken = token;
    localStorage.setItem('access_token', token);
  }
  setRefreshToken(token: string) {
    this.refreshToken = token;
    localStorage.setItem('refresh_token', token);
  }
  getAccessToken(): string | null {
    if (!this.accessToken) this.accessToken = localStorage.getItem('access_token');
    return this.accessToken;
  }

  /** token helpers */
  isAccessTokenExpired(): boolean {
    const token = this.getAccessToken();
    if (!token) return true;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return Date.now() >= payload.exp * 1000;
    } catch {
      return true;
    }
  }
  isAuthenticated(): boolean {
    return !!this.getAccessToken() && !this.isAccessTokenExpired();
  }


  /** logout */
  logout() {
    this.accessToken = null;
    this.refreshToken = null;
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.currentUser$.next(null);
    this.router.navigate(['/home']);
  }

  /** signup */
  signup(payload: SignupPayload): Observable<any> {
    return this.http.post(`${this.baseUrl}/signup`, payload);
  }
}
