import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ACTIVE_FILTERS } from '@core/constants/filters';
import { ICupon } from '@core/interfaces/cupon.interface';
import { IResultData } from '@core/interfaces/result-data.interface';
import { ITableColumns } from '@core/interfaces/table-columns.interface';
import { Cupon } from '@core/models/cupon.models';
import { CuponsService } from '@core/services/cupon.service';
import { CUPONS_LIST_QUERY } from '@graphql/operations/query/cupons';
import { optionsWithDetails } from '@shared/alert/alerts';
import { basicAlert } from '@shared/alert/toasts';
import { TYPE_ALERT } from '@shared/alert/values.config';
import { CaptureCatComponent } from '@shared/capture-cat/capture-cat.component';
import { TablePaginationService } from '@shared/table-pagination/table-pagination.service';
import { DocumentNode } from 'graphql';

@Component({
  selector: 'app-cupons',
  templateUrl: './cupons.component.html',
  styleUrls: ['./cupons.component.scss']
})
export class CuponsComponent implements OnInit {
  query: DocumentNode = CUPONS_LIST_QUERY;
  context: object;
  itemsPage: number;
  resultData: IResultData;
  include: boolean;
  columns: Array<ITableColumns>;
  filterActiveValues: ACTIVE_FILTERS;
  mostrarBoton: boolean;
  cupon: Cupon;
  editMode = false;
  nextId: string;
  title = 'Catálogo de Cupones';
  onlyCupons = true;

  @ViewChild('mdCaptureCat') modal: CaptureCatComponent;
  @Input() datosEnviar: FormData = new FormData();

  constructor(
    private cuponsService: CuponsService,
    private tablePaginationService: TablePaginationService
  ) { }

  ngOnInit(): void {
    this.context = {};
    this.itemsPage = 10;
    this.resultData = {
      listKey: 'cupons',
      definitionKey: 'cupons',
      title: 'Cupones',
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
        property: 'cupon',
        label: 'Cupon',
        class: 'descriptionShort'
      },
      {
        property: 'description',
        label: 'Descripcion',
        class: 'descriptionShort'
      },
      {
        property: 'typeDiscount',
        label: 'Tipo Descuento',
        class: 'clave'
      },
      {
        property: 'amountDiscount',
        label: 'Descuento',
        class: 'importe'
      },
      {
        property: 'active',
        label: 'Activo?',
        class: 'number'
      }
    ];
    this.cupon = new Cupon();
    this.NextId();
  }

  NextId() {
    // Obtiene el siguiente Id del Catálogo
    this.cuponsService.next().subscribe(result => {
      this.nextId = result;
    });
  }

  async takeAction($event) {
    // Obtiene la informacion para las acciones
    const action = $event[0];
    const cupon = $event[1];
    this.mostrarBoton = true;
    switch (action) {
      case 'add':                                       // Agregar elemento
        this.onNewCatalog();
        this.addForm();
        break;
      case 'edit':                                      // Modificar elemento
        this.updateForm(cupon);
        break;
      case 'info':                                      // Mostrar información del elemento
        this.mostrarBoton = false;
        this.updateForm(cupon, true, true);
        break;
      case 'block':                                     // Bloquear elemento
        this.unblockForm(cupon, false);
        break;
      case 'unblock':                                   // Bloquear elemento
        this.unblockForm(cupon, true);
        break;
      default:
        break;
    }
  }

  onNewCatalog() {
    this.cupon = new Cupon();
    this.NextId();
    this.cupon = {
      id: this.nextId,
      cupon: '',
      description: '',
      typeDiscount: '',
      amountDiscount: 0,
      minimumPurchase: 0,
      active: true
    };
  }

  private async addForm(editMode: boolean = false) {
    this.editMode = editMode;
    setTimeout(() => {
      this.modal.onOpenModal(undefined, editMode, false, this.cupon);
    }, 2000);
  }

  private async updateForm(cupon: Cupon, editMode: boolean = true, onlyView: boolean = false) {
    this.editMode = editMode;
    this.modal.onOpenModal(undefined, editMode, onlyView, cupon);
  }

  cuponBack(event) {
    if (event.tipo === 'item') {
      if (this.editMode) {                        // Si es un  para editar
        this.updateCatalog(event.item);
      } else {                                    // Si es un catalogo nuevo
        this.addCatalog(event.item);
      }
    }
  }

  private addCatalog(cupon: ICupon) {
    this.cuponsService.add(cupon).subscribe(
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

  private updateCatalog(cupon: ICupon) {
    if (cupon.description !== '') {
      this.cuponsService.update(cupon).subscribe(
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
    this.cuponsService.unblock(id, unblock, admin).subscribe(
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
