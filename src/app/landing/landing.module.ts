import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndexComponent } from './index/index.component';
import { NgbCarouselModule, NgbTooltipModule, NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { LandingRoutingModule } from "./landing-routing.module";
import { SharedModule } from '../shared/shared.module';
import { StickyTableDirective } from '../shared/sticky-table.directive';
import { StickyTableScrollDirective } from '../shared/sticky-table-scroll.directive';

@NgModule({
  declarations: [
    IndexComponent
  ],
  imports: [
    CommonModule,
    NgbCarouselModule,
    LandingRoutingModule,
    SharedModule,
    StickyTableDirective,
    StickyTableScrollDirective,
    NgbTooltipModule,
    NgbCollapseModule
  ]
})
export class LandingModule { }
