import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CtRoutingModule } from './ct-routing.module';
import { ListOrdersCtComponent } from './list-orders-ct/list-orders-ct.component';
import { DetailOrderCtComponent } from './detail-order-ct/detail-order-ct.component';
import { TablePaginationModule } from '@shared/table-pagination/table-pagination.module';


@NgModule({
  declarations: [
    ListOrdersCtComponent,
    DetailOrderCtComponent
  ],
  imports: [
    CommonModule,
    CtRoutingModule,
    TablePaginationModule
  ]
})
export class CtModule { }
