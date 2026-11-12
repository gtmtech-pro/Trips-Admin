import { v4 as uuidv4 } from 'uuid';

export class TripMemberModel {
    TripMemberId: string;
    TripId: string;
    UserId: string;
    MemberName: string;
    EmailId: string;
    MobileNo: string;
    JoinedDate: any;
    ProfileImageUrl: string;
    TripRole: string;
    MemberStatus: string;
    IsOwner: boolean;
    IsActive: boolean;
    RequestType: any;

    constructor(tripMemberItem?: any) {
        tripMemberItem = tripMemberItem || {};

        this.TripMemberId = tripMemberItem.TripMemberId || uuidv4();
        this.TripId = tripMemberItem.TripId || null;
        this.UserId = tripMemberItem.UserId || null;
        this.MemberName = tripMemberItem.MemberName || '';
        this.EmailId = tripMemberItem.EmailId || '';
        this.MobileNo = tripMemberItem.MobileNo || '';
        this.JoinedDate = tripMemberItem.JoinedDate || '';
        this.ProfileImageUrl = tripMemberItem.ProfileImageUrl || '';
        this.TripRole = tripMemberItem.TripRole || '';
        this.MemberStatus = tripMemberItem.MemberStatus || '';
        this.IsOwner = tripMemberItem.IsOwner || false;
        this.IsActive = tripMemberItem.IsActive || true;
        this.RequestType = 0; // New
    }
}
