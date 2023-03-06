import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'config',
    loadChildren: () => import('./config/config.module').then(m => m.ConfigModule),
    data: { pageTitle: 'Configuraciones' }
  },
  {
    path: 'brands',
    loadChildren: () => import('./brands/brands.module').then(m => m.BrandsModule),
    data: { pageTitle: 'Marcas' }
  },
  {
    path: 'models',
    loadChildren: () => import('./models/models.module').then(m => m.ModelsModule),
    data: { pageTitle: 'Modelos' }
  },
  {
    path: 'groups',
    loadChildren: () => import('./groups/groups.module').then(m => m.GroupsModule),
    data: { pageTitle: 'Grupos' }
  },
  {
    path: 'categories',
    loadChildren: () => import('./categories/categories.module').then(m => m.CategoriesModule),
    data: { pageTitle: 'Categorias' }
  },
  {
    path: 'subcategories',
    loadChildren: () => import('./subcategories/subcategories.module').then(m => m.SubcategoriesModule),
    data: { pageTitle: 'SubCategorias' }
  },
  {
    path: 'tags',
    loadChildren: () => import('./tags/tags.module').then(m => m.TagsModule),
    data: { pageTitle: 'Etiquetas' }
  },
  {
    path: 'products',
    loadChildren: () => import('./products/products.module').then(m => m.ProductsModule),
    data: { pageTitle: 'Productos' }
  },
  {
    path: 'users',
    loadChildren: () => import('./users/users.module').then(m => m.UsersModule),
    data: { pageTitle: 'Usuarios' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CatalogsRoutingModule { }
