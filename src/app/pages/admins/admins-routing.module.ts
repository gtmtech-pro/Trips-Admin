import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Component pages
import { RouteConstants } from '../../constants/route.constant';
import { AuthGuard } from '../../core/guards/auth.guard';
import { AccountComponent } from './accounts/account.component';
import { CreateAccountComponent } from './accounts/create-account/create-account.component';
import { UserProfileComponent } from './accounts/user-profile/user-profile.component';

const routes: Routes = [
  { path: RouteConstants.Account.List, component: AccountComponent, canActivate: [AuthGuard] },
  { path: RouteConstants.Account.New, component: CreateAccountComponent, canActivate: [AuthGuard] },
  { path: RouteConstants.Account.Edit, component: CreateAccountComponent, canActivate: [AuthGuard] },
  { path: RouteConstants.Account.UserProfile, component: UserProfileComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminsRoutingModule { }
