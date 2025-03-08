import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
    providedIn: 'root'
  })

  export class AuthService {
    private baseUrl = 'http://localhost:3334/api/v1/users';
    private userSubject = new BehaviorSubject<any>(this.getUserFromStorage());

    //private authStateChanged = new BehaviorSubject<string>('');
    public authState$ = this.userSubject.asObservable();

    constructor(private http: HttpClient, private snackBar: MatSnackBar){}

    public get userValue() {
        return this.userSubject.value;
      }

      login(email: string, password: string): Observable<any> {
        return this.http.post<any>(`${this.baseUrl}/login`, { email, password })
          .pipe(map(response => {
            // Store user details and token in local storage
            localStorage.setItem('user', JSON.stringify(response));
            this.userSubject.next(response);
            //this.authStateChanged.next('login');
            this.showNotification('Login successful');
            return response;
          }));
      }

      signup(name: string, email: string, password: string): Observable<any> {
        return this.http.post<any>(`${this.baseUrl}/signup`, { name, email, password })
          .pipe(map(response => {
            this.showNotification('Registration successful');
            return response;
          }));
      }

      logout() {
        // Remove user from local storage
        localStorage.removeItem('user');
        this.userSubject.next(null);
        this.showNotification('Logged out successfully');
      }

      isLoggedIn(): boolean {
        return !!this.userValue && !!this.userValue.token;
      }

      private getUserFromStorage() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
      }
    
      private showNotification(message: string) {
        this.snackBar.open(message, 'Close', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top'
        });
      }

  }