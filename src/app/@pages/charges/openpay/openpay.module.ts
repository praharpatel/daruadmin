import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OpenpayRoutingModule } from './openpay-routing.module';
import { ListChargesOpenpayComponent } from './list-charges-openpay/list-charges-openpay.component';
import { DetailChargeOpenpayComponent } from './detail-charge-openpay/detail-charge-openpay.component';


@NgModule({
  declarations: [
    ListChargesOpenpayComponent,
    DetailChargeOpenpayComponent
  ],
  imports: [
    CommonModule,
    OpenpayRoutingModule
  ]
})
export class OpenpayModule { }
