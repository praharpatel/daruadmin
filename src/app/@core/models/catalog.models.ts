import { Picture } from './product.models';

export class Catalog {
  id: string;
  description: string;
  slug: string;
  order?: number;
  active?: boolean;
  suppliersCat?: SupplierCat[];
  pictures?: Picture[];
}

export class AddCatalog {
  tipo: string;
  item: Catalog;
  list: Catalog[];
  files?: File[];
}

export class SupplierCat {
  idProveedor: string;
  name: string;
  slug: string;
}
