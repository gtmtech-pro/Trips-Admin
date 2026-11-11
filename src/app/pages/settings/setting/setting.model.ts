export class SettingModel {
    RoleId: string;
    UserId: string;

    ContentTypeId: string;
    LargestFilesSize: string;
    FilesForCompress: string;
    IsWatermarkAllowed: boolean;

    constructor(schoolItem?: any) {
        schoolItem = schoolItem || {};

        this.RoleId = schoolItem.RoleId || '';
        this.UserId = schoolItem.UserId || '';

        this.ContentTypeId = schoolItem.ContentTypeId || '';
        this.LargestFilesSize = schoolItem.LargestFilesSize || '';
        this.FilesForCompress = schoolItem.FilesForCompress || '';
        this.IsWatermarkAllowed = schoolItem.IsWatermarkAllowed || false;
    }
}
