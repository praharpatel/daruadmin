import { EventEmitter, Injectable } from '@angular/core';
import { ExternalAuthService } from '@core/services/external-auth.service';
import { ApiService } from '@graphql/services/api.service';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImportarService extends ApiService {
  $emitter = new EventEmitter();
  SyscomToken: string;

  constructor(
    apollo: Apollo,
    private externalAuthService: ExternalAuthService
  ) {
    super (apollo);
  }

  // getCatalogo(catalog: string): Observable<any> {
  //   this.externalAuthService.getSyscomToken().subscribe(
  //     result => {
  //       this.SyscomToken = result.access_token;
  //       return this.externalAuthService.getSyscomCatalog(this.SyscomToken, catalog).subscribe(
  //         result => {
  //           console.log('getSyscomCatalog: ', result);
  //           // return result;
  //           // return {
  //           //   info: {
  //           //     page: 1,
  //           //     pages: 1,
  //           //     itemsPage: 10,
  //           //     total: 1
  //           //   },
  //           //   status: true,
  //           //   message: `Lista de ${catalog} cargada correctamente`,
  //           //   items: result.getSyscomCatalog
  //           // };
  //         },
  //         error => {
  //           console.log('error/syscom: ', error);
  //           return result;
  //         }
  //       );
  //     },
  //     error => {
  //       console.log('error/syscom: ', error);
  //       return null;
  //     }
  //   );
  //   return null;
  // }

}
