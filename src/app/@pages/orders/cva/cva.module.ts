import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CvaRoutingModule } from './cva-routing.module';
import { ListOrdersCvaComponent } from './list-orders-cva/list-orders-cva.component';
import { DetailOrderCvaComponent } from './detail-order-cva/detail-order-cva.component';
import { TablePaginationModule } from '@shared/table-pagination/table-pagination.module';


@NgModule({
  declarations: [
    ListOrdersCvaComponent,
    DetailOrderCvaComponent
  ],
  imports: [
    CommonModule,
    CvaRoutingModule,
    TablePaginationModule
  ]
})
export class CvaModule { }
