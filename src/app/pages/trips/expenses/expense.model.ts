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

    constructor(expenseItem?: any) {
        expenseItem = expenseItem || {};

        this.ExpenseId = expenseItem.ExpenseId || uuidv4();
        this.TripId = expenseItem.TripId || null;
        this.CategoryId = expenseItem.CategoryId || null;
        this.ExpenseTitle = expenseItem.ExpenseTitle || '';
        this.Description = expenseItem.Description || '';
        this.PaidByTripMemberId = expenseItem.PaidByTripMemberId || null;
        this.OriginalAmount = expenseItem.OriginalAmount || '';
        this.BaseAmount = expenseItem.BaseAmount || '';
        this.ExpenseDate = expenseItem.ExpenseDate || '';
        this.SplitMethod = expenseItem.SplitMethod || '';
        this.IsDeleted = expenseItem.IsDeleted || false;
        this.ExpenseStatus = expenseItem.ExpenseStatus || '';
        this.IsActive = expenseItem.IsActive || true;
        this.RequestType = 0; // New
    }
}
