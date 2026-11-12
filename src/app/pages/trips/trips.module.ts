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
import { TripPlaceComponent } from './trip-places/trip-place.component';
import { CreateTripPlaceComponent } from './trip-places/create-trip-place/create-trip-place.component';
import { TripPlaceService } from './trip-places/trip-place.service';
import { TripDayComponent } from './trip-days/trip-day.component';
import { CreateTripDayComponent } from './trip-days/create-trip-day/create-trip-day.component';
import { TripDayService } from './trip-days/trip-day.service';
import { TripMemberComponent } from './trip-members/trip-member.component';
import { CreateTripMemberComponent } from './trip-members/create-trip-member/create-trip-member.component';
import { TripMemberService } from './trip-members/trip-member.service';
import { TripInvitationComponent } from './trip-invitations/trip-invitation.component';
import { CreateTripInvitationComponent } from './trip-invitations/create-trip-invitation/create-trip-invitation.component';
import { TripInvitationService } from './trip-invitations/trip-invitation.service';
import { TripNoteComponent } from './trip-notes/trip-note.component';
import { CreateTripNoteComponent } from './trip-notes/create-trip-note/create-trip-note.component';
import { TripNoteService } from './trip-notes/trip-note.service';
import { TripPackingItemComponent } from './trip-packing-items/trip-packing-item.component';
import { CreateTripPackingItemComponent } from './trip-packing-items/create-trip-packing-item/create-trip-packing-item.component';
import { TripPackingItemService } from './trip-packing-items/trip-packing-item.service';
import { DepositComponent } from './deposits/deposit.component';
import { CreateDepositComponent } from './deposits/create-deposit/create-deposit.component';
import { DepositService } from './deposits/deposit.service';
import { RefundComponent } from './refunds/refund.component';
import { CreateRefundComponent } from './refunds/create-refund/create-refund.component';
import { RefundService } from './refunds/refund.service';
import { SettlementComponent } from './settlements/settlement.component';
import { CreateSettlementComponent } from './settlements/create-settlement/create-settlement.component';
import { SettlementService } from './settlements/settlement.service';
import { SettlementTransactionComponent } from './settlement-transactions/settlement-transaction.component';
import { CreateSettlementTransactionComponent } from './settlement-transactions/create-settlement-transaction/create-settlement-transaction.component';
import { SettlementTransactionService } from './settlement-transactions/settlement-transaction.service';
import { ExpenseShareComponent } from './expense-shares/expense-share.component';
import { CreateExpenseShareComponent } from './expense-shares/create-expense-share/create-expense-share.component';
import { ExpenseShareService } from './expense-shares/expense-share.service';
import { FriendComponent } from './friends/friend.component';
import { CreateFriendComponent } from './friends/create-friend/create-friend.component';
import { FriendService } from './friends/friend.service';
import { ExpenseComponent } from './expenses/expense.component';
import { CreateExpenseComponent } from './expenses/create-expense/create-expense.component';
import { ExpenseService } from './expenses/expense.service';
import { StickyTableDirective } from '../../shared/sticky-table.directive';
import { StickyTableScrollDirective } from '../../shared/sticky-table-scroll.directive';

@NgModule({
  declarations: [
    TripComponent,
    CreateTripComponent,
    TripPlaceComponent,
    CreateTripPlaceComponent,
    TripDayComponent,
    CreateTripDayComponent,
    TripMemberComponent,
    CreateTripMemberComponent,
    TripInvitationComponent,
    CreateTripInvitationComponent,
    TripNoteComponent,
    CreateTripNoteComponent,
    TripPackingItemComponent,
    CreateTripPackingItemComponent,
    DepositComponent,
    CreateDepositComponent,
    RefundComponent,
    CreateRefundComponent,
    SettlementComponent,
    CreateSettlementComponent,
    SettlementTransactionComponent,
    CreateSettlementTransactionComponent,
    ExpenseShareComponent,
    CreateExpenseShareComponent,
    FriendComponent,
    CreateFriendComponent,
    ExpenseComponent,
    CreateExpenseComponent
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
    TripService,
    TripDayService,
    TripPlaceService,
    TripMemberService,
    TripInvitationService,
    TripNoteService,
    TripPackingItemService,
    ExpenseService,
    DepositService,
    DepositService,
    RefundService,
    SettlementService,
    SettlementTransactionService,
    ExpenseShareService,
    FriendService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TripsModule {
  constructor() {
    defineElement();
  }
}
