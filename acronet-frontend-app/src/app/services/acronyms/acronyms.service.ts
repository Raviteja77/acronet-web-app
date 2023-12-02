import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AcronymsService {

  suggestedAcronyms$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  acronymUpdated$: BehaviorSubject<boolean> = new BehaviorSubject<any>(false);

  constructor(private _http: HttpClient, 
    private messageService: MessageService, 
    private router: Router) {
    const suggestedAcronyms = localStorage.getItem('suggested-acronyms');
    const user = localStorage.getItem('user');
    if(user && suggestedAcronyms) {
      this.suggestedAcronyms$.next(JSON.parse(suggestedAcronyms))    
    }
  }

  getAllAcronyms(): Observable<any> {
    const url = environment.baseURL;
    const headers = new HttpHeaders({ "Content-Type": "application/json" });
    return this._http.get(url, { headers: headers });
  }

  getSuggestedAcronyms() {
    const url = `${environment.baseURL}/suggestions`;
    const headers = new HttpHeaders({ "Content-Type": "application/json" });
    this._http.get(url, { headers: headers }).subscribe((res: any) => {
      if (res) {
        const user = localStorage.getItem('user')
        if(user) {
          const parsedUser = JSON.parse(user);
          if(parsedUser['user_type'] === 'admin') {
            this.suggestedAcronyms$.next(res);
            localStorage.setItem('suggested-acronyms', JSON.stringify(res));
          } else {
            const suggestedEmail = res.filter((r: any) => r.suggested_by_email == parsedUser['email']);
            if(suggestedEmail.length > 0) {
              this.suggestedAcronyms$.next(suggestedEmail);
            }
          }
        }
      }
      return res;
    })
  }

  getRecentSuggestedAcronyms() {
    const url = `${environment.baseURL}/suggestions`;
    return this._http.get(url);
  }

  createSuggestedAcronym(suggestedAcronym: any) {
    const url = `${environment.baseURL}/suggest`;
    const headers = new HttpHeaders({ "Content-Type": "application/json" });

    const user = localStorage.getItem('user');
    if(user) {
      suggestedAcronym['suggested_by_name'] = JSON.parse(user)['user_name'];
      suggestedAcronym['suggested_by_email'] = JSON.parse(user)['email'];
      suggestedAcronym['created_on'] = '';
      suggestedAcronym['status'] = 'pending';
      return this._http.post(url, suggestedAcronym, { headers: headers }).subscribe(data => {
        this.messageService.add({severity:'success', detail:`Acronym '${suggestedAcronym['acronym_name']}' is submitted and it's under review.`});
        this.router.navigateByUrl("/");
      })
    }
    return; 
  }

  updateSuggestedAcronym(suggestedAcronym: any, editForm: any) {
    const url = `${environment.baseURL}/suggest/update`;

    const user = localStorage.getItem('user');
    if(user) {
      suggestedAcronym['suggested_by_name'] = JSON.parse(user)['user_name'];
      suggestedAcronym['suggested_by_email'] = JSON.parse(user)['email'];
      suggestedAcronym['created_on'] = '';
      suggestedAcronym['status'] = suggestedAcronym['status'].code;
      if(suggestedAcronym['status'] === 'approved' && !editForm) {
        return this._http.post(`${environment.baseURL}/add`, suggestedAcronym).subscribe(data => {
          this.acronymUpdated$.next(true);
          this.messageService.add({severity:'success', detail:`Acronym '${suggestedAcronym['acronym_name']}' is approved.`});
          this._http.put(url, suggestedAcronym).subscribe(data => {
            localStorage.removeItem('suggested-acronyms');
            this.getSuggestedAcronyms();
          })
        })
      }
      return this._http.put(url, suggestedAcronym).subscribe(data => {
        localStorage.removeItem('suggested-acronyms');
        this.getSuggestedAcronyms();
        this.updateAcronym(suggestedAcronym);
        this.messageService.add({severity:'success', detail:`Acronym '${suggestedAcronym['acronym_name']}' is updated.`});
      })
    }
    return; 
  }

  updateAcronym(acronym: any) {
    const url = `${environment.baseURL}/update`;

    const user = localStorage.getItem('user');
    if(user) {
      acronym['suggested_by_name'] = JSON.parse(user)['user_name'];
      acronym['suggested_by_email'] = JSON.parse(user)['email'];
      acronym['created_on'] = '';
      return this._http.put(url, acronym).subscribe(data => {
        this.acronymUpdated$.next(true);
        this.messageService.add({severity:'success', detail:`Acronym '${acronym['acronym_name']}' is updated.`});
      })
    }
    return; 
  }

  deleteSuggestedAcronym(acronym_name: string) {
    return this._http.delete(`${environment.baseURL}/suggest/delete/${acronym_name}`);
  }

  deleteAcronym(acronym_name: string) {
    return this._http.delete(`${environment.baseURL}/delete/${acronym_name}`);
  }
}
