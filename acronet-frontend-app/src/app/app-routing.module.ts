import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './shared/not-found/not-found.component';
import { HomeComponent } from './modules/home/home.component';
import { AuthGuard } from './auth/auth.guard';
import { RegisterComponent } from './modules/register/register.component';
import { LoginComponent } from './modules/login/login.component';
import { CreateAcronymComponent } from './modules/create-acronym/create-acronym.component';
import { MyAcronymsComponent } from './modules/my-acronyms/my-acronyms.component';
import { AdminManagementComponent } from './modules/admin-management/admin-management.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/home' },
  { path: 'home', component: HomeComponent,  },
  { path: 'register', component: RegisterComponent,  },
  { path: 'login', component: LoginComponent,  },
  { path: 'create-acronym', component: CreateAcronymComponent, canActivate: [AuthGuard]},
  { path: 'my-acronyms', component: MyAcronymsComponent, canActivate: [AuthGuard]},
  { path: 'manage-users', component: AdminManagementComponent, canActivate: [AuthGuard]},
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes), CommonModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }
