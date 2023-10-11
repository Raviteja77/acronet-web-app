import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ListboxModule } from 'primeng/listbox';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { SharedModule } from 'src/app/shared/shared.module';
import { AutoCompleteModule } from 'primeng/autocomplete';

@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    ListboxModule,
    FormsModule,
    InputTextModule,
    OverlayPanelModule,
    SharedModule,
    AutoCompleteModule
  ],
  exports: [
    HomeComponent
  ]
})
export class HomeModule { }
