import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AcronymsService } from 'src/app/services/acronyms/acronyms.service';

@Component({
  selector: 'app-create-acronym',
  templateUrl: './create-acronym.component.html',
  styleUrls: ['./create-acronym.component.scss']
})
export class CreateAcronymComponent {
  createForm = this.formBuilder.group({
    acronym_name: ['', [Validators.required, Validators.maxLength(10)]],
    full_form: ['', [Validators.required, Validators.maxLength(70)]],
    description: ['', [Validators.required, Validators.maxLength(300)]],
    location: ['', [Validators.required, Validators.maxLength(20)]],
    phone_number: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern("^[0-9]*$")]],
    email: ['', [Validators.required, Validators.maxLength(50), Validators.email]],
    website: ['', [Validators.required, Validators.maxLength(100), Validators.pattern('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?')]]
  });

  constructor(private formBuilder: FormBuilder, private acronymService: AcronymsService) {}

  get form() {
    return this.createForm.controls;
  }

  onSubmit() {
    const form = this.createForm.value;
    if(this.createForm.valid) {
      this.acronymService.createSuggestedAcronym(form);
    }
  }

}
