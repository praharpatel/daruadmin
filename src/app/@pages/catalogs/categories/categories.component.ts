import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ACTIVE_FILTERS } from 'src/app/@core/constants/filters';
import { IResultData } from 'src/app/@core/interfaces/result-data.interface';
import { ITableColumns } from 'src/app/@core/interfaces/table-columns.interface';
import { CategoriesService } from 'src/app/@core/services/categorie.service';
import { DocumentNode } from 'graphql';
import { CATEGORIES_LIST_QUERY } from 'src/app/@graphql/operations/query/categories';
import { optionsWithDetails } from 'src/app/@shared/alert/alerts';
import { basicAlert } from 'src/app/@shared/alert/toasts';
import { TYPE_ALERT } from 'src/app/@shared/alert/values.config';
import { CaptureCatComponent } from 'src/app/@shared/capture-cat/capture-cat.component';
import { TablePaginationService } from 'src/app/@shared/table-pagination/table-pagination.service';
import { ImportarComponent } from '@shared/importar/importar.component';
import { ISupplier } from '@core/interfaces/supplier.interface';
import { Catalog } from '@core/models/catalog.models';
import { ICatalog } from '@core/interfaces/catalog.interface';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {
  query: DocumentNode = CATEGORIES_LIST_QUERY;
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
  title = 'Catálogo de Categorías';
  mostrarImport = true;
  importados: [ICatalog];

  @ViewChild('mdCaptureCat') modal: CaptureCatComponent;
  @ViewChild('mdImportCat') modalImport: ImportarComponent;
  @Input() datosEnviar: FormData = new FormData();

  constructor(
    private categoriesService: CategoriesService,
    private tablePaginationService: TablePaginationService
  ) { }

  ngOnInit(): void {
    this.context = {};
    this.itemsPage = 10;
    this.resultData = {
      listKey: 'categories',
      definitionKey: 'categories',
      title: 'Categorías',
      apiExterna: 'categorias'
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
        property: 'order',
        label: 'Orden',
        class: 'clave'
      },
      {
        property: 'description',
        label: 'Categoria',
        class: 'descriptionShort'
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
    this.catalog = new Catalog();
    this.NextId();
  }

  NextId() {
    // Obtiene el siguiente Id del Catálogo
    this.categoriesService.next().subscribe(result => {
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
      case 'import':
        this.importForm([catalog]);
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
    this.catalog = new Catalog();
    this.NextId();
    this.catalog = {
      id: this.nextId,
      description: '',
      slug: '',
      order: 1000,
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

  private async importForm(catalog: [Catalog]) {
    this.modalImport.onOpenModal(catalog);
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
    this.categoriesService.add(catalog).subscribe(
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

  importaBack(event) {
    if (event.tipo === 'list') {
      this.importados = event.list;
      this.addListCatalog(this.importados, event.suppliersCat);
    }
  }

  private addListCatalog(categories: [ICatalog], supplier: ISupplier) {
    this.categoriesService.addList(categories, supplier).subscribe(
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
      this.categoriesService.update(catalog).subscribe(
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
    this.categoriesService.unblock(id, unblock, admin).subscribe(
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
