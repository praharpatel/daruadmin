import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CtRoutingModule } from './ct-routing.module';
import { ListOrdersCtComponent } from './list-orders-ct/list-orders-ct.component';
import { DetailOrderCtComponent } from './detail-order-ct/detail-order-ct.component';


@NgModule({
  declarations: [
    ListOrdersCtComponent,
    DetailOrderCtComponent
  ],
  imports: [
    CommonModule,
    CtRoutingModule
  ]
})
export class CtModule { }
