import { Injectable } from '@angular/core';
import { ADD_PRODUCT, ADD_PRODUCT_LIST, BLOCK_PRODUCT, UPDATE_PRODUCT } from '@graphql/operations/mutation/product';
import { PRODUCTS_LIST_QUERY, PRODUCT_ID_QUERY } from '@graphql/operations/query/product';
import { ApiService } from '@graphql/services/api.service';
import { Apollo } from 'apollo-angular';
import { map } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ACTIVE_FILTERS } from '@core/constants/filters';
import { Product } from '@core/models/product.models';

@Injectable({
  providedIn: 'root'
})
export class ProductsService extends ApiService {

  constructor(apollo: Apollo, public http: HttpClient) {
    super(apollo);
  }

  add(product: Product) {
    console.log('producto: ', product);
    return this.set(
      ADD_PRODUCT,
      {
        product
      }, {}).pipe(map((result: any) => {
        return result.addProduct;
      })
      );
  }

  addList(products: [Product]) {
    return this.set(
      ADD_PRODUCT_LIST,
      {
        products
      }, {}).pipe(map((result: any) => {
        return result.addProducts;
      })
      );
  }

  update(product: Product) {
    return this.set(
      UPDATE_PRODUCT,
      {
        product
      }, {}).pipe(map((result: any) => {
        return result.updateProduct;
      })
      );
  }

  unblock(id: string, unblock: boolean = false, admin: boolean = false) {
    return this.set(
      BLOCK_PRODUCT,
      {
        id,
        unblock,
        admin
      }, {}).pipe(map((result: any) => {
        return result.blockProduct;
      })
      );
  }

  getProducts(page: number = 1, itemsPage: number = 10, filterActiveValues: ACTIVE_FILTERS = ACTIVE_FILTERS.ACTIVE) {
    return this.get(PRODUCTS_LIST_QUERY, {
      itemsPage, page, filterActiveValues
    }).pipe(map((result: any) => {
      return result.products;
    }));
  }

  next() {
    return this.get(
      PRODUCT_ID_QUERY, {}, {}, false
    ).pipe(map((result: any) => {
      return result.productId.productId;
    }));
  }

  addImages(formData: FormData) {
    const boundary = '---------------------------' + Date.now();
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'multipart/form-data; boundary=' + boundary);
    const options = { headers };
    console.log('options: ', options);
    console.log('service.addImages/formData. ', formData);
    return this.http.post('http://localhost:3000/uploadFile', formData, options)
      .subscribe({
        next: (response) => console.log('response: ', response),
        error: (error) => console.log('error: ', error)
      });
  }
}
