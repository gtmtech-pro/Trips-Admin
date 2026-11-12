import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";

@Injectable()
export class ServiceConstants {
    public BaseUrl: string = environment.ApiBaseUrl;
    public RetryServieNo: number = 0;

    public CommonService = {
        SaveTripSettings: "TripTracker/SaveTripSettings",
        CompressUploadedImages: "TripTracker/CompressUploadedImages",
        CheckSalaryStatus: "SalaryProcessing/CheckSalaryStatus"
    }

    public MasterData = {
        GetAll: "TripTracker/GetMasterDataByType",
        UploadExcelData: "DataUpload/UploadExcelData",
        GetDashboardData: "TripTracker/GetDashboardData",
        GetUniqueId: "TripTracker/GetUniqueId"
    };

    public DashboardGraphData = {
        GetDashboardSchoolChartData: "Dashboard/GetDashboardSchoolChartData",
        GetDashboardVocationalTrainersCardData: "Dashboard/GetDashboardVocationalTrainersCardData",
        GetDashboardJobRoleUnitsCardData: "Dashboard/GetDashboardJobRoleUnitsCardData",
        GetDashboardSummary: "TripTracker/GetDashboardSummary",
    }

    public Account = {
        GetAll: "Account/GetAccounts",
        GetAllByCriteria: "Account/GetAccountsByCriteria",
        GetById: "Account/GetAccountById",
        GetEmployeeDetailsById: "Employee/GetEmployeeDetailsById",
        CreateOrUpdate: "Account/CreateOrUpdateAccountDetails",
        GetAccountDetailsById: "Account/GetAccountDetailsById",
        GetLogoutHistoriesById: "Account/GetLogoutHistoriesById",
        GetEmployeesByReportingManagerId: "Account/GetEmployeesByReportingManagerId",
        SaveEmployeesforReportingManager: "Account/SaveEmployeesforReportingManager",
        Delete: "Account/DeleteAccountById",
        ChangePassword: "Account/ChangePassword",
        ForgotPassword: "TripTracker/ForgotPassword",
        ResetPassword: "TripTracker/ResetPassword",
        ChangeLogin: "Account/ChangeUserLoginId"
    };

    public AccountTransaction = {
        GetAll: "AccountTransaction/GetAccountTransactions",
        GetAllByCriteria: "AccountTransaction/GetAccountTransactionsByCriteria",
        GetById: "AccountTransaction/GetAccountTransactionById",
        CreateOrUpdate: "AccountTransaction/CreateOrUpdateAccountTransactionDetails",
        Delete: "AccountTransaction/DeleteAccountTransactionById"
    };

    public Country = {
        GetAll: "Country/GetCountries",
        GetAllByCriteria: "Country/GetCountriesByCriteria",
        GetById: "Country/GetCountryById",
        CreateOrUpdate: "Country/CreateOrUpdateCountryDetails",
        Delete: "Country/DeleteCountryById"
    };

    public State = {
        GetAll: "State/GetStates",
        GetAllByCriteria: "State/GetStatesByCriteria",
        GetById: "State/GetStateById",
        CreateOrUpdate: "State/CreateOrUpdateStateDetails",
        Delete: "State/DeleteStateById"
    };

    public District = {
        GetAll: "District/GetDistricts",
        GetAllByCriteria: "District/GetDistrictsByCriteria",
        GetById: "District/GetDistrictById",
        CreateOrUpdate: "District/CreateOrUpdateDistrictDetails",
        Delete: "District/DeleteDistrictById",
        GetAllByCriteriaTmp: "District/GetDistrictsByCriteriaTmp",
    };

    public Division = {
        GetAll: "Division/GetDivisions",
        GetAllByCriteria: "Division/GetDivisionsByCriteria",
        GetById: "Division/GetDivisionById",
        CreateOrUpdate: "Division/CreateOrUpdateDivisionDetails",
        Delete: "Division/DeleteDivisionById"
    };

