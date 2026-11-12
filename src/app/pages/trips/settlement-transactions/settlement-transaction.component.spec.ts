import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SettlementTransactionComponent } from './settlement-transaction.component';

describe('SettlementTransactionComponent', () => {
  let component: SettlementTransactionComponent;
  let fixture: ComponentFixture<SettlementTransactionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SettlementTransactionComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettlementTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
