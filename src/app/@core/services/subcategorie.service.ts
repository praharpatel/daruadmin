import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { ICatalog } from 'src/app/@core/interfaces/catalog.interface';
import { ADD_SUBCATEGORIE, BLOCK_SUBCATEGORIE, UPDATE_SUBCATEGORIE } from 'src/app/@graphql/operations/mutation/subcategorie';
import { SUBCATEGORIES_LIST_QUERY, SUBCATEGORIE_ID_QUERY } from 'src/app/@graphql/operations/query/subcategories';
import { ApiService } from 'src/app/@graphql/services/api.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SubcategoriesService extends ApiService {

  constructor(apollo: Apollo) {
    super(apollo);
  }

  add(subcategorie: ICatalog) {
    return this.set(
      ADD_SUBCATEGORIE,
      {
        subcategorie
      }, {}).pipe(map((result: any) => {
        return result.addSubcategorie;
      })
      );
  }

  update(subcategorie: ICatalog) {
    return this.set(
      UPDATE_SUBCATEGORIE,
      {
        subcategorie
      }, {}).pipe(map((result: any) => {
        return result.updateSubcategorie;
      })
      );
  }

  unblock(id: string, unblock: boolean = false, admin: boolean = false) {
    return this.set(
      BLOCK_SUBCATEGORIE,
      {
        id,
        unblock,
        admin
      }, {}).pipe(map((result: any) => {
        return result.blockSubcategorie;
      })
      );
  }

  getSubcategories(page: number = 1, itemsPage: number = 10) {
    return this.get(SUBCATEGORIES_LIST_QUERY, {
      itemsPage, page
    }).pipe(map((result: any) => {
      return result.subcategories;
    }));
  }

  next() {
    return this.get(
      SUBCATEGORIE_ID_QUERY, {}, {}, false
    ).pipe(map((result: any) => {
      return result.subcategorieId.subcategorieId;
    }));
  }
}
