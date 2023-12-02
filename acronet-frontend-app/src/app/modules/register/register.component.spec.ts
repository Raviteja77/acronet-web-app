import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RegisterComponent } from './register.component';
import { AuthService } from 'src/app/auth/auth/auth.service';
import { of } from 'rxjs';
import { CardModule } from 'primeng/card';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['signUp']);

    TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      imports: [ReactiveFormsModule, CardModule],
      providers: [{ provide: AuthService, useValue: authServiceSpy }],
    });

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize userForm with default values', () => {
    const defaultValues = {
      user_name: '',
      user_type: 'user',
      email: '',
      password: '',
    };

    expect(component.userForm.value).toEqual(defaultValues);
  });

  it('should have required validators on form controls', () => {
    const formControls = component.form;
    expect(formControls['user_name'].hasError('required')).toBeTruthy();
    expect(formControls['password'].hasError('required')).toBeTruthy();
    expect(formControls['email'].hasError('required')).toBeTruthy();
  });

  it('should have maxLength validators on form controls', () => {
    const formControls = component.form;
    expect(formControls['user_name'].hasError('maxlength')).toBeFalsy();
    expect(formControls['password'].hasError('maxlength')).toBeFalsy();
    expect(formControls['email'].hasError('maxlength')).toBeFalsy();

    formControls['user_name'].setValue('a'.repeat(51));
    formControls['password'].setValue('b'.repeat(51));
    formControls['email'].setValue('b'.repeat(51));

    expect(formControls['user_name'].hasError('maxlength')).toBeTruthy();
    expect(formControls['password'].hasError('maxlength')).toBeTruthy();
    expect(formControls['email'].hasError('maxlength')).toBeTruthy();
  });

  it('should call signUp method on valid form submission', () => {
    const mockUserDetails = {
      user_name: 'testuser',
      user_type: 'user',
      email: 'testuser@example.com',
      password: 'password123',
    };

    component.userForm.setValue(mockUserDetails);
    component.onSubmit(component.userForm);

    expect(authService.signUp).toHaveBeenCalledWith(mockUserDetails);
  });

  it('should not call signUp method on invalid form submission', () => {
    const mockUserDetails = {
      user_name: 'testuser',
      user_type: 'user',
      email: 'invalid-email', // Invalid email
      password: 'password123',
    };

    component.userForm.setValue(mockUserDetails);
    component.onSubmit(component.userForm);

    expect(authService.signUp).not.toHaveBeenCalled();
  });

  it('should provide convenient access to form controls', () => {
    const user_nameControl = component.form['user_name'];
    const user_typeControl = component.form['user_type'];
    const emailControl = component.form['email'];
    const passwordControl = component.form['password'];

    expect(user_nameControl).toBeDefined();
    expect(user_typeControl).toBeDefined();
    expect(emailControl).toBeDefined();
    expect(passwordControl).toBeDefined();
  });
});
