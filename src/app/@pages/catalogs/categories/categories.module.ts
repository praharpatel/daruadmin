import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CategoriesRoutingModule } from './categories-routing.module';
import { CategoriesComponent } from './categories.component';
import { TablePaginationModule } from 'src/app/@shared/table-pagination/table-pagination.module';
import { CaptureCatModule } from 'src/app/@shared/capture-cat/capture-cat.module';
import { ImportarModule } from '@shared/importar/importar.module';


@NgModule({
  declarations: [
    CategoriesComponent
  ],
  imports: [
    CommonModule,
    CategoriesRoutingModule,
    CaptureCatModule,
    ImportarModule,
    TablePaginationModule
  ]
})
export class CategoriesModule { }
