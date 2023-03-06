import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './@core/guards/auth.guard';
import { LayoutComponent } from './@layouts/layout.component';
import { Page404Component } from './@extrapages/page404/page404.component';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./@account/account.module').then(m => m.AccountModule)
  },
  {
    path: '',
    component: LayoutComponent,
    loadChildren: () => import('./@pages/pages.module').then(m => m.PagesModule)
  },
  {
    path: 'pages',
    loadChildren: () => import('./@extrapages/extrapages.module').then(m => m.ExtrapagesModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'catalogs',
    loadChildren: () => import('./@pages/catalogs/catalogs.module').then(m => m.CatalogsModule),
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    component: Page404Component
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top', relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})

export class AppRoutingModule { }
