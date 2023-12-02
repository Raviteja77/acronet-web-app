import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './home.component';
import { AcronymsService } from 'src/app/services/acronyms/acronyms.service';
import { AuthService } from 'src/app/auth/auth/auth.service';
import { BehaviorSubject, of } from 'rxjs';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ListboxModule } from 'primeng/listbox';
import { InputTextModule } from 'primeng/inputtext';
import { SharedModule } from 'src/app/shared/shared.module';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { DialogService } from 'primeng/dynamicdialog';
import { ConfirmationService } from 'primeng/api';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let formBuilder: FormBuilder;
  let acronymService: jasmine.SpyObj<AcronymsService>;
  let authService: jasmine.SpyObj<AuthService>;
  let dialogService: jasmine.SpyObj<DialogService>;
  let confirmationService: ConfirmationService;
  let confirmObject: { accept: Function, reject: Function };

  beforeEach(() => {
    const acronymServiceSpy = jasmine.createSpyObj('AcronymsService', [
      'getAllAcronyms',
      'getSuggestedAcronyms',
      'getRecentSuggestedAcronyms',
    ]);

    const authServiceSpy = jasmine.createSpyObj('AuthService', ['deleteAcronym']);

    const dialogServiceSpy = jasmine.createSpyObj('DialogService', ['dialogComponentRefMap']);
    TestBed.configureTestingModule({
      declarations: [HomeComponent],
      imports: [
        ReactiveFormsModule,
        CardModule,
        ButtonModule,
        ListboxModule,
        InputTextModule,
        SharedModule,
        AutoCompleteModule,
      ],
      providers: [
        { provide: FormBuilder, useClass: FormBuilder },
        { provide: AcronymsService, useValue: acronymServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: DialogService, useValue: dialogServiceSpy },
        ConfirmationService,
      ],
    });

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    formBuilder = TestBed.inject(FormBuilder);
    acronymService = TestBed.inject(
      AcronymsService
    ) as jasmine.SpyObj<AcronymsService>;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    dialogService = TestBed.inject(DialogService) as jasmine.SpyObj<DialogService>;
    confirmationService = TestBed.inject(ConfirmationService);

    authService.isLoggedIn$ = new BehaviorSubject<boolean>(false);
    acronymService.acronymUpdated$ = new BehaviorSubject<boolean>(false);
    acronymService.suggestedAcronyms$ = new BehaviorSubject<any>(null);

    confirmObject = { accept: () => null, reject: () => null };

    spyOn(confirmationService, 'confirm').and.callFake((confirmation: any): any => {
      confirmObject.accept = confirmation.accept;
      confirmObject.reject = confirmation.reject ?? (() => {}); // default noop function for reject
    });

    const mockAcronyms = [
      {
        acronym_name: 'ABC',
        full_form: 'Full Form',
        description: 'description',
        location: 'location',
        phone_number: '1234567890',
        email: 'test@gmail.com',
        website: 'https://example.com',
        created_on: Date.now(),
      },
    ];
    
    acronymService.acronymUpdated$.next(false);
    acronymService.getAllAcronyms.and.returnValue(of(mockAcronyms));
    acronymService.getRecentSuggestedAcronyms.and.returnValue(of(mockAcronyms));
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form groups', () => {
    expect(component.autoCompleteFormGroup).toBeDefined();
    expect(component.chipsFormGroup).toBeDefined();
  });

  it('should fetch acronyms and format labels on initialization', () => {
    authService.isLoggedIn$.next(true);

    fixture.detectChanges();

    expect(acronymService.getAllAcronyms).toHaveBeenCalled();
    expect(acronymService.getRecentSuggestedAcronyms).toHaveBeenCalled();
    expect(component.groupedAcronyms.length).toBe(1);
  });

  it('should fetch suggested acronyms on user login', () => {
    authService.isLoggedIn$.next(true);

    fixture.detectChanges();

    expect(acronymService.getSuggestedAcronyms).toHaveBeenCalled();
  });

  it('should reset suggested acronyms when user is not logged in', () => {
    authService.isLoggedIn$.next(false);

    fixture.detectChanges();

    expect(acronymService.suggestedAcronyms$.getValue()).toBeNull();
  });

  it('should fetch recent suggested acronyms on initialization', () => {
    const mockRecentSuggestedAcronyms = [
      {
        acronym_name: 'ABC',
        full_form: 'ABC',
        description: 'description',
        location: 'location',
        phone_number: '1234567890',
        email: 'test@gmail.com',
        website: 'https://example.com',
        status: 'approved',
        suggested_by_email: 'user@gmail.com',
        suggested_by_name: 'username',
        created_on: new Date("2023-11-12"),
      },
      {
        acronym_name: 'XYZ',
        full_form: 'XYZ',
        description: 'description',
        location: 'location',
        phone_number: '1234567890',
        email: 'test@gmail.com',
        website: 'https://example.com',
        status: 'approved',
        suggested_by_email: 'user@gmail.com',
        suggested_by_name: 'username',
        created_on: new Date("2023-11-13"),
      },
      {
        acronym_name: 'XYZ',
        full_form: 'XYZ',
        description: 'description',
        location: 'location',
        phone_number: '1234567890',
        email: 'test@gmail.com',
        website: 'https://example.com',
        status: 'approved',
        suggested_by_email: 'user@gmail.com',
        suggested_by_name: 'username',
        created_on: new Date("2023-11-13"),
      },
    ];
    acronymService.getRecentSuggestedAcronyms.and.returnValue(
      of(mockRecentSuggestedAcronyms)
    );

    fixture.detectChanges();

    acronymService.getRecentSuggestedAcronyms().subscribe(data => {
      expect(component.newlyCreatedAcronyms).toEqual([
        {
          label: 'XYZ - XYZ',
          value: 'XYZ',
        },
        {
          label: 'XYZ - XYZ',
          value: 'XYZ',
        },
        {
          label: 'ABC - ABC',
          value: 'ABC',
        }
      ])
    });
  });

  it('should handle acronym selection', () => {
    const mockAcronym = { label: 'TEST - Test Acronym', value: 'TEST' };
    component.handleSelection(mockAcronym);

    expect(component.searchKeyword).toEqual(mockAcronym);
    expect(component.recentAcronyms.length).toBe(1);
  });

  it('should filter grouped acronyms based on AutoCompleteEvent', fakeAsync(() => {
    component.groupedAcronyms = [
      {
        label: 'XYZ - XYZ',
        value: 'XYZ',
      },
      {
        label: 'XYZ - XYZ',
        value: 'XYZ',
      },
      {
        label: 'ABC - ABC',
        value: 'ABC',
      }
    ];
    const mockEvent: any = { query: 'ABC' };
    component.filterGroupedAcronyms(mockEvent);
    tick();

    // expect(component.filteredGroups.length).toBe(1);
    expect(component.filteredGroups[0].label).toContain('ABC');
  }));

  it('should handle selection clear', () => {
    component.handleSelectionClear([]);

    expect(component.showSearchIcon).toBe(true);
    // expect(component.clearSelection).toHaveBeenCalled(); // Make sure you have a clearSelection method
  });

  it('should handle selected recent acronym', () => {
    const mockRecentAcronym = { label: 'RECENT - Recent Acronym', value: 'RECENT' };
    component.handleSelectedRecentAcronym(mockRecentAcronym);

    expect(component.searchKeyword).toEqual(mockRecentAcronym);
    expect(component.autoCompleteFormGroup.get('selectedAcronym')?.value).toEqual(mockRecentAcronym);
    expect(component.showSearchIcon).toBe(false);
  });

  it('should handle selected filters', () => {
    const mockEvent = { checked: [{ name: 'Schools' }] };
    component.handleSelectedFilters(mockEvent);

    expect(component.selectedFilterNames).toContain('Schools');
    expect(component.chipsFormGroup.get('selectedFilterNames')?.value).toBe('Schools');
  });
});
