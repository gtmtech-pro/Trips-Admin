import { v4 as uuidv4 } from 'uuid';

export class ExpenseModel {
    ExpenseId: string;
    TripId: string;
    CategoryId: string;
    ExpenseTitle: string;
    Description: string;
    PaidByTripMemberId: string;
    OriginalAmount: any;
    BaseAmount: any;
    ExpenseDate: any;
    SplitMethod: string;
    IsDeleted: boolean;
    ExpenseStatus: string;
    IsActive: boolean;
    RequestType: any;

    constructor(expensItem?: any) {
        expensItem = expensItem || {};

        this.ExpenseId = expensItem.ExpenseId || uuidv4();
        this.TripId = expensItem.TripId || null;
        this.CategoryId = expensItem.CategoryId || null;
        this.ExpenseTitle = expensItem.ExpenseTitle || '';
        this.Description = expensItem.Description || '';
        this.PaidByTripMemberId = expensItem.PaidByTripMemberId || null;
        this.OriginalAmount = expensItem.OriginalAmount || '';
        this.BaseAmount = expensItem.BaseAmount || '';
        this.ExpenseDate = expensItem.ExpenseDate || '';
        this.SplitMethod = expensItem.SplitMethod || '';
        this.IsDeleted = expensItem.IsDeleted || false;
        this.ExpenseStatus = expensItem.ExpenseStatus || '';
        this.IsActive = expensItem.IsActive || true;
        this.RequestType = 0; // New
    }
}
