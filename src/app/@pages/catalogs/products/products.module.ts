import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductsRoutingModule } from './products-routing.module';
import { ProductsComponent } from './products.component';
import { TablePaginationModule } from '@shared/table-pagination/table-pagination.module';
import { CaptureProdModule } from '@shared/capture-prod/capture-prod.module';
import { ImportarModule } from '@shared/importar/importar.module';

@NgModule({
  declarations: [
    ProductsComponent
  ],
  imports: [
    CommonModule,
    ProductsRoutingModule,
    CaptureProdModule,
    ImportarModule,
    TablePaginationModule
  ]
})
export class ProductsModule { }
