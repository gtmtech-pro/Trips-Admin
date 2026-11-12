import { v4 as uuidv4 } from 'uuid';

export class SettlementModel {
    SettlementId: string;
    TripId: string;
    FromTripMemberId: string;
    ToTripMemberId: string;
    Amount: any;
    PaymentMethod: string;
    SettlementDate: any;
    ConfirmedDate: any;
    CompletedDate: any;
    SettlementStatus: string;
    ReferenceNo: string;
    Notes: string;
    Status: string;
    IsActive: boolean;
    RequestType: any;

    constructor(settlementItem?: any) {
        settlementItem = settlementItem || {};

        this.SettlementId = settlementItem.SettlementId || uuidv4();
        this.TripId = settlementItem.TripId || null;
        this.FromTripMemberId = settlementItem.FromTripMemberId || null;
        this.ToTripMemberId = settlementItem.ToTripMemberId || null;
        this.Amount = settlementItem.Amount || '';
        this.PaymentMethod = settlementItem.PaymentMethod || '';
        this.SettlementDate = settlementItem.SettlementDate || '';
        this.ConfirmedDate = settlementItem.ConfirmedDate || '';
        this.CompletedDate = settlementItem.CompletedDate || '';
        this.SettlementStatus = settlementItem.SettlementStatus || '';
        this.ReferenceNo = settlementItem.ReferenceNo || '';
        this.Notes = settlementItem.Notes || '';
        this.Status = settlementItem.Status || '';
        this.IsActive = settlementItem.IsActive || true;
        this.RequestType = 0; // New
    }
}
