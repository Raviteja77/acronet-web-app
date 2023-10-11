import { Component, OnInit } from '@angular/core';
import { AcronymHistory } from '../../interfaces/acronym-history.interface';
import { LABELS } from 'src/app/constants/constants';
import { FilterService, SelectItemGroup } from 'primeng/api';
import { AutoCompleteEvent } from 'src/app/interfaces/autocomplete-event.interface';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  acronyms!: AcronymHistory[];
  selectedAcronym!: AcronymHistory;
  searchKeyword!: any;
  filteredGroups: any[] = [];
  groupedAcronyms!: SelectItemGroup[];
  showSearchIcon: boolean = true;

  public LABELS = LABELS;

  constructor(private filterService: FilterService) {}

  ngOnInit() {
    this.acronyms = [
      { value: 'SPS', label: 'SPS - School of Professional Studies' },
      { value: 'SOM', label: 'SOM - School of Management' },
      {
        value: 'BSDT',
        label: 'BSDT - Becker School of Design & Technology',
      },
    ];
    this.groupedAcronyms = [
      {
        label: 'Schools',
        value: 'school',
        items: [
          { label: 'SPS - School of Professional Studies', value: 'SPS' },
          { label: 'SOM - School of Management', value: 'SOM' },
          {
            label: 'BSDT - Becker School of Design & Technology',
            value: 'BSDT',
          },
        ],
      },
    ];
  }

  handleSelection(data: any): void {
    this.searchKeyword = data;
  }

  filterGroupedAcronyms(event: AutoCompleteEvent) {
    let query = event.query;
    let filteredGroups = [];

    for (let optgroup of this.groupedAcronyms) {
      let filteredSubOptions = this.filterService.filter(
        optgroup.items,
        ['label'],
        query,
        'contains'
      );
      if (filteredSubOptions && filteredSubOptions.length) {
        filteredGroups.push({
          label: optgroup.label,
          value: optgroup.value,
          items: filteredSubOptions,
        });
      }
    }

    this.filteredGroups = filteredGroups;
  }

  handleSelectionClear(data: any): void {
    this.showSearchIcon = false;
    this.searchKeyword = data;
    if(data.length === 0) {
      this.clearSelection();
    }
  }

  clearSelection(): void {
    this.searchKeyword = null;
    this.showSearchIcon = true;
  }

  handleSelectedRecentAcronym(selectedRecentAcronym: AcronymHistory): void {
    this.searchKeyword = selectedRecentAcronym;
    this.selectedAcronym = this.searchKeyword;
    this.showSearchIcon = false;
  }
}