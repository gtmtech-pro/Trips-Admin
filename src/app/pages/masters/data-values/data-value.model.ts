import { v4 as uuidv4 } from 'uuid';

export class DataValueModel {
    DataValueId: string;
    DataTypeId: string;
    ParentId: string;
    Code: string;
    Name: string;
    Description: string;
    DisplayOrder: any;
    FilterValue1: string;
    FilterValue2: string;
    FilterValue3: string;
    IsActive: boolean;
    RequestType: any;

    constructor(dataValueItem?: any) {
        dataValueItem = dataValueItem || {};

        this.DataValueId = dataValueItem.DataValueId || '';
        this.DataTypeId = dataValueItem.DataTypeId || null;
        this.ParentId = dataValueItem.ParentId || '';
        this.Code = dataValueItem.Code || '';
        this.Name = dataValueItem.Name || '';
        this.Description = dataValueItem.Description || '';
        this.DisplayOrder = dataValueItem.DisplayOrder || '';
        this.FilterValue1 = dataValueItem.FilterValue1 || '';
        this.FilterValue2 = dataValueItem.FilterValue2 || '';
        this.FilterValue3 = dataValueItem.FilterValue3 || '';
        this.IsActive = dataValueItem.IsActive || true;
        this.RequestType = 0; // New
    }
}
