import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GroupsRoutingModule } from './groups-routing.module';
import { GroupsComponent } from './groups.component';
import { TablePaginationModule } from 'src/app/@shared/table-pagination/table-pagination.module';
import { CaptureCatModule } from 'src/app/@shared/capture-cat/capture-cat.module';
import { ImportarModule } from '@shared/importar/importar.module';

@NgModule({
  declarations: [
    GroupsComponent
  ],
  imports: [
    CommonModule,
    GroupsRoutingModule,
    CaptureCatModule,
    ImportarModule,
    TablePaginationModule
  ]
})
export class GroupsModule { }
