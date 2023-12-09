import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Message, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogComponent, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AcronymsService } from 'src/app/services/acronyms/acronyms.service';
import { EditAcronymComponent } from './edit-acronym.component';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { ComponentRef } from '@angular/core';
import { ButtonModule } from 'primeng/button';

describe('EditAcronymComponent', () => {
  let component: EditAcronymComponent;
  let fixture: ComponentFixture<EditAcronymComponent>;
  let formBuilder: FormBuilder;
  let acronymService: jasmine.SpyObj<AcronymsService>;
  let dynamicDialogConfig: DynamicDialogConfig;
  let messageService: jasmine.SpyObj<MessageService>;
  let dialogService: DialogService;
  let dynamicDialogRef: DynamicDialogRef;

  beforeEach(() => {
    const acronymServiceSpy = jasmine.createSpyObj('AcronymsService', ['updateSuggestedAcronym', 'updateAcronym']);
    const dynamicDialogRefSpy = jasmine.createSpyObj('DynamicDialogRef', ['destroy']);

    TestBed.configureTestingModule({
      declarations: [EditAcronymComponent],
      imports: [ReactiveFormsModule, ButtonModule],
      providers: [
        FormBuilder,
        { provide: AcronymsService, useValue: acronymServiceSpy },
        { provide: DynamicDialogRef, useValue: dynamicDialogRefSpy },
        DialogService,
        MessageService,
        DynamicDialogConfig,
      ],
    });

    fixture = TestBed.createComponent(EditAcronymComponent);
    component = fixture.componentInstance;
    formBuilder = TestBed.inject(FormBuilder);
    acronymService = TestBed.inject(AcronymsService) as jasmine.SpyObj<AcronymsService>;
    dynamicDialogConfig = TestBed.inject(DynamicDialogConfig);
    messageService = TestBed.inject(MessageService) as jasmine.SpyObj<MessageService>;
    dialogService = TestBed.inject(DialogService);
    dynamicDialogRef = TestBed.inject(DynamicDialogRef);
    messageService.messageObserver = new Observable<Message>();
    dialogService.dialogComponentRefMap = new Map<DynamicDialogRef, ComponentRef<DynamicDialogComponent>>;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize properties on ngOnInit when editing suggested acronym', () => {
    // Arrange
    dynamicDialogConfig.data = { suggestedAcronym: { acronym_name: 'ABC', full_form: 'Alpha Beta Charlie' } };
    dynamicDialogConfig.header = 'Edit Suggested Acronym';

    // Act
    component.ngOnInit();

    // Assert
    expect(component.openDialogForSuggestedAcronym).toBeTruthy();
    expect(component.editForm.get('acronym_name')?.value).toBe('ABC');
    // ... other assertions for form initialization
  });

  it('should initialize properties on ngOnInit when editing acronym', () => {
    // Arrange
    const mockSuggestedAcronym = { 
      acronym_name: 'ABC', 
      full_form: 'Alpha Beta Charlie',
      description: 'description',
      location: 'location',
      phone_number: '1234567890',
      email: 'abc@example.com',
      website: 'https://www.example.com',
      created_on: new Date(),
      suggested_by_name: 'username',
      suggested_by_email: 'email@gmail.com',
      status: 'pending'
    };
    dynamicDialogConfig.header = 'Edit Acronym';
    dynamicDialogConfig.data = { suggestedAcronym: mockSuggestedAcronym };

    // Act
    component.ngOnInit();

    // Assert
    expect(component.openDialogForSuggestedAcronym).toBeFalsy();
  });

  it('should set buttonName correctly', () => {
    // Arrange
    component.openDialogForSuggestedAcronym = true;

    // Assert
    expect(component.buttonName).toBe('Suggested');
  });

  it('should call updateSuggestedAcronym when onSubmit is called for suggested acronym', () => {
    // Arrange
    component.openDialogForSuggestedAcronym = true;
    const formValue = { 
      acronym_name: 'ABC', 
      full_form: 'Alpha Beta Charlie',
      description: 'description',
      location: 'location',
      phone_number: '1234567890',
      email: 'abc@example.com',
      website: 'https://www.example.com',
      status: { name: 'Pending', code: 'pending' }
    };
    component.editForm.setValue(formValue);

    // Act
    component.onSubmit();

    // Assert
    expect(acronymService.updateSuggestedAcronym).toHaveBeenCalledWith(formValue, undefined);
  });

  it('should call updateAcronym when onSubmit is called for regular acronym', () => {
    // Arrange
    component.openDialogForSuggestedAcronym = false;
    const formValue = { 
      acronym_name: 'ABC', 
      full_form: 'Alpha Beta Charlie',
      description: 'description',
      location: 'location',
      phone_number: '1234567890',
      email: 'abc@example.com',
      website: 'https://www.example.com',
      status: { name: 'Pending', code: 'pending' }
    };
    component.editForm.setValue(formValue);

    // Act
    component.onSubmit();

    // Assert
    expect(acronymService.updateAcronym).toHaveBeenCalledWith(formValue);
  });
});
