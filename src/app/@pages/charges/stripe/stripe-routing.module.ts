import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListChargesStripeComponent } from './list-charges-stripe/list-charges-stripe.component';
import { DetailChargeStripeComponent } from './detail-charge-stripe/detail-charge-stripe.component';

const routes: Routes = [
  {
    path: 'list',
    component: ListChargesStripeComponent
  },
  {
    path: 'detail',
    component: DetailChargeStripeComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StripeRoutingModule { }
