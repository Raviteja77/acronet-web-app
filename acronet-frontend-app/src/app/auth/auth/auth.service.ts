import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

import { BehaviorSubject, Observable, map } from 'rxjs';
import { LoginUser, RegisterUser } from 'src/app/interfaces/user.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isLoggedIn = false;
  isLoggedIn$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private _http: HttpClient, private router: Router, private messageService: MessageService) {
    const user = localStorage.getItem('user');
    if(user) {
      this.isLoggedIn = true;
      this.isLoggedIn$.next(true);
    }
  }

  login(loginDetails: LoginUser) {
    this._http.post(`${environment.baseURL}/login`, loginDetails).subscribe(response => {
      this.isLoggedIn = true;
      localStorage.setItem('user', JSON.stringify(response));
      this.router.navigateByUrl('/');
      this.isLoggedIn$.next(true);
    })
  }

  logout(loginDetails: LoginUser) {
    this._http.post(`${environment.baseURL}/logout`, loginDetails).subscribe(response => {
      this.isLoggedIn = false;
      this.isLoggedIn$.next(false);
      this.router.navigateByUrl('/');
    })
  }

  signUp(signUpDetails: RegisterUser) {
    return this._http.post(`${environment.baseURL}/signup`, signUpDetails).subscribe(_ => {
      this.messageService.add({severity:'success', detail:'Registration Successful'});
      this.router.navigateByUrl('/login');
    })
  }

  getAllUsers() {
    return this._http.get(`${environment.baseURL}/users`);
  }

  deleteUser(email: string) {
    return this._http.delete(`${environment.baseURL}/user/delete/${email}`);
  }

  updateUser(updatedUser: RegisterUser) {
    return this._http.put(`${environment.baseURL}/user/update`, updatedUser);
  }
}