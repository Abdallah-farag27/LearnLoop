import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { catchError, switchMap, filter, take, finalize, throwError, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export const authInterceptorFn: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const auth = inject(AuthService);
  const baseUrl = `${environment.apiUrl}/users`;

  console.log('[AuthInterceptor] Intercepted request:', req.url);

  // Skip login & refresh endpoints
  if (
    req.url.includes(`${baseUrl}/refreshtoken`) ||
    req.url.includes(`${baseUrl}/login`)
  ) {
    return next(req);
  }

  let authReq = req;
  const token = auth.getAccessToken();

  if (token) {
    console.log('[AuthInterceptor] Attaching token:', token);
    authReq = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  }

  return next(authReq).pipe(
    catchError((err) => {
      if (err instanceof HttpErrorResponse && err.status === 401) {
        console.warn('[AuthInterceptor] 401 detected, trying refresh...');
        return handle401(authReq, next, auth);
      }
      return throwError(() => err);
    })
  );
};

// Helper for handling token refresh
function handle401(
  req: HttpRequest<any>,
  next: HttpHandlerFn,
  auth: AuthService
): Observable<HttpEvent<any>> {
  if (!auth.isRefreshing) {
    console.log('[AuthInterceptor] Starting refresh flow...');
    auth.isRefreshing = true;
    auth.tokenSubject.next(null);

    return auth.refreshTokenCall().pipe(
      switchMap((newToken: string) => {
        console.log('[AuthInterceptor] New token received:', newToken);
        auth.tokenSubject.next(newToken);
        const cloned = req.clone({
          setHeaders: { Authorization: `Bearer ${newToken}` },
        });
        return next(cloned);
      }),
      catchError((err) => {
        console.error('[AuthInterceptor] Refresh failed, logging out...');
        auth.logout();
        return throwError(() => err);
      }),
      finalize(() => {
        console.log('[AuthInterceptor] Refresh flow completed.');
        auth.isRefreshing = false;
      })
    );
  } else {
    console.log('[AuthInterceptor] Already refreshing, waiting for new token...');
    return auth.tokenSubject.pipe(
      filter((t) => t != null),
      take(1),
      switchMap((token) => {
        console.log('[AuthInterceptor] Retrying request with new token:', token);
        const cloned = req.clone({
          setHeaders: { Authorization: `Bearer ${token}` },
        });
        return next(cloned);
      })
    );
  }
}
