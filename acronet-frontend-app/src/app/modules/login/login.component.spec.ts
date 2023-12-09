import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login.component';
import { AuthService } from 'src/app/auth/auth/auth.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    // Create a spy object for the AuthService
    authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);

    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [ReactiveFormsModule],
      providers: [{ provide: AuthService, useValue: authServiceSpy }],
    });

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with the correct controls', () => {
    const formControls = component.form;
    expect(formControls['user_name']).toBeTruthy();
    expect(formControls['password']).toBeTruthy();
  });

  it('should have required validators on form controls', () => {
    const formControls = component.form;
    expect(formControls['user_name'].hasError('required')).toBeTruthy();
    expect(formControls['password'].hasError('required')).toBeTruthy();
  });

  it('should have maxLength validators on form controls', () => {
    const formControls = component.form;
    expect(formControls['user_name'].hasError('maxlength')).toBeFalsy();
    expect(formControls['password'].hasError('maxlength')).toBeFalsy();

    formControls['user_name'].setValue('a'.repeat(51));
    formControls['password'].setValue('b'.repeat(51));

    expect(formControls['user_name'].hasError('maxlength')).toBeTruthy();
    expect(formControls['password'].hasError('maxlength')).toBeTruthy();
  });

  it('should call AuthService.login when form is submitted with valid data', () => {
    const formControls = component.form;
    formControls['user_name'].setValue('validUsername');
    formControls['password'].setValue('validPassword');

    component.onSubmit(component.userForm);

    expect(authServiceSpy.login).toHaveBeenCalledWith({
      user_name: 'validUsername',
      password: 'validPassword',
    });
  });

  it('should not call AuthService.login when form is submitted with invalid data', () => {
    // No need to set values, form is invalid by default

    component.onSubmit(component.userForm);

    expect(authServiceSpy.login).not.toHaveBeenCalled();
  });
});
