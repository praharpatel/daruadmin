import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ACTIVE_FILTERS } from '@core/constants/filters';
import { ICatalog } from '@core/interfaces/catalog.interface';
import { IResultData } from '@core/interfaces/result-data.interface';
import { ITableColumns } from '@core/interfaces/table-columns.interface';
import { Catalog } from '@core/models/catalog.models';
import { WelcomesService } from '@core/services/welcome.service';
import { WELCOME_LIST_QUERY } from '@graphql/operations/query/welcomes';
import { optionsWithDetails } from '@shared/alert/alerts';
import { basicAlert } from '@shared/alert/toasts';
import { TYPE_ALERT } from '@shared/alert/values.config';
import { CaptureCatComponent } from '@shared/capture-cat/capture-cat.component';
import { TablePaginationService } from '@shared/table-pagination/table-pagination.service';
import { DocumentNode } from 'graphql';

@Component({
  selector: 'app-welcomes',
  templateUrl: './welcomes.component.html',
  styleUrls: ['./welcomes.component.scss']
})
export class WelcomesComponent implements OnInit {
  query: DocumentNode = WELCOME_LIST_QUERY;
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
  title = 'Catálogo de Cupones';
  mostrarImport = false;
  mostrarAgregar = false;
  mostrarActivos = false;

  @ViewChild('mdCaptureCat') modal: CaptureCatComponent;
  @Input() datosEnviar: FormData = new FormData();

  constructor(
    private welcomesService: WelcomesService,
    private tablePaginationService: TablePaginationService
  ) { }

  ngOnInit(): void {
    this.context = {};
    this.itemsPage = 10;
    this.resultData = {
      listKey: 'welcomes',
      definitionKey: 'welcomes',
      title: 'Bienvenidos',
      apiExterna: ''
    };
    this.include = false;
    this.filterActiveValues = ACTIVE_FILTERS.ALL;
    this.columns = [
      {
        property: 'id',
        label: '#',
        class: 'clave'
      },
      {
        property: 'email',
        label: 'Correo',
        class: 'descriptionShort'
      },
      {
        property: 'name',
        label: 'Nombre',
        class: 'descriptionShort'
      },
      {
        property: 'cupon',
        label: 'Cupon',
        class: 'descriptionShort'
      }
    ];
    this.catalog = new Catalog();
    this.NextId();
  }

  NextId() {
    // Obtiene el siguiente Id del Catálogo
    this.welcomesService.next().subscribe(result => {
      console.log('welcomesService/result: ', result);
      this.nextId = result;
    });
  }

  async takeAction($event) {
    // Obtiene la informacion para las acciones
    const action = $event[0];
    const catalog = $event[1];
    this.mostrarBoton = true;
    switch (action) {
      case 'add':                                       // Agregar elemento
        this.onNewCatalog();
        this.addForm();
        break;
      case 'edit':                                      // Modificar elemento
        this.updateForm(catalog);
        break;
      case 'info':                                      // Mostrar información del elemento
        this.mostrarBoton = false;
        this.updateForm(catalog, true, true);
        break;
      case 'block':                                     // Bloquear elemento
        this.unblockForm(catalog, false);
        break;
      case 'unblock':                                   // Bloquear elemento
        this.unblockForm(catalog, true);
        break;
      default:
        break;
    }
  }

  onNewCatalog() {
    this.catalog = new Catalog();
    this.NextId();
    this.catalog = {
      id: this.nextId,
      description: '',
      name: '',
      cupon: '',
      active: true
    };
  }

  private async addForm(editMode: boolean = false) {
    this.editMode = editMode;
    setTimeout(() => {
      this.modal.onOpenModal(this.catalog, editMode);
    }, 2000);
  }

  private async updateForm(catalog: Catalog, editMode: boolean = true, onlyView: boolean = false) {
    this.editMode = editMode;
    this.modal.onOpenModal(catalog, editMode, onlyView);
  }

  catalogBack(event) {
    if (event.tipo === 'item') {
      if (this.editMode) {                        // Si es un  para editar
        this.updateCatalog(event.item);
      } else {                                    // Si es un catalogo nuevo
        this.addCatalog(event.item);
      }
    }
  }

  private addCatalog(catalog: ICatalog) {
    this.welcomesService.add(catalog).subscribe(
      (res: any) => {
        if (res.status) {
          basicAlert(TYPE_ALERT.SUCCESS, res.message);
          setTimeout(() => {
            this.modal.onCloseModal();
            this.tablePaginationService.refreshTable();
          }, 2900);
        } else {
          basicAlert(TYPE_ALERT.WARNING, res.message);
        }
      }
    );
  }

  private updateCatalog(catalog: ICatalog) {
    if (catalog.description !== '') {
      this.welcomesService.update(catalog).subscribe(
        (res: any) => {
          if (res.status) {
            basicAlert(TYPE_ALERT.SUCCESS, res.message);
            setTimeout(() => {
              this.modal.onCloseModal();
              this.tablePaginationService.refreshTable();
            }, 2900);
          } else {
            basicAlert(TYPE_ALERT.WARNING, res.message);
          }
        }
      );
    }
  }

  private async unblockForm(cupon: any, unblock: boolean) {
    const result = (unblock) ?
      await optionsWithDetails(
        'Desbloquear?',
        `Si desbloqueas el item seleccionado, se mostrara en la lista`,
        450,
        'No desbloquear',
        'Si desbloquear'
      )
      :
      await optionsWithDetails(
        'Bloquear?',
        `Si bloqueas el item seleccionado, no se mostrara en la lista`,
        430,
        'No bloquear',
        'Si bloquear'
      );
    if (result === false) {             // Si el resultado es falso, queremos bloquear
      this.unblockCupon(cupon.id, unblock, true);
    }
    this.tablePaginationService.refreshTable();
  }

  private unblockCupon(id: string, unblock: boolean = false, admin: boolean = false) {
    this.welcomesService.unblock(id, unblock, admin).subscribe(
      (res: any) => {
        if (res.status) {
          basicAlert(TYPE_ALERT.SUCCESS, res.message);
        } else {
          basicAlert(TYPE_ALERT.WARNING, res.message);
        }
      }
    );
  }
}
