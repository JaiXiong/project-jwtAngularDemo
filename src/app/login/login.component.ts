import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: 
  [
    CommonModule,
    FormsModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  email: any;
  pw: any;
  currentUser: any;
  authService = inject(AuthService);
  routerService = inject(Router);

submit() {
    this.authService.login({ email: this.email, password: this.pw }).pipe(
        switchMap((response: any) => {
          console.log('Login successful', response.token);
          return this.authService.getCurrentUser();
      })
    ).subscribe({
      next: (response: any) => {
        console.log('Current user1:', response);
        this.currentUser = response;
        console.log('Current user2:', this.currentUser);
      },
      complete: () => {
        console.log('Request completed');
        this.routerService.navigate(['/']);
      },
      error: (error: any) => {
        console.log('Login failed');
        console.log(error);
      }
    }
    );
  }

  logout() {
    this.authService.logout();
    this.routerService.navigate(['/login']);
  }
}
