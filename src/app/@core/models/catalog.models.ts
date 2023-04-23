export class Catalog {
  id: string;
  description: string;
  slug: string;
  order: number;
  active: boolean;
  suppliersCat?: SupplierCat[];
}

export class AddCatalog {
  tipo: string;
  item: Catalog;
  list: Catalog[];
}

export class SupplierCat {
  idProveedor: string;
  name: string;
  slug: string;
}
