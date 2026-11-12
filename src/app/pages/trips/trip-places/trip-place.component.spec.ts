import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TripPlaceComponent } from './trip-place.component';

describe('TripPlaceComponent', () => {
  let component: TripPlaceComponent;
  let fixture: ComponentFixture<TripPlaceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TripPlaceComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TripPlaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
