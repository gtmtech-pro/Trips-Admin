import { v4 as uuidv4 } from 'uuid';

export class AccountTransactionModel {
    AccountTransactionId: string;
    AccountId: string;
    TransactionId: string;
    Rights: boolean;
    CanAdd: boolean;
    CanEdit: boolean;
    CanDelete: boolean;
    CanView: boolean;
    CanExport: boolean;
    CanChild: boolean;
    CanRemark: boolean;
    ListView: boolean;
    BasicView: boolean;
    DetailView: boolean;
    IsPublic: boolean;
    Remarks: string;
    IsActive: boolean;
    RequestType: any;

    constructor(accountTransactionItem?: any) {
        accountTransactionItem = accountTransactionItem || {};

        this.AccountTransactionId = accountTransactionItem.AccountTransactionId || uuidv4();
        this.AccountId = accountTransactionItem.AccountId || null;
        this.TransactionId = accountTransactionItem.TransactionId || null;
        this.Rights = accountTransactionItem.Rights || false;
        this.CanAdd = accountTransactionItem.CanAdd || false;
        this.CanEdit = accountTransactionItem.CanEdit || false;
        this.CanDelete = accountTransactionItem.CanDelete || false;
        this.CanView = accountTransactionItem.CanView || false;
        this.CanExport = accountTransactionItem.CanExport || false;
        this.CanChild = accountTransactionItem.CanChild || false;
        this.CanRemark = accountTransactionItem.CanRemark || false;
        this.ListView = accountTransactionItem.ListView || false;
        this.BasicView = accountTransactionItem.BasicView || false;
        this.DetailView = accountTransactionItem.DetailView || false;
        this.IsPublic = accountTransactionItem.IsPublic || false;
        this.Remarks = accountTransactionItem.Remarks || '';
        this.IsActive = accountTransactionItem.IsActive || true;
        this.RequestType = 0; // New
    }
}
