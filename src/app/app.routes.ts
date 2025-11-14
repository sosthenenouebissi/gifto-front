import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Login } from './pages/auth/login/login';
import { Register } from './pages/auth/register/register';
import { ForgotPassword } from './pages/auth/forgot-password/forgot-password';
import { AuthGuard } from './guards/auth/auth-guard';
import { AlreadyAuthGuard } from './guards/auth/already-auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: Home,
    canActivate: [AuthGuard],
  },
  {
    path: 'login',
    component: Login,
    canActivate: [AlreadyAuthGuard],
  },
  {
    path: 'register',
    component: Register,
  },
  {
    path: 'forgot-password',
    component: ForgotPassword,
  },
];
