import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { ICatalog } from 'src/app/@core/interfaces/catalog.interface';
import { ADD_BRAND, ADD_BRAND_LIST, BLOCK_BRAND, UPDATE_BRAND } from 'src/app/@graphql/operations/mutation/brands';
import { BRANDS_LIST_QUERY, BRAND_ID_QUERY } from 'src/app/@graphql/operations/query/brands';
import { ApiService } from 'src/app/@graphql/services/api.service';
import { map } from 'rxjs/operators';
import { ISupplier } from '@core/interfaces/supplier.interface';
import { ACTIVE_FILTERS } from '@core/constants/filters';

@Injectable({
  providedIn: 'root'
})
export class BrandsService extends ApiService {

  constructor(apollo: Apollo) {
    super(apollo);
  }

  add(brand: ICatalog) {
    return this.set(
      ADD_BRAND,
      {
        brand
      }, {}).pipe(map((result: any) => {
        return result.addBrand;
      })
      );
  }

  addList(brands: [ICatalog], supplier: ISupplier) {
    return this.set(
      ADD_BRAND_LIST,
      {
        brands,
        supplier
      }, {}).pipe(map((result: any) => {
        return result.addBrands;
      })
      );
  }

  update(brand: ICatalog) {
    return this.set(
      UPDATE_BRAND,
      {
        brand
      }, {}).pipe(map((result: any) => {
        return result.updateBrand;
      })
      );
  }

  unblock(id: string, unblock: boolean = false, admin: boolean = false) {
    return this.set(
      BLOCK_BRAND,
      {
        id,
        unblock,
        admin
      }, {}).pipe(map((result: any) => {
        return result.blockBrand;
      })
      );
  }

  getBrands(page: number = 1, itemsPage: number = 10, filterActiveValues: ACTIVE_FILTERS = ACTIVE_FILTERS.ACTIVE) {
    return this.get(BRANDS_LIST_QUERY, {
      itemsPage, page, filterActiveValues
    }).pipe(map((result: any) => {
      return result.brands;
    }));
  }

  next() {
    return this.get(
      BRAND_ID_QUERY, {}, {}, false
    ).pipe(map((result: any) => {
      return result.brandId.brandId;
    }));
  }
}
