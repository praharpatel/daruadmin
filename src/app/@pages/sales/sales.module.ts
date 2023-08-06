import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SalesRoutingModule } from './sales-routing.module';
import { ListSalesComponent } from './list-sales/list-sales.component';
import { DetailSalesComponent } from './detail-sales/detail-sales.component';
import { UIModule } from '@shared/ui/ui.module';


@NgModule({
  declarations: [
    ListSalesComponent,
    DetailSalesComponent
  ],
  imports: [
    CommonModule,
    SalesRoutingModule,
    UIModule
  ]
})
export class SalesModule { }
