import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly JWT_TOKEN = 'JWT TOKEN';
  private loggedUser?: string;
  private isAuthicatedSubject = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {}

  login(user: { email: string, password: string}): Observable<any> {
    const body = { email: user.email, password: user.password };
    return this.http.post<any>('http://localhost:3001/api/login/loginauth', body)
      .pipe(
        tap({
          next: (response: any) => {
          console.log('Response received:', response);
          this.doLoginUser(user.email, response.token);
        },
        complete: () => {
          console.log('Request completed');
        },
        error: (error) => {
          console.log('Error received:', error);
        }
      }));
  }

  private doLoginUser(email: string, token: any) {
    this.loggedUser = email;
    this.storeJwtTokens(token);
    this.isAuthicatedSubject.next(true);
  }

  private storeJwtTokens(jwt: any) {
    localStorage.setItem(this.JWT_TOKEN, jwt); //JSON.stringify(tokens));
  }

  getCurrentUser(): Observable<any> {
    const token = localStorage.getItem(this.JWT_TOKEN);
    return this.http.get('http://localhost:3001/api/login/currentuser');
    // , {
    //   headers: {
    //     Authorization: `Bearer ${token}`
    //   }
    // });
  }

  isLoggedIn() {
    //return this.isAuthicatedSubject.value;
    return !!localStorage.getItem(this.JWT_TOKEN);
  }

  logout() {
    localStorage.removeItem(this.JWT_TOKEN);
    this.isAuthicatedSubject.next(false);
    window.location.reload();
  }
}
