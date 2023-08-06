import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListSalesComponent } from './list-sales/list-sales.component';
import { DetailSalesComponent } from './detail-sales/detail-sales.component';

const routes: Routes = [
  {
    path: 'list',
    component: ListSalesComponent
  },
  {
    path: 'detail',
    component: DetailSalesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalesRoutingModule { }
