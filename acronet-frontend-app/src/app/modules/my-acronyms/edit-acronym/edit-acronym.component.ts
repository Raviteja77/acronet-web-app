import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { AcronymsService } from 'src/app/services/acronyms/acronyms.service';

@Component({
  selector: 'app-edit-acronym',
  templateUrl: './edit-acronym.component.html',
  styleUrls: ['./edit-acronym.component.scss'],
})
export class EditAcronymComponent implements OnInit {
  openDialogForSuggestedAcronym: boolean = false;
  editForm = this.formBuilder.group({
    acronym_name: ['', [Validators.required, Validators.maxLength(10)]],
    full_form: ['', [Validators.required, Validators.maxLength(70)]],
    description: ['', [Validators.required, Validators.maxLength(300)]],
    location: ['', [Validators.required, Validators.maxLength(20)]],
    phone_number: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern("^[0-9]*$")]],
    email: ['', [Validators.required, Validators.maxLength(50), Validators.email]],
    status: [ { name: 'Pending', code: 'pending' } ],
    website: ['', [Validators.required, Validators.maxLength(100), Validators.pattern('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?')]],
  });
  status!: { name: string; code: string }[];
  userRole!: string;

  constructor(
    private formBuilder: FormBuilder,
    private acronymService: AcronymsService,
    private dialogConfig: DynamicDialogConfig,
    private messageService: MessageService,
    private dialogService: DialogService
  ) {}

  get buttonName() {
    return this.openDialogForSuggestedAcronym ? 'Suggested' : '';
  }

  get form() {
    return this.editForm.controls;
  }

  ngOnInit(): void {
    const suggestedAcronym = this.dialogConfig.data.suggestedAcronym;
    const user = localStorage.getItem('user');
    if (user) {
      this.userRole = JSON.parse(user)['user_type'];
    }
    if (this.dialogConfig.header === 'Edit Suggested Acronym') {
      this.openDialogForSuggestedAcronym = true;
    } else if (this.dialogConfig.header === 'Edit Acronym') {
      this.openDialogForSuggestedAcronym = false;
    }
    if (this.dialogConfig.data) {
      this.editForm
        .get('acronym_name')
        ?.patchValue(suggestedAcronym.acronym_name);
      this.editForm.get('full_form')?.patchValue(suggestedAcronym.full_form);
      this.editForm
        .get('description')
        ?.patchValue(suggestedAcronym.description);
      this.editForm.get('location')?.patchValue(suggestedAcronym.location);
      this.editForm
        .get('phone_number')
        ?.patchValue(suggestedAcronym.phone_number);
      this.editForm.get('email')?.patchValue(suggestedAcronym.email);
      this.editForm.get('status')?.patchValue(this.statusObj(suggestedAcronym.status));
      this.editForm.get('website')?.patchValue(suggestedAcronym.website);
    }
    this.status = [
      { name: 'Approved', code: 'approved' },
      { name: 'Rejected', code: 'rejected' },
      { name: 'Pending', code: 'pending' },
    ];

    this.messageService.messageObserver.subscribe(data => {
      if(data) {
        this.dialogService?.dialogComponentRefMap?.forEach(ref => {
          ref.destroy();
        })
      }
    })
  }

  statusObj(status: string) {
    if(status === 'approved') {
      return { name: 'Approved', code: 'approved' }
    } else if(status === 'rejected') {
      return { name: 'Rejected', code: 'rejected' }
    }
    return { name: 'Pending', code: 'pending' }
  } 

  onSubmit() {
    const form = this.editForm.value;
    if (this.openDialogForSuggestedAcronym) {
      this.acronymService.updateSuggestedAcronym(form, this.dialogConfig.data);
    } else {
      this.acronymService.updateAcronym(form);
    }
  }
}
