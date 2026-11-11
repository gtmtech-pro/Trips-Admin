import { v4 as uuidv4 } from 'uuid';

export class SiteSubHeaderModel {
    SiteSubHeaderId: string;
    SiteHeaderId: string;
    ParentHeaderId: string;
    TransactionId: string;
    DisplayOrder: any;
    Remarks: string;
    IsActive: boolean;
    RequestType: any;

    constructor(siteSubHeaderItem?: any) {
        siteSubHeaderItem = siteSubHeaderItem || {};

        this.SiteSubHeaderId = siteSubHeaderItem.SiteSubHeaderId || uuidv4();
        this.SiteHeaderId = siteSubHeaderItem.SiteHeaderId || null;
        this.ParentHeaderId = siteSubHeaderItem.ParentHeaderId || null;
        this.TransactionId = siteSubHeaderItem.TransactionId || null;
        this.DisplayOrder = siteSubHeaderItem.DisplayOrder || '';
        this.Remarks = siteSubHeaderItem.Remarks || '';
        this.IsActive = siteSubHeaderItem.IsActive || true;
        this.RequestType = 0; // New
    }
}
