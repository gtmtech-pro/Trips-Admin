import { v4 as uuidv4 } from 'uuid';

export class TripModel {
    TripId: string;
    OwnerAccountId: string;
    TripName: string;
    Destination: string;
    StartDate: any;
    EndDate: any;
    TripType: string;
    TripDescription: string;
    BackgroundImageUrl: string;
    IsShortcut: boolean;
    IsArchived: boolean;
    IsDeleted: boolean;
    IsActive: boolean;
    RequestType: any;

    constructor(tripItem?: any) {
        tripItem = tripItem || {};

        this.TripId = tripItem.TripId || uuidv4();
        this.OwnerAccountId = tripItem.OwnerAccountId || null;
        this.TripName = tripItem.TripName || '';
        this.Destination = tripItem.Destination || '';
        this.StartDate = tripItem.StartDate || '';
        this.EndDate = tripItem.EndDate || '';
        this.TripType = tripItem.TripType || '';
        this.TripDescription = tripItem.TripDescription || '';
        this.BackgroundImageUrl = tripItem.BackgroundImageUrl || '';
        this.IsShortcut = tripItem.IsShortcut || false;
        this.IsArchived = tripItem.IsArchived || false;
        this.IsDeleted = tripItem.IsDeleted || false;
        this.IsActive = tripItem.IsActive || true;
        this.RequestType = 0; // New
    }
}
