export const RouteConstants = {
    Login: 'login',
    Home: 'home',
    Sample: 'sample',
    Settings: 'settings',
    PageNotFound: 'page-not-found',

    Account: {
        List: 'admins/accounts',
        New: 'admins/accounts/:actionType',
        Edit: 'admins/accounts/:actionType/:accountId',
        UserProfile: 'user/profile',
        ChangePassword: 'user/change-password',
        ForgotPassword: 'user/forgot-password',
        ResetPassword: 'user/reset-password',
        ResetPasswordByToken: 'user/reset-password/:accessToken',
        ChangeLogin: 'user/change-login',
    },
    Country: {
        List: 'countries',
        New: 'countries/:actionType',
        Edit: 'countries/:actionType/:countryCode'
    },
    State: {
        List: 'states',
        New: 'states/:actionType',
        Edit: 'states/:actionType/:stateCode'
    },
    District: {
        List: 'districts',
        New: 'districts/:actionType',
        Edit: 'districts/:actionType/:districtCode'
    },
    Division: {
        List: 'divisions',
        New: 'divisions/:actionType',
        Edit: 'divisions/:actionType/:divisionId'
    },
    Block: {
        List: 'blocks',
        New: 'blocks/:actionType',
        Edit: 'blocks/:actionType/:blockId'
    },
    Cluster: {
        List: 'clusters',
        New: 'clusters/:actionType',
        Edit: 'clusters/:actionType/:clusterId'
    },
    Phase: {
        List: 'phases',
        New: 'phases/:actionType',
        Edit: 'phases/:actionType/:phaseId'
    },
    TermsCondition: {
        List: 'terms-conditions',
        New: 'terms-conditions/:actionType',
        Edit: 'terms-conditions/:actionType/:termsConditionId'
    },
    Report: {
        GetEmployeeReports: 'report/employee-reports',
        GetEmployeeSalaryReports: 'report/employee-salary-reports',
        GetMonthlyAttendanceReports: 'report/monthly-attendance-reports',
        GetEmployeePayrollReports: 'report/employee-payroll-reports',
        GetEmployeePFContributionReport: 'report/employee-pf-contribution-reports',
        GetEmployeePTDeductionReport: 'report/employee-pt-deduction-reports',
        GetEmployeeESICContributionReport: 'report/employee-esic-contribution-reports',
        GetEmployeeSalarySheetReport: 'report/employee-salary-sheet-report',
    },
    SummaryDashboard: {
        HRMSDashboard: 'dashboards/hrms-dashboard',
        AttendanceDashboard: 'dashboards/attendance-dashboard'
    },
    FolderAccess: {
        VTMonthlyAttendancePDF: 'Reports/VTMonthlyAttendancePDF',
        DataUpload: 'data-upload'
    },
    MessageTemplates: {
        List: 'message-templates',
        New: 'message-templates/:actionType',
        Edit: 'message-templates/:actionType/:messageTemplateId'
    },
    PrivacyPolicy: {
        List: 'privacy-policy',
    },
    DataType: {
        List: 'masters/data-types',
        New: 'masters/data-types/:actionType',
        Edit: 'masters/data-types/:actionType/:dataTypeId'
    },
    DataValue: {
        List: 'masters/data-values',
        New: 'masters/data-values/:actionType',
        Edit: 'masters/data-values/:actionType/:dataValueId'
    },
    Employee: {
        List: 'hrms/employees',
        New: 'hrms/employees/:actionType',
        Edit: 'hrms/employees/:actionType/:employeeId'
    },
    ErrorLog: {
        List: 'admins/error-logs',
        New: 'admins/error-logs/:actionType',
        Edit: 'admins/error-logs/:actionType/:errorLogId'
    },
    QueryLog: {
        List: 'admins/query-logs',
        New: 'admins/query-logs/:actionType',
        Edit: 'admins/query-logs/:actionType/:queryLogId'
    },
    AccountTransaction: {
        List: 'admins/account-transactions',
        New: 'admins/account-transactions/:actionType',
        Edit: 'admins/account-transactions/:actionType/:accountTransactionId'
    },
    Role: {
        List: 'settings/roles',
        New: 'settings/roles/:actionType',
        Edit: 'settings/roles/:actionType/:roleId'
    },
    RoleTransaction: {
        List: 'settings/role-transactions',
        New: 'settings/role-transactions/:actionType',
        Edit: 'settings/role-transactions/:actionType/:roleTransactionId'
    },
    SiteHeader: {
        List: 'settings/site-headers',
        New: 'settings/site-headers/:actionType',
        Edit: 'settings/site-headers/:actionType/:siteHeaderId'
    },
    SiteSubHeader: {
        List: 'settings/site-sub-headers',
        New: 'settings/site-sub-headers/:actionType',
        Edit: 'settings/site-sub-headers/:actionType/:siteSubHeaderId'
    },
    Transaction: {
        List: 'settings/transactions',
        New: 'settings/transactions/:actionType',
        Edit: 'settings/transactions/:actionType/:transactionId'
    },
    AppSetting: {
        List: 'settings/trip-settings',
        New: 'settings/trip-settings/:actionType',
        Edit: 'settings/trip-settings/:actionType/:settingId'
    },
    Trip: {
        List: 'transaction/trips',
        New: 'transaction/trips/:actionType',
        Edit: 'transaction/trips/:actionType/:tripId'
    }
}
