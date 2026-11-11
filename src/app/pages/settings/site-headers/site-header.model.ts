import { v4 as uuidv4 } from 'uuid';

export class SiteHeaderModel {
    SiteHeaderId: string;
    ParentHeaderId!: string;
    ShortName: string;
    LongName: string;
    Description: string;
    DisplayOrder: any;
    IconUrl: string;
    Remarks: string;
    IsActive: boolean;
    RequestType: any;

    constructor(siteHeaderItem?: any) {
        siteHeaderItem = siteHeaderItem || {};

        this.SiteHeaderId = siteHeaderItem.SiteHeaderId || uuidv4();
        this.ParentHeaderId = siteHeaderItem.ParentHeaderId || null;
        this.ShortName = siteHeaderItem.ShortName || '';
        this.LongName = siteHeaderItem.LongName || '';
        this.Description = siteHeaderItem.Description || '';
        this.DisplayOrder = siteHeaderItem.DisplayOrder || '';
        this.IconUrl = siteHeaderItem.IconUrl || '';
        this.Remarks = siteHeaderItem.Remarks || '';
        this.IsActive = siteHeaderItem.IsActive || true;
        this.RequestType = 0; // New
    }
}
