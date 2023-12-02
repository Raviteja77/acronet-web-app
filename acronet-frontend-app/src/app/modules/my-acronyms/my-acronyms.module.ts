import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyAcronymsComponent } from './my-acronyms.component';
import { TableModule } from 'primeng/table';
import { ChipModule } from 'primeng/chip';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ReactiveFormsModule } from '@angular/forms';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { EditAcronymComponent } from './edit-acronym/edit-acronym.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DropdownModule } from 'primeng/dropdown';


@NgModule({
  declarations: [
    MyAcronymsComponent,
    EditAcronymComponent
  ],
  imports: [
    CommonModule,
    TableModule,
    ChipModule,
    ButtonModule,
    InputTextModule,
    ReactiveFormsModule,
    DynamicDialogModule,
    ConfirmDialogModule,
    DropdownModule
  ]
})
export class MyAcronymsModule { }
