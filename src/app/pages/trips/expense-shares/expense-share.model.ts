import { v4 as uuidv4 } from 'uuid';

export class ExpenseShareModel {
    ExpenseShareId: string;
    ExpenseId: string;
    TripMemberId: string;
    ShareAmount: any;
    Percentage: any;
    ShareUnits: any;
    IsActive: boolean;
    RequestType: any;

    constructor(expenseShareItem?: any) {
        expenseShareItem = expenseShareItem || {};

        this.ExpenseShareId = expenseShareItem.ExpenseShareId || uuidv4();
        this.ExpenseId = expenseShareItem.ExpenseId || null;
        this.TripMemberId = expenseShareItem.TripMemberId || null;
        this.ShareAmount = expenseShareItem.ShareAmount || '';
        this.Percentage = expenseShareItem.Percentage || '';
        this.ShareUnits = expenseShareItem.ShareUnits || '';
        this.IsActive = expenseShareItem.IsActive || true;
        this.RequestType = 0; // New
    }
}
