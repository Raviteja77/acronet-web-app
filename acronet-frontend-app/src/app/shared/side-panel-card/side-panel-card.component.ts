import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AcronymHistory } from 'src/app/interfaces/acronym-history.interface';

@Component({
  selector: 'app-side-panel-card',
  templateUrl: './side-panel-card.component.html',
  styleUrls: ['./side-panel-card.component.scss']
})
export class SidePanelCardComponent {
  selectedAcronym!: AcronymHistory;

  @Input() acronyms!: AcronymHistory[];
  @Input() cardHeaderLabel: string = '';
  @Input() cardFooterLabel: string = '';

  @Output() emitSelectedAcronym: EventEmitter<AcronymHistory> = new EventEmitter<AcronymHistory>();

  constructor() {}

  handleSelectedAcronym() {
    console.log(this.selectedAcronym);
    this.emitSelectedAcronym.emit(this.selectedAcronym);
  }
}
