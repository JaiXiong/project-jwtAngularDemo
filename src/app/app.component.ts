import { Component, inject } from '@angular/core';
import { AuthService } from './auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { switchMap } from 'rxjs';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: 
  [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  title = 'project-jwtAngularDemo';
  authService = inject(AuthService);
  username: any;
  pw: any;
  currentUser: any;

  constructor() {}

  // submit() {
  //   this.authService.login({ email: this.username, password: this.pw }).pipe(
  //       switchMap((response: any) => {
  //         console.log('Login successful', response.token);
  //         return this.authService.getCurrentUser();
  //     })
  //   ).subscribe({
  //     next: (response: any) => {
  //       console.log('Current user1:', response);
  //       this.currentUser = response;
  //       console.log('Current user2:', this.currentUser);
  //     },
  //     complete: () => {
  //       console.log('Request completed');
  //     },
  //     error: (error) => {
  //       console.log('Login failed');
  //       console.log(error);
  //     }
  //   }
  //   );

    //let's practice with rxjs instead of promises
    // this.authService.login({ email: this.username, password: this.pw }).subscribe( {
    //   next: (response: any) => {
    //     console.log('Login successful');
    //     console.log(response.token);
    //     this.authService.getCurrentUser().subscribe(response => {
    //       console.log('Current user:', response);
    //       console.log('Current user:', this.currentUser);
    //       this.currentUser = response;
    //     });
    //     //this.currentUser = response;
    //   },
    //   complete: () => {
    //     console.log('Request completed');
    //   },
    //   error: (error) => {
    //     console.log('Login failed');
    //     console.log(error);
    //   }
    // });
  }

  // logout() {
  //   this.authService.logout();
  // }
//}
