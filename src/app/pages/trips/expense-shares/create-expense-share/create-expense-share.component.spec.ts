import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateExpenseShareComponent } from './create-expense-share.component';

describe('CreateExpenseShareComponent', () => {
  let component: CreateExpenseShareComponent;
  let fixture: ComponentFixture<CreateExpenseShareComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateExpenseShareComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateExpenseShareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
