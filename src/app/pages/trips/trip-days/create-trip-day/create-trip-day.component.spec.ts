import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateTripDayComponent } from './create-trip-day.component';

describe('CreateTripDayComponent', () => {
  let component: CreateTripDayComponent;
  let fixture: ComponentFixture<CreateTripDayComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateTripDayComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTripDayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
