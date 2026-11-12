import { v4 as uuidv4 } from 'uuid';

export class AccountModel {
    AccountId: string;
    LoginId: string;
    Password: string;
    UserName: string;
    FirstName: string;
    MiddleName: string;
    LastName: string;
    DepartmentId: string;
    DesignationId: string;
    RoleId: string;
    ReportingToId: string;
    ReportingTo1Id: string;
    ReportingTo2Id: string;
    EmailId: string;
    Mobile: string;
    IsLocked: boolean;
    IsApproved: string;
    IsActive: boolean;
    RequestType: any;

    constructor(accountItem?: any) {
        accountItem = accountItem || {};

        this.AccountId = accountItem.AccountId || null;
        this.LoginId = accountItem.LoginId || '';
        this.Password = accountItem.Password || '';
        this.UserName = accountItem.UserName || '';
        this.FirstName = accountItem.FirstName || '';
        this.MiddleName = accountItem.MiddleName || '';
        this.LastName = accountItem.LastName || '';
        this.DepartmentId = accountItem.DepartmentId || null;
        this.DesignationId = accountItem.DesignationId || null;
        this.RoleId = accountItem.RoleId || null;
        this.ReportingToId = accountItem.ReportingToId || null;
        this.ReportingTo1Id = accountItem.ReportingTo1Id || null;
        this.ReportingTo2Id = accountItem.ReportingTo2Id || null;
        this.EmailId = accountItem.EmailId || '';
        this.Mobile = accountItem.Mobile || '';
        this.IsLocked = accountItem.IsLocked || false;
        this.IsApproved = accountItem.IsApproved || '';
        this.IsActive = accountItem.IsActive || true;
        this.RequestType = 0; // New
    }
}
