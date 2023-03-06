import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SubcategoriesRoutingModule } from './subcategories-routing.module';
import { SubcategoriesComponent } from './subcategories.component';
import { TablePaginationModule } from 'src/app/@shared/table-pagination/table-pagination.module';
import { CaptureCatModule } from 'src/app/@shared/capture-cat/capture-cat.module';


@NgModule({
  declarations: [
    SubcategoriesComponent
  ],
  imports: [
    CommonModule,
    SubcategoriesRoutingModule,
    CaptureCatModule,
    TablePaginationModule
  ]
})
export class SubcategoriesModule { }
