import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateTripPackingItemComponent } from './create-trip-packing-item.component';

describe('CreateTripPackingItemComponent', () => {
  let component: CreateTripPackingItemComponent;
  let fixture: ComponentFixture<CreateTripPackingItemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateTripPackingItemComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTripPackingItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
