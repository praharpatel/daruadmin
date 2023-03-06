import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { ICatalog } from 'src/app/@core/interfaces/catalog.interface';
import { ADD_MODEL, BLOCK_MODEL, UPDATE_MODEL } from 'src/app/@graphql/operations/mutation/models';
import { MODELS_LIST_QUERY, MODEL_ID_QUERY } from 'src/app/@graphql/operations/query/models';
import { ApiService } from 'src/app/@graphql/services/api.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ModelsService extends ApiService {

  constructor(apollo: Apollo) {
    super(apollo);
  }

  add(model: ICatalog) {
    return this.set(
      ADD_MODEL,
      {
        model
      }, {}).pipe(map((result: any) => {
        return result.addModel;
      })
      );
  }

  update(model: ICatalog) {
    return this.set(
      UPDATE_MODEL,
      {
        model
      }, {}).pipe(map((result: any) => {
        return result.updateModel;
      })
      );
  }

  unblock(id: string, unblock: boolean = false, admin: boolean = false) {
    return this.set(
      BLOCK_MODEL,
      {
        id,
        unblock,
        admin
      }, {}).pipe(map((result: any) => {
        return result.blockModel;
      })
      );
  }

  getModels(page: number = 1, itemsPage: number = 10) {
    return this.get(MODELS_LIST_QUERY, {
      itemsPage, page
    }).pipe(map((result: any) => {
      return result.models;
    }));
  }

  next() {
    return this.get(
      MODEL_ID_QUERY, {}, {}, false
    ).pipe(map((result: any) => {
      return result.modelId.modelId;
    }));
  }
}
