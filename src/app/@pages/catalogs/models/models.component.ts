import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ACTIVE_FILTERS } from 'src/app/@core/constants/filters';
import { IResultData } from 'src/app/@core/interfaces/result-data.interface';
import { ITableColumns } from 'src/app/@core/interfaces/table-columns.interface';
import { ModelsService } from 'src/app/@core/services/model.service';
import { DocumentNode } from 'graphql';
import { MODELS_LIST_QUERY } from 'src/app/@graphql/operations/query/models';
import { optionsWithDetails } from 'src/app/@shared/alert/alerts';
import { basicAlert } from 'src/app/@shared/alert/toasts';
import { TYPE_ALERT } from 'src/app/@shared/alert/values.config';
import { CaptureCatComponent } from 'src/app/@shared/capture-cat/capture-cat.component';
import { TablePaginationService } from 'src/app/@shared/table-pagination/table-pagination.service';
import { Catalog } from '@core/models/catalog.models';

@Component({
  selector: 'app-models',
  templateUrl: './models.component.html',
  styleUrls: ['./models.component.scss']
})
export class ModelsComponent implements OnInit {
  query: DocumentNode = MODELS_LIST_QUERY;
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

  @ViewChild('mdCaptureCat') modal: CaptureCatComponent;
  @Input() datosEnviar: FormData = new FormData();

  constructor(
    private modelsService: ModelsService,
    private tablePaginationService: TablePaginationService
    ) {
      // Obtiene el siguiente Id del Catálogo
      this.modelsService.next().subscribe(result => {
        this.nextId = result;
      });
    }

  ngOnInit(): void {
    this.context = {};
    this.itemsPage = 10;
    this.resultData = {
      listKey: 'models',
      definitionKey: 'models',
      title: 'Modelos'
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
        property: 'description',
        label: 'Modelos',
        class: 'description'
      },
      {
        property: 'slug',
        label: 'Slug',
        class: ''
      },
      {
        property: 'active',
        label: 'Activo?',
        class: 'clave'
      }
    ];
  }

  async takeAction($event) {
    // Obtiene la informacion para las acciones
    const action = $event[0];
    const catalog = $event[1];
    this.mostrarBoton = true;
    switch (action) {
      case 'add':                                       // Agregar elemento
        this.addForm(this.onNewCatalog());
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
      case 'unblock':                                     // Bloquear elemento
        this.unblockForm(catalog, true);
        break;
      default:
        break;
    }
  }

  onNewCatalog() {
    let catalog: Catalog;
    return catalog = {
      id: this.nextId,
      description: '',
      slug: '',
      active: true
    };
  }

  private async addForm(catalog: Catalog, editMode: boolean = false) {
    this.editMode = editMode;
    this.modal.onOpenModal(catalog, editMode);
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
    } else {

    }
  }

  private addCatalog(catalog: Catalog) {
    this.modelsService.add(catalog).subscribe(
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

  private updateCatalog(catalog: Catalog) {
    if (catalog.description !== '') {
      this.modelsService.update(catalog).subscribe(
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

  private async unblockForm(brand: any, unblock: boolean) {
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
      this.unblockBrand(brand.id, unblock, true);
    }
    this.tablePaginationService.refreshTable();
  }

  private unblockBrand(id: string, unblock: boolean = false, admin: boolean = false) {
    this.modelsService.unblock(id, unblock, admin).subscribe(
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
