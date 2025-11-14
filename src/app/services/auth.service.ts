import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { AuthToken } from '../models/auth-token.model';
import { LoginRequest } from '../models/login.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'access_token';
  private readonly REFRESH_KEY = 'refresh_token';
  private readonly TYPE_KEY = 'token_type';
  private readonly EXPIRES_KEY = 'expires_in';

  private refreshing = false;
  private authApiUrl = '/api/v1/auth';
  accessToken$ = new BehaviorSubject<string | null>(this.getAccessToken());
  redirectUrl: string | null = null;

  constructor(private http: HttpClient) {}

  login(credentials: LoginRequest): Observable<AuthToken> {
    return this.http
      .post<AuthToken>(`${this.authApiUrl}/login`, credentials)
      .pipe(tap((token) => this.saveToken(token)));
  }

  private saveToken(token: AuthToken): void {
    localStorage.setItem(this.TOKEN_KEY, token.access_token);
    localStorage.setItem(this.REFRESH_KEY, token.refresh_token);
    localStorage.setItem(this.TYPE_KEY, token.token_type);

    const expiresIn = Date.now() + token.expires_in * 1000;
    localStorage.setItem(this.EXPIRES_KEY, expiresIn.toString());

    this.accessToken$.next(token.access_token);
  }

  refreshToken(): Observable<AuthToken> {
    const refreshToken = this.getRefreshToken();

    return this.http
      .post<AuthToken>(`${this.authApiUrl}/refresh`, { refresh_token: refreshToken })
      .pipe(tap((token) => this.saveToken(token)));
  }

  isExpired(): boolean {
    const exp = Number(localStorage.getItem(this.EXPIRES_KEY) || 0);
    return Date.now() > exp;
  }

  getTokenType(): string | null {
    return localStorage.getItem(this.TYPE_KEY);
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_KEY);
  }

  getDecodedToken(): any {
    const token = this.getAccessToken();
    return token ? jwtDecode(token) : null;
  }

  getRoles(): string[] {
    const decoded = this.getDecodedToken();
    return decoded?.realm_access?.roles || [];
  }

  hasRole(role: string): boolean {
    return this.getRoles().includes(role);
  }

  hasPermission(permission: string): boolean {
    const decoded = this.getDecodedToken();
    return decoded?.resource_access?.['gifto-front']?.roles?.includes(permission);
  }

  logout(): void {
    localStorage.clear();
    this.accessToken$.next(null);
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }
}
