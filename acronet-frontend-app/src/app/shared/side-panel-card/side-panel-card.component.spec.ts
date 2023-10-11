import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidePanelCardComponent } from './side-panel-card.component';

describe('SidePanelCardComponent', () => {
  let component: SidePanelCardComponent;
  let fixture: ComponentFixture<SidePanelCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SidePanelCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SidePanelCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
