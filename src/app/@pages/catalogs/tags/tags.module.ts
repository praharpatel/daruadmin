import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TagsRoutingModule } from './tags-routing.module';
import { TagsComponent } from './tags.component';
import { TablePaginationModule } from 'src/app/@shared/table-pagination/table-pagination.module';
import { CaptureCatModule } from 'src/app/@shared/capture-cat/capture-cat.module';


@NgModule({
  declarations: [
    TagsComponent
  ],
  imports: [
    CommonModule,
    TagsRoutingModule,
    CaptureCatModule,
    TablePaginationModule
  ]
})
export class TagsModule { }
