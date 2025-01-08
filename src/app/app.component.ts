import { Component, inject } from '@angular/core';
import { AuthService } from './auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: 
  [
    CommonModule,
    FormsModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  title = 'project-jwtAngularDemo';
  authService = inject(AuthService);
  username: any;
  pw: any;

  constructor() {}

  submit() {
    this.authService.login({ email: this.username, password: this.pw }).subscribe( {
      next: (response: any) => {
        console.log('Login successful');
        console.log(response.token);
      },
      complete: () => {
        console.log('Request completed');
      },
      error: (error) => {
        console.log('Login failed');
        console.log(error);
      }
    });
  }

}
