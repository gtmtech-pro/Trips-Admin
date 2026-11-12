import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateTripInvitationComponent } from './create-trip-invitation.component';

describe('CreateTripInvitationComponent', () => {
  let component: CreateTripInvitationComponent;
  let fixture: ComponentFixture<CreateTripInvitationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateTripInvitationComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTripInvitationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
