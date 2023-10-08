import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IPicture, IProduct } from '@core/interfaces/product.interface';
import { Catalog } from '@core/models/catalog.models';
import { AddProduct, Brands, Categorys, PivotBrand, PivotCategory, Product } from '@core/models/product.models';
import { BrandsService } from '@core/services/brand.service';
import { CategoriesService } from '@core/services/categorie.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { basicAlert } from '@shared/alert/toasts';
import { TYPE_ALERT } from '@shared/alert/values.config';

@Component({
  selector: 'app-capture-prod',
  templateUrl: './capture-prod.component.html',
  styleUrls: ['./capture-prod.component.scss']
})
export class CaptureProdComponent implements OnInit {

  editMode = false;
  onlyView = false;
  submitted = false;
  brand: string;
  brands: Catalog[];
  brandsSelected: string;
  category: Categorys[];
  subCategory: Categorys[];
  categorySelected: string[];
  captureGeneral: FormGroup;
  captureVariants: FormGroup;
  titulo = 'Capturando producto';

  files: File[] = [];
  pictures: IPicture[];

  @Input() product: Product;
  @Output() datosEnviar: FormData = new FormData();
  @Output() productChange = new EventEmitter<AddProduct>();
  @ViewChild('content') content: any;

  constructor(
    private formBuilder: FormBuilder,
    private brandsService: BrandsService,
    private categoriesService: CategoriesService,
    public modal: NgbModal
  ) { }

  // convenience getter for easy access to form fields
  get f() { return this.captureGeneral.controls; }
  get f1() { return this.captureVariants.controls; }

  ngOnInit(): void {
    this.captureGeneral = this.formBuilder.group({
      id: [''],
      name: ['', [Validators.required]],
      slug: [''],
      short_desc: ['', [Validators.required]],
      price: [0, [Validators.required]],
      sale_price: [0],
      review: [0],
      ratings: [0],
      until: [null],
      stock: [0],
      top: [false],
      featured: [false],
      new: [false],
      author: [''],
      sold: [''],
      category: [null, [Validators.required]],
      subCategory: [null],
      brands: [null, [Validators.required]],
      active: [true],
      estatus: ['Activos'],
      sku: [''],
      upc: [''],
      partnumber: [''],
    });
    this.captureVariants = this.formBuilder.group({
      variants: [[]],
    });
    this.brands = [];
    this.category = [];
    this.subCategory = [];
  }

  onSubmit() {
    this.submitted = true;
    if (this.captureGeneral.invalid) {
      basicAlert(TYPE_ALERT.WARNING, 'Verificar campos');
      return;
    }
    if (typeof (this.product.price) === 'string') {
      this.product.price = parseFloat(this.product.price);
    }
    if (typeof (this.product.sale_price) === 'string') {
      this.product.sale_price = parseFloat(this.product.sale_price);
    }
    let i = 0;
    if (this.brandsSelected !== '') {
      this.brands.forEach(brand => {
        if (brand.slug === this.brandsSelected) {
          if (this.product.brands.length === 0) {
            const newBrand = new Brands();
            newBrand.name = brand.description;
            newBrand.slug = brand.slug;
            this.brand = brand.slug;
            const newPivot = new PivotBrand();
            newPivot.brand_id = brand.id;
            newPivot.product_id = this.product.id.toString();
            newBrand.pivot = newPivot;
            this.product.brands.push(newBrand);
          } else {
            this.product.brands.forEach(b => {
              i += 1;
              if (i = 1) {
                this.brand = brand.slug;
              }
              if (b.slug !== brand.slug) {
                const newBrand = new Brands();
                newBrand.name = brand.description;
                newBrand.slug = brand.slug;
                const newPivot = new PivotBrand();
                newPivot.brand_id = brand.id;
                newPivot.product_id = this.product.id.toString();
                newBrand.pivot = newPivot;
                this.product.brands.push(newBrand);
              }
            });
          }
        }
        // });
      });
    }
    if (this.categorySelected.length > 0) {
      this.category.forEach(categorie => {
        this.categorySelected.forEach(categorieSel => {
          if (categorie.slug === categorieSel) {
            const newCategorie = new Categorys();
            newCategorie.name = categorie.name;
            newCategorie.slug = categorie.slug;
            const newPivot = new PivotCategory();
            newPivot.product_id = this.product.id.toString();
            newPivot.product_category_id = categorie.slug;
            newCategorie.pivot = newPivot;
            this.product.category.push(newCategorie);
          }
        });
      });
    }
    // Asignar producto
    this.product.brand = this.brand;
    this.onSetProduct();
    const addProduct = new AddProduct();
    addProduct.tipo = 'item';
    addProduct.item = this.product;
    addProduct.list = [];
    // addProduct.suppliersCat = [{ idProveedor: '', name: '', slug: '' }];
    addProduct.files = this.files;
    this.productChange.emit(addProduct);
  }

