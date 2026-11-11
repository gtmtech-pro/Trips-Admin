import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Component pages
import { AuthGuard } from '../../core/guards/auth.guard';
import { RouteConstants } from '../../constants/route.constant';
import { TripComponent } from './trips/trip.component';
import { CreateTripComponent } from './trips/create-trip/create-trip.component';

const routes: Routes = [
  { path: RouteConstants.Trip.List, component: TripComponent, canActivate: [AuthGuard] },
  { path: RouteConstants.Trip.New, component: CreateTripComponent, canActivate: [AuthGuard] },
  { path: RouteConstants.Trip.Edit, component: CreateTripComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TripsRoutingModule { }
