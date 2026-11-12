import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateTripNoteComponent } from './create-trip-note.component';

describe('CreateTripNoteComponent', () => {
  let component: CreateTripNoteComponent;
  let fixture: ComponentFixture<CreateTripNoteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateTripNoteComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTripNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
