import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IPicture } from '@core/interfaces/product.interface';
import { AddCatalog, Catalog } from '@core/models/catalog.models';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
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

  files: File[] = [];
  pictures: IPicture[];

  // @Input() catalog: ICatalog;
  @Input() onlyCupons: boolean = false;
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
    this.updateCaptureForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Verifica si 'onlyCupons' cambió y actualiza el formulario en consecuencia
    if (changes.onlyCupons) {
      this.updateCaptureForm();
    }
  }

  updateCaptureForm() {
    this.captureForm = this.formBuilder.group({
      clave: ['1', [Validators.required]],
      estatus: ['Activos'],
      order: [this.onlyCupons ? 0 : 1000],
      active: [true],
      description: ['', [Validators.required]]
    });
  }

  onSetCatalog(catalog: Catalog = undefined) {
    if (catalog) {
      this.pictures = [];
      this.pictures = catalog.pictures;
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
    addCatalog.files = this.files;
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
    // this.captureForm.controls.order.setValue(1);
    this.modal.open(this.content, { size: 'lg' });
  }

  onCloseModal() {
    this.modal.dismissAll();
  }

  onSelect(event) {
    let existFile = false;
    if (this.files.length > 0) {
      this.files.forEach(file => {
        event.addedFiles.forEach(newFile => {
          if (file.name === newFile.name) {
            existFile = true;
            basicAlert(TYPE_ALERT.WARNING, 'Ya existe en la lista un archivo con el mismo nombre. Verificar');
          }
        });
      });
    }
    if (!existFile) {
      this.files.push(...event.addedFiles);
    }
  }

  readFile(input) {
    const fr = new FileReader();
    fr.readAsDataURL(input);
    fr.addEventListener('load', () => {
      const res = fr.result;
    })
  }

  onInitDropzone() {
    this.files = [];
    this.pictures.forEach(picture => {
      fetch(picture.url, {
        'mode': 'cors',
        'headers': {
          'Access-Control-Allow-Origin': '*',
        }
      })
        .then(res => res.blob())
        .then(blob => {
          const splitUrl = picture.url.split('/');
          const iSplit = splitUrl.length;
          const fileName = splitUrl[iSplit - 1];
          const splitName = fileName.split('.');
          const name = splitName[0];
          const file = new File([blob], name, { type: blob.type });
          this.files.push(file);
          this.readFile(blob);
        }).catch((error) => {
          console.log('Request failed', error);
        });
    });
  }

  onRemove(event) {
    this.files.splice(this.files.indexOf(event), 1);
    this.pictures.splice(this.pictures.indexOf(event), 1);
  }

  convertToUppercase(event: any) {
    let inputValue = event.target.value.toUpperCase();
    // Eliminar caracteres no válidos
    inputValue = inputValue.replace(/[^A-Z0-9]/g, '');
    // Limitar a 11 caracteres alfanuméricos
    if (inputValue.length > 11) {
      inputValue = inputValue.slice(0, 11);
    }
    // Formatear como "DARU-XXXXXX"
    if (inputValue.length >= 5) {
      inputValue = "DARU-" + inputValue.slice(4); // Mantener solo los últimos 6 caracteres
    }
    event.target.value = inputValue;
  }
}
