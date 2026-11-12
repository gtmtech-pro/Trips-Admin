import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbPaginationModule, NgbTypeaheadModule, NgbDropdownModule, NgbNavModule, NgbAccordionModule, NgbRatingModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';


// Range Slider
import { NgxSliderModule } from 'ngx-slider-v2';
// Simple bar
import { SimplebarAngularModule } from 'simplebar-angular';
// Swiper Slider
import { SlickCarouselModule } from 'ngx-slick-carousel';
// Ck Editer
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
// File Uploads
import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { DROPZONE_CONFIG } from 'ngx-dropzone-wrapper';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
// Flat Picker
import { FlatpickrModule } from 'angularx-flatpickr';
// Ng Select
import { NgSelectModule } from '@ng-select/ng-select';
// Apex Chart Package
import { NgApexchartsModule } from 'ng-apexcharts';

// Load Icon
import { defineElement } from "@lordicon/element";
import lottie from 'lottie-web';

// Component Pages
import { SharedModule } from '../../shared/shared.module';

// Feather Icon
import { FeatherModule } from 'angular-feather';
import { allIcons } from 'angular-feather/icons';

import { DatePipe } from '@angular/common';
import { SettingsRoutingModule } from './settings-routing.module';

import { RoleComponent } from './roles/role.component';
import { CreateRoleComponent } from './roles/create-role/create-role.component';
import { RoleService } from './roles/role.service';
import { TransactionComponent } from './transactions/transaction.component';
import { CreateTransactionComponent } from './transactions/create-transaction/create-transaction.component';
import { TransactionService } from './transactions/transaction.service';
import { RoleTransactionComponent } from './role-transactions/role-transaction.component';
import { CreateRoleTransactionComponent } from './role-transactions/create-role-transaction/create-role-transaction.component';
import { RoleTransactionService } from './role-transactions/role-transaction.service';
import { SiteHeaderComponent } from './site-headers/site-header.component';
import { CreateSiteHeaderComponent } from './site-headers/create-site-header/create-site-header.component';
import { SiteHeaderService } from './site-headers/site-header.service';
import { SiteSubHeaderComponent } from './site-sub-headers/site-sub-header.component';
import { CreateSiteSubHeaderComponent } from './site-sub-headers/create-site-sub-header/create-site-sub-header.component';
import { SiteSubHeaderService } from './site-sub-headers/site-sub-header.service';
import { AppSettingComponent } from '../settings/app-settings/app-setting.component';
import { CreateAppSettingComponent } from '../settings/app-settings/create-app-setting/create-app-setting.component';
import { AppSettingService } from '../settings/app-settings/app-setting.service';
import { StickyTableDirective } from '../../shared/sticky-table.directive';
import { StickyTableScrollDirective } from '../../shared/sticky-table-scroll.directive';

const DEFAULT_DROPZONE_CONFIG: DropzoneConfigInterface = {
    url: 'https://httpbin.org/post',
    maxFilesize: 50,
    acceptedFiles: 'image/*'
};

@NgModule({
    declarations: [
        RoleComponent,
        CreateRoleComponent,
        TransactionComponent,
        CreateTransactionComponent,
        RoleTransactionComponent,
        CreateRoleTransactionComponent,
        SiteHeaderComponent,
        CreateSiteHeaderComponent,
        SiteSubHeaderComponent,
        CreateSiteSubHeaderComponent,
        AppSettingComponent,
        CreateAppSettingComponent,
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
        NgxSliderModule,
        SimplebarAngularModule,
        SlickCarouselModule,
        StickyTableDirective,
        StickyTableScrollDirective,
        CKEditorModule,
        DropzoneModule,
        FlatpickrModule.forRoot(),
        NgSelectModule,
        NgApexchartsModule,
        SettingsRoutingModule,
        SharedModule
    ],
    providers: [
        DatePipe,
        RoleService,
        TransactionService,
        SiteHeaderService,
        SiteSubHeaderService,
        RoleTransactionService,
        AppSettingService,
        { provide: DROPZONE_CONFIG, useValue: DEFAULT_DROPZONE_CONFIG }
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SettingsModule {
    constructor() {
        defineElement();
    }
}
