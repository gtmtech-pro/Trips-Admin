import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Component pages
import { AuthGuard } from '../../core/guards/auth.guard';
import { RouteConstants } from '../../constants/route.constant';
import { TripComponent } from './trips/trip.component';
import { CreateTripComponent } from './trips/create-trip/create-trip.component';
import { TripPlaceComponent } from './trip-places/trip-place.component';
import { CreateTripPlaceComponent } from './trip-places/create-trip-place/create-trip-place.component';
import { TripDayComponent } from './trip-days/trip-day.component';
import { CreateTripDayComponent } from './trip-days/create-trip-day/create-trip-day.component';
import { TripMemberComponent } from './trip-members/trip-member.component';
import { CreateTripMemberComponent } from './trip-members/create-trip-member/create-trip-member.component';
import { TripInvitationComponent } from './trip-invitations/trip-invitation.component';
import { CreateTripInvitationComponent } from './trip-invitations/create-trip-invitation/create-trip-invitation.component';
import { TripNoteComponent } from './trip-notes/trip-note.component';
import { CreateTripNoteComponent } from './trip-notes/create-trip-note/create-trip-note.component';
import { TripPackingItemComponent } from './trip-packing-items/trip-packing-item.component';
import { CreateTripPackingItemComponent } from './trip-packing-items/create-trip-packing-item/create-trip-packing-item.component';
import { DepositComponent } from './deposits/deposit.component';
import { CreateDepositComponent } from './deposits/create-deposit/create-deposit.component';
import { RefundComponent } from './refunds/refund.component';
import { CreateRefundComponent } from './refunds/create-refund/create-refund.component';
import { SettlementComponent } from './settlements/settlement.component';
import { CreateSettlementComponent } from './settlements/create-settlement/create-settlement.component';
import { SettlementTransactionComponent } from './settlement-transactions/settlement-transaction.component';
import { CreateSettlementTransactionComponent } from './settlement-transactions/create-settlement-transaction/create-settlement-transaction.component';
import { ExpenseShareComponent } from './expense-shares/expense-share.component';
import { CreateExpenseShareComponent } from './expense-shares/create-expense-share/create-expense-share.component';
import { FriendComponent } from './friends/friend.component';
import { CreateFriendComponent } from './friends/create-friend/create-friend.component';
import { ExpenseComponent } from './expenses/expense.component';
import { CreateExpenseComponent } from './expenses/create-expense/create-expense.component';

const routes: Routes = [
  { path: RouteConstants.Trip.List, component: TripComponent, canActivate: [AuthGuard] },
  { path: RouteConstants.Trip.New, component: CreateTripComponent, canActivate: [AuthGuard] },
  { path: RouteConstants.Trip.Edit, component: CreateTripComponent, canActivate: [AuthGuard] },

  { path: RouteConstants.TripPlace.List, component: TripPlaceComponent, canActivate: [AuthGuard] },
  { path: RouteConstants.TripPlace.New, component: CreateTripPlaceComponent, canActivate: [AuthGuard] },
  { path: RouteConstants.TripPlace.Edit, component: CreateTripPlaceComponent, canActivate: [AuthGuard] },

  { path: RouteConstants.TripDay.List, component: TripDayComponent, canActivate: [AuthGuard] },
  { path: RouteConstants.TripDay.New, component: CreateTripDayComponent, canActivate: [AuthGuard] },
  { path: RouteConstants.TripDay.Edit, component: CreateTripDayComponent, canActivate: [AuthGuard] },

  { path: RouteConstants.TripMember.List, component: TripMemberComponent, canActivate: [AuthGuard] },
  { path: RouteConstants.TripMember.New, component: CreateTripMemberComponent, canActivate: [AuthGuard] },
  { path: RouteConstants.TripMember.Edit, component: CreateTripMemberComponent, canActivate: [AuthGuard] },

  { path: RouteConstants.TripInvitation.List, component: TripInvitationComponent, canActivate: [AuthGuard] },
  { path: RouteConstants.TripInvitation.New, component: CreateTripInvitationComponent, canActivate: [AuthGuard] },
  { path: RouteConstants.TripInvitation.Edit, component: CreateTripInvitationComponent, canActivate: [AuthGuard] },

  { path: RouteConstants.TripNote.List, component: TripNoteComponent, canActivate: [AuthGuard] },
  { path: RouteConstants.TripNote.New, component: CreateTripNoteComponent, canActivate: [AuthGuard] },
  { path: RouteConstants.TripNote.Edit, component: CreateTripNoteComponent, canActivate: [AuthGuard] },

  { path: RouteConstants.TripPackingItem.List, component: TripPackingItemComponent, canActivate: [AuthGuard] },
  { path: RouteConstants.TripPackingItem.New, component: CreateTripPackingItemComponent, canActivate: [AuthGuard] },
  { path: RouteConstants.TripPackingItem.Edit, component: CreateTripPackingItemComponent, canActivate: [AuthGuard] },

  { path: RouteConstants.Expense.List, component: ExpenseComponent, canActivate: [AuthGuard] },
  { path: RouteConstants.Expense.New, component: CreateExpenseComponent, canActivate: [AuthGuard] },
  { path: RouteConstants.Expense.Edit, component: CreateExpenseComponent, canActivate: [AuthGuard] },

  { path: RouteConstants.Deposit.List, component: DepositComponent, canActivate: [AuthGuard] },
  { path: RouteConstants.Deposit.New, component: CreateDepositComponent, canActivate: [AuthGuard] },
  { path: RouteConstants.Deposit.Edit, component: CreateDepositComponent, canActivate: [AuthGuard] },

  { path: RouteConstants.Refund.List, component: RefundComponent, canActivate: [AuthGuard] },
  { path: RouteConstants.Refund.New, component: CreateRefundComponent, canActivate: [AuthGuard] },
  { path: RouteConstants.Refund.Edit, component: CreateRefundComponent, canActivate: [AuthGuard] },

  { path: RouteConstants.Settlement.List, component: SettlementComponent, canActivate: [AuthGuard] },
  { path: RouteConstants.Settlement.New, component: CreateSettlementComponent, canActivate: [AuthGuard] },
  { path: RouteConstants.Settlement.Edit, component: CreateSettlementComponent, canActivate: [AuthGuard] },

  { path: RouteConstants.SettlementTransaction.List, component: SettlementTransactionComponent, canActivate: [AuthGuard] },
  { path: RouteConstants.SettlementTransaction.New, component: CreateSettlementTransactionComponent, canActivate: [AuthGuard] },
  { path: RouteConstants.SettlementTransaction.Edit, component: CreateSettlementTransactionComponent, canActivate: [AuthGuard] },

  { path: RouteConstants.ExpenseShare.List, component: ExpenseShareComponent, canActivate: [AuthGuard] },
  { path: RouteConstants.ExpenseShare.New, component: CreateExpenseShareComponent, canActivate: [AuthGuard] },
  { path: RouteConstants.ExpenseShare.Edit, component: CreateExpenseShareComponent, canActivate: [AuthGuard] },

  { path: RouteConstants.Friend.List, component: FriendComponent, canActivate: [AuthGuard] },
  { path: RouteConstants.Friend.New, component: CreateFriendComponent, canActivate: [AuthGuard] },
  { path: RouteConstants.Friend.Edit, component: CreateFriendComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TripsRoutingModule { }
