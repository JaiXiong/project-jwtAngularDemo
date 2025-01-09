import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { jwtDecode } from "jwt-decode";

@Injectable({
  providedIn: 'root',
})

export class AuthService {
  private readonly JWT_TOKEN = 'JWT_TOKEN';
  private loggedUser?: string;
  private isAuthicatedSubject = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {}

  login(user: { email: string, password: string}): Observable<any> {
    const body = { email: user.email, password: user.password };
    return this.http.post<any>('http://localhost:3001/api/login/loginauth', body)
      .pipe(
        tap({
          next: (tokens: any) => {
          console.log('Response received:', tokens);
          this.doLoginUser(user.email, JSON.stringify(tokens));
        },
        complete: () => {
          console.log('Request completed');
        },
        error: (error) => {
          console.log('Error received:', error);
        }
      }));
  }

  private doLoginUser(email: string, tokens: any) {
    this.loggedUser = email;
    this.storeJwtTokens(tokens);
    this.isAuthicatedSubject.next(true);
  }

  private storeJwtTokens(jwt: any) {
    localStorage.setItem(this.JWT_TOKEN, jwt); //JSON.stringify(tokens));
    //localStorage.setItem(this.REFRESH_TOKEN, tokens.refreshToken); //JSON.stringify(tokens));
  }

  getCurrentUser(): Observable<any> {
    return this.http.get('http://localhost:3001/api/login/currentuser');
  }

  isLoggedIn() {
    //return this.isAuthicatedSubject.value;
    return !!localStorage.getItem(this.JWT_TOKEN);
  }

  isTokenExpired() {
    const tokens = localStorage.getItem(this.JWT_TOKEN);
    if (!tokens) {
      return true
    }
    const token = JSON.parse(tokens).access_token;
    const decoded = jwtDecode(token);
    if (!decoded.exp) {
      return true;
    }
    const expirationDate = decoded.exp * 1000;
    const now = Date.now();

    console.log('Token expiration:', new Date(expirationDate));
    console.log('Current time:', new Date(now));

    return expirationDate < now;
  }
  catch (error: any) {
    console.error('Error decoding token:', error);
    return true;
  }

  refreshToken() {
    var tokens: any = localStorage.getItem(this.JWT_TOKEN);
    if (!tokens) {
      return;
    }
    tokens = JSON.parse(tokens);
    const refreshToken = JSON.parse(tokens).refreshToken;
    return this.http.post('http://localhost:3001/api/login/refreshtoken', {refreshToken}).pipe(
      tap({
        next: (response: any) => {
          console.log('Token refreshed:', response);
          this.storeJwtTokens(response.token);
        },
        complete: () => {
          console.log('Request completed');
        },
        error: (error) => {
          console.log('Error refreshing token:', error);
        }
      }));
  }


  logout() {
    localStorage.removeItem(this.JWT_TOKEN);
    //localStorage.removeItem(this.REFRESH_TOKEN);
    this.isAuthicatedSubject.next(false);
    window.location.reload();
  }
}

