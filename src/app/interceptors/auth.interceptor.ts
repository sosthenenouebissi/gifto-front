import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { BehaviorSubject, catchError, filter, Observable, switchMap, take, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private refreshInProgress = false;
  private refreshTokenSubject = new BehaviorSubject<string | null>(null);

  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const accessToken = this.authService.getAccessToken();
    const tokenType = this.authService.getTokenType();

    if (accessToken) {
      const cloned = req.clone({
        setHeaders: {
          Authorization: `${tokenType} ${accessToken}`,
        },
      });
      return next.handle(cloned);
    }

    return next.handle(req).pipe(
      catchError((err) => {
        // Si token expiré OU 401 -> on tente refresh
        if (err.status === 401) {
          return this.handle401Error(req, next);
        }
        return throwError(() => err);
      })
    );
  }

  private handle401Error(req: HttpRequest<any>, next: HttpHandler) {
    if (!this.refreshInProgress) {
      this.refreshInProgress = true;
      this.refreshTokenSubject.next(null);

      const refreshCall = this.authService.refreshToken();
      if (!refreshCall) return throwError(() => new Error('No refresh token'));

      return refreshCall.pipe(
        switchMap((res) => {
          this.refreshInProgress = false;
          this.refreshTokenSubject.next(res.access_token);
          const tokenType = this.authService.getTokenType();

          const newReq = req.clone({
            setHeaders: { Authorization: `${tokenType} ${res.access_token}` },
          });

          return next.handle(newReq);
        }),
        catchError((error) => {
          this.refreshInProgress = false;
          this.authService.logout();
          return throwError(() => error);
        })
      );
    }

    // Si un refresh est déjà en cours → file d'attente
    return this.refreshTokenSubject.pipe(
      filter((token) => token !== null),
      take(1),
      switchMap((token) => {
        const newReq = req.clone({
          setHeaders: { Authorization: `Bearer ${token}` },
        });
        return next.handle(newReq);
      })
    );
  }
}
