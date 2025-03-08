import { AuthService } from './services/auth.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { SocketService } from './services/socket.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: false
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Real-Time To-Do List';
  public isAuthenticated = false;
  private authSubscription: Subscription | null = null;
  private _user: any;

  constructor(private socketService: SocketService, 
    private authService: AuthService,
     private router: Router) {}

  ngOnInit() {
    this.socketService.connect();
    this.authService.authState$.subscribe(user => {
      this._user = user;
      const isAuthenticated = user !== null;
      this.isAuthenticated = isAuthenticated;
    });
  }

  ngOnDestroy() {
    this.socketService.disconnect();
  }

  public logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}