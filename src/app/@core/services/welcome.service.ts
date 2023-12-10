import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { ICatalog } from 'src/app/@core/interfaces/catalog.interface';
import { ADD_WELCOME, BLOCK_WELCOME, UPDATE_WELCOME } from 'src/app/@graphql/operations/mutation/welcomes';
import { WELCOME_LIST_QUERY, WELCOME_ID_QUERY } from 'src/app/@graphql/operations/query/welcomes';
import { ApiService } from 'src/app/@graphql/services/api.service';
import { map } from 'rxjs/operators';
import { ACTIVE_FILTERS } from '@core/constants/filters';

@Injectable({
  providedIn: 'root'
})
export class WelcomesService extends ApiService {

  constructor(apollo: Apollo) {
    super(apollo);
  }

  add(welcome: ICatalog) {
    return this.set(
      ADD_WELCOME,
      {
        welcome
      }, {}).pipe(map((result: any) => {
        return result.addWelcome;
      })
      );
  }

  update(welcome: ICatalog) {
    return this.set(
      UPDATE_WELCOME,
      {
        welcome
      }, {}).pipe(map((result: any) => {
        return result.updateWelcome;
      })
      );
  }

  unblock(id: string, unblock: boolean = false, admin: boolean = false) {
    return this.set(
      BLOCK_WELCOME,
      {
        id,
        unblock,
        admin
      }, {}).pipe(map((result: any) => {
        return result.blockWelcome;
      })
      );
  }

  getWelcomes(page: number = 1, itemsPage: number = 10, filterActiveValues: ACTIVE_FILTERS = ACTIVE_FILTERS.ACTIVE) {
    return this.get(WELCOME_LIST_QUERY, {
      itemsPage, page, filterActiveValues
    }).pipe(map((result: any) => {
      return result.welcomes;
    }));
  }

  next() {
    return this.get(
      WELCOME_ID_QUERY, {}, {}, false
    ).pipe(map((result: any) => {
      return result.welcomeId.welcomeId;
    }));
  }
}
