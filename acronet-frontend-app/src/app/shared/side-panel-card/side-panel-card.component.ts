import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth/auth.service';
import { LABELS } from 'src/app/constants/constants';
import { AcronymHistory } from 'src/app/interfaces/acronym-history.interface';

@Component({
  selector: 'app-side-panel-card',
  templateUrl: './side-panel-card.component.html',
  styleUrls: ['./side-panel-card.component.scss']
})
export class SidePanelCardComponent implements OnChanges, OnInit{
  selectedAcronym!: AcronymHistory;
  public LABELS = LABELS;
  public isLoggedIn = false;

  @Input() acronyms: AcronymHistory[] = [];
  @Input() cardHeaderLabel: string = '';
  @Input() cardFooterLabel: string = '';
  @Input() searchedAcronym: string = '';

  @Output() emitSelectedAcronym: EventEmitter<AcronymHistory> = new EventEmitter<AcronymHistory>();

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe(res => {
      this.isLoggedIn = res;
    })
  }

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

  createArconym() {
    this.router.navigate(['/create-acronym']);
  }
}
