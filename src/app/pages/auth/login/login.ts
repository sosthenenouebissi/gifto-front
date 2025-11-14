import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { LoginRequest } from '../../../models/login.model';

@Component({
  selector: 'app-login',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  loginForm = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
  });

  constructor(private router: Router, private authService: AuthService) {}

  onSubmit() {
    const credentials: LoginRequest = this.loginForm.value;
    this.authService.login(credentials).subscribe({
      next: () => {
        const target = this.authService.redirectUrl ?? '/';
        this.authService.redirectUrl = null; // reset
        this.router.navigateByUrl(target);
      },
      error: (err) => console.error(err),
    });
  }
}
