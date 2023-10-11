import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeDataViewComponent } from './home-data-view.component';

describe('HomeDataViewComponent', () => {
  let component: HomeDataViewComponent;
  let fixture: ComponentFixture<HomeDataViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeDataViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeDataViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
