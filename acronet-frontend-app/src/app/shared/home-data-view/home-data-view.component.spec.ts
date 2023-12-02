import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, SimpleChanges } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { HomeDataViewComponent } from './home-data-view.component';
import { AuthService } from 'src/app/auth/auth/auth.service';
import { AcronymsService } from 'src/app/services/acronyms/acronyms.service';
import { Acronym } from 'src/app/interfaces/acronym.interface';
import { EditAcronymComponent } from 'src/app/modules/my-acronyms/edit-acronym/edit-acronym.component';
import { DataViewModule } from 'primeng/dataview';
import { ButtonModule } from 'primeng/button';
import { SharedModule } from '../shared.module';
import { DialogService } from 'primeng/dynamicdialog';
import { HttpClient } from '@angular/common/http';

describe('HomeDataViewComponent', () => {
  let component: HomeDataViewComponent;
  let fixture: ComponentFixture<HomeDataViewComponent>;
  let authService: AuthService;
  let acronymsServiceSpy: jasmine.SpyObj<AcronymsService>;
  let dialogServiceSpy: jasmine.SpyObj<DialogService>;
  let confirmationService: ConfirmationService;
  let confirmObject: { accept: Function, reject: Function };
  let httpSpy: jasmine.SpyObj<HttpClient>;
  let messageServiceSpy: jasmine.SpyObj<MessageService>;

  beforeEach((() => {
    const spyHttpClient = jasmine.createSpyObj('HttpClient', ['get', 'post', 'put', 'delete']);
    const spyMessageService = jasmine.createSpyObj('MessageService', ['add']);
    acronymsServiceSpy = jasmine.createSpyObj('AcronymsService', ['getAllAcronyms', 'deleteAcronym']);
    dialogServiceSpy = jasmine.createSpyObj('DialogService', ['open']);
    // Create a BehaviorSubject for acronymUpdated$
    acronymsServiceSpy.acronymUpdated$ = new BehaviorSubject<boolean>(false);
    
    TestBed.configureTestingModule({
      declarations: [HomeDataViewComponent],
      imports: [DataViewModule, ButtonModule, SharedModule],
      providers: [
        AuthService,
        { provide: AcronymsService, useValue: acronymsServiceSpy },
        { provide: DialogService, useValue: dialogServiceSpy },
        { provide: HttpClient, useValue: spyHttpClient },
        { provide: MessageService, useValue: spyMessageService },
        ConfirmationService,  
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    httpSpy = TestBed.inject(HttpClient) as jasmine.SpyObj<HttpClient>;
    messageServiceSpy = TestBed.inject(MessageService) as jasmine.SpyObj<MessageService>;
    fixture = TestBed.createComponent(HomeDataViewComponent);
    component = fixture.componentInstance;
    confirmationService = TestBed.inject(ConfirmationService);
    confirmObject = { accept: () => null, reject: () => null };
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    spyOn(confirmationService, 'confirm').and.callFake((confirmation: any): any => {
      confirmObject.accept = confirmation.accept;
      confirmObject.reject = confirmation.reject ?? (() => {}); // default noop function for reject
    });
  }));


  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should get acronyms on initialization', () => {
    const mockAcronyms: Acronym[] = [{
      acronym_name: 'ABC',
      full_form: 'Full Form',
      description: 'Description',
      location: 'Location',
      phone_number: '1234567890',
      email: 'test@example.com',
      website: 'https://example.com',
      created_on: new Date()
    }];
    acronymsServiceSpy.getAllAcronyms.and.returnValue(of(mockAcronyms));

    fixture.detectChanges();

    expect(component.acronyms).toEqual(mockAcronyms);
  });

  it('should return acronyms', () => {
    const mockAcronyms: Acronym[] = [{
      acronym_name: 'ABC',
      full_form: 'Full Form',
      description: 'Description',
      location: 'Location',
      phone_number: '1234567890',
      email: 'test@example.com',
      website: 'https://example.com',
      created_on: new Date()
    }];
    component.acronyms = mockAcronyms;

    expect(component.getAcronyms()).toEqual(mockAcronyms);
  })

  it('should update acronyms when acronymUpdated$ is triggered', () => {
    const mockAcronyms: Acronym[] = [{
      acronym_name: 'ABC',
      full_form: 'Full Form',
      description: 'Description',
      location: 'Location',
      phone_number: '1234567890',
      email: 'test@example.com',
      website: 'https://example.com',
      created_on: new Date()
    }];
    acronymsServiceSpy.acronymUpdated$.next(true);
    acronymsServiceSpy.getAllAcronyms.and.returnValue(of(mockAcronyms));

    fixture.detectChanges();

    expect(component.acronyms).toEqual(mockAcronyms);
  });

  it('should set filteredAcronyms when ngOnChanges is called with searchedAcronym', () => {
    const mockAcronyms: Acronym[] = [{
      acronym_name: 'ABC',
      full_form: 'Full Form',
      description: 'Description',
      location: 'Location',
      phone_number: '1234567890',
      email: 'test@example.com',
      website: 'https://example.com',
      created_on: new Date()
    }];
    component.acronyms = mockAcronyms;

    component.ngOnChanges({ searchedAcronym: { currentValue: { value: 'ABC', label: 'Full Form' }, previousValue: null, firstChange: true, isFirstChange: () => true } } as SimpleChanges);

    expect(component.getAcronyms()).toEqual(mockAcronyms);
  });

  it('should set filteredAcronyms to null when ngOnChanges is called with searchedAcronym not matched', () => {
    const mockAcronyms: Acronym[] = [{
      acronym_name: 'ABC',
      full_form: 'Full Form',
      description: 'Description',
      location: 'Location',
      phone_number: '1234567890',
      email: 'test@example.com',
      website: 'https://example.com',
      created_on: new Date()
    }];
    component.acronyms = mockAcronyms;

    component.ngOnChanges({ searchedAcronym: { currentValue: { value: 'TEST', label: 'Full Form' }, previousValue: null, firstChange: true, isFirstChange: () => true } } as SimpleChanges);

    expect(component.getAcronyms()).toEqual([]);
    expect(component.filteredAcronyms === null);
  });

  it('should open the confirmation dialog when ConfirmationDialog is called', () => {
    const mockAcronym: Acronym = {
      acronym_name: 'ABC',
      full_form: 'Full Form',
      description: 'Description',
      location: 'Location',
      phone_number: '1234567890',
      email: 'test@example.com',
      website: 'https://example.com',
      created_on: new Date()
    };

    acronymsServiceSpy.deleteAcronym.and.returnValue(of([]));
    acronymsServiceSpy.getAllAcronyms.and.returnValue(of(mockAcronym));
    authService.isLoggedIn$.next(false);

    // Simulate user clicking "OK" in the confirmation dialog
    component.ConfirmationDialog(mockAcronym);
    confirmObject.accept();

    expect(acronymsServiceSpy.deleteAcronym).toHaveBeenCalledWith(mockAcronym.acronym_name);
    expect(confirmationService.confirm).toHaveBeenCalled();
  });

  it('should get acronyms and sort them', () => {
    // Arrange
    const mockAcronyms = [
      {
        acronym_name: 'Charlie',
        full_form: 'Charlie',
        description: 'Description',
        location: 'Location',
        phone_number: '1234567890',
        email: 'test@example.com',
        website: 'https://example.com',
        created_on: ''
      },
      {
        acronym_name: 'Alpha',
        full_form: 'Alpha',
        description: 'Description',
        location: 'Location',
        phone_number: '1234567890',
        email: 'test@example.com',
        website: 'https://example.com',
        created_on: ''
      },
      {
        acronym_name: 'Beta',
        full_form: 'Beta',
        description: 'Description',
        location: 'Location',
        phone_number: '1234567890',
        email: 'test@example.com',
        website: 'https://example.com',
        created_on: ''
      },
      {
        acronym_name: 'Beta',
        full_form: 'Beta',
        description: 'Description',
        location: 'Location',
        phone_number: '1234567890',
        email: 'test@example.com',
        website: 'https://example.com',
        created_on: ''
      },
    ];
    acronymsServiceSpy.getAllAcronyms.and.returnValue(of(mockAcronyms));

    component.getAllAcronyms();

    expect(component.getAcronyms()).toEqual([
      {
        acronym_name: 'Alpha',
        full_form: 'Alpha',
        description: 'Description',
        location: 'Location',
        phone_number: '1234567890',
        email: 'test@example.com',
        website: 'https://example.com',
        created_on: ''
      },
      {
        acronym_name: 'Beta',
        full_form: 'Beta',
        description: 'Description',
        location: 'Location',
        phone_number: '1234567890',
        email: 'test@example.com',
        website: 'https://example.com',
        created_on: ''
      },
      {
        acronym_name: 'Beta',
        full_form: 'Beta',
        description: 'Description',
        location: 'Location',
        phone_number: '1234567890',
        email: 'test@example.com',
        website: 'https://example.com',
        created_on: ''
      },
      {
        acronym_name: 'Charlie',
        full_form: 'Charlie',
        description: 'Description',
        location: 'Location',
        phone_number: '1234567890',
        email: 'test@example.com',
        website: 'https://example.com',
        created_on: ''
      },
    ]); // Sorted alphabetically
  });

  it('should open the edit acronym dialog when show is called', () => {
    const mockAcronym: Acronym = {
      acronym_name: 'ABC',
      full_form: 'Full Form',
      description: 'Description',
      location: 'Location',
      phone_number: '1234567890',
      email: 'test@example.com',
      website: 'https://example.com',
      created_on: new Date()
    };

    component.show(mockAcronym);

    expect(dialogServiceSpy.open).toHaveBeenCalledWith(EditAcronymComponent, {
      data: { suggestedAcronym: mockAcronym },
      header: 'Edit Acronym',
      width: '70%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true,
    });
  });
});
