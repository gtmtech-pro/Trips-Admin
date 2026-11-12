import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Component pages
import { RouteConstants } from '../../constants/route.constant';
import { AuthGuard } from '../../core/guards/auth.guard';
import { RoleComponent } from './roles/role.component';
import { CreateRoleComponent } from './roles/create-role/create-role.component';
import { TransactionComponent } from './transactions/transaction.component';
import { CreateTransactionComponent } from './transactions/create-transaction/create-transaction.component';
import { RoleTransactionComponent } from './role-transactions/role-transaction.component';
import { CreateRoleTransactionComponent } from './role-transactions/create-role-transaction/create-role-transaction.component';
import { SiteHeaderComponent } from './site-headers/site-header.component';
import { CreateSiteHeaderComponent } from './site-headers/create-site-header/create-site-header.component';
import { SiteSubHeaderComponent } from './site-sub-headers/site-sub-header.component';
import { CreateSiteSubHeaderComponent } from './site-sub-headers/create-site-sub-header/create-site-sub-header.component';
import { AppSettingComponent } from '../settings/app-settings/app-setting.component';
import { CreateAppSettingComponent } from '../settings/app-settings/create-app-setting/create-app-setting.component';

const routes: Routes = [
  { path: RouteConstants.Role.List, component: RoleComponent, canActivate: [AuthGuard] },
  { path: RouteConstants.Role.New, component: CreateRoleComponent, canActivate: [AuthGuard] },
  { path: RouteConstants.Role.Edit, component: CreateRoleComponent, canActivate: [AuthGuard] },

  { path: RouteConstants.Transaction.List, component: TransactionComponent, canActivate: [AuthGuard] },
  { path: RouteConstants.Transaction.New, component: CreateTransactionComponent, canActivate: [AuthGuard] },
  { path: RouteConstants.Transaction.Edit, component: CreateTransactionComponent, canActivate: [AuthGuard] },

  { path: RouteConstants.RoleTransaction.List, component: RoleTransactionComponent, canActivate: [AuthGuard] },
  { path: RouteConstants.RoleTransaction.New, component: CreateRoleTransactionComponent, canActivate: [AuthGuard] },
  { path: RouteConstants.RoleTransaction.Edit, component: CreateRoleTransactionComponent, canActivate: [AuthGuard] },

  { path: RouteConstants.SiteHeader.List, component: SiteHeaderComponent, canActivate: [AuthGuard] },
  { path: RouteConstants.SiteHeader.New, component: CreateSiteHeaderComponent, canActivate: [AuthGuard] },
  { path: RouteConstants.SiteHeader.Edit, component: CreateSiteHeaderComponent, canActivate: [AuthGuard] },

  { path: RouteConstants.SiteSubHeader.List, component: SiteSubHeaderComponent, canActivate: [AuthGuard] },
  { path: RouteConstants.SiteSubHeader.New, component: CreateSiteSubHeaderComponent, canActivate: [AuthGuard] },
  { path: RouteConstants.SiteSubHeader.Edit, component: CreateSiteSubHeaderComponent, canActivate: [AuthGuard] },

  { path: RouteConstants.AppSetting.List, component: AppSettingComponent, canActivate: [AuthGuard] },
  { path: RouteConstants.AppSetting.New, component: CreateAppSettingComponent, canActivate: [AuthGuard] },
  { path: RouteConstants.AppSetting.Edit, component: CreateAppSettingComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
