import { v4 as uuidv4 } from 'uuid';

export class AppSettingModel {
    SettingId: string;
    SettingType: string;
    SettingName: string;
    SettingLabel: string;
    SettingValue: string;
    FormattedValue: string;
    DisplayOrder: any;
    Remarks: string;
    IsActive: boolean;
    RequestType: any;

    constructor(appSettingItem?: any) {
        appSettingItem = appSettingItem || {};

        this.SettingId = appSettingItem.SettingId || uuidv4();
        this.SettingType = appSettingItem.SettingType || '';
        this.SettingName = appSettingItem.SettingName || '';
        this.SettingLabel = appSettingItem.SettingLabel || '';
        this.SettingValue = appSettingItem.SettingValue || '';
        this.FormattedValue = appSettingItem.FormattedValue || '';
        this.DisplayOrder = appSettingItem.DisplayOrder || '';
        this.Remarks = appSettingItem.Remarks || '';
        this.IsActive = appSettingItem.IsActive || true;
        this.RequestType = 0; // New
    }
}
