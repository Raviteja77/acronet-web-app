import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateAcronymComponent } from './create-acronym.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextareaModule } from 'primeng/inputtextarea';



@NgModule({
  declarations: [
    CreateAcronymComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextareaModule
  ]
})
export class CreateAcronymModule { }
