import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OpenpayRoutingModule } from './openpay-routing.module';
import { ListChargesOpenpayComponent } from './list-charges-openpay/list-charges-openpay.component';
import { DetailChargeOpenpayComponent } from './detail-charge-openpay/detail-charge-openpay.component';
import { TablePaginationModule } from '@shared/table-pagination/table-pagination.module';


@NgModule({
  declarations: [
    ListChargesOpenpayComponent,
    DetailChargeOpenpayComponent
  ],
  imports: [
    CommonModule,
    OpenpayRoutingModule,
    TablePaginationModule
  ]
})
export class OpenpayModule { }
