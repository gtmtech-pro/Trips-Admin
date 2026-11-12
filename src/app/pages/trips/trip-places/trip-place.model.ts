import { v4 as uuidv4 } from 'uuid';

export class TripPlaceModel {
    PlaceId: string;
    TripDayId: string;
    PlaceName: string;
    LocationName: string;
    TripAddress: string;
    Description: string;
    PlannedVisitDate: any;
    VisitTime: any;
    SortOrder: any;
    Priority: string;
    Notes: string;
    ImageUrl: string;
    IsVisited: boolean;
    VisitStatus: string;
    IsActive: boolean;
    RequestType: any;

    constructor(tripPlaceItem?: any) {
        tripPlaceItem = tripPlaceItem || {};

        this.PlaceId = tripPlaceItem.PlaceId || uuidv4();
        this.TripDayId = tripPlaceItem.TripDayId || null;
        this.PlaceName = tripPlaceItem.PlaceName || '';
        this.LocationName = tripPlaceItem.LocationName || '';
        this.TripAddress = tripPlaceItem.TripAddress || '';
        this.Description = tripPlaceItem.Description || '';
        this.PlannedVisitDate = tripPlaceItem.PlannedVisitDate || '';
        this.VisitTime = tripPlaceItem.VisitTime || '';
        this.SortOrder = tripPlaceItem.SortOrder || '';
        this.Priority = tripPlaceItem.Priority || '';
        this.Notes = tripPlaceItem.Notes || '';
        this.ImageUrl = tripPlaceItem.ImageUrl || '';
        this.IsVisited = tripPlaceItem.IsVisited || false;
        this.VisitStatus = tripPlaceItem.VisitStatus || '';
        this.IsActive = tripPlaceItem.IsActive || true;
        this.RequestType = 0; // New
    }
}
