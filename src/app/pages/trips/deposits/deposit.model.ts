import { v4 as uuidv4 } from 'uuid';

export class DepositModel {
    DepositId: string;
    TripId: string;
    TripMemberId: string;
    Amount: any;
    BaseAmount: any;
    DepositDate: any;
    PaymentMethod: string;
    TransactionReference: string;
    Status: string;
    Notes: string;
    IsActive: boolean;
    RequestType: any;

    constructor(depositItem?: any) {
        depositItem = depositItem || {};

        this.DepositId = depositItem.DepositId || uuidv4();
        this.TripId = depositItem.TripId || null;
        this.TripMemberId = depositItem.TripMemberId || null;
        this.Amount = depositItem.Amount || '';
        this.BaseAmount = depositItem.BaseAmount || '';
        this.DepositDate = depositItem.DepositDate || '';
        this.PaymentMethod = depositItem.PaymentMethod || '';
        this.TransactionReference = depositItem.TransactionReference || '';
        this.Status = depositItem.Status || '';
        this.Notes = depositItem.Notes || '';
        this.IsActive = depositItem.IsActive || true;
        this.RequestType = 0; // New
    }
}
