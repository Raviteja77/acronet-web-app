import { Component, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { AuthService } from 'src/app/auth/auth/auth.service';
import { RegisterUser } from 'src/app/interfaces/user.interface';

@Component({
  selector: 'app-admin-management',
  templateUrl: './admin-management.component.html',
  styleUrls: ['./admin-management.component.scss'],
})
export class AdminManagementComponent implements OnInit {
  users: RegisterUser[] = [];
  outlined: boolean = true;

  constructor(
    private authService: AuthService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.getAllUsers();
  }

  getAllUsers(): void {
    this.authService.getAllUsers()?.subscribe((users: any) => {
      this.users = users;
    });
  }

  confirmationDialog(user: RegisterUser, status: string, userType: string) {
    this.confirmationService.confirm({
      message: `Are you sure that you want to ${status} the user <strong>${user.email}</strong>?`,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if(status == 'update') {
          this.updateUser(user, userType);
        } else if(status == 'delete') {
          this.deleteUser(user.email);
        }
      },
    });
  }

  deleteUser(email: string) {
    this.authService.deleteUser(email).subscribe((data: any) => {
      this.users = data
    })
  }

  updateUser(user: RegisterUser, userType: string) {
    user['user_type'] = userType === 'admin'? 'user': 'admin';
    this.authService.updateUser(user).subscribe(data => {});
  }
}
