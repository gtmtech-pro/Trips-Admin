import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateTripMemberComponent } from './create-trip-member.component';

describe('CreateTripMemberComponent', () => {
  let component: CreateTripMemberComponent;
  let fixture: ComponentFixture<CreateTripMemberComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateTripMemberComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTripMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
