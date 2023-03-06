import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModelsRoutingModule } from './models-routing.module';
import { ModelsComponent } from './models.component';
import { TablePaginationModule } from 'src/app/@shared/table-pagination/table-pagination.module';
import { CaptureCatModule } from 'src/app/@shared/capture-cat/capture-cat.module';

@NgModule({
  declarations: [
    ModelsComponent
  ],
  imports: [
    CommonModule,
    ModelsRoutingModule,
    CaptureCatModule,
    TablePaginationModule
  ]
})
export class ModelsModule { }
