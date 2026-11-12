import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateTripPlaceComponent } from './create-trip-place.component';

describe('CreateTripPlaceComponent', () => {
  let component: CreateTripPlaceComponent;
  let fixture: ComponentFixture<CreateTripPlaceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateTripPlaceComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTripPlaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
