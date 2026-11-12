import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbPaginationModule, NgbTypeaheadModule, NgbDropdownModule, NgbNavModule, NgbAccordionModule, NgbRatingModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

// Flat Picker
import { FlatpickrModule } from 'angularx-flatpickr';
// Ng Select
import { NgSelectModule } from '@ng-select/ng-select';

// Load Icon
import { defineElement } from "@lordicon/element";
import lottie from 'lottie-web';

// Component Pages
import { SharedModule } from '../../shared/shared.module';
import { DatePipe } from '@angular/common';
import { MastersRoutingModule } from './masters-routing.module';

import { DataTypeComponent } from './data-types/data-type.component';
import { CreateDataTypeComponent } from './data-types/create-data-type/create-data-type.component';
import { DataTypeService } from './data-types/data-type.service';
import { DataValueComponent } from './data-values/data-value.component';
import { CreateDataValueComponent } from './data-values/create-data-value/create-data-value.component';
import { DataValueService } from './data-values/data-value.service';
import { StickyTableScrollDirective } from '../../shared/sticky-table-scroll.directive';
import { StickyTableDirective } from '../../shared/sticky-table.directive';

@NgModule({
    declarations: [
        DataTypeComponent,
        CreateDataTypeComponent,
        DataValueComponent,
        CreateDataValueComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgbPaginationModule,
        NgbTypeaheadModule,
        NgbDropdownModule,
        NgbNavModule,
        NgbAccordionModule,
        NgbRatingModule,
        NgbTooltipModule,
        FlatpickrModule.forRoot(),
        NgSelectModule,
        StickyTableDirective,
        StickyTableScrollDirective,
        MastersRoutingModule,
        SharedModule
    ],
    providers: [
        DatePipe,
        DataTypeService,
        DataValueService,

    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MastersModule {
    constructor() {
        defineElement();
    }
}
