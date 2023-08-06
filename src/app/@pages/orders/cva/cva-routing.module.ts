import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListOrdersCvaComponent } from './list-orders-cva/list-orders-cva.component';
import { DetailOrderCvaComponent } from './detail-order-cva/detail-order-cva.component';

const routes: Routes = [
  {
    path: 'list',
    component: ListOrdersCvaComponent
  },
  {
    path: 'detail',
    component: DetailOrderCvaComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CvaRoutingModule { }
