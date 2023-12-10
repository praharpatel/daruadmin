import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WelcomesComponent } from './welcomes.component';

const routes: Routes = [
  {
    path: '',
    component: WelcomesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WelcomesRoutingModule { }
