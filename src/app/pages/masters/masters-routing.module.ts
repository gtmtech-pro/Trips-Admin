import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Component pages
import { RouteConstants } from '../../constants/route.constant';
import { AuthGuard } from '../../core/guards/auth.guard';
import { DataTypeComponent } from './data-types/data-type.component';
import { CreateDataTypeComponent } from './data-types/create-data-type/create-data-type.component';
import { DataValueComponent } from './data-values/data-value.component';
import { CreateDataValueComponent } from './data-values/create-data-value/create-data-value.component';

const routes: Routes = [
  { path: RouteConstants.DataType.List, component: DataTypeComponent, canActivate: [AuthGuard] },
  { path: RouteConstants.DataType.New, component: CreateDataTypeComponent, canActivate: [AuthGuard] },
  { path: RouteConstants.DataType.Edit, component: CreateDataTypeComponent, canActivate: [AuthGuard] },

  { path: RouteConstants.DataValue.List, component: DataValueComponent, canActivate: [AuthGuard] },
  { path: RouteConstants.DataValue.New, component: CreateDataValueComponent, canActivate: [AuthGuard] },
  { path: RouteConstants.DataValue.Edit, component: CreateDataValueComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MastersRoutingModule { }
