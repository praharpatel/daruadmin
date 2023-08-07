import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DocumentNode } from 'graphql';
import { TablePaginationService } from './table-pagination.service';
import { IInfoPage, IResultData } from 'src/app/@core/interfaces/result-data.interface';
import { ITableColumns } from 'src/app/@core/interfaces/table-columns.interface';
import { ACTIVE_FILTERS } from 'src/app/@core/constants/filters';
import { Observable } from 'rxjs';
import { closeAlert, loadData } from 'src/app/@shared/alert/alerts';
import { map } from 'rxjs/operators';
import { ImportarService } from '@shared/importar/importar.service';

@Component({
  selector: 'app-table-pagination',
  templateUrl: './table-pagination.component.html',
  styleUrls: ['./table-pagination.component.scss']
})
export class TablePaginationComponent implements OnInit {
  @Input() query: DocumentNode;
  @Input() context: object;
  @Input() itemsPage = 10;
  @Input() include = true;
  @Input() filterName = '';
  // @Input() filterBranch = '0';
  // @Input() filtroProduct = false;
  @Input() onlySearch = false;
  @Input() mostrarBoton = true;
  @Input() mostrarImport = false;
  @Input() mostrarAgregar = true;
  @Input() mostrarActivos = true;
  @Input() resultData: IResultData;
  @Input() tableColumns: Array<ITableColumns> = undefined;
  @Input() filterActiveValues: ACTIVE_FILTERS = ACTIVE_FILTERS.ALL;
  @Input() title: string;
  @Output() manageItem = new EventEmitter<Array<any>>();
  infoPage: IInfoPage;
  data$: Observable<any>;
  loading: boolean;
  shopProducts = false;
  products = false;
  MuestraFiltros = true;
  queryBranch: DocumentNode;
  totalData: number;
  tagFilter: string;

  constructor(
    private service: TablePaginationService,
    private importarService: ImportarService,
  ) {
    service.$emitter.subscribe(() => {
      this.loadData();
    });
  }

  ngOnInit(): void {
    if (this.query === undefined) {
      throw new Error('Query is undefined, please add.');
    }
    if (this.resultData === undefined) {
      throw new Error('ResultData is undefined, please add.');
    }
    if (this.tableColumns === undefined) {
      throw new Error('Table Columns is undefined, please add.');
    }
    this.infoPage = {
      page: 1,
      pages: 10,
      itemsPage: this.itemsPage,
      total: 1
    };
    this.tagFilter = 'Todos(Activos/Inactivos)';
    this.loadData();
  }

  loadData() {
    this.loading = true;
    loadData('Cargando informacion...', 'Espera mientras carga la informacion');
    const variables = {
      page: this.infoPage.page,
      itemsPage: this.infoPage.itemsPage,
      include: this.include,
      active: this.filterActiveValues,
      filterName: this.filterName,
      // filterBranch: this.filterBranch
    };

    if (this.query) {
      this.data$ = this.service.getCollectionData(this.query, variables, {}).pipe(
        map((result: any) => {
          const data = result[this.resultData.definitionKey];
          if (!data) {
            this.loading = false;
            closeAlert();
            return result;
          }
          if (data.info) {
            this.infoPage.pages = data.info.pages;
            this.infoPage.total = data.info.total;
            this.totalData = data.info.total;
          }
          this.loading = false;
          closeAlert();
          return data[this.resultData.listKey];
        })
      );
    } else {
      this.loading = false;
      closeAlert();
    }
  }

  changePage() {
    this.loadData();
  }

  manageAction(action: string, data: any) {
    this.manageItem.emit([action, data]);
  }

  formatoMoneda(valor, mostrarSimbolo) {
    if (valor === undefined || valor === 0) {
      return '$0.00';
    }
    let num = '';
    if (mostrarSimbolo === true) {
      num = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(valor)
    }
    return num;
  }

  asignFilter(filter, tagFilter) {
    this.filterActiveValues = filter;
    this.tagFilter = tagFilter;
    this.loadData();
  }

  asignPage(itemsPage: number) {
    this.infoPage.itemsPage = itemsPage;
    this.loadData();
  }

}
