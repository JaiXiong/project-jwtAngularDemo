import { Component, inject } from '@angular/core';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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

constructor() {
  this.authService.getCurrentUser().subscribe(response => {
    this.currentUser = response;
  }
  );
}
}
