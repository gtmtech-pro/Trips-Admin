import { v4 as uuidv4 } from 'uuid';

export class RoleTransactionModel {
    RoleTransactionId: string;
    RoleId: string;
    DepartmentId: string;
    DesignationId: string;
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

    constructor(roleTransactionItem?: any) {
        roleTransactionItem = roleTransactionItem || {};

        this.RoleTransactionId = roleTransactionItem.RoleTransactionId || uuidv4();
        this.RoleId = roleTransactionItem.RoleId || null;
        this.DepartmentId = roleTransactionItem.DepartmentId || null;
        this.DesignationId = roleTransactionItem.DesignationId || null;
        this.TransactionId = roleTransactionItem.TransactionId || null;
        this.Rights = roleTransactionItem.Rights || false;
        this.CanAdd = roleTransactionItem.CanAdd || false;
        this.CanEdit = roleTransactionItem.CanEdit || false;
        this.CanDelete = roleTransactionItem.CanDelete || false;
        this.CanView = roleTransactionItem.CanView || false;
        this.CanExport = roleTransactionItem.CanExport || false;
        this.CanChild = roleTransactionItem.CanChild || false;
        this.CanRemark = roleTransactionItem.CanRemark || false;
        this.ListView = roleTransactionItem.ListView || false;
        this.BasicView = roleTransactionItem.BasicView || false;
        this.DetailView = roleTransactionItem.DetailView || false;
        this.IsPublic = roleTransactionItem.IsPublic || false;
        this.Remarks = roleTransactionItem.Remarks || '';
        this.IsActive = roleTransactionItem.IsActive || true;
        this.RequestType = 0; // New
    }
}
