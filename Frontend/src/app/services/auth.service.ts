import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

export interface User { id: string; name: string; email: string; roles?: string[]; }
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
  private baseUrl = 'http://localhost:3000/users';

  // helper used by interceptor to coordinate refresh
  public isRefreshing = false;
  public tokenSubject = new BehaviorSubject<string | null>(null);

  constructor(private http: HttpClient, private router: Router) {
    // Optionally restore access token from localStorage on app init
    const at = localStorage.getItem('access_token');
    const rt = localStorage.getItem('refresh_token');
    if (at) this.accessToken = at;
    if (rt) this.refreshToken = rt;
  }

  login(creds: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, creds).pipe(
      tap((res: any) => {
        if (res.accessToken) this.setAccessToken(res.accessToken);
        if (res.refreshToken) this.setRefreshToken(res.refreshToken);
        if (res.user) this.currentUser$.next(res.user);
        else this.fetchProfile().subscribe(); // get profile if not returned
      })
    );
  }

  fetchProfile(): Observable<User> {
    return this.http.get<User>('/api/auth/me').pipe(
      tap(user => this.currentUser$.next(user))
    );
  }

  setAccessToken(token: string) {
    this.accessToken = token;
    localStorage.setItem('access_token', token); // optional
  }

  setRefreshToken(token: string) {
    this.refreshToken = token;
    localStorage.setItem('refresh_token', token); // ⚠️ less secure
  }


  getAccessToken(): string | null {
    if (!this.accessToken) this.accessToken = localStorage.getItem('access_token');
    return this.accessToken;
  }

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

  refreshTokenCall(): Observable<string> {
    // if refresh token is stored as HttpOnly cookie, call refresh without body
    return this.http.post('/api/auth/refresh', {}).pipe(
      tap((res: any) => {
        if (res.accessToken) this.setAccessToken(res.accessToken);
      }),
      map((res: any) => res.accessToken),
      catchError(err => throwError(err))
    );
  }

  logout() {
    this.accessToken = null;
    this.refreshToken = null;
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.currentUser$.next(null);
    this.router.navigate(['/home']);
  }
  signup(payload: SignupPayload): Observable<any> {
    return this.http.post(`${this.baseUrl}/signup`, payload);
  }

}
