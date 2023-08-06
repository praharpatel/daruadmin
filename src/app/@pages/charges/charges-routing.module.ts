import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'openpay',
    loadChildren: () => import('./openpay/openpay.module').then(m => m.OpenpayModule)
  },
  {
    path: 'stripe',
    loadChildren: () => import('./stripe/stripe.module').then(m => m.StripeModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChargesRoutingModule { }
