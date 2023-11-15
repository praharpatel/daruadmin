import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './@core/guards/auth.guard';
import { LayoutComponent } from './@layouts/layout.component';
import { Page404Component } from './@extrapages/page404/page404.component';
import { ModuleWithProviders } from '@angular/core';

export const routes: Routes = [
  {
    path: '',
    data: { pageTitle: 'Inicio' },
    children: [
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
    ],
  },
  {
    path: 'auth',
    component: AuthGuard,
    loadChildren: () =>
      import('./@account/account.module').then((m) => m.AccountModule),
  },
  { path: '**', redirectTo: 'dashboard' },
];

// @NgModule({
//   imports: [
//     RouterModule.forRoot(routes, {
//       scrollPositionRestoration: 'top',
//       relativeLinkResolution: 'legacy',
//       useHash: true,
//     }),
//   ],
//   exports: [RouterModule],
// })
// export class AppRoutingModule { }

export const AppRoutingModule = RouterModule.forRoot(routes, {
  useHash: true, scrollPositionRestoration: 'top',
  relativeLinkResolution: 'legacy',
});
