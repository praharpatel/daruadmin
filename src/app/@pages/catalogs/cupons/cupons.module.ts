import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CuponsRoutingModule } from './cupons-routing.module';
import { CuponsComponent } from './cupons.component';
import { CaptureCatModule } from '@shared/capture-cat/capture-cat.module';
import { TablePaginationModule } from '@shared/table-pagination/table-pagination.module';


@NgModule({
  declarations: [
    CuponsComponent
  ],
  imports: [
    CommonModule,
    CuponsRoutingModule,
    CaptureCatModule,
    TablePaginationModule
  ]
})
export class CuponsModule { }
