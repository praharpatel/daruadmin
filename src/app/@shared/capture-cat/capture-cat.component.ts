import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { IPicture } from '@core/interfaces/product.interface';
import { AddCatalog, AddCupon, Catalog } from '@core/models/catalog.models';
import { Cupon } from '@core/models/cupon.models';
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
  typeDiscount: string;

  @Input() onlyCupons: boolean = false;
  @Input() catalog: Catalog;
  @Input() cupon: Cupon;
  @Output() datosEnviar: FormData = new FormData();
  @Output() catalogChange = new EventEmitter<AddCatalog>();
  @Output() cuponChange = new EventEmitter<AddCupon>();
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
    if (this.onlyCupons) {
      this.captureForm = this.formBuilder.group({
        clave: ['1', [Validators.required]],
        typeDiscount: ['', [Validators.required]],
        amountDiscount: [0.0, [Validators.required, this.exchangeRateValidator]],
        minimumPurchase: [0, [Validators.required, this.exchangeRateValidatorInt]],
        estatus: ['Activos'],
        cupon: ['', [Validators.required]],
        description: ['', [Validators.required]],
        active: [true]
      });
    } else {
      this.captureForm = this.formBuilder.group({
        clave: ['1', [Validators.required]],
        estatus: ['Activos'],
        order: [1000],
        active: [true],
        description: ['', [Validators.required]]
      });
    }
  }

  exchangeRateValidator(control: FormControl) {
    const value = control.value;
    // Expresión regular para validar 3 enteros y 2 decimales
    const pattern = /^[0-9]{1,3}(?:\.[0-9]{1,2})?$/;
    if (!pattern.test(value)) {
      return { invalidExchangeRateFormat: true };
    }
    return null;
  }

  exchangeRateValidatorInt(control: FormControl) {
    const value = control.value;
    // Expresión regular para validar 4 enteros
    const pattern = /^[0-9]{1,4}$/;
    if (!pattern.test(value)) {
      return { invalidExchangeRateFormat: true };
    }
    return null;
  }

  onSetCatalog(catalog: Catalog = undefined, cupon: Cupon = undefined) {
    if (this.onlyCupons) {
      if (cupon) {
        this.pictures = [];
        this.captureForm.controls.cupon.setValue(cupon.cupon.toUpperCase());
        this.captureForm.controls.description.setValue(cupon.description);
        this.captureForm.controls.typeDiscount.setValue(cupon.typeDiscount);
        this.captureForm.controls.amountDiscount.setValue(cupon.amountDiscount);
        this.captureForm.controls.minimumPurchase.setValue(cupon.minimumPurchase);
        this.captureForm.controls.active.setValue(cupon.active);
        return
      }
      this.cupon.id = this.captureForm.controls.clave.value;
      this.cupon.cupon = this.captureForm.controls.cupon.value.toUpperCase();
      this.cupon.description = this.captureForm.controls.description.value;
      this.cupon.typeDiscount = this.captureForm.controls.typeDiscount.value;
      this.cupon.amountDiscount = parseFloat(this.captureForm.controls.amountDiscount.value);
      this.cupon.minimumPurchase = parseFloat(this.captureForm.controls.minimumPurchase.value);
      this.cupon.active = this.captureForm.controls.active.value;
    } else {
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
  }

  onSubmit() {
    this.submitted = true;
    if (this.captureForm.invalid) {
      basicAlert(TYPE_ALERT.WARNING, 'Verificar campos');
      return;
    }
    this.onSetCatalog();
    if (this.onlyCupons) {
      const addCupon = new AddCupon();
      addCupon.tipo = 'item';
      addCupon.item = this.cupon;
      addCupon.list = [];
      addCupon.files = this.files;
      this.cuponChange.emit(addCupon);
    } else {
      const addCatalog = new AddCatalog();
      addCatalog.tipo = 'item';
      addCatalog.item = this.catalog;
      addCatalog.list = [];
      addCatalog.files = this.files;
      this.catalogChange.emit(addCatalog);
    }
  }

  onOpenModal(catalog: Catalog = undefined, editMode: boolean = false,
    onlyView: boolean = false, cupon: Cupon = undefined) {
    this.cupon = cupon;
    this.catalog = catalog;
    this.editMode = editMode;
    this.onlyView = onlyView;
    // Cambia el título de acuerdo a si es solo vista, edición o nuevo.
    this.titulo = this.editMode ? onlyView ? 'Consultar' : 'Modificar' : 'Agregar';
    // Campos para editar
    if (this.onlyCupons) {
      const valorEditar = this.editMode ? this.cupon.active ? 'Activo' : 'Inactivo' : 'Activo';
      this.captureForm.controls.clave.setValue(this.cupon.id);
      this.captureForm.controls.estatus.setValue(valorEditar);
      this.captureForm.controls.cupon.setValue(this.cupon.cupon);
      this.captureForm.controls.description.setValue(this.cupon.description);
      this.captureForm.controls.typeDiscount.setValue(this.cupon.typeDiscount);
      this.captureForm.controls.amountDiscount.setValue(this.cupon.amountDiscount);
      this.captureForm.controls.minimumPurchase.setValue(this.cupon.minimumPurchase);
    } else {
      const valorEditar = this.editMode ? this.catalog.active ? 'Activo' : 'Inactivo' : 'Activo';
      this.captureForm.controls.clave.setValue(this.catalog.id);
      this.captureForm.controls.estatus.setValue(valorEditar);
      this.captureForm.controls.description.setValue(this.catalog.description);
    }
    // this.captureForm.controls.order.setValue(1);
    this.modal.open(this.content, { size: 'lg' });

    setTimeout(() => {
      this.setDiscountTypeValue();
    }, 100);
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
    inputValue = inputValue.replace(/[^A-Z0-9]/g, '');
    if (inputValue.length > 15) {
      inputValue = inputValue.slice(0, 15);
    }
    event.target.value = inputValue;
  }

  changedTypeDiscount(event: any) {
    this.typeDiscount = event && event.target ? event.target.value : '';
  }

  setDiscountTypeValue() {
    const discountType = this.cupon.typeDiscount;
    this.captureForm.controls.typeDiscount.setValue(discountType);
  }
}
