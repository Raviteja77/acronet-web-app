import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth/auth/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  userForm: FormGroup;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder
  ) {
    this.userForm = this.formBuilder.group({
      user_name: ['', [Validators.required, Validators.maxLength(50)]],
      user_type: ['user'],
      email: ['', [Validators.required, Validators.maxLength(50), Validators.email]],
      password: ['', [Validators.required, Validators.maxLength(50)]],
    });
  }

  onSubmit(userForm: FormGroup): void {
    if (userForm.valid) {
      let userDetails = userForm.value;
      this.authService.signUp(userDetails);
    }
  }

  get form() {
    return this.userForm.controls;
  }

}
