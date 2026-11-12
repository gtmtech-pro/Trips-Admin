import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExpenseShareComponent } from './expense-share.component';

describe('ExpenseShareComponent', () => {
  let component: ExpenseShareComponent;
  let fixture: ComponentFixture<ExpenseShareComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExpenseShareComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpenseShareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
