import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreateAcronymComponent } from './create-acronym.component';
import { AcronymsService } from 'src/app/services/acronyms/acronyms.service';
import { of } from 'rxjs';

describe('CreateAcronymComponent', () => {
  let component: CreateAcronymComponent;
  let fixture: ComponentFixture<CreateAcronymComponent>;
  let formBuilder: FormBuilder;
  let acronymService: jasmine.SpyObj<AcronymsService>;

  beforeEach(() => {
    const acronymServiceSpy = jasmine.createSpyObj('AcronymsService', ['createSuggestedAcronym']);

    TestBed.configureTestingModule({
      declarations: [CreateAcronymComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: FormBuilder, useClass: FormBuilder },
        { provide: AcronymsService, useValue: acronymServiceSpy },
      ],
    });

    fixture = TestBed.createComponent(CreateAcronymComponent);
    component = fixture.componentInstance;
    formBuilder = TestBed.inject(FormBuilder);
    acronymService = TestBed.inject(AcronymsService) as jasmine.SpyObj<AcronymsService>;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with default values', () => {
    const defaultValues = {
      acronym_name: '',
      full_form: '',
      description: '',
      location: '',
      phone_number: '',
      email: '',
      website: '',
    };

    expect(component.createForm.value).toEqual(defaultValues);
  });

  it('should set up form controls with validators', () => {
    const controls = component.form;

    expect(controls.acronym_name.valid).toBeFalsy();
    expect(controls.full_form.valid).toBeFalsy();
    expect(controls.description.valid).toBeFalsy();
    expect(controls.location.valid).toBeFalsy();
    expect(controls.phone_number.valid).toBeFalsy();
    expect(controls.email.valid).toBeFalsy();
    expect(controls.website.valid).toBeFalsy();

    controls.acronym_name.setValue('ABC');
    controls.full_form.setValue('Full Form');
    controls.description.setValue('Description');
    controls.location.setValue('Location');
    controls.phone_number.setValue('1234567890');
    controls.email.setValue('test@example.com');
    controls.website.setValue('https://example.com');

    expect(controls.acronym_name.valid).toBeTruthy();
    expect(controls.full_form.valid).toBeTruthy();
    expect(controls.description.valid).toBeTruthy();
    expect(controls.location.valid).toBeTruthy();
    expect(controls.phone_number.valid).toBeTruthy();
    expect(controls.email.valid).toBeTruthy();
    expect(controls.website.valid).toBeTruthy();
  });

  it('should call AcronymsService.createSuggestedAcronym on form submission', () => {
    const mockFormValue = {
      acronym_name: 'ABC',
      full_form: 'Full Form',
      description: 'Description',
      location: 'Location',
      phone_number: '1234567890',
      email: 'test@example.com',
      website: 'https://example.com',
    };

    component.createForm.setValue(mockFormValue);
    component.onSubmit();

    expect(acronymService.createSuggestedAcronym).toHaveBeenCalledWith(mockFormValue);
  });

  it('should not call AcronymsService.createSuggestedAcronym if form is invalid', () => {
    const mockInvalidFormValue = {
      acronym_name: 'ABC',
      full_form: '', // Invalid, as it's required
      description: 'Description',
      location: 'Location',
      phone_number: '1234567890',
      email: 'test@example.com',
      website: 'https://example.com',
    };

    component.createForm.setValue(mockInvalidFormValue);
    component.onSubmit();

    expect(acronymService.createSuggestedAcronym).not.toHaveBeenCalled();
  });
});
