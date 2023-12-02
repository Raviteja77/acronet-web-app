import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { AuthService } from '../auth/auth/auth.service';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authService: jasmine.SpyObj<AuthService>;
  let router: Router;

  beforeEach(() => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['isLoggedIn']);

    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        AuthGuard,
        { provide: AuthService, useValue: authServiceSpy },
      ],
    });

    guard = TestBed.inject(AuthGuard);
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow activation if user is logged in', () => {
    // Arrange
    authService.isLoggedIn = true;

    // Act & Assert
    expect(guard.canActivate(null!, null!)).toBe(true);
  });

  it('should redirect to login page if user is not logged in', () => {
    // Arrange
    authService.isLoggedIn = false;
    const navigateSpy = spyOn(router, 'navigate');

    // Act & Assert
    expect(guard.canActivate(null!, null!)).toBe(false);
    expect(navigateSpy).toHaveBeenCalledWith(['/login']);
  });
});
