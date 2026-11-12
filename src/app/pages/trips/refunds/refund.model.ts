import { v4 as uuidv4 } from 'uuid';

export class RefundModel {
    RefundId: string;
    TripId: string;
    OriginalExpenseId: string;
    ReceivedByTripMemberId: string;
    Amount: any;
    BaseAmount: any;
    RefundDate: any;
    Notes: string;
    RefundStatus: string;
    IsActive: boolean;
    RequestType: any;

    constructor(refundItem?: any) {
        refundItem = refundItem || {};

        this.RefundId = refundItem.RefundId || uuidv4();
        this.TripId = refundItem.TripId || null;
        this.OriginalExpenseId = refundItem.OriginalExpenseId || null;
        this.ReceivedByTripMemberId = refundItem.ReceivedByTripMemberId || null;
        this.Amount = refundItem.Amount || '';
        this.BaseAmount = refundItem.BaseAmount || '';
        this.RefundDate = refundItem.RefundDate || '';
        this.Notes = refundItem.Notes || '';
        this.RefundStatus = refundItem.RefundStatus || '';
        this.IsActive = refundItem.IsActive || true;
        this.RequestType = 0; // New
    }
}
