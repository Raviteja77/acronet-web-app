import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AuthService } from 'src/app/auth/auth/auth.service';
import { SuggestAcronym } from 'src/app/interfaces/suggest-acronym.interface';
import { AcronymsService } from 'src/app/services/acronyms/acronyms.service';
import { EditAcronymComponent } from './edit-acronym/edit-acronym.component';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-my-acronyms',
  templateUrl: './my-acronyms.component.html',
  styleUrls: ['./my-acronyms.component.scss'],
})
export class MyAcronymsComponent implements OnInit {
  suggestedAcronyms: Array<SuggestAcronym> = [];
  editAcronymIndex: number = -1;
  acronymForm!: FormGroup;

  ref: DynamicDialogRef | undefined;

  constructor(
    private acronymService: AcronymsService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private dialogService: DialogService,
    private confirmationService: ConfirmationService
  ) {
    this.acronymForm = this.formBuilder.group({
      acronym_name: [''],
      full_form: [''],
      description: [''],
      location: [''],
      phone_number: [''],
      email: [''],
      website: [''],
    });
  }

  ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe((res) => {
      if (res) {
        this.acronymService.getSuggestedAcronyms();
      } else {
        this.acronymService.suggestedAcronyms$.next(null);
      }
    });
    this.acronymService.suggestedAcronyms$.subscribe(
      (data: SuggestAcronym[]) => {
        if (data) {
          this.suggestedAcronyms = data;
        }
      }
    );
  }

  show(suggestedAcronym: SuggestAcronym) {
    this.ref = this.dialogService.open(EditAcronymComponent, {
      data: {
        suggestedAcronym: suggestedAcronym,
      },
      header: 'Edit Suggested Acronym',
      width: '70%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true,
    });
  }

  editAcronym(suggestedAcronym: SuggestAcronym, index: number) {
    this.editAcronymIndex = index;
    if (suggestedAcronym) {
      this.acronymForm
        .get('acronym_name')
        ?.patchValue(suggestedAcronym.acronym_name);
    }
  }

  confirmationDialog(suggestedAcronym: SuggestAcronym) {
    this.confirmationService.confirm({
      message: `Are you sure that you want to delete the acronym <strong>${suggestedAcronym.acronym_name}</strong>?`,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteAcronym(suggestedAcronym.acronym_name);
      },
    });
  }

  deleteAcronym(suggestedAcronymName: string) {
    this.acronymService
      .deleteSuggestedAcronym(suggestedAcronymName)
      .subscribe((data: any) => {
        this.suggestedAcronyms = data;
      });
  }
}
