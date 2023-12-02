import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HomeModule } from './modules/home/home.module';
import { SharedModule } from './shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { LoginModule } from './modules/login/login.module';
import { RegisterModule } from './modules/register/register.module';
import { CreateAcronymModule } from './modules/create-acronym/create-acronym.module';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { MyAcronymsModule } from './modules/my-acronyms/my-acronyms.module';
import { AdminManagementModule } from './modules/admin-management/admin-management.module';
import { DialogService } from 'primeng/dynamicdialog';
import { GlobalErrorHandler } from './core/global-error-handler/global-error-handler';
import { MessagesModule } from 'primeng/messages';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HomeModule,
    SharedModule,
    HttpClientModule,
    LoginModule,
    RegisterModule,
    CreateAcronymModule,
    ToastModule,
    MyAcronymsModule,
    AdminManagementModule,
    MessagesModule
  ],
  providers: [
    MessageService, 
    ConfirmationService, 
    DialogService,
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandler
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
