import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { environment } from 'src/environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpSpy: jasmine.SpyObj<HttpClient>;
  let messageServiceSpy: jasmine.SpyObj<MessageService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const spyHttpClient = jasmine.createSpyObj('HttpClient', ['get', 'post', 'put', 'delete']);
    const spyMessageService = jasmine.createSpyObj('MessageService', ['add']);
    const spyRouter = jasmine.createSpyObj('Router', ['navigateByUrl']);

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: HttpClient, useValue: spyHttpClient },
        { provide: MessageService, useValue: spyMessageService },
        { provide: Router, useValue: spyRouter }
      ]
    });
    service = TestBed.inject(AuthService);
    httpSpy = TestBed.inject(HttpClient) as jasmine.SpyObj<HttpClient>;
    messageServiceSpy = TestBed.inject(MessageService) as jasmine.SpyObj<MessageService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set isLoggedIn$ to true if user exists in local storage', () => {
    const user = {
      user_name: 'Admin',
      user_type: 'admin',
      email: 'admin@example.com',
      password: 'password'
    }
    spyOn(localStorage, 'getItem').and.callFake((key: string) => {
      if (key === 'user') {
        return JSON.stringify(user);
      }
      return null;
    });
    service = new AuthService(httpSpy, routerSpy, messageServiceSpy);

    expect(service.isLoggedIn).toEqual(true);
    expect(service.isLoggedIn$.value).toEqual(true);
  });

  it('should not set isLoggedIn$ to true if user does not exists in local storage', () => {
    spyOn(localStorage, 'getItem').and.returnValue(null);
    service = new AuthService(httpSpy, routerSpy, messageServiceSpy);

    expect(service.isLoggedIn).toEqual(false);
    expect(service.isLoggedIn$.value).toEqual(false);
  });

  it('should login the user for valid credentials', () => {
    const user = {
      user_name: 'Admin',
      password: 'password'
    }
    httpSpy.post.and.returnValue(of({}));
    service.login(user);

    expect(service.isLoggedIn).toEqual(true)
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/');
    expect(service.isLoggedIn$.value).toEqual(true);
  });

  it('should logout the user', () => {
    const user = {
      user_name: 'Admin',
      password: 'password'
    }
    httpSpy.post.and.returnValue(of({}));
    service.logout(user);

    expect(service.isLoggedIn).toEqual(false)
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/');
    expect(service.isLoggedIn$.value).toEqual(false);
  });

  it('should register the user', () => {
    const user = {
      user_name: 'Admin',
      user_type: 'admin',
      email: 'admin@example.com',
      password: 'password'
    }
    httpSpy.post.and.returnValue(of({}));
    service.signUp(user);

    expect(messageServiceSpy.add).toHaveBeenCalledWith({
      severity: 'success',
      detail: "Registration Successful",
    });
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/login');
  });

  it('should get all the users', () => {
    const mockUsers = [
      { user_name: 'test1', user_type: 'user', email: 'test1@gmail.com', password: 'password'},
      { user_name: 'test2', user_type: 'user', email: 'test2@gmail.com', password: 'password'},
      { user_name: 'test3', user_type: 'user', email: 'test3@gmail.com', password: 'password'},
    ];
    httpSpy.get.and.returnValue(of(mockUsers));
    service.getAllUsers().subscribe(data => {
      expect(data).toEqual(mockUsers);
    });
  });

  it('should delete the user', () => {
    const email = 'test@gmail.com';
    httpSpy.delete.and.returnValue(of({}));
    service.deleteUser(email).subscribe(_ => {
      expect(httpSpy.delete).toHaveBeenCalledWith(`${environment.baseURL}/user/delete/${email}`);
    });
  });

  it('should update the registered user', () => {
    const user = {
      user_name: 'test',
      user_type: 'user',
      email: 'test@example.com',
      password: 'password'
    }
    httpSpy.put.and.returnValue(of({}));
    service.updateUser(user).subscribe(_ => {
      expect(httpSpy.put).toHaveBeenCalledWith(`${environment.baseURL}/user/update`, user);
    })
  });
});
