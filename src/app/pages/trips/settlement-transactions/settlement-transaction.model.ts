import { v4 as uuidv4 } from 'uuid';

export class SettlementTransactionModel {
    SettlementTransactionId: string;
    SettlementId: string;
    FromTripMemberId: string;
    ToTripMemberId: string;
    Amount: any;
    TransactionStatus: string;
    PaidAtUtc: any;
    PaymentMode: string;
    TransactionReference: string;
    IsActive: boolean;
    RequestType: any;

    constructor(settlementTransactionItem?: any) {
        settlementTransactionItem = settlementTransactionItem || {};

        this.SettlementTransactionId = settlementTransactionItem.SettlementTransactionId || uuidv4();
        this.SettlementId = settlementTransactionItem.SettlementId || null;
        this.FromTripMemberId = settlementTransactionItem.FromTripMemberId || null;
        this.ToTripMemberId = settlementTransactionItem.ToTripMemberId || null;
        this.Amount = settlementTransactionItem.Amount || '';
        this.TransactionStatus = settlementTransactionItem.TransactionStatus || '';
        this.PaidAtUtc = settlementTransactionItem.PaidAtUtc || '';
        this.PaymentMode = settlementTransactionItem.PaymentMode || '';
        this.TransactionReference = settlementTransactionItem.TransactionReference || '';
        this.IsActive = settlementTransactionItem.IsActive || true;
        this.RequestType = 0; // New
    }
}
