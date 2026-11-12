import { v4 as uuidv4 } from 'uuid';

export class FriendModel {
    EmployeeId: string;
    EmployeeCode: string;
    FirstName: string;
    MiddleName: string;
    LastName: string;
    EmployeeName: string;
    Gender: string;
    Age: any;
    DateOfBirth: any;
    MaritalStatus: string;
    MobileNo: string;
    EmailId: string;
    DateOfJoining: any;
    AadhaarNo: string;
    PAN: string;
    ProfileImage: string;
    IsActive: boolean;
    RequestType: any;

    constructor(friendItem?: any) {
        friendItem = friendItem || {};

        this.EmployeeId = friendItem.EmployeeId || uuidv4();
        this.EmployeeCode = friendItem.EmployeeCode || '';
        this.FirstName = friendItem.FirstName || '';
        this.MiddleName = friendItem.MiddleName || '';
        this.LastName = friendItem.LastName || '';
        this.EmployeeName = friendItem.EmployeeName || '';
        this.Gender = friendItem.Gender || '';
        this.Age = friendItem.Age || '';
        this.DateOfBirth = friendItem.DateOfBirth || '';
        this.MaritalStatus = friendItem.MaritalStatus || '';
        this.MobileNo = friendItem.MobileNo || '';
        this.EmailId = friendItem.EmailId || '';
        this.DateOfJoining = friendItem.DateOfJoining || '';
        this.AadhaarNo = friendItem.AadhaarNo || '';
        this.PAN = friendItem.PAN || '';
        this.ProfileImage = friendItem.ProfileImage || '';
        this.IsActive = friendItem.IsActive || true;
        this.RequestType = 0; // New
    }
}
