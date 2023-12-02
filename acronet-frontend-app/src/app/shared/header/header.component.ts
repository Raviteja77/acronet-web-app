import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth/auth.service';
import { AcronymsService } from 'src/app/services/acronyms/acronyms.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  visible: boolean = false;
  position: string = 'top-right';
  username: string = '';
  userRole: string = '';
  isMyAcronymsAvailable: boolean = false;
  loginSubscription!: Subscription;
  suggestedAcronymSubscription!: Subscription;
  constructor(
    public authService: AuthService,
    private router: Router,
    public acronymService: AcronymsService
  ) {}

  ngOnInit(): void {
    this.loginSubscription = this.authService.isLoggedIn$.subscribe((_) => {
      const user = localStorage.getItem('user');
      if (user) {
        this.username = JSON.parse(user)['user_name'];
        this.userRole = JSON.parse(user)['user_type'];
      }
    });
    this.suggestedAcronymSubscription =
      this.acronymService.suggestedAcronyms$.subscribe((data) => {
        if (data) {
          this.isMyAcronymsAvailable = true;
        }
      });
  }

  ngOnDestroy(): void {
    if (this.loginSubscription) {
      this.loginSubscription.unsubscribe();
    }
    if (this.suggestedAcronymSubscription) {
      this.suggestedAcronymSubscription.unsubscribe();
    }
  }

  logout(): void {
    const user = localStorage.getItem('user');
    if (user) {
      this.authService.logout(JSON.parse(user));
      localStorage.removeItem('user');
      localStorage.removeItem('suggested-acronyms');
      this.router.navigate(['/']);
    }
  }

  showDialog() {
    this.visible = !this.visible;
  }
}
