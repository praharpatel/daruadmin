import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StripeRoutingModule } from './stripe-routing.module';
import { ListChargesStripeComponent } from './list-charges-stripe/list-charges-stripe.component';
import { DetailChargeStripeComponent } from './detail-charge-stripe/detail-charge-stripe.component';


@NgModule({
  declarations: [
    ListChargesStripeComponent,
    DetailChargeStripeComponent
  ],
  imports: [
    CommonModule,
    StripeRoutingModule
  ]
})
export class StripeModule { }
