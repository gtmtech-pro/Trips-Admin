import { v4 as uuidv4 } from 'uuid';

export class TripInvitationModel {
    InvitationId: string;
    TripId: string;
    EmailId: string;
    TripRole: string;
    TokenHash: string;
    ExpiredDate: any;
    AcceptedDate: any;
    IsActive: boolean;
    RequestType: any;

    constructor(tripInvitationItem?: any) {
        tripInvitationItem = tripInvitationItem || {};

        this.InvitationId = tripInvitationItem.InvitationId || uuidv4();
        this.TripId = tripInvitationItem.TripId || null;
        this.EmailId = tripInvitationItem.EmailId || '';
        this.TripRole = tripInvitationItem.TripRole || '';
        this.TokenHash = tripInvitationItem.TokenHash || '';
        this.ExpiredDate = tripInvitationItem.ExpiredDate || '';
        this.AcceptedDate = tripInvitationItem.AcceptedDate || '';
        this.IsActive = tripInvitationItem.IsActive || true;
        this.RequestType = 0; // New
    }
}
