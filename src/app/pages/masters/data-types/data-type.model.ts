import { v4 as uuidv4 } from 'uuid';

export class DataTypeModel {
    DataTypeId: string;
    Name: string;
    Description: string;
    IsActive: boolean;
    RequestType: any;

    constructor(dataTypeItem?: any) {
        dataTypeItem = dataTypeItem || {};

        this.DataTypeId = dataTypeItem.DataTypeId || '';
        this.Name = dataTypeItem.Name || '';
        this.Description = dataTypeItem.Description || '';
        this.IsActive = dataTypeItem.IsActive || true;
        this.RequestType = 0; // New
    }
}
