import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { of } from 'rxjs';
import { AcronymsService } from './acronyms.service';
import { environment } from 'src/environments/environment';

describe('AcronymsService', () => {
  let service: AcronymsService;
  let httpSpy: jasmine.SpyObj<HttpClient>;
  let messageServiceSpy: jasmine.SpyObj<MessageService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const spyHttpClient = jasmine.createSpyObj('HttpClient', ['get', 'post', 'put', 'delete']);
    const spyMessageService = jasmine.createSpyObj('MessageService', ['add']);
    const spyRouter = jasmine.createSpyObj('Router', ['navigateByUrl']);

    TestBed.configureTestingModule({
      providers: [
        AcronymsService,
        { provide: HttpClient, useValue: spyHttpClient },
        { provide: MessageService, useValue: spyMessageService },
        { provide: Router, useValue: spyRouter },
      ],
    });

    service = TestBed.inject(AcronymsService);
    httpSpy = TestBed.inject(HttpClient) as jasmine.SpyObj<HttpClient>;
    messageServiceSpy = TestBed.inject(MessageService) as jasmine.SpyObj<MessageService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize suggestedAcronyms$ if user and suggestedAcronyms exist in local storage', () => {
    // Mock localStorage.getItem to simulate a user being logged in
    const user = {
      user_name: 'Admin',
      user_type: 'admin',
      email: 'admin@example.com',
      password: 'password'
    }

    const suggestedAcronyms = { 
      acronym_name: 'SPS',
      full_form: 'School of Professional Studies',
      description:
        'The School of Professional Studies (SPS) serves the needs of recent graduates and working professionals seeking to advance in their jobs and careers. Students of diverse ages and backgrounds learn together in a context where various perspectives are welcomed and all experience is valued.',
      location: 'Jonas clark, Clark University, 950 Main street',
      phone: '5087937218',
      email: 'SPS@clarku.edu',
      website: 'https://www.clarku.edu/schools/professional-studies/',
    };

    spyOn(localStorage, 'getItem').and.callFake((key: string) => {
      if (key === 'user') {
        return JSON.stringify(user);
      } else if (key === 'suggested-acronyms') {
        return JSON.stringify(suggestedAcronyms);
      }
      return null;
    });

    service = new AcronymsService(httpSpy, messageServiceSpy, routerSpy);

    expect(service.suggestedAcronyms$.value).toEqual(suggestedAcronyms);
  });

  it('should not initialize suggestedAcronyms$ if user or suggestedAcronyms do not exist in local storage', () => {
    spyOn(localStorage, 'getItem').and.returnValue(null);

    service = new AcronymsService(httpSpy, messageServiceSpy, routerSpy);

    expect(service.suggestedAcronyms$.value).toBeNull();
  });

  it('should get all acronyms', () => {
    const acronyms = [{
      acronym_name: 'SPS',
      full_form: 'School of Professional Studies',
      description:
        'The School of Professional Studies (SPS) serves the needs of recent graduates and working professionals seeking to advance in their jobs and careers. Students of diverse ages and backgrounds learn together in a context where various perspectives are welcomed and all experience is valued.',
      location: 'Jonas clark, Clark University, 950 Main street',
      phone: '5087937218',
      email: 'SPS@clarku.edu',
      created_on: new Date(Date.now()),
      website: 'https://www.clarku.edu/schools/professional-studies/',
    }];
    httpSpy.get.and.returnValue(of(acronyms));
    service.getAllAcronyms().subscribe((response) => {
      expect(response).toEqual(acronyms);
    });
  });

  it('should get all suggested acronyms', () => {
    // Mock localStorage.getItem to simulate a user being logged in
    const user = {
      user_name: 'Admin',
      user_type: 'admin',
      email: 'admin@example.com',
      password: 'password'
    }
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(user));

    const response = [{ 
      acronym_name: 'SPS',
      full_form: 'School of Professional Studies',
      description:
        'The School of Professional Studies (SPS) serves the needs of recent graduates and working professionals seeking to advance in their jobs and careers. Students of diverse ages and backgrounds learn together in a context where various perspectives are welcomed and all experience is valued.',
      location: 'Jonas clark, Clark University, 950 Main street',
      phone: '5087937218',
      email: 'SPS@clarku.edu',
      created_on: new Date(Date.now()),
      website: 'https://www.clarku.edu/schools/professional-studies/',
      suggested_by_name: 'test user',
      suggested_by_email: 'test@gmail.com',
      status: 'pending'
    }];
    httpSpy.get.and.returnValue(of(response));

    service.getSuggestedAcronyms();

    expect(service.suggestedAcronyms$.value).toEqual(response);
  });

  it('should get recent suggested acronyms', () => {
    const response = [{ 
      acronym_name: 'SPS',
      full_form: 'School of Professional Studies',
      description:
        'The School of Professional Studies (SPS) serves the needs of recent graduates and working professionals seeking to advance in their jobs and careers. Students of diverse ages and backgrounds learn together in a context where various perspectives are welcomed and all experience is valued.',
      location: 'Jonas clark, Clark University, 950 Main street',
      phone: '5087937218',
      email: 'SPS@clarku.edu',
      created_on: new Date(Date.now()),
      website: 'https://www.clarku.edu/schools/professional-studies/',
      suggested_by_name: 'test user',
      suggested_by_email: 'test@gmail.com',
      status: 'pending'
    }];
    httpSpy.get.and.returnValue(of(response));

    service.getRecentSuggestedAcronyms().subscribe(data => {
      expect(data).toEqual(response);
    })
  });

  it('should create a suggested acroynm and show success message', () => {
    // Mock localStorage.getItem to simulate a user being logged in
    const user = {
      user_name: 'Admin',
      user_type: 'admin',
      email: 'admin@example.com',
      password: 'password'
    }
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(user));

    const suggestedAcronym = { 
      acronym_name: 'SPS',
      full_form: 'School of Professional Studies',
      description:
        'The School of Professional Studies (SPS) serves the needs of recent graduates and working professionals seeking to advance in their jobs and careers. Students of diverse ages and backgrounds learn together in a context where various perspectives are welcomed and all experience is valued.',
      location: 'Jonas clark, Clark University, 950 Main street',
      phone: '5087937218',
      email: 'SPS@clarku.edu',
      website: 'https://www.clarku.edu/schools/professional-studies/',
    };
    
    httpSpy.post.and.returnValue(of({}));
    service.createSuggestedAcronym(suggestedAcronym);

    expect(messageServiceSpy.add).toHaveBeenCalledWith({
      severity: 'success',
      detail: "Acronym 'SPS' is submitted and it's under review.",
    });

    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/');
  });

  it('should not create suggested acronym if user is not logged in', () => {
    // Mock localStorage.getItem to simulate no user being logged in
    spyOn(localStorage, 'getItem').and.returnValue(null);

    const suggestedAcronym = { 
      acronym_name: 'SPS',
      full_form: 'School of Professional Studies',
      description:
        'The School of Professional Studies (SPS) serves the needs of recent graduates and working professionals seeking to advance in their jobs and careers. Students of diverse ages and backgrounds learn together in a context where various perspectives are welcomed and all experience is valued.',
      location: 'Jonas clark, Clark University, 950 Main street',
      phone: '5087937218',
      email: 'SPS@clarku.edu',
      website: 'https://www.clarku.edu/schools/professional-studies/',
    };

    service.createSuggestedAcronym(suggestedAcronym);

    // Expect that the HTTP post and other actions are not called
    expect(httpSpy.post).not.toHaveBeenCalled();
    expect(messageServiceSpy.add).not.toHaveBeenCalled();
    expect(routerSpy.navigateByUrl).not.toHaveBeenCalled();
  });

  it('should update suggested acronym with status "approved"', () => {
    // Mock localStorage.getItem to simulate a user being logged in
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify({ 'user_name': 'testuser', 'email': 'testuser@example.com', 'user_type': 'user' }));

    const editSuggestedAcronym = { 
      acronym_name: 'SPS',
      full_form: 'School of Professional Studies',
      description:
        'The School of Professional Studies (SPS) serves the needs of recent graduates and working professionals seeking to advance in their jobs and careers. Students of diverse ages and backgrounds learn together in a context where various perspectives are welcomed and all experience is valued.',
      location: 'Jonas clark, Clark University, 950 Main street',
      phone: '5087937218',
      email: 'SPS@clarku.edu',
      status: { name: 'Approved', code: 'approved' },
      website: 'https://www.clarku.edu/schools/professional-studies/',
    };

    httpSpy.post.and.returnValue(of(editSuggestedAcronym));
    httpSpy.put.and.returnValue(of(editSuggestedAcronym));
    httpSpy.get.and.returnValue(of([editSuggestedAcronym]));
    service.updateSuggestedAcronym(editSuggestedAcronym, '');

    expect(messageServiceSpy.add).toHaveBeenCalledWith({
      severity: 'success',
      detail: "Acronym 'SPS' is approved.",
    });

    expect(service.suggestedAcronyms$.value).toEqual([editSuggestedAcronym]);
  });

  it('should update suggested acronym with status "pending"', () => {
    // Mock localStorage.getItem to simulate a user being logged in
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify({ 'user_name': 'testuser', 'email': 'testuser@example.com', 'user_type': 'user' }));

    const editSuggestedAcronym = { 
      acronym_name: 'SPS',
      full_form: 'School of Professional Studies',
      description:
        'The School of Professional Studies (SPS) serves the needs of recent graduates and working professionals seeking to advance in their jobs and careers. Students of diverse ages and backgrounds learn together in a context where various perspectives are welcomed and all experience is valued.',
      location: 'Jonas clark, Clark University, 950 Main street',
      phone: '5087937218',
      email: 'SPS@clarku.edu',
      status: { name: 'Pending', code: 'pending' },
      website: 'https://www.clarku.edu/schools/professional-studies/',
    };

    httpSpy.put.and.returnValue(of(editSuggestedAcronym));
    httpSpy.get.and.returnValue(of([editSuggestedAcronym]));
    service.updateSuggestedAcronym(editSuggestedAcronym, '');

    expect(messageServiceSpy.add).toHaveBeenCalledWith({
      severity: 'success',
      detail: "Acronym 'SPS' is updated.",
    });

    expect(service.suggestedAcronyms$.value).toEqual([editSuggestedAcronym]);
  });

  it('should not update suggested acronym if user is not logged in', () => {
    // Mock localStorage.getItem to simulate no user being logged in
    spyOn(localStorage, 'getItem').and.returnValue(null);

    const editSuggestedAcronym = { 
      acronym_name: 'SPS',
      full_form: 'School of Professional Studies',
      description:
        'The School of Professional Studies (SPS) serves the needs of recent graduates and working professionals seeking to advance in their jobs and careers. Students of diverse ages and backgrounds learn together in a context where various perspectives are welcomed and all experience is valued.',
      location: 'Jonas clark, Clark University, 950 Main street',
      phone: '5087937218',
      email: 'SPS@clarku.edu',
      status: { name: 'Pending', code: 'pending' },
      website: 'https://www.clarku.edu/schools/professional-studies/',
    };

    service.updateSuggestedAcronym(editSuggestedAcronym, '');

    // Expect that the HTTP post and other actions are not called
    expect(httpSpy.post).not.toHaveBeenCalled();
    expect(messageServiceSpy.add).not.toHaveBeenCalled();
    expect(httpSpy.put).not.toHaveBeenCalled();
  });

  it('should update acronym if user is logged in', () => {

    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify({ 'user_name': 'testuser', 'email': 'testuser@example.com' }));

    const updateAcronym = { 
      acronym_name: 'SPS',
      full_form: 'School of Professional Studies',
      description:
        'The School of Professional Studies (SPS) serves the needs of recent graduates and working professionals seeking to advance in their jobs and careers. Students of diverse ages and backgrounds learn together in a context where various perspectives are welcomed and all experience is valued.',
      location: 'Jonas clark, Clark University, 950 Main street',
      phone: '5087937218',
      email: 'SPS@clarku.edu',
      status: { name: 'Pending', code: 'pending' },
      website: 'https://www.clarku.edu/schools/professional-studies/',
    };

    httpSpy.put.and.returnValue(of(updateAcronym));
    httpSpy.get.and.returnValue(of([updateAcronym]));
    service.updateAcronym(updateAcronym);

    expect(messageServiceSpy.add).toHaveBeenCalledWith({
      severity: 'success',
      detail: "Acronym 'SPS' is updated.",
    });
  })

  it('should update acronym if user is not logged in', () => {

    spyOn(localStorage, 'getItem').and.returnValue(null);

    const updateAcronym = { 
      acronym_name: 'SPS',
      full_form: 'School of Professional Studies',
      description:
        'The School of Professional Studies (SPS) serves the needs of recent graduates and working professionals seeking to advance in their jobs and careers. Students of diverse ages and backgrounds learn together in a context where various perspectives are welcomed and all experience is valued.',
      location: 'Jonas clark, Clark University, 950 Main street',
      phone: '5087937218',
      email: 'SPS@clarku.edu',
      status: { name: 'Pending', code: 'pending' },
      website: 'https://www.clarku.edu/schools/professional-studies/',
    };

    service.updateAcronym(updateAcronym);

    // Expect that the HTTP post and other actions are not called
    expect(messageServiceSpy.add).not.toHaveBeenCalled();
    expect(httpSpy.put).not.toHaveBeenCalled();
  });

  it('should delete suggested acronym', () => {
    const acronymName = 'SPS';

    httpSpy.delete.and.returnValue(of({}));

    service.deleteSuggestedAcronym(acronymName);

    expect(httpSpy.delete).toHaveBeenCalledWith(`${environment.baseURL}/suggest/delete/${acronymName}`);
  });

  it('should delete acronym', () => {
    const acroynm = 'SPS';
    httpSpy.delete.and.returnValue(of({}));
    service.deleteAcronym(acroynm);
    expect(httpSpy.delete).toHaveBeenCalledWith(`${environment.baseURL}/delete/${acroynm}`);
  })


});
