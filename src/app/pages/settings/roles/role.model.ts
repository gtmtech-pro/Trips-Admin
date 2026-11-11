import { v4 as uuidv4 } from 'uuid';

export class RoleModel {
    RoleId: string;
    Code: string;
    Name: string;
    Description: string;
    LandingPageUrl: string;
    Remarks: string;
    IsActive: boolean;
    RequestType: any;

    constructor(roleItem?: any) {
        roleItem = roleItem || {};

        this.RoleId = roleItem.RoleId || uuidv4();
        this.Code = roleItem.Code || '';
        this.Name = roleItem.Name || '';
        this.Description = roleItem.Description || '';
        this.LandingPageUrl = roleItem.LandingPageUrl || '';
        this.Remarks = roleItem.Remarks || '';
        this.IsActive = roleItem.IsActive || true;
        this.RequestType = 0; // New
    }
}
