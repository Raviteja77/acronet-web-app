import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmationService } from 'primeng/api';
import { AdminManagementComponent } from './admin-management.component';
import { AuthService } from 'src/app/auth/auth/auth.service';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { of } from 'rxjs';

describe('AdminManagementComponent', () => {
  let component: AdminManagementComponent;
  let fixture: ComponentFixture<AdminManagementComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let confirmationService: ConfirmationService;
  let confirmObject: { accept: Function, reject: Function };

  beforeEach(() => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['getAllUsers', 'deleteUser', 'updateUser']);

    TestBed.configureTestingModule({
      declarations: [AdminManagementComponent],
      imports: [TableModule, ButtonModule, ConfirmDialogModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        ConfirmationService,
      ],
    });

    const mockUsers = [
      {
        email: 'user1@example.com',
        user_name: 'User 1',
        user_type: 'user',
        password: 'password',
      },
      {
        email: 'user2@example.com',
        user_name: 'User 2',
        user_type: 'user',
        password: 'password',
      },
    ];

    fixture = TestBed.createComponent(AdminManagementComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    confirmationService = TestBed.inject(ConfirmationService);
    
    authService.getAllUsers.and.returnValue(of(mockUsers));
    confirmObject = { accept: () => null, reject: () => null };

    spyOn(confirmationService, 'confirm').and.callFake((confirmation: any): any => {
      confirmObject.accept = confirmation.accept;
      confirmObject.reject = confirmation.reject ?? (() => {}); // default noop function for reject
    });

    fixture.detectChanges();
  });

  it('should create the component', () => {
    const mockUsers = [
      {
        email: 'user1@example.com',
        user_name: 'User 1',
        user_type: 'user',
        password: 'password',
      },
      {
        email: 'user2@example.com',
        user_name: 'User 2',
        user_type: 'user',
        password: 'password',
      },
    ];

    expect(component).toBeTruthy();
    expect(authService.getAllUsers).toHaveBeenCalled();
    expect(component.users).toEqual(mockUsers);
  });

  it('should show confirmation dialog and delete user on accept', () => {
    const mockUser = { email: 'user1@example.com', user_name: 'User 1', user_type: 'user', password: 'password' };

    authService.deleteUser.and.returnValue(of([]));
    // Simulate user clicking "OK" in the confirmation dialog
    component.confirmationDialog(mockUser, 'delete');
    confirmObject.accept();
    fixture.detectChanges();

    // Now, you can test the logic after the user accepts the confirmation
    expect(authService.deleteUser).toHaveBeenCalledWith(mockUser.email);
    expect(component.users).toEqual([]);
  });

  it('should show confirmation dialog and update user on accept', () => {
    const mockUser = { email: 'user1@example.com', user_name: 'User 1', user_type: 'user', password: 'password' };

    authService.updateUser.and.returnValue(of([]));
    // Simulate user clicking "OK" in the confirmation dialog
    component.confirmationDialog(mockUser, 'update');
    confirmObject.accept();
    fixture.detectChanges();

    // Now, you can test the logic after the user accepts the confirmation
    expect(authService.updateUser).toHaveBeenCalledWith(jasmine.objectContaining(mockUser));
  });

  it('should not call the other-service on reject', () => {
    const mockUser = { email: 'user1@example.com', user_name: 'User 1', user_type: 'user', password: 'password' };
    
    // Simulate user clicking "Cancel" in the confirmation dialog
    component.confirmationDialog(mockUser, 'delete');
    confirmObject.reject();
    fixture.detectChanges();

    // Now, you can test the logic after the user rejects the confirmation
    expect(authService.deleteUser).not.toHaveBeenCalled();
    expect(authService.updateUser).not.toHaveBeenCalled();
  });
});
