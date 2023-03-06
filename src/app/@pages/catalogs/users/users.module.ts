import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { UsersComponent } from './users.component';
import { TablePaginationModule } from 'src/app/@shared/table-pagination/table-pagination.module';
import { CaptureUserModule } from './capture-user/capture-user.module';


@NgModule({
  declarations: [
    UsersComponent
  ],
  imports: [
    CommonModule,
    UsersRoutingModule,
    TablePaginationModule,
    CaptureUserModule
  ]
})
export class UsersModule { }
