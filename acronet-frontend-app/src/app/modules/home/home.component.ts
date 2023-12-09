import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AcronymHistory,
  NewlyAddedAcronym,
} from '../../interfaces/acronym-history.interface';
import { LABELS } from 'src/app/constants/constants';
import { AutoCompleteEvent } from 'src/app/interfaces/autocomplete-event.interface';
import { FormControl, FormGroup } from '@angular/forms';
import { AcronymsService } from 'src/app/services/acronyms/acronyms.service';
import { Acronym } from 'src/app/interfaces/acronym.interface';
import { AuthService } from 'src/app/auth/auth/auth.service';
import { SuggestAcronym } from 'src/app/interfaces/suggest-acronym.interface';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  autoCompleteFormGroup: FormGroup = new FormGroup({
    selectedAcronym: new FormControl<AcronymHistory | null>(null),
  });
  chipsFormGroup: FormGroup = new FormGroup({
    selectedFilterNames: new FormControl<string>(''),
  });
  recentAcronyms: AcronymHistory[] = [];
  newlyCreatedAcronyms: AcronymHistory[] = [];
  searchKeyword!: any;
  filteredGroups: any[] = [];
  groupedAcronyms: any[] = [];
  showSearchIcon: boolean = true;

  selectedFilterNames: any[] = [];
  selectedFilters: any[] = [];

  loginSubscription!: Subscription;
  allAcronymsSubscription!: Subscription;
  recentSugestedSubscription!: Subscription;

  filters: any[] = [
    { name: 'Schools', key: 'S' },
    { name: 'Degrees & Majors', key: 'D&M' },
  ];

  public LABELS = LABELS;

  constructor(
    private acronymService: AcronymsService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.allAcronymsSubscription = this.acronymService.getAllAcronyms().subscribe((data) => {
      this.formatAcronymsLabel(data);
    });

    this.loginSubscription = this.authService.isLoggedIn$.subscribe((res) => {
      if (res) {
        this.acronymService.getSuggestedAcronyms();
      } else {
        this.acronymService.suggestedAcronyms$.next(null);
      }
    });
    this.recentSugestedSubscription = this.acronymService.getRecentSuggestedAcronyms().subscribe((data: any) => {
      const suggestedAcronyms = data.filter(
        (el: SuggestAcronym) => el.status === 'approved'
      );
      suggestedAcronyms.sort((a: SuggestAcronym, b: SuggestAcronym) => {
        if (a.created_on === b.created_on) {
          return 0;
        }
        return a.created_on > b.created_on ? -1 : 1;
      });
      this.formatNewlyAddedAcronyms(suggestedAcronyms);
    });
  }

  ngOnDestroy(): void {
    if (this.loginSubscription) {
      this.loginSubscription.unsubscribe();
    }
    if(this.allAcronymsSubscription) {
      this.allAcronymsSubscription.unsubscribe();
    }
    if(this.recentSugestedSubscription) {
      this.recentSugestedSubscription.unsubscribe();
    }
  }

  formatNewlyAddedAcronyms(acronyms: SuggestAcronym[]) {
    this.newlyCreatedAcronyms = [];
    const limit = acronyms.length < 10 ? acronyms.length : 10;
    for (let i = 0; i < limit; i++) {
      const acronymObj = {
        label: `${acronyms[i].acronym_name} - ${acronyms[i].full_form}`,
        value: acronyms[i].acronym_name,
      };
      this.newlyCreatedAcronyms.push(acronymObj);
    }
  }

  formatAcronymsLabel(acronyms: Acronym[]) {
    acronyms.forEach((acronym) => {
      const acronymObj = {
        label: `${acronym.acronym_name} - ${acronym.full_form}`,
        value: acronym.acronym_name,
      };
      this.groupedAcronyms.push(acronymObj);
    });
  }

  handleSelection(data: any): void {
    this.searchKeyword = data;
    if (this.recentAcronyms.length >= 10) {
      this.recentAcronyms.shift();
    }
    if (
      this.recentAcronyms.filter((el) => el.value == data.value).length == 0
    ) {
      this.recentAcronyms = this.recentAcronyms.concat([data]);
    }
  }

  filterGroupedAcronyms(event: AutoCompleteEvent) {
    let filtered: any[] = [];
    let query = event.query;

    for (let i = 0; i < (this.groupedAcronyms as any[])?.length; i++) {
      let acronym = (this.groupedAcronyms as any[])[i];
      if (acronym.label.toLowerCase().includes(query.toLowerCase())) {
        filtered.push(acronym);
      }
    }

    this.filteredGroups = filtered;

    if (filtered.length === 0) {
      this.searchKeyword = query;
    }
  }

  handleSelectionClear(data: any): void {
    this.showSearchIcon = false;
    if (data.length === 0) {
      this.clearSelection();
    }
  }

  clearSelection(): void {
    this.searchKeyword = null;
    this.showSearchIcon = true;
  }

  handleSelectedRecentAcronym(selectedRecentAcronym: AcronymHistory): void {
    this.searchKeyword = selectedRecentAcronym;
    this.autoCompleteFormGroup
      .get('selectedAcronym')
      ?.patchValue(this.searchKeyword);
    // this.selectedAcronym = this.searchKeyword;
    this.showSearchIcon = false;
  }

  handleSelectedFilters(event: any): void {
    console.log(event.checked[0].name);
    this.selectedFilterNames.push(event.checked[0].name);
    this.chipsFormGroup
      .get('selectedFilterNames')
      ?.patchValue(event.checked[0].name);
  }
}
