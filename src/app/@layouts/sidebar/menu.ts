import { MenuItem } from './menu.model';

export const MENU: MenuItem[] = [
  {
    id: 1,
    label: 'Menú Principal', // 'MENUITEMS.MENU.TEXT',
    isTitle: true
  },
  {
    id: 2,
    label: 'Tablero', // 'MENUITEMS.DASHBOARDS.TEXT',
    icon: 'bx-home-circle',
    // badge: {
    //   variant: 'info',
    //   text: 'MENUITEMS.DASHBOARDS.BADGE',
    // },
    subItems: [
      {
        id: 1,
        label: 'Tablero', // 'MENUITEMS.DASHBOARDS.LIST.DEFAULT',
        link: '/',
        parentId: 2
      },
    ]
  },
  {
    id: 3,
    label: 'Catálogos', // 'MENUITEMS.CATALOGS.TEXT',
    icon: 'bx-collection',
    // badge: {
    //   variant: 'info',
    //   text: 'MENUITEMS.CATALOGS.BADGE',
    // },
    subItems: [
      {
        id: 1,
        label: 'Marcas', // 'MENUITEMS.BRANDS.LIST.BRANDLIST',
        link: '/brands',
        parentId: 3
      },
      {
        id: 2,
        label: 'Grupos', // 'MENUITEMS.GROUPS.LIST.GROUPLIST',
        link: '/groups',
        parentId: 3
      },
      {
        id: 3,
        label: 'Categorías', // 'MENUITEMS.CATEGORIES.LIST.CATEGORIELIST',
        link: '/categories',
        parentId: 3
      },
      {
        id: 4,
        label: 'Productos', // 'MENUITEMS.PRODUCTS.LIST.PRODUCTLIST',
        link: '/products',
        parentId: 3
      },
      {
        id: 5,
        label: 'Usuarios', // 'MENUITEMS.USERS.LIST.USERLIST',
        link: '/users',
        parentId: 3
      },
      {
        id: 6,
        label: 'Configuraciones',
        link: '/config',
        parentId: 3
      },
    ]
  },
  {
    id: 7,
    isLayout: true
  },

];

