import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateSettlementTransactionComponent } from './create-settlement-transaction.component';

describe('CreateSettlementTransactionComponent', () => {
  let component: CreateSettlementTransactionComponent;
  let fixture: ComponentFixture<CreateSettlementTransactionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateSettlementTransactionComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateSettlementTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
