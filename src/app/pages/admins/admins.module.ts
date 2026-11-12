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
import { AdminsRoutingModule } from './admins-routing.module';

import { AccountComponent } from './accounts/account.component';
import { CreateAccountComponent } from './accounts/create-account/create-account.component';
import { UserProfileComponent } from './accounts/user-profile/user-profile.component';
import { AccountService } from './accounts/account.service';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { StickyTableDirective } from '../../shared/sticky-table.directive';
import { StickyTableScrollDirective } from '../../shared/sticky-table-scroll.directive';

@NgModule({
    declarations: [
        AccountComponent,
        CreateAccountComponent,
        UserProfileComponent,
    ],
    imports: [
        NgxMaterialTimepickerModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgbPaginationModule,
        NgbTypeaheadModule,
        NgbDropdownModule,
        NgbNavModule,
        NgbAccordionModule,
        NgbRatingModule,
        StickyTableDirective,
        StickyTableScrollDirective,
        NgbTooltipModule,
        FlatpickrModule.forRoot(),
        NgSelectModule,
        AdminsRoutingModule,
        SharedModule
    ],
    providers: [
        DatePipe,
        AccountService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AdminsModule {
    constructor() {
        defineElement();
    }
}
