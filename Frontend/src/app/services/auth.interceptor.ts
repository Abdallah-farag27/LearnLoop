import { Injectable } from '@angular/core';
import {
  HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap, filter, take, finalize } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // don't attach token to auth endpoints to avoid recursion
    if (req.url.includes('/auth/refresh') || req.url.includes('/auth/login') || req.url.includes('/auth/logout')) {
      return next.handle(req);
    }

    const token = this.auth.getAccessToken();
    let authReq = req;
    if (token) authReq = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });

    return next.handle(authReq).pipe(
      catchError(err => {
        if (err instanceof HttpErrorResponse && err.status === 401) {
          return this.handle401(authReq, next);
        }
        return throwError(err);
      })
    );
  }

  private handle401(req: HttpRequest<any>, next: HttpHandler) {
    if (!this.auth.isRefreshing) {
      this.auth.isRefreshing = true;
      this.auth.tokenSubject.next(null);

      return this.auth.refreshTokenCall().pipe(
        switchMap((newToken: string) => {
          this.auth.tokenSubject.next(newToken);
          const cloned = req.clone({ setHeaders: { Authorization: `Bearer ${newToken}` } });
          return next.handle(cloned);
        }),
        catchError(err => {
          this.auth.logout();
          return throwError(err);
        }),
        finalize(() => { this.auth.isRefreshing = false; })
      );
    } else {
      // wait until tokenSubject has a non-null token
      return this.auth.tokenSubject.pipe(
        filter(t => t != null),
        take(1),
        switchMap((token) => {
          const cloned = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
          return next.handle(cloned);
        })
      );
    }
  }
}
