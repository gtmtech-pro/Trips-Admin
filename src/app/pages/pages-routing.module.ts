import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Component pages
import { DashboardComponent } from "./dashboards/dashboard/dashboard.component";

const routes: Routes = [
  {
    path: "",
    component: DashboardComponent
  },
  {
    path: '', loadChildren: () => import('./dashboards/dashboards.module').then(m => m.DashboardsModule)
  },
  {
    path: 'apps', loadChildren: () => import('./apps/apps.module').then(m => m.AppsModule)
  },
  {
    path: 'crm', loadChildren: () => import('./crm/crm.module').then(m => m.CrmModule)
  },
  {
    path: 'pages', loadChildren: () => import('./extrapages/extraspages.module').then(m => m.ExtraspagesModule)
  },
  {
    path: 'settings', loadChildren: () => import('./settings/settings.module').then(m => m.SettingsModule)
  },
  {
    path: 'trips', loadChildren: () => import('./trips/trips.module').then(m => m.TripsModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