    public Block = {
        GetAll: "Block/GetBlocks",
        GetAllByCriteria: "Block/GetBlocksByCriteria",
        GetById: "Block/GetBlockById",
        CreateOrUpdate: "Block/CreateOrUpdateBlockDetails",
        Delete: "Block/DeleteBlockById"
    };

    public Cluster = {
        GetAll: "Cluster/GetClusters",
        GetAllByCriteria: "Cluster/GetClustersByCriteria",
        GetById: "Cluster/GetClusterById",
        CreateOrUpdate: "Cluster/CreateOrUpdateClusterDetails",
        Delete: "Cluster/DeleteClusterById"
    };

    public MonthQuarterYear = {
        GetAll: "MonthQuarterYear/GetMonthQuarterYears",
        GetAllByCriteria: "MonthQuarterYear/GetMonthQuarterYearsByCriteria",
        GetById: "MonthQuarterYear/GetMonthQuarterYearById",
        CreateOrUpdate: "MonthQuarterYear/CreateOrUpdateMonthQuarterYearDetails",
        Delete: "MonthQuarterYear/DeleteMonthQuarterYearById",
        GetAllByCriteriaTmp: "MonthQuarterYear/GetMonthQuarterYearsByCriteriaTmp",
    };

    public TermsCondition = {
        GetAll: "TermsCondition/GetTermsConditions",
        GetAllByCriteria: "TermsCondition/GetTermsConditionsByCriteria",
        GetById: "TermsCondition/GetTermsConditionById",
        CreateOrUpdate: "TermsCondition/CreateOrUpdateTermsConditionDetails",
        Delete: "TermsCondition/DeleteTermsConditionById"
    };

    public Report = {
        GetEmployeeReports: "Report/GetEmployeeReports",
        GetEmployeeSalaryReports: "Report/GetEmployeeSalaryReports",
        GetMonthlyAttendanceReports: "Report/GetMonthlyAttendanceReports",
    };

    public MessageTemplate = {
        GetAll: "MessageTemplate/GetMessageTemplates",
        GetAllByCriteria: "MessageTemplate/GetMessageTemplatesByCriteria",
        GetById: "MessageTemplate/GetMessageTemplateById",
        CreateOrUpdate: "MessageTemplate/CreateOrUpdateMessageTemplateDetails",
        Delete: "MessageTemplate/DeleteMessageTemplateById"
    };

    public AppSetting = {
        GetAll: "AppSetting/GetAppSettings",
        GetAllByCriteria: "AppSetting/GetAppSettingsByCriteria",
        GetById: "AppSetting/GetAppSettingById",
        CreateOrUpdate: "AppSetting/CreateOrUpdateAppSettingDetails",
        Delete: "AppSetting/DeleteAppSettingById"
    };

    public AuditLog = {
        GetAll: "AuditLog/GetAuditLogs",
        GetAllByCriteria: "AuditLog/GetAuditLogsByCriteria",
        GetById: "AuditLog/GetAuditLogById",
        CreateOrUpdate: "AuditLog/CreateOrUpdateAuditLogDetails",
        Delete: "AuditLog/DeleteAuditLogById"
    };

    public DataType = {
        GetAll: "DataType/GetDataTypes",
        GetAllByCriteria: "DataType/GetDataTypesByCriteria",
        GetById: "DataType/GetDataTypeById",
        CreateOrUpdate: "DataType/CreateOrUpdateDataTypeDetails",
        Delete: "DataType/DeleteDataTypeById"
    };

    public DataValue = {
        GetAll: "DataValue/GetDataValues",
        GetAllByCriteria: "DataValue/GetDataValuesByCriteria",
        GetById: "DataValue/GetDataValueById",
        CreateOrUpdate: "DataValue/CreateOrUpdateDataValueDetails",
        Delete: "DataValue/DeleteDataValueById"
    };

    public Deposit = {
        GetAll: "Deposit/GetDeposits",
        GetAllByCriteria: "Deposit/GetDepositsByCriteria",
        GetById: "Deposit/GetDepositById",
        CreateOrUpdate: "Deposit/CreateOrUpdateDepositDetails",
        Delete: "Deposit/DeleteDepositById"
    };

