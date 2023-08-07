import { Component, OnInit } from '@angular/core';
import { ACTIVE_FILTERS } from '@core/constants/filters';
import { ICatalog } from '@core/interfaces/catalog.interface';
import { IResultData } from '@core/interfaces/result-data.interface';
import { ITableColumns } from '@core/interfaces/table-columns.interface';
import { Catalog } from '@core/models/catalog.models';
import { ExternalAuthService } from '@core/services/external-auth.service';
import { ORDERSCVA_LIST_QUERY } from '@graphql/operations/query/suppliers/cva';
import { TablePaginationService } from '@shared/table-pagination/table-pagination.service';
import { DocumentNode } from 'graphql';

@Component({
  selector: 'app-list-orders-cva',
  templateUrl: './list-orders-cva.component.html',
  styleUrls: ['./list-orders-cva.component.scss']
})
export class ListOrdersCvaComponent implements OnInit {

  query: DocumentNode = ORDERSCVA_LIST_QUERY;
  context: object;
  itemsPage: number;
  resultData: IResultData;
  include: boolean;
  columns: Array<ITableColumns>;
  filterActiveValues: ACTIVE_FILTERS;
  mostrarBoton: boolean;
  catalog: Catalog;
  editMode = false;
  nextId: string;
  title = 'Ordenes solicitadas a CVA';
  mostrarImport = false;
  mostrarAgregar = false;
  mostrarActivos = false;
  importados: [ICatalog];

  constructor(
    private externalAuthService: ExternalAuthService,
    private tablePaginationService: TablePaginationService
  ) { }

  ngOnInit(): void {
    this.context = {};
    this.itemsPage = 10;
    this.resultData = {
      listKey: 'listOrdersCva',
      definitionKey: 'listOrdersCva',
      title: 'Ordenes CVA',
      apiExterna: 'orderscva'
    };
    this.include = false;
    this.filterActiveValues = ACTIVE_FILTERS.ALL;
    this.columns = [
      {
        property: 'Numero',
        label: 'Numero',
        class: 'clave'
      },
      {
        property: 'Total',
        label: 'Total',
        class: 'numero'
      },
      {
        property: 'Moneda',
        label: 'Moneda',
        class: 'id'
      },
      {
        property: 'NumOC',
        label: 'NumOC',
        class: 'clave'
      },
      {
        property: 'Almacen',
        label: 'Almacen',
        class: 'clave'
      },
      {
        property: 'Asignado',
        label: 'Asignado',
        class: 'clave'
      },
      {
        property: 'FechaAsignado',
        label: 'FechaAsignado',
        class: 'clave'
      }
    ]
  }

  async takeAction($event) {
    // Obtiene la informacion para las acciones
    const action = $event[0];
    const product = $event[1];
    this.mostrarBoton = false;
    switch (action) {
      case 'add':                                       // Agregar elemento
        console.log('unblock');
        break;
      case 'edit':                                      // Modificar elemento
        console.log('unblock');
        break;
      case 'info':                                      // Mostrar información del elemento
        console.log('unblock');
        break;
      case 'import':
        console.log('unblock');
        break;
      case 'block':                                     // Bloquear elemento
        console.log('unblock');
        break;
      case 'unblock':                                     // Bloquear elemento
        console.log('unblock');
        break;
      default:
        break;
    }
  }

}
