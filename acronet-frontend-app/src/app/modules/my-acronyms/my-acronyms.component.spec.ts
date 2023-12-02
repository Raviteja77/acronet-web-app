import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject, of } from 'rxjs';
import { MyAcronymsComponent } from './my-acronyms.component';
import { AuthService } from 'src/app/auth/auth/auth.service';
import { AcronymsService } from 'src/app/services/acronyms/acronyms.service';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { EditAcronymComponent } from './edit-acronym/edit-acronym.component';
import { ConfirmationService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { ChipModule } from 'primeng/chip';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DropdownModule } from 'primeng/dropdown';

describe('MyAcronymsComponent', () => {
  let component: MyAcronymsComponent;
  let fixture: ComponentFixture<MyAcronymsComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let acronymService: jasmine.SpyObj<AcronymsService>;
  let dialogService: jasmine.SpyObj<DialogService>;
  let confirmationService: ConfirmationService;
  let confirmObject: { accept: Function, reject: Function };
  let formBuilder: FormBuilder;

  beforeEach(() => {
    const acronymServiceSpy = jasmine.createSpyObj('AcronymsService', ['getSuggestedAcronyms', 'deleteSuggestedAcronym']);
    const dialogServiceSpy = jasmine.createSpyObj('DialogService', ['open']);
    const authServiceSpy = jasmine.createSpyObj('authService', ['deleteAcronym']);
    TestBed.configureTestingModule({
      declarations: [MyAcronymsComponent],
      imports: [ReactiveFormsModule, TableModule, ChipModule, ButtonModule, InputTextModule, DynamicDialogModule, ConfirmDialogModule, DropdownModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: AcronymsService, useValue: acronymServiceSpy },
        { provide: DialogService, useValue: dialogServiceSpy },
        ConfirmationService,
        FormBuilder,
      ],
    });

    fixture = TestBed.createComponent(MyAcronymsComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    acronymService = TestBed.inject(AcronymsService) as jasmine.SpyObj<AcronymsService>;
    dialogService = TestBed.inject(DialogService) as jasmine.SpyObj<DialogService>;
    confirmationService = TestBed.inject(ConfirmationService) as jasmine.SpyObj<ConfirmationService>;
    formBuilder = TestBed.inject(FormBuilder);
    authService.isLoggedIn$ = new BehaviorSubject<boolean>(false);
    acronymServiceSpy.suggestedAcronyms$ = new BehaviorSubject<any>(null);
    confirmationService = TestBed.inject(ConfirmationService);
    confirmObject = { accept: () => null, reject: () => null };
    spyOn(confirmationService, 'confirm').and.callFake((confirmation: any): any => {
      confirmObject.accept = confirmation.accept;
      confirmObject.reject = confirmation.reject ?? (() => {}); // default noop function for reject
    });
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize properties on ngOnInit when user is logged in', () => {
    const mockSuggestedAcronym = [{ 
      acronym_name: 'ABC', 
      full_form: 'Alpha Beta Charlie',
      description: 'description',
      location: 'location',
      phone_number: 1234567890,
      email: 'abc@example.com',
      website: 'https://www.example.com',
      created_on: new Date(),
      suggested_by_name: 'username',
      suggested_by_email: 'email@gmail.com',
      status: 'pending'
    }];
    // Arrange
    authService.isLoggedIn$.next(true);
    acronymService.suggestedAcronyms$.next(mockSuggestedAcronym)

    // Act
    component.ngOnInit();

    // Assert
    expect(acronymService.getSuggestedAcronyms).toHaveBeenCalled();
    expect(component.suggestedAcronyms).toEqual(mockSuggestedAcronym);
  });

  it('should not initialize properties on ngOnInit when user is not logged in', () => {
    // Arrange
    authService.isLoggedIn$.next(false);

    // Act
    component.ngOnInit();

    // Assert
    expect(component.suggestedAcronyms).toEqual([]);
  });

  it('should open the edit acronym dialog when show is called', () => {
    // Arrange
    const mockSuggestedAcronym = { 
      acronym_name: 'ABC', 
      full_form: 'Alpha Beta Charlie',
      description: 'description',
      location: 'location',
      phone_number: 1234567890,
      email: 'abc@example.com',
      website: 'https://www.example.com',
      created_on: new Date(),
      suggested_by_name: 'username',
      suggested_by_email: 'email@gmail.com',
      status: 'pending'
    };

    // Act
    component.show(mockSuggestedAcronym);

    // Assert
    expect(dialogService.open).toHaveBeenCalledWith(EditAcronymComponent, {
      data: { suggestedAcronym: mockSuggestedAcronym },
      header: 'Edit Suggested Acronym',
      width: '70%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true,
    });
  });

  it('should set form values on editAcronym', () => {
    // Arrange
    const mockSuggestedAcronym = { 
      acronym_name: 'ABC', 
      full_form: 'Alpha Beta Charlie',
      description: 'description',
      location: 'location',
      phone_number: 1234567890,
      email: 'abc@example.com',
      website: 'https://www.example.com',
      created_on: new Date(),
      suggested_by_name: 'username',
      suggested_by_email: 'email@gmail.com',
      status: 'pending'
    };

    // Act
    component.editAcronym(mockSuggestedAcronym, 1);

    // Assert
    expect(component.editAcronymIndex).toBe(1);
    expect(component.acronymForm.get('acronym_name')?.value).toBe('ABC');
  });

  it('should open the confirmation dialog when confirmationDialog is called', () => {
    // Arrange
    const mockSuggestedAcronym = { 
      acronym_name: 'ABC', 
      full_form: 'Alpha Beta Charlie',
      description: 'description',
      location: 'location',
      phone_number: 1234567890,
      email: 'abc@example.com',
      website: 'https://www.example.com',
      created_on: new Date(),
      suggested_by_name: 'username',
      suggested_by_email: 'email@gmail.com',
      status: 'pending'
    };

    // Act
    component.confirmationDialog(mockSuggestedAcronym);

    // Assert
    expect(confirmationService.confirm).toHaveBeenCalledWith({
      message: 'Are you sure that you want to delete the acronym <strong>ABC</strong>?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: jasmine.any(Function),
    });
  });

  it('should delete the acronym when deleteAcronym is called', () => {
    // Arrange
    const mockSuggestedAcronym = { 
      acronym_name: 'ABC', 
      full_form: 'Alpha Beta Charlie',
      description: 'description',
      location: 'location',
      phone_number: 1234567890,
      email: 'abc@example.com',
      website: 'https://www.example.com',
      created_on: new Date(),
      suggested_by_name: 'username',
      suggested_by_email: 'email@gmail.com',
      status: 'pending'
    };
    acronymService.deleteSuggestedAcronym.and.returnValue(of([]));

    // Act
    component.confirmationDialog(mockSuggestedAcronym);
    confirmObject.accept();

    // Assert
    expect(acronymService.deleteSuggestedAcronym).toHaveBeenCalledWith(mockSuggestedAcronym.acronym_name);
    expect(component.suggestedAcronyms).toEqual([]);
  });
});
