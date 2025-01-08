import { Component, inject } from '@angular/core';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: 
  [
    CommonModule,
    FormsModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
currentUser: any;
authService = inject(AuthService);
routerService = inject(Router);

constructor() {
  this.authService.getCurrentUser().subscribe(response => {
    this.currentUser = response;
  }
  );
}

logout() {
  this.authService.logout();
  this.routerService.navigate(['/login']);
}
}