  onSetProduct(product: Product = undefined) {
    if (product) {
      this.pictures = [];
      this.pictures = product.pictures;
      this.captureGeneral.controls.id.setValue(product.id);
      this.captureGeneral.controls.name.setValue(product.name);
      this.captureGeneral.controls.slug.setValue(product.slug);
      this.captureGeneral.controls.short_desc.setValue(product.short_desc);
      this.captureGeneral.controls.price.setValue(product.price);
      this.captureGeneral.controls.sale_price.setValue(product.sale_price);
      this.captureGeneral.controls.review.setValue(product.review);
      this.captureGeneral.controls.ratings.setValue(product.ratings);
      this.captureGeneral.controls.until.setValue(product.until);
      this.captureGeneral.controls.stock.setValue(product.stock);
      this.captureGeneral.controls.top.setValue(product.top);
      this.captureGeneral.controls.featured.setValue(product.featured);
      this.captureGeneral.controls.new.setValue(product.new);
      this.captureGeneral.controls.author.setValue(product.author);
      this.captureGeneral.controls.sold.setValue(product.sold);
      this.captureGeneral.controls.category.setValue(product.category);
      this.captureGeneral.controls.subCategory.setValue(product.subCategory);
      this.captureGeneral.controls.brands.setValue(product.brands);
      this.captureGeneral.controls.sku.setValue(product.sku);
      this.captureGeneral.controls.upc.setValue(product.upc);
      this.captureGeneral.controls.partnumber.setValue(product.partnumber);
      if (product.variants) {
        if (product.variants.length > 0) {
          this.captureGeneral.controls.variants.setValue(product.variants);
        }
      }
      this.captureGeneral.controls.active.setValue(product.active);
      this.brandsSelected = product.brand;
      this.categorySelected = [];
      if (product.category) {
        product.category.forEach(cat => {
          this.categorySelected.push(cat.slug);
        });
      }
      if (product.subCategory) {
        product.subCategory.forEach(cat => {
          this.subCategorySelected.push(cat.slug);
        });
      }
      return
    }
    // this.catalog.id = this.captureForm.controls.clave.value;

    // Cargar Imagenes en Dropzone
    // this.onInitDropzone();
  }

  onOpenModal(product: Product, editMode: boolean = false, onlyView: boolean = false) {
    this.product = product;
    this.editMode = editMode;
    this.onlyView = onlyView;
    // Cambia el título de acuerdo a si es solo vista, edición o nuevo.
    this.titulo = this.editMode ? onlyView ? 'Consultar' : 'Modificar' : 'Agregar';
    // Campos para editar
    const valorEditar = this.editMode ? this.product.active ? 'Activo' : 'Inactivo' : 'Activo';
    this.onSetProduct(this.product)

    // Campos particulares
    this.captureGeneral.controls.estatus.setValue(valorEditar);

    // Abrir el modals
    this.modal.open(this.content, { size: 'lg' });

    // Cargar los catálogos
    this.brandsService.getBrands(1, -1).subscribe(result => {
      this.brands = result.brands;
    }, error => {
      basicAlert(TYPE_ALERT.ERROR, error.message);
    });
    this.categoriesService.getCategories(1, -1).subscribe(result => {
      this.category = result.categories;
    }, error => {
      basicAlert(TYPE_ALERT.ERROR, error.message);
    });

  }

  onCloseModal() {
    this.modal.dismissAll();
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

  readFile(input) {
    const fr = new FileReader();
    fr.readAsDataURL(input);
    fr.addEventListener('load', () => {
      const res = fr.result;
    })
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

  onRemove(event) {
    this.files.splice(this.files.indexOf(event), 1);
    this.pictures.splice(this.pictures.indexOf(event), 1);
  }

  public onUploadError(args: any): void {
    this.logger(args);
  }

  private logger(info: any) {
    console.log(info);
  }
}
