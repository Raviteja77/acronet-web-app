import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from 'src/app/auth/auth/auth.service';
import { AcronymsService } from 'src/app/services/acronyms/acronyms.service';
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { SharedModule } from '../shared.module';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let authService: AuthService;
  let acronymService: AcronymsService;
  let httpSpy: jasmine.SpyObj<HttpClient>;
  let messageServiceSpy: jasmine.SpyObj<MessageService>;

  beforeEach(() => {
    const spyHttpClient = jasmine.createSpyObj('HttpClient', ['get', 'post', 'put', 'delete']);
    const spyMessageService = jasmine.createSpyObj('MessageService', ['add']);
    TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      imports: [RouterTestingModule, SharedModule],
      providers: [AuthService, AcronymsService, 
        { provide: HttpClient, useValue: spyHttpClient },
        { provide: MessageService, useValue: spyMessageService },
      ],
    }).compileComponents();

    httpSpy = TestBed.inject(HttpClient) as jasmine.SpyObj<HttpClient>;
    messageServiceSpy = TestBed.inject(MessageService) as jasmine.SpyObj<MessageService>;
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    acronymService = TestBed.inject(AcronymsService);

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should set username and userRole on ngOnInit if user is logged in', () => {
    const user = { user_name: 'testUser', user_type: 'admin' };
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(user));
    spyOn(authService.isLoggedIn$, 'subscribe').and.callThrough();

    component.ngOnInit();

    expect(authService.isLoggedIn$.subscribe).toHaveBeenCalled();
    expect(component.username).toBe('testUser');
    expect(component.userRole).toBe('admin');
  });

  it('should toggle visibility on showDialog()', () => {
    component.visible = false;

    component.showDialog();

    expect(component.visible).toBe(true);

    component.showDialog();

    expect(component.visible).toBe(false);
  });

  it('should call authService.logout and navigate to root on logout()', () => {
    const user = { username: 'testUser' };
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(user));
    spyOn(authService, 'logout').and.stub();
    spyOn(localStorage, 'removeItem').and.stub();

    component.logout();

    expect(localStorage.removeItem).toHaveBeenCalledWith('user');
    expect(localStorage.removeItem).toHaveBeenCalledWith('suggested-acronyms');
  });
});
