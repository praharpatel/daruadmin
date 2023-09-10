import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { ICatalog } from 'src/app/@core/interfaces/catalog.interface';
import { ADD_CUPON, BLOCK_CUPON, UPDATE_CUPON } from 'src/app/@graphql/operations/mutation/cupons';
import { CUPONS_LIST_QUERY, CUPON_ID_QUERY } from 'src/app/@graphql/operations/query/cupons';
import { ApiService } from 'src/app/@graphql/services/api.service';
import { map } from 'rxjs/operators';
import { ISupplier } from '@core/interfaces/supplier.interface';
import { ACTIVE_FILTERS } from '@core/constants/filters';

@Injectable({
  providedIn: 'root'
})
export class CuponsService extends ApiService {

  constructor(apollo: Apollo) {
    super(apollo);
  }

  add(cupon: ICatalog) {
    return this.set(
      ADD_CUPON,
      {
        cupon
      }, {}).pipe(map((result: any) => {
        return result.addCupon;
      })
      );
  }

  update(cupon: ICatalog) {
    return this.set(
      UPDATE_CUPON,
      {
        cupon
      }, {}).pipe(map((result: any) => {
        return result.updateCupon;
      })
      );
  }

  unblock(id: string, unblock: boolean = false, admin: boolean = false) {
    return this.set(
      BLOCK_CUPON,
      {
        id,
        unblock,
        admin
      }, {}).pipe(map((result: any) => {
        return result.blockCupon;
      })
      );
  }

  getCupons(page: number = 1, itemsPage: number = 10, filterActiveValues: ACTIVE_FILTERS = ACTIVE_FILTERS.ACTIVE) {
    return this.get(CUPONS_LIST_QUERY, {
      itemsPage, page, filterActiveValues
    }).pipe(map((result: any) => {
      return result.cupons;
    }));
  }

  next() {
    return this.get(
      CUPON_ID_QUERY, {}, {}, false
    ).pipe(map((result: any) => {
      return result.cuponId.cuponId;
    }));
  }
}
