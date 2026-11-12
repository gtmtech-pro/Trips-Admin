import { v4 as uuidv4 } from 'uuid';

export class TripDayModel {
    TripDayId: string;
    TripId: string;
    DayNumber: any;
    TripDate: any;
    Title: string;
    Notes: string;
    IsActive: boolean;
    RequestType: any;

    constructor(tripDayItem?: any) {
        tripDayItem = tripDayItem || {};

        this.TripDayId = tripDayItem.TripDayId || uuidv4();
        this.TripId = tripDayItem.TripId || null;
        this.DayNumber = tripDayItem.DayNumber || '';
        this.TripDate = tripDayItem.TripDate || '';
        this.Title = tripDayItem.Title || '';
        this.Notes = tripDayItem.Notes || '';
        this.IsActive = tripDayItem.IsActive || true;
        this.RequestType = 0; // New
    }
}