    public ErrorLog = {
        GetAll: "ErrorLog/GetErrorLogs",
        GetAllByCriteria: "ErrorLog/GetErrorLogsByCriteria",
        GetById: "ErrorLog/GetErrorLogById",
        CreateOrUpdate: "ErrorLog/CreateOrUpdateErrorLogDetails",
        Delete: "ErrorLog/DeleteErrorLogById"
    };

    public ExpenseCategory = {
        GetAll: "ExpenseCategory/GetExpenseCategories",
        GetAllByCriteria: "ExpenseCategory/GetExpenseCategoriesByCriteria",
        GetById: "ExpenseCategory/GetExpenseCategoryById",
        CreateOrUpdate: "ExpenseCategory/CreateOrUpdateExpenseCategoryDetails",
        Delete: "ExpenseCategory/DeleteExpenseCategoryById"
    };

    public Expense = {
        GetAll: "Expense/GetExpense",
        GetAllByCriteria: "Expense/GetExpensesByCriteria",
        GetById: "Expense/GetExpenseById",
        CreateOrUpdate: "Expense/CreateOrUpdateExpenseDetails",
        Delete: "Expense/DeleteExpenseById"
    };

    public ExpenseShare = {
        GetAll: "ExpenseShare/GetExpenseShares",
        GetAllByCriteria: "ExpenseShare/GetExpenseSharesByCriteria",
        GetById: "ExpenseShare/GetExpenseShareById",
        CreateOrUpdate: "ExpenseShare/CreateOrUpdateExpenseShareDetails",
        Delete: "ExpenseShare/DeleteExpenseShareById"
    };

    public Friend = {
        GetAll: "Friend/GetFriends",
        GetAllByCriteria: "Friend/GetFriendsByCriteria",
        GetById: "Friend/GetFriendById",
        CreateOrUpdate: "Friend/CreateOrUpdateFriendDetails",
        Delete: "Friend/DeleteFriendById"
    };

    public QueryLog = {
        GetAll: "QueryLog/GetQueryLogs",
        GetAllByCriteria: "QueryLog/GetQueryLogsByCriteria",
        GetById: "QueryLog/GetQueryLogById",
        CreateOrUpdate: "QueryLog/CreateOrUpdateQueryLogDetails",
        Delete: "QueryLog/DeleteQueryLogById"
    };

    public Refund = {
        GetAll: "Refund/GetRefunds",
        GetAllByCriteria: "Refund/GetRefundsByCriteria",
        GetById: "Refund/GetRefundById",
        CreateOrUpdate: "Refund/CreateOrUpdateRefundDetails",
        Delete: "Refund/DeleteRefundById"
    };

    public Role = {
        GetAll: "Role/GetRoles",
        GetAllByCriteria: "Role/GetRolesByCriteria",
        GetById: "Role/GetRoleById",
        CreateOrUpdate: "Role/CreateOrUpdateRoleDetails",
        Delete: "Role/DeleteRoleById"
    };

    public RoleTransaction = {
        GetAll: "RoleTransaction/GetRoleTransactions",
        GetAllByCriteria: "RoleTransaction/GetRoleTransactionsByCriteria",
        GetById: "RoleTransaction/GetRoleTransactionById",
        CreateOrUpdate: "RoleTransaction/CreateOrUpdateRoleTransactionDetails",
        Delete: "RoleTransaction/DeleteRoleTransactionById"
    };

    public Settlement = {
        GetAll: "Settlement/GetSettlements",
        GetAllByCriteria: "Settlement/GetSettlementsByCriteria",
        GetById: "Settlement/GetSettlementById",
        CreateOrUpdate: "Settlement/CreateOrUpdateSettlementDetails",
        Delete: "Settlement/DeleteSettlementById"
    };

    public SettlementTransaction = {
        GetAll: "SettlementTransaction/GetSettlementTransactions",
        GetAllByCriteria: "SettlementTransaction/GetSettlementTransactionsByCriteria",
        GetById: "SettlementTransaction/GetSettlementTransactionById",
        CreateOrUpdate: "SettlementTransaction/CreateOrUpdateSettlementTransactionDetails",
        Delete: "SettlementTransaction/DeleteSettlementTransactionById"
    };

