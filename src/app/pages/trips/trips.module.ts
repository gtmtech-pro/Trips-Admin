import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbNavModule, NgbPaginationModule, NgbToastModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { FlatpickrDirective } from 'angularx-flatpickr';
import { LeafletModule } from '@bluehalo/ngx-leaflet';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { LightboxModule } from 'ngx-lightbox';

// Load Icons
import { defineElement } from "@lordicon/element";

// Pages Routing
import { TripsRoutingModule } from './trips-routing.module';
import { SharedModule } from '../../shared/shared.module';

import { TripComponent } from './trips/trip.component';
import { CreateTripComponent } from './trips/create-trip/create-trip.component';
import { TripService } from './trips/trip.service';
import { StickyTableDirective } from '../../shared/sticky-table.directive';
import { StickyTableScrollDirective } from '../../shared/sticky-table-scroll.directive';

@NgModule({
  declarations: [
    TripComponent,
    CreateTripComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbToastModule,
    FlatpickrDirective,
    LeafletModule,
    NgbPaginationModule,
    NgbTooltipModule,
    NgbDropdownModule,
    NgbNavModule,
    StickyTableDirective,
    StickyTableScrollDirective,
    SharedModule,
    LightboxModule,
    TripsRoutingModule,
  ],
  providers: [
    TripService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TripsModule {
  constructor() {
    defineElement();
  }
}
