import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { ICatalog } from 'src/app/@core/interfaces/catalog.interface';
import { ADD_TAG, BLOCK_TAG, UPDATE_TAG } from 'src/app/@graphql/operations/mutation/tags';
import { TAGS_LIST_QUERY, TAG_ID_QUERY } from 'src/app/@graphql/operations/query/tags';
import { ApiService } from 'src/app/@graphql/services/api.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TagsService extends ApiService {

  constructor(apollo: Apollo) {
    super(apollo);
  }

  add(tag: ICatalog) {
    return this.set(
      ADD_TAG,
      {
        tag
      }, {}).pipe(map((result: any) => {
        return result.addTag;
      })
      );
  }

  update(tag: ICatalog) {
    return this.set(
      UPDATE_TAG,
      {
        tag
      }, {}).pipe(map((result: any) => {
        return result.updateTag;
      })
      );
  }

  unblock(id: string, unblock: boolean = false, admin: boolean = false) {
    return this.set(
      BLOCK_TAG,
      {
        id,
        unblock,
        admin
      }, {}).pipe(map((result: any) => {
        return result.blockTag;
      })
      );
  }

  getTags(page: number = 1, itemsPage: number = 10) {
    return this.get(TAGS_LIST_QUERY, {
      itemsPage, page
    }).pipe(map((result: any) => {
      return result.tags;
    }));
  }

  next() {
    return this.get(
      TAG_ID_QUERY, {}, {}, false
    ).pipe(map((result: any) => {
      return result.tagId.tagId;
    }));
  }
}
