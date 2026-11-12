import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TripDayComponent } from './trip-day.component';

describe('TripDayComponent', () => {
  let component: TripDayComponent;
  let fixture: ComponentFixture<TripDayComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TripDayComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TripDayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
