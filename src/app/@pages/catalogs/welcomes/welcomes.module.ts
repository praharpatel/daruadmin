import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WelcomesRoutingModule } from './welcomes-routing.module';
import { WelcomesComponent } from './welcomes.component';
import { CaptureCatModule } from '@shared/capture-cat/capture-cat.module';
import { TablePaginationModule } from '@shared/table-pagination/table-pagination.module';


@NgModule({
  declarations: [
    WelcomesComponent
  ],
  imports: [
    CommonModule,
    WelcomesRoutingModule,
    CaptureCatModule,
    TablePaginationModule
  ]
})
export class WelcomesModule { }
