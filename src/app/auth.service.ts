import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { jwtDecode } from "jwt-decode";
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})

export class AuthService {
  private readonly JWT_TOKEN = 'JWT_TOKEN';
  private readonly REFRESH_TOKEN = 'REFRESH_TOKEN';
  private loggedUser?: string;
  private isAuthicatedSubject = new BehaviorSubject<boolean>(false);

  private cookieService = inject(CookieService);

  constructor(private http: HttpClient) {}

  login(user: { email: string, password: string}): Observable<any> {
    const body = { email: user.email, password: user.password };
    return this.http.post<any>('http://localhost:3001/api/login/loginauth', body)
      .pipe(
        tap({
          next: (tokens) => {
          console.log('Response received:', tokens);
          this.doLoginUser(user.email, tokens.access_token, tokens.refresh_token);
        },
        complete: () => {
          console.log('Request completed');
        },
        error: (error) => {
          console.log('Error received:', error);
        }
      }));
  }

  private doLoginUser(email: string, acesstoken: any, refreshtoken: any) {
    // console.log('Tokens in doLoginUser:', tokens);
    // this.loggedUser = email;
    // this.storeJwtTokens(tokens);
    // this.isAuthicatedSubject.next(true);
    console.log('Raw response:', acesstoken, refreshtoken);

  this.loggedUser = email;
  this.storeJwtTokens({
    access_token: acesstoken,
    refresh_token: refreshtoken
  });
  this.isAuthicatedSubject.next(true);
  }

  private storeJwtTokens(tokens: any) {
    console.log('Tokens to store:', tokens);
    localStorage.setItem(this.JWT_TOKEN, tokens.access_token); //JSON.stringify(tokens));
    // Store refresh token in secure cookie
    this.cookieService.set(
      this.REFRESH_TOKEN, 
      tokens.refresh_token,
      {
        secure: true,
        sameSite: 'Strict',
        expires: 7  // expires in 7 days
      }
    );
    console.log('Stored refresh token:', this.cookieService.get(this.REFRESH_TOKEN));
    localStorage.setItem(this.REFRESH_TOKEN, tokens.refreshToken); //JSON.stringify(tokens));
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

  refreshToken(): Observable<any> {
    var refreshToken = this.cookieService.get(this.REFRESH_TOKEN);
    if (!refreshToken) {
      console.error('No refresh token found');
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${refreshToken}`);
    
    return this.http.post('http://localhost:3001/api/login/refreshtoken', {}, { headers }).pipe(
      tap({
        next: (response: any) => {
          console.log('Token refreshed:', response);
          //this.storeJwtTokens(response);
          this.storeJwtTokens({
            access_token: response.access_token,
            refresh_token: this.cookieService.get(this.REFRESH_TOKEN)
          });
        },
        complete: () => {
          console.log('Request completed');
        },
        error: (error) => {
          console.log('Error refreshing token:', error);
        }
      }));
    // var storedTokens: any = localStorage.getItem(this.JWT_TOKEN);
    // if (!storedTokens) {
    //   return;
    // }
    
    // try {
    //   const tokens = JSON.parse(storedTokens);
    //   console.log('Parsed tokens:', tokens);
    //   console.log('Token properties:', Object.keys(tokens));
  
    //   // Check both possible token properties
    //   const refreshToken = tokens.refresh_token || tokens.refreshToken;
      
    //   if (!refreshToken) {
    //     console.error('No refresh token found. Token object:', tokens);
    //     return;
    //   }

    // return this.http.post('http://localhost:3001/api/login/refreshtoken', {refreshToken}).pipe(
    //   tap({
    //     next: (response: any) => {
    //       console.log('Token refreshed:', response);
    //       //this.storeJwtTokens(response.token);
    //       this.storeJwtTokens(response.access_token);
    //     },
    //     complete: () => {
    //       console.log('Request completed');
    //     },
    //     error: (error) => {
    //       console.log('Error refreshing token:', error);
    //     }
    //   }));
    // } catch (error) {
    //   console.error('Token parsing error:', error);
    //   return;
    // }
  }


  logout() {
    localStorage.removeItem(this.JWT_TOKEN);
    //localStorage.removeItem(this.REFRESH_TOKEN);
    this.isAuthicatedSubject.next(false);
    window.location.reload();
  }
}

