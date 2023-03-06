import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BrandsRoutingModule } from './brands-routing.module';
import { BrandsComponent } from './brands.component';
import { TablePaginationModule } from 'src/app/@shared/table-pagination/table-pagination.module';
import { CaptureCatModule } from 'src/app/@shared/capture-cat/capture-cat.module';
import { ImportarModule } from 'src/app/@shared/importar/importar.module';

@NgModule({
  declarations: [
    BrandsComponent,
  ],
  imports: [
    CommonModule,
    BrandsRoutingModule,
    CaptureCatModule,
    ImportarModule,
    TablePaginationModule
  ]
})
export class BrandsModule { }