    public SiteHeader = {
        GetAll: "SiteHeader/GetSiteHeaders",
        GetAllByCriteria: "SiteHeader/GetSiteHeadersByCriteria",
        GetById: "SiteHeader/GetSiteHeaderById",
        CreateOrUpdate: "SiteHeader/CreateOrUpdateSiteHeaderDetails",
        Delete: "SiteHeader/DeleteSiteHeaderById"
    };

    public SiteSubHeader = {
        GetAll: "SiteSubHeader/GetSiteSubHeaders",
        GetAllByCriteria: "SiteSubHeader/GetSiteSubHeadersByCriteria",
        GetById: "SiteSubHeader/GetSiteSubHeaderById",
        CreateOrUpdate: "SiteSubHeader/CreateOrUpdateSiteSubHeaderDetails",
        Delete: "SiteSubHeader/DeleteSiteSubHeaderById"
    };

    public Transaction = {
        GetAll: "Transaction/GetTransactions",
        GetAllByCriteria: "Transaction/GetTransactionsByCriteria",
        GetById: "Transaction/GetTransactionById",
        CreateOrUpdate: "Transaction/CreateOrUpdateTransactionDetails",
        Delete: "Transaction/DeleteTransactionById"
    };

    public TripDay = {
        GetAll: "TripDay/GetTripDays",
        GetAllByCriteria: "TripDay/GetTripDaysByCriteria",
        GetById: "TripDay/GetTripDayById",
        CreateOrUpdate: "TripDay/CreateOrUpdateTripDayDetails",
        Delete: "TripDay/DeleteTripDayById"
    };

    public TripInvitation = {
        GetAll: "TripInvitation/GetTripInvitations",
        GetAllByCriteria: "TripInvitation/GetTripInvitationsByCriteria",
        GetById: "TripInvitation/GetTripInvitationById",
        CreateOrUpdate: "TripInvitation/CreateOrUpdateTripInvitationDetails",
        Delete: "TripInvitation/DeleteTripInvitationById"
    };

    public TripMember = {
        GetAll: "TripMember/GetTripMembers",
        GetAllByCriteria: "TripMember/GetTripMembersByCriteria",
        GetById: "TripMember/GetTripMemberById",
        CreateOrUpdate: "TripMember/CreateOrUpdateTripMemberDetails",
        Delete: "TripMember/DeleteTripMemberById"
    };

    public TripNote = {
        GetAll: "TripNote/GetTripNotes",
        GetAllByCriteria: "TripNote/GetTripNotesByCriteria",
        GetById: "TripNote/GetTripNoteById",
        CreateOrUpdate: "TripNote/CreateOrUpdateTripNoteDetails",
        Delete: "TripNote/DeleteTripNoteById"
    };

    public TripPackingItem = {
        GetAll: "TripPackingItem/GetTripPackingItems",
        GetAllByCriteria: "TripPackingItem/GetTripPackingItemsByCriteria",
        GetById: "TripPackingItem/GetTripPackingItemById",
        CreateOrUpdate: "TripPackingItem/CreateOrUpdateTripPackingItemDetails",
        Delete: "TripPackingItem/DeleteTripPackingItemById"
    };

    public TripPlace = {
        GetAll: "TripPlace/GetTripPlaces",
        GetAllByCriteria: "TripPlace/GetTripPlacesByCriteria",
        GetById: "TripPlace/GetTripPlaceById",
        CreateOrUpdate: "TripPlace/CreateOrUpdateTripPlaceDetails",
        Delete: "TripPlace/DeleteTripPlaceById"
    };

    public Trip = {
        GetAll: "Trip/GetTrips",
        GetAllByCriteria: "Trip/GetTripsByCriteria",
        GetById: "Trip/GetTripById",
        CreateOrUpdate: "Trip/CreateOrUpdateTripDetails",
        Delete: "Trip/DeleteTripById"
    };
};
