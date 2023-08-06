import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailOrderCtComponent } from './detail-order-ct/detail-order-ct.component';
import { ListOrdersCtComponent } from './list-orders-ct/list-orders-ct.component';

const routes: Routes = [
  {
    path: 'list',
    component: ListOrdersCtComponent
  },
  {
    path: 'detail',
    component: DetailOrderCtComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CtRoutingModule { }
