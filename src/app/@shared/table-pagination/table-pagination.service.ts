import { EventEmitter, Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { DocumentNode } from 'graphql';
import { ApiService } from 'src/app/@graphql/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class TablePaginationService extends ApiService {
  $emitter = new EventEmitter();

  constructor(apollo: Apollo) {
    super(apollo);
  }

  getCollectionData(query: DocumentNode, variables: object={}, context: object={}) {
    return this.get(query, variables, context);
  }

  refreshTable() {
    this.$emitter.emit();
  }
}
