import { v4 as uuidv4 } from 'uuid';

export class TripPackingItemModel {
    PackingItemId: string;
    TripId: string;
    CategoryName: string;
    ItemName: string;
    Quantity: any;
    IsPacked: boolean;
    Notes: string;
    SortOrder: any;
    IsActive: boolean;
    RequestType: any;

    constructor(tripPackingItemItem?: any) {
        tripPackingItemItem = tripPackingItemItem || {};

        this.PackingItemId = tripPackingItemItem.PackingItemId || uuidv4();
        this.TripId = tripPackingItemItem.TripId || null;
        this.CategoryName = tripPackingItemItem.CategoryName || '';
        this.ItemName = tripPackingItemItem.ItemName || '';
        this.Quantity = tripPackingItemItem.Quantity || '';
        this.IsPacked = tripPackingItemItem.IsPacked || false;
        this.Notes = tripPackingItemItem.Notes || '';
        this.SortOrder = tripPackingItemItem.SortOrder || '';
        this.IsActive = tripPackingItemItem.IsActive || true;
        this.RequestType = 0; // New
    }
}
