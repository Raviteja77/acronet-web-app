import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SidePanelCardComponent } from './side-panel-card.component';
import { AuthService } from 'src/app/auth/auth/auth.service';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { ListboxModule } from 'primeng/listbox';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';

describe('SidePanelCardComponent', () => {
  let component: SidePanelCardComponent;
  let fixture: ComponentFixture<SidePanelCardComponent>;
  let authService: AuthService;
  let routerSpy: jasmine.SpyObj<Router>;
  let httpSpy: jasmine.SpyObj<HttpClient>;
  let messageServiceSpy: jasmine.SpyObj<MessageService>;
  
  beforeEach(async () => {
    const spyHttpClient = jasmine.createSpyObj('HttpClient', ['get', 'post', 'put', 'delete']);
    const spyMessageService = jasmine.createSpyObj('MessageService', ['add']);
    const spyRouter = jasmine.createSpyObj('Router', ['navigate']);
    await TestBed.configureTestingModule({
      declarations: [SidePanelCardComponent],
      imports: [RouterTestingModule, CardModule, ListboxModule, ButtonModule, FormsModule],
      providers: [
        AuthService,
        { provide: HttpClient, useValue: spyHttpClient },
        { provide: MessageService, useValue: spyMessageService },
        { provide: Router, useValue: spyRouter },
      ],
    }).compileComponents();

    httpSpy = TestBed.inject(HttpClient) as jasmine.SpyObj<HttpClient>;
    messageServiceSpy = TestBed.inject(MessageService) as jasmine.SpyObj<MessageService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SidePanelCardComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    fixture.detectChanges();
    });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should update isLoggedIn when AuthService emits a value', () => {
    authService.isLoggedIn$.next(true);
    component.ngOnInit();
    expect(component.isLoggedIn).toBeTrue();
  });

  it('should set selectedAcronym to an empty object when searchedAcronym changes to an empty string', () => {
    component.ngOnChanges({ searchedAcronym: { firstChange:false, isFirstChange: () => false, previousValue: null,currentValue: '' } });
    expect(component.selectedAcronym).toEqual({ label: '', value: '' });
  });

  it('should emit selectedAcronym when handleSelectedAcronym is called', () => {
    const selectedAcronym = { label: 'Test', value: 'Test' };
    spyOn(component.emitSelectedAcronym, 'emit');
    component.selectedAcronym = selectedAcronym;
    component.handleSelectedAcronym();
    expect(component.emitSelectedAcronym.emit).toHaveBeenCalledWith(selectedAcronym);
  });

  it('should navigate to /create-acronym when createAcronym is called', () => {
    component.createArconym();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/create-acronym']);
  });
});
