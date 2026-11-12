import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TripPackingItemComponent } from './trip-packing-item.component';

describe('TripPackingItemComponent', () => {
  let component: TripPackingItemComponent;
  let fixture: ComponentFixture<TripPackingItemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TripPackingItemComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TripPackingItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
