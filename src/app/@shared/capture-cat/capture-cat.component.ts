import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AddCatalog, Catalog } from '@core/models/catalog.models';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ICatalog } from 'src/app/@core/interfaces/catalog.interface';
import { basicAlert } from 'src/app/@shared/alert/toasts';
import { TYPE_ALERT } from 'src/app/@shared/alert/values.config';

@Component({
  selector: 'app-capture-cat',
  templateUrl: './capture-cat.component.html',
  styleUrls: ['./capture-cat.component.scss']
})
export class CaptureCatComponent implements OnInit {

  editMode = false;
  onlyView = false;
  submitted = false;
  captureForm: FormGroup;
  titulo = 'Capturando elemento';

  // @Input() catalog: ICatalog;
  @Input() catalog: Catalog;
  @Output() datosEnviar: FormData = new FormData();
  @Output() catalogChange = new EventEmitter<AddCatalog>();
  @ViewChild('content') content: any;

  constructor(
    private formBuilder: FormBuilder,
    public modal: NgbModal
  ) { }

  // convenience getter for easy access to form fields
  get f() { return this.captureForm.controls; }

  ngOnInit(): void {
    this.captureForm = this.formBuilder.group({
      clave: ['1', [Validators.required]],
      estatus: ['Activos'],
      order: [0],
      active: [true],
      description: ['', [Validators.required]]
    });
  }

  onSetCatalog(catalog: ICatalog = undefined) {
    if (catalog) {
      this.captureForm.controls.clave.setValue(catalog.id);
      this.captureForm.controls.description.setValue(catalog.description);
      this.captureForm.controls.order.setValue(catalog.order);
      this.captureForm.controls.active.setValue(catalog.active);
      return
    }
    this.catalog.id = this.captureForm.controls.clave.value;
    this.catalog.description = this.captureForm.controls.description.value;
    this.catalog.order = parseInt(this.captureForm.controls.order.value);
    this.catalog.active = this.captureForm.controls.active.value;
  }

  onSubmit() {
    this.submitted = true;
    if (this.captureForm.invalid) {
      basicAlert(TYPE_ALERT.WARNING, 'Verificar campos');
      return;
    }
    this.onSetCatalog();
    const addCatalog = new AddCatalog();
    addCatalog.tipo = 'item';
    addCatalog.item = this.catalog;
    addCatalog.list = [];
    this.catalogChange.emit(addCatalog);
  }

  onOpenModal(catalog: Catalog, editMode: boolean = false, onlyView: boolean = false) {
    this.catalog = catalog;
    this.editMode = editMode;
    this.onlyView = onlyView;
    // Cambia el título de acuerdo a si es solo vista, edición o nuevo.
    this.titulo = this.editMode ? onlyView ? 'Consultar' : 'Modificar' : 'Agregar';
    // Campos para editar
    const valorEditar = this.editMode ? this.catalog.active ? 'Activo' : 'Inactivo' : 'Activo';
    this.captureForm.controls.clave.setValue(this.catalog.id);
    this.captureForm.controls.estatus.setValue(valorEditar);
    this.captureForm.controls.description.setValue(this.catalog.description);
    this.captureForm.controls.order.setValue(this.catalog.order);
    this.modal.open(this.content, { size: 'lg' });
  }

  onCloseModal() {
    this.modal.dismissAll();
  }

}
