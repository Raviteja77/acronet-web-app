import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { AcronymHistory } from 'src/app/interfaces/acronym-history.interface';

@Component({
  selector: 'app-side-panel-card',
  templateUrl: './side-panel-card.component.html',
  styleUrls: ['./side-panel-card.component.scss']
})
export class SidePanelCardComponent implements OnChanges{
  selectedAcronym!: AcronymHistory;

  @Input() acronyms: AcronymHistory[] = [];
  @Input() cardHeaderLabel: string = '';
  @Input() cardFooterLabel: string = '';
  @Input() searchedAcronym: string = '';

  @Output() emitSelectedAcronym: EventEmitter<AcronymHistory> = new EventEmitter<AcronymHistory>();

  constructor() {}
  ngOnChanges(changes: SimpleChanges): void {
    const currentValue = changes['searchedAcronym']?.currentValue;
    if(!currentValue) {
      this.selectedAcronym = {
        label: '',
        value: ''
      };
    }
  }

  handleSelectedAcronym() {
    this.emitSelectedAcronym.emit(this.selectedAcronym);
  }
}
