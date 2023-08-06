import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListChargesOpenpayComponent } from './list-charges-openpay/list-charges-openpay.component';
import { DetailChargeOpenpayComponent } from './detail-charge-openpay/detail-charge-openpay.component';

const routes: Routes = [
  {
    path: 'list',
    component: ListChargesOpenpayComponent
  },
  {
    path: 'detail',
    component: DetailChargeOpenpayComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OpenpayRoutingModule { }
