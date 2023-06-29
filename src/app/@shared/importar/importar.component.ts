import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IResultData } from '@core/interfaces/result-data.interface';
import { IApis, IParameters, ISupplier } from '@core/interfaces/supplier.interface';
import { AddCatalog, Catalog, SupplierCat } from '@core/models/catalog.models';
import {
  AddProduct, Brands, Categorys, Picture, Product, UnidadDeMedida, BranchOffices,
  SupplierProd, ProductExport, Descuentos, Promociones, PromocionBranchOffice, Vigente
} from '@core/models/product.models';
import { BrandsService } from '@core/services/brand.service';
import { CategoriesService } from '@core/services/categorie.service';
import { ConfigsService } from '@core/services/config.service';
import { ExternalAuthService } from '@core/services/external-auth.service';
import { GroupsService } from '@core/services/group.service';
import { SuppliersService } from '@core/services/supplier.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { closeAlert, infoEventAlert, loadData } from '@shared/alert/alerts';
import { basicAlert } from '@shared/alert/toasts';
import { TYPE_ALERT } from '@shared/alert/values.config';
import slugify from 'slugify';

@Component({
  selector: 'app-importar',
  templateUrl: './importar.component.html',
  styleUrls: ['./importar.component.scss']
})
export class ImportarComponent implements OnInit {

  //#region Variables
  data = [];
  dataSupplier = [];
  dataExport = [];
  apiName: string;
  stockMinimo: number;
  title: string;
  titulo: string;
  catalog: string;
  apis: IApis[];
  apisFilter: IApis[];
  apiSelect: IApis;
  apiCatalog: IApis;
  operation: string;
  suboperation: string;
  submitted: boolean;
  onlySearch: boolean;
  token: string;
  valorSearch: Catalog;
  catalogItem: Catalog;
  importForm: FormGroup;
  habilitaEjecutar: boolean;
  habilitaGuardar: boolean;
  supplier: ISupplier;
  suppliers: [ISupplier];
  bodyParameters: IParameters;
  tokenParameters: Array<IParameters>;
  apiParameters: Array<IParameters>;
  catalogValues: Catalog[];
  brands: Catalog[];
  categories: Catalog[];
  groups: Catalog[];
  ctAlmacenes: any[];
  cvaAlmacenes: any[];
  exchangeRate: number;
  offer: number;

  @Input() resultData: IResultData;
  @Input() catalogs: [Catalog];
  @Input() products: [Product];
  @Output() importaChange = new EventEmitter<AddCatalog>();
  @Output() importaChangeProduct = new EventEmitter<AddProduct>();
  @Output() datosEnviar: FormData = new FormData();
  @ViewChild('content') content: any;

  //#endregion End Variables

  //#region Constructor
  constructor(
    public modal: NgbModal,
    public suppliersService: SuppliersService,
    private formBuilder: FormBuilder,
    private externalAuthService: ExternalAuthService,
    private brandsService: BrandsService,
    private categoriesService: CategoriesService,
    private groupsService: GroupsService,
    private httpClient: HttpClient,
    private configsService: ConfigsService
  ) { }

  // Define requests
  private httpReq1$ = this.httpClient.get('assets/uploads/json/productos.json');
  private httpReq2$ = this.httpClient.get('assets/uploads/json/ct_almacenes.json');
  private httpReq3$ = this.httpClient.get('assets/uploads/json/ingram_products.json');

  // convenience getter for easy access to form fields
  get f() { return this.importForm.controls; }
  //#endregion End Constructor

  //#region Iniciando Formulario
  ngOnInit(): void {
    console.clear();
    this.onlySearch = false;
    this.valorSearch = new Catalog();
    this.importForm = this.formBuilder.group({
      datos: [[], [Validators.required]]
    });
    this.suppliersService.getSuppliers().subscribe(result => {
      this.suppliers = result.suppliers;
    });
    this.configsService.getConfig('1').subscribe((result) => {
      this.offer = parseInt(result.ofer, 10);
      this.exchangeRate = parseFloat(result.exchange_rate);
    });
  }

  onOpenModal(catalogs: [Catalog]) {
    this.apiName = '';
    this.stockMinimo = 10;
    this.data = [];
    this.dataSupplier = [];
    this.dataExport = [];
    this.apis = [];
    this.operation = '';
    this.supplier = null;
    this.apisFilter = [];
    this.brands = [];
    this.catalogValues = [];
    this.submitted = false;
    this.onlySearch = false;
    this.catalogs = catalogs;
    this.habilitaEjecutar = false;
    this.habilitaGuardar = false;
    this.catalog = this.resultData.apiExterna;
    this.importForm.controls.datos.setValue([]);
    this.modal.open(this.content, { size: 'xl' });
    this.title = 'Catálogo Externo de ' + this.resultData.title;
    this.titulo = 'Importar Catálogo de ' + this.resultData.title;
    switch (this.catalog) {
      case 'marcas':
        this.brandsService.getBrands(1, -1).subscribe(result => {
          this.data = result.brands;
          this.data.forEach(item => {
            if (!item.suppliersCat) {
              item.suppliersCat = [];
              const supplierCat = new SupplierCat();
              supplierCat.idProveedor = '';
              supplierCat.name = '';
              supplierCat.slug = '';
              item.suppliersCat.push(supplierCat);
            }
          });
          this.brands = this.data;
        });
        break;
      case 'categorias':
        this.categoriesService.getCategories(1, -1).subscribe(result => {
          this.data = result.categories;
          this.data.forEach(item => {
            if (!item.suppliersCat) {
              item.suppliersCat = [];
              const supplierCat = new SupplierCat();
              supplierCat.idProveedor = '';
              supplierCat.name = '';
              supplierCat.slug = '';
              item.suppliersCat.push(supplierCat);
            }
          });
          this.categories = this.data;
        });
        break;
      case 'grupos':
        this.groupsService.getGroups(1, -1).subscribe(result => {
          this.data = result.groups;
          this.data.forEach(item => {
            if (!item.suppliersCat) {
              item.suppliersCat = [];
              const supplierCat = new SupplierCat();
              supplierCat.idProveedor = '';
              supplierCat.name = '';
              supplierCat.slug = '';
              item.suppliersCat.push(supplierCat);
            }
          });
          this.groups = this.data;
        });
        break;
      default:
        break;
    }
  }

  async getProd(): Promise<any> {
    return await this.httpReq1$.toPromise();
  }

  async getAlma(): Promise<any> {
    return await this.httpReq2$.toPromise();
  }

  async getProductosIngram(): Promise<any> {
    return await this.httpReq3$.toPromise();
  }


  async getProducts() {
    const productsCt = await this.getProd()
      .then(
        async (result) => {
          return await result;
        }
      )
      .catch((error: Error) => {
        infoEventAlert('No es posible importar el catalogo.', error.message, TYPE_ALERT.ERROR);
      });
    return productsCt;
  }
  async getProductsIngram() {
    const productsCt = await this.getProductosIngram()
      .then(
        async (result) => {
          return await result;
        }
      )
      .catch((error: Error) => {
        infoEventAlert('No es posible importar el catalogo.', error.message, TYPE_ALERT.ERROR);
      });
    return productsCt;
  }

  async getAlmacenes() {
    const almacenesCt = await this.getAlma()
      .then(
        async (result) => {
          return await result;
        }
      )
      .catch((error: Error) => {
        infoEventAlert('No es posible importar el catalogo.', error.message, TYPE_ALERT.ERROR);
      });
    return almacenesCt;
  }

  async getCvaAlmacenes(supplier: ISupplier): Promise<any> {
    const ApiSelect = this.apis.filter(api => api.return === 'sucursales');
    if (ApiSelect.length > 0) {
      return await this.getCatalogo(supplier, ApiSelect[0])
        .then(
          async (result) => {
            return await result;
          }
        )
        .catch((error: Error) => {
          infoEventAlert('No es posible importar el catalogo.', error.message, TYPE_ALERT.ERROR);
        });
    }
  }

  async onOpenModalProduct(products: [Product]) {
    this.apiName = '';
    this.stockMinimo = 10;
    this.data = [];
    this.brands = [];
    this.dataSupplier = [];
    this.dataExport = [];
    this.supplier = null;
    this.apisFilter = [];
    this.catalogValues = [];
    this.submitted = false;
    this.products = products;
    this.habilitaEjecutar = false;
    this.habilitaGuardar = false;
    this.catalog = this.resultData.apiExterna;
    this.operation = '';
    this.importForm.controls.datos.setValue([]);
    this.modal.open(this.content, { size: 'xl' });
    this.title = 'Catálogo Externo de ' + this.resultData.title;
    this.titulo = 'Importar Catálogo de ' + this.resultData.title;
  }
  //#endregion End Iniciando Formulario

  //#region Metodos Formularios
  onCloseModal() {
    this.modal.dismissAll();
  }

  onCargar() {
    basicAlert(TYPE_ALERT.WARNING, 'Cargando archivo');
  }
  //#endregion Metodos Formularios

  //#region Metodos cargas de catalogos
  onGetBrands(supplier: string = ''): Catalog[] {
    this.brandsService.getBrands(1, -1)
      .subscribe(result => {
        const dataSupplier = [];
        const data = result.brands;
        data.forEach(item => {
          if (!item.suppliersCat) {
            item.suppliersCat = [];
            const supplierCat = new SupplierCat();
            supplierCat.idProveedor = '';
            supplierCat.name = '';
            supplierCat.slug = '';
            item.suppliersCat.push(supplierCat);
          } else {
            if (item.suppliersCat.length > 0) {
              let i = 0;
              item.suppliersCat.forEach(element => {
                i += 1;
                if (element.idProveedor === supplier) {
                  element.id = i;
                  dataSupplier.push(element);
                }
              });
            }
          }
        });
        this.catalogValues = supplier === '' ? data : dataSupplier;
        return supplier === '' ? data : dataSupplier;
      });
    return [];
  }
  //#endregion

  //#region Metodos de Seleccion
  onSelectSupplier() {
    this.apiName = '';
    this.stockMinimo = 10;
    this.onlySearch = false;
    this.valorSearch = new Catalog();
    if (this.supplier) {
      this.apisFilter = [];
      this.dataSupplier = [];
      this.dataExport = [];
      this.catalogValues = [];
      this.apiCatalog = null;
      this.habilitaGuardar = false;
      this.habilitaEjecutar = false;
      this.importForm.controls.datos.setValue([]);
      this.apiName = 'No existe api para este catálogo';
      this.apis = this.supplier.apis;
      this.supplier.apis.forEach(api => {
        if (api.type === 'catalog' || api.type === 'products') {
          if (this.resultData.apiExterna === api.return) {
            this.apiName = this.supplier.url_base_api;
            this.apisFilter.push(api);
          }
          if (this.supplier.slug === 'ct' && api.return === 'existencia') {
            this.apiName = this.supplier.url_base_api;
            this.apisFilter.push(api);
          }
          if (this.supplier.slug === 'ingram' && api.return === 'existencia') {
            this.apiName = this.supplier.url_base_api;
            this.apisFilter.push(api);
          }
        }
      });
      if (this.apisFilter.length > 0) {
        this.habilitaEjecutar = true;
        this.apiSelect = this.apisFilter[0];
        this.apiCatalog = this.apiSelect;
        this.onSelectApi();
      }
      if (this.supplier.slug === 'ct') {                    // Si el proveedor es CT solo hay api de productos.
        this.habilitaEjecutar = true;
        this.apiSelect = this.apisFilter[0];
        this.apiCatalog = this.apiSelect;
      }
    }
  }

  async onSelectApi() {
    this.valorSearch = new Catalog();
    this.onlySearch = false;
    this.habilitaGuardar = false;
    if (this.apiSelect.parameters.length > 0) {
      this.onlySearch = true;
      if (this.apiSelect.parameters.length > 0) {
        if (this.apiSelect.parameters[0].value) {
          this.onlySearch = false;
        }
      }
    }
    this.apiCatalog = this.apiSelect;
    // Llenar el combo del catalogo seleccionado.
    if (this.apiSelect.type === 'products') {
      this.onGetBrands(this.supplier.slug);
    }
  }

  async onEjecutarAPI() {
    if (this.apiSelect.type !== 'products') {
      loadData('Importando el catalogo', 'Esperar la carga del catalogo.');
      return await this.getCatalogo(this.supplier, this.apiCatalog)
        .then(
          async (result) => {
            this.dataSupplier = result;
            // Si hay elementos del proveedor.
            if (this.dataSupplier.length > 0) {
              this.habilitaGuardar = true;
              // Revisar en todos los elementos del proveedor
              this.dataSupplier.forEach(itemSupplier => {
                // Revisar en todos los elementos del catalogo interno
                this.data.forEach(item => {
                  // Si el elemento es igual al del proveedor
                  let itemName = '';
                  let itemSlug = '';
                  switch (this.supplier.slug) {
                    case 'cva':
                      itemName = itemSupplier.description.toUpperCase();
                      itemSlug = slugify(itemSupplier.description, { lower: true });
                      break;
                    case 'syscom':
                      if (typeof itemSupplier.id === 'string') {
                        itemName = itemSupplier.id.toUpperCase();
                        itemSlug = slugify(itemSupplier.id, { lower: true });
                      }
                      break;
                    case 'exel':
                      itemName = itemSupplier.descripcion.toUpperCase();
                      itemSlug = slugify(itemSupplier.descripcion, { lower: true });
                      break;
                    default:
                      break;
                  }
                  if (item.slug.toUpperCase() === itemName) {
                    const supplierCat = new SupplierCat();
                    // Inicializar el nombre del proveedor.
                    supplierCat.idProveedor = this.supplier.slug;
                    supplierCat.name = itemName;
                    supplierCat.slug = itemSlug;
                    // Si ya existe un proveedor en el elemento.
                    if (item.suppliersCat.length > 0) {
                      if (item.suppliersCat[0].idProveedor !== '') {
                        item.suppliersCat.forEach(supplier => {
                          // Si el proveedor actual existe en catalogo de datos.
                          if (supplier.idProveedor === this.supplier.slug) {
                            supplier.name = supplierCat.name;
                            supplier.slug = supplierCat.slug;
                          } else {
                            // Si el proveedor no existe, lo agrega.
                            item.suppliersCat = [];
                            item.suppliersCat.push(supplierCat);
                          }
                        });
                      } else {
                        // Si el proveedor no existe, lo agrega.
                        item.suppliersCat = [];
                        item.suppliersCat.push(supplierCat);
                      }
                    }
                  }
                });
              });
            }
            closeAlert();
          }
        )
        .catch((error: Error) => {
          infoEventAlert('No es posible importar el catalogo.', error.message, TYPE_ALERT.ERROR);
        });
    } else {
      if (this.catalogValues.length > 0 || this.supplier.slug === 'ct' ||
        this.supplier.slug === 'ingram' || this.supplier.slug === 'exel') {
        loadData('Importando los productos', 'Esperar la carga de los productos.');
        return await this.getCatalogoAllBrands(this.supplier, this.apiSelect, this.catalogValues)
          .then(
            async (result) => {
              this.dataSupplier = result;
              if (this.dataSupplier) {
                if (this.dataSupplier.length > 0) {
                  this.habilitaGuardar = true;
                  this.dataExport = [];
                  // Setear dataExport
                  this.dataSupplier.forEach(item => {
                    const newItemExport = new ProductExport();
                    newItemExport.slug = item.slug;
                    newItemExport.brand = item.brand;
                    newItemExport.partnumber = item.partnumber;
                    newItemExport.sku = item.sku;
                    newItemExport.upc = item.upc;
                    this.dataExport.push(newItemExport);
                  });
                } else {
                  basicAlert(TYPE_ALERT.WARNING, 'No se encontraron productos.');
                }
              }
              closeAlert();
            }
          )
          .catch((error: Error) => {
            infoEventAlert(error.message, '', TYPE_ALERT.ERROR);
          });
      } else {
        basicAlert(TYPE_ALERT.WARNING, 'No existen elementos para buscar.');
      }
    }
  }
  //#endregion

  async getCatalogo(supplier: ISupplier, apiSelect: IApis, forCatalog: boolean = false): Promise<any> {
    // Cuando la consulta externa no requiere token
    const catalogValues: Catalog[] = [];
    const data = [];
    if (!supplier.token) {
      switch (supplier.slug) {
        case 'cva':
          return await this.externalAuthService.getCatalogXML(supplier, apiSelect, this.valorSearch.id)
            .then(
              async result => {
                try {
                  if (result) {
                    if (result[0].message) {                                        // Verifica si hay un error en la respuesta.
                      const errorArray = result[0].message.split('.');
                      if (errorArray[0] === 'Non-whitespace before first tag') {
                        throw new Error('El servicio no se encuentra disponible por favor intentalo mas tarde');
                      }
                    }
                    // Hay una demora en el catálogo de grupos2.xml y se eusará grupos.xml
                    if (apiSelect.operation === 'grupos.xml') {
                      result.forEach(async item => {
                        const itemData = new Catalog();
                        if (forCatalog) {
                          itemData.id = item.clave;
                          itemData.description = item.descripcion;
                          this.catalogValues.push(itemData);
                        } else {
                          itemData.id = item;
                          itemData.description = item;
                          data.push(itemData);
                        }
                      });
                      return await data;
                    } else if (apiSelect.operation === 'sucursales.xml') {
                      return await result;
                    } else {
                      result.forEach(async item => {
                        const itemData = new Catalog();
                        itemData.id = item.clave;
                        itemData.description = item.descripcion;
                        if (forCatalog) {
                          this.catalogValues.push(itemData);
                        } else {
                          data.push(itemData);
                        }
                      });
                      return await data;
                    }
                  }
                } catch (error) {
                  throw await new Error(error.message);
                }
              }, error => {
                basicAlert(TYPE_ALERT.ERROR, error.message);
              }
            );
        case 'exel':
          return await this.externalAuthService.getCatalogSOAP(supplier, apiSelect, this.valorSearch.id)
            .then(
              async result => {
                try {
                  if (result) {
                    return await result;
                  }
                } catch (error) {
                  throw await new Error(error.message);
                }
              }
            );
        default:
          break;
      }
    } else {
      switch (supplier.slug) {
        case 'syscom':
          return this.externalAuthService.getToken(supplier)
            .then(
              async result => {
                this.token = result.access_token;
                if (this.token) {
                  let productos: Product[] = [];
                  const catalogos: Catalog[] = [];
                  const resultado = await this.externalAuthService.getSyscomCatalog(supplier, apiSelect, this.token, this.valorSearch.id)
                    .then(
                      // tslint:disable-next-line: no-shadowed-variable
                      async result => {
                        switch (apiSelect.operation) {
                          case 'productos':                                 // Syscom
                            result.productos.forEach(item => {
                              let itemData = new Product();
                              itemData = this.setProduct(supplier.slug, item);
                              productos.push(itemData);
                            });
                            return await productos;
                          case 'existencia/promociones':                    // CT
                            result.forEach(item => {
                              const itemData = new Catalog();
                              itemData.id = item.codigo;
                              itemData.description = item.codigo;
                              catalogos.push(itemData);
                            });
                            return await catalogos;
                          default:
                            if (forCatalog) {
                              let i = 0;
                              result.forEach(res => {
                                i += 1;
                                res.description = res.nombre;
                                catalogos.push(res);
                              });
                              return await catalogos;
                            } else {
                              productos = result;
                              return await productos;
                            }
                        }
                      },
                      error => {
                        basicAlert(TYPE_ALERT.ERROR, 'Error al obtener los productos: (' + error.message + ')');
                      }
                    );
                  return await resultado;
                } else {
                  basicAlert(TYPE_ALERT.WARNING, 'No se encontró el Token de Autorización.');
                }
              },
              error => {
                basicAlert(TYPE_ALERT.ERROR, error.message);
              }
            );
        default:
          break;
      }
    }
  }

  async getCatalogoAllBrands(supplier: ISupplier, apiSelect: IApis, catalogValues: Catalog[]): Promise<any> {
    // Cuando la consulta externa no requiere token
    if (!supplier.token) {
      const productos: Product[] = [];
      let resultados;
      switch (supplier.slug) {
        case 'cva':
          // Carga de Productos
          this.cvaAlmacenes = await this.getCvaAlmacenes(supplier);
          resultados = await this.externalAuthService.getCatalogXMLAllBrands(supplier, apiSelect, this.valorSearch.id, catalogValues)
            .then(async result => {
              if (result.length > 0) {
                try {
                  let i = 0;
                  if (result[0].message) {
                    const errorArray = result[0].message.split('.');
                    if (errorArray[0] === 'Non-whitespace before first tag') {
                      throw new Error('El servicio no se encuentra disponible por favor intentalo mas tarde');
                    }
                  }
                  result.forEach(item => {
                    i += 1;
                    if (!item.id) {
                      item.id = i;
                    }
                    let itemData = new Product();
                    itemData = this.setProduct(supplier.slug, item);
                    if (itemData.id !== undefined) {
                      productos.push(itemData);
                    }
                  });
                  return await productos;
                } catch (error) {
                  throw await new Error(error.message);
                }
              }
              return await [];
            })
            .catch(async (error: Error) => {
              throw await new Error(error.message);
            });
          return await resultados;
        case 'exel':
          // Carga de todos los Productos
          resultados = await this.externalAuthService.getCatalogSOAP(supplier, apiSelect, this.valorSearch.id)
            .then(async result => {
              if (result.length === undefined) {
                if (result.message === 'Expected property name or \'}\' in JSON at position 1') {
                  throw await new Error('Bloqueado acceso al WS por exceder cantidad de Accesos');
                } else {
                  throw await new Error('Error de Conexion.');
                }
              }
              if (result.length > 0) {
                try {
                  // Api para Cargar Precios y Disponibilidad
                  let apiPrecio: IApis;
                  supplier.apis.forEach(api => {
                    if (api.type === 'precios') {
                      apiPrecio = api;
                    }
                  });
                  // Api para Cargar Imagenes
                  let apiImagenes: IApis;
                  supplier.apis.forEach(api => {
                    if (api.type === 'imagenes') {
                      apiImagenes = api;
                    }
                  });
                  // Cargar todas las imagenes de los productos.
                  const imagenes = await this.externalAuthService.getCatalogSOAP(supplier, apiImagenes, this.valorSearch.id)
                    // tslint:disable-next-line: no-shadowed-variable
                    .then(async result => {
                      try {
                        return await result;
                      } catch (error) {
                        throw await new Error(error.message);
                      }
                    })
                    .catch(async (error: Error) => {
                      throw await new Error(error.message);
                    });
                  let i = 0;
                  // Obtener el codigo, existencia y precios de los productos de 80 en 80
                  let codigos = '';
                  const arrayCodigos = [];
                  for (const item of result) {
                    i += 1;
                    if (i <= 100) {
                      codigos += '<string>' + item.codigo_proveedor.trimRight() + '</string>';
                    } else {
                      await arrayCodigos.push(codigos);
                      i = 0;
                      codigos = '';
                    }
                  }
                  // Crear un arreglo general de todos los precios
                  const preciosExistencias = [];
                  let k = 0;
                  // tslint:disable-next-line: no-shadowed-variable
                  for (const codigos of arrayCodigos) {
                    k += 1;
                    if (k <= 20) {            // -80/2665 Ok
                      const codigoProveedor = '<Codigos>' + codigos.trimRight() + '</Codigos>';
                      await this.externalAuthService.getCatalogSOAP(
                        supplier, apiPrecio, this.valorSearch.id, codigoProveedor)
                        .then(async resultPricEx => {
                          if (resultPricEx.length > 0) {
                            resultPricEx.forEach(element => {
                              // Solo ocupa los productos que tengan existencia.
                              if (parseInt(element.existencia, 10) > 0) {
                                preciosExistencias.push(element);
                              }
                            });
                          }
                        })
                        .catch(async (error: Error) => {
                          throw new Error(error.message);
                        });
                    }
                  }
                  // Iniciar para cada producto de 100 en 100
                  result.forEach(item => {
                    // Recupera las imagenes del producto
                    const imagenesProd = imagenes.filter(image =>
                      image.id_producto === item.id_producto);
                    // Recupera los precios y disponibles del producto
                    const preciosExistenciasProd = preciosExistencias.filter(precio =>
                      precio.id_producto === item.id_producto);
                    if (preciosExistenciasProd.length > 0) {
                      let precioMax = 0;
                      let existencia = 0;
                      // Calcula el precio maximo y las existencias
                      preciosExistenciasProd.forEach(element => {
                        existencia += parseInt(element.existencia, 0);
                        if (precioMax <= parseFloat(element.precio)) {
                          precioMax = parseFloat(element.precio);
                        }
                      });
                      if (existencia >= this.stockMinimo) {
                        let itemData = new Product();
                        item.stock = existencia;
                        item.precioLista = precioMax;
                        itemData = this.setProduct(supplier.slug, item, preciosExistenciasProd, imagenesProd);
                        productos.push(itemData);
                      }
                    }
                  });
                  return await productos;
                } catch (error) {
                  throw await new Error(error.message);
                }
              }
              return await [];
            })
            .catch(async (error: Error) => {
              throw await new Error(error.message);
            });
          return await resultados;
        default:
          break;
      }
    } else {                                                                  // Syscom, CT, Ingram
      return await this.externalAuthService.getToken(supplier)
        .then(
          async result => {
            switch (supplier.slug) {
              case 'ct':
                this.token = result.token;
                break;
              case 'syscom':
                this.token = result.access_token;
                break;
              case 'ingram':
                this.token = result.access_token;
                break;
              default:
                break;
            }
            if (this.token) {
              const productos: Product[] = [];
              if (supplier.slug === 'ct') {
                this.ctAlmacenes = await this.getAlmacenes();
              }
              // Carga de Productos
              const resultados = await this.externalAuthService.getSyscomCatalogAllBrands(supplier, apiSelect, this.token, catalogValues)
                // tslint:disable-next-line: no-shadowed-variable
                .then(async result => {
                  try {
                    if (result.length > 0) {
                      if (supplier.slug === 'ct') {
                        // Carga de Precios y Disponibilidad
                        const productsJson = await this.getProducts();
                        result.forEach(item => {
                          productsJson.forEach(productJson => {
                            if (item.codigo === productJson.clave) {
                              let itemData = new Product();
                              itemData = this.setProduct(supplier.slug, item, productJson);
                              if (itemData.id !== undefined) {
                                productos.push(itemData);
                              }
                            }
                          });
                        });
                      } else if (supplier.slug === 'ingram') {
                        const rows = Object.values(result).slice(0, -1);
                        // tslint:disable-next-line: forin
                        for (const idR in rows) {
                          const item = result[idR];
                          let itemData = new Product();
                          itemData = this.setProduct(supplier.slug, item);
                          if (itemData.id !== undefined) {
                            productos.push(itemData);
                          }
                        }
                      } else {
                        result.forEach(item => {
                          let itemData = new Product();
                          itemData = this.setProduct(supplier.slug, item);
                          if (itemData.id !== undefined) {
                            productos.push(itemData);
                          }
                        });
                      }
                    }
                    return await productos;
                  } catch (error) {
                    throw await new Error(error.message);
                  }
                });
              return await resultados;
            } else {
              basicAlert(TYPE_ALERT.WARNING, 'No se encontró el Token de Autorización.');
            }
          },
          error => {
            basicAlert(TYPE_ALERT.ERROR, error.message);
          }
        );
    }
  }

  getAlmacenCant(x): BranchOffices {
    const almacen = new BranchOffices();
    Object.keys(x).forEach((branch, index) => {
      const almacenEstado = this.getCtAlmacenes(branch);
      almacen.id = almacenEstado.id;
      almacen.name = almacenEstado.Sucursal;
      almacen.estado = almacenEstado.Estado;
      almacen.cp = almacenEstado.CP;
      almacen.latitud = almacenEstado.latitud;
      almacen.longitud = almacenEstado.longitud;
      almacen.cantidad = x[branch];
      // Si el dato es un objeto entonces viene una promocion.
      if (typeof x[branch] === 'object') {
        const promoBranch = x[branch];
        const promocion = new PromocionBranchOffice();
        // Divide la promocion en precio y vencia
        Object.keys(promoBranch).forEach((promo, indexY) => {
          if (indexY === 0) {
            promocion.price = parseFloat(promoBranch[promo]);
          } else if (indexY === 1) {
            const vigencia = promoBranch[promo];
            const vigente = new Vigente();
            // Divide la vigencia en inicio y fin.
            Object.keys(vigencia).forEach((vig, indexZ) => {
              if (indexZ === 0) {
                vigente.ini = vigencia[vig];
              } else if (indexZ === 1) {
                vigente.fin = vigencia[vig];
              }
            });
            promocion.vigente = vigente;
          }
        });
        almacen.promocionBranchOffice = promocion;
      }
    });
    return almacen;
  }

  getCtAlmacenes(id: string): any {
    // tslint:disable-next-line: no-shadowed-variable
    const almacen = this.ctAlmacenes.filter(almacen => almacen.id === id);
    if (almacen.length > 0) {
      const sucursal = almacen.map(element => element);
      return sucursal[0];
    }
    return '';
  }

  getFechas(fecha: Date) {
    let dtS = '';
    let monthS = '';
    const year = fecha.getFullYear();
    const month = (fecha.getMonth() + 1);
    const dt = fecha.getDate();
    dtS = dt < 10 ? '0' + dt : dt.toString();
    monthS = month < 10 ? '0' + month : month.toString();
    return year + '-' + monthS + '-' + dtS;
  }

  setCvaAlmacenes(item: any): BranchOffices[] {
    const branchOffices: BranchOffices[] = [];
    this.cvaAlmacenes.forEach(almacen => {
      let cantidad = 0;
      const branchOffice = new BranchOffices();
      branchOffice.id = almacen.clave;
      branchOffice.name = almacen.nombre;
      branchOffice.estado = almacen.nombre;
      branchOffice.cp = almacen.cp;
      branchOffice.latitud = '';
      branchOffice.longitud = '';
      switch (almacen.clave) {
        case '1':
          cantidad = parseInt(item.VENTAS_GUADALAJARA, 10);
          if (cantidad > 0) {
            branchOffice.cantidad = cantidad;
            branchOffices.push(branchOffice);
          }
          break;
        case '3':
          cantidad = parseInt(item.VENTAS_MORELIA, 10);
          if (cantidad > 0) {
            branchOffice.cantidad = cantidad;
            branchOffices.push(branchOffice);
          }
          break;
        case '4':
          cantidad = parseInt(item.VENTAS_LEON, 10);
          if (cantidad > 0) {
            branchOffice.cantidad = cantidad;
            branchOffices.push(branchOffice);
          }
          break;
        case '5':
          cantidad = parseInt(item.VENTAS_CULIACAN, 10);
          if (cantidad > 0) {
            branchOffice.cantidad = cantidad;
            branchOffices.push(branchOffice);
          }
          break;
        case '6':
          cantidad = parseInt(item.VENTAS_QUERETARO, 10);
          if (cantidad > 0) {
            branchOffice.cantidad = cantidad;
            branchOffices.push(branchOffice);
          }
          break;
        case '7':
          cantidad = parseInt(item.VENTAS_TORREON, 10);
          if (cantidad > 0) {
            branchOffice.cantidad = cantidad;
            branchOffices.push(branchOffice);
          }
          break;
        case '8':
          cantidad = parseInt(item.VENTAS_TEPIC, 10);
          if (cantidad > 0) {
            branchOffice.cantidad = cantidad;
            branchOffices.push(branchOffice);
          }
          break;
        case '9':
          cantidad = parseInt(item.VENTAS_MONTERREY, 10);
          if (cantidad > 0) {
            branchOffice.cantidad = cantidad;
            branchOffices.push(branchOffice);
          }
          break;
        case '10':
          cantidad = parseInt(item.VENTAS_PUEBLA, 10);
          if (cantidad > 0) {
            branchOffice.cantidad = cantidad;
            branchOffices.push(branchOffice);
          }
          break;
        case '11':
          cantidad = parseInt(item.VENTAS_VERACRUZ, 10);
          if (cantidad > 0) {
            branchOffice.cantidad = cantidad;
            branchOffices.push(branchOffice);
          }
          break;
        case '12':
          cantidad = parseInt(item.VENTAS_VILLAHERMOSA, 10);
          if (cantidad > 0) {
            branchOffice.cantidad = cantidad;
            branchOffices.push(branchOffice);
          }
          break;
        case '13':
          cantidad = parseInt(item.VENTAS_TUXTLA, 10);
          if (cantidad > 0) {
            branchOffice.cantidad = cantidad;
            branchOffices.push(branchOffice);
          }
          break;
        case '14':
          cantidad = parseInt(item.VENTAS_HERMOSILLO, 10);
          if (cantidad > 0) {
            branchOffice.cantidad = cantidad;
            branchOffices.push(branchOffice);
          }
          break;
        case '18':
          cantidad = parseInt(item.VENTAS_MERIDA, 10);
          if (cantidad > 0) {
            branchOffice.cantidad = cantidad;
            branchOffices.push(branchOffice);
          }
          break;
        case '19':
          cantidad = parseInt(item.VENTAS_CANCUN, 10);
          if (cantidad > 0) {
            branchOffice.cantidad = cantidad;
            branchOffices.push(branchOffice);
          }
          break;
        case '23':
          cantidad = parseInt(item.VENTAS_AGUASCALIENTES, 10);
          if (cantidad > 0) {
            branchOffice.cantidad = cantidad;
            branchOffices.push(branchOffice);
          }
          break;
        case '24':
          cantidad = parseInt(item.VENTAS_DF_TALLER, 10);
          if (cantidad > 0) {
            branchOffice.cantidad = cantidad;
            branchOffices.push(branchOffice);
          }
          break;
        case '26':
          cantidad = parseInt(item.VENTAS_SAN_LUIS_POTOSI, 10);
          if (cantidad > 0) {
            branchOffice.cantidad = cantidad;
            branchOffices.push(branchOffice);
          }
          break;
        case '27':
          cantidad = parseInt(item.VENTAS_CHIHUAHUA, 10);
          if (cantidad > 0) {
            branchOffice.cantidad = cantidad;
            branchOffices.push(branchOffice);
          }
          break;
        case '28':
          cantidad = parseInt(item.VENTAS_DURANGO, 10);
          if (cantidad > 0) {
            branchOffice.cantidad = cantidad;
            branchOffices.push(branchOffice);
          }
          break;
        case '29':
          cantidad = parseInt(item.VENTAS_TOLUCA, 10);
          if (cantidad > 0) {
            branchOffice.cantidad = cantidad;
            branchOffices.push(branchOffice);
          }
          break;
        case '31':
          cantidad = parseInt(item.VENTAS_OAXACA, 10);
          if (cantidad > 0) {
            branchOffice.cantidad = cantidad;
            branchOffices.push(branchOffice);
          }
          break;
        case '32':
          cantidad = parseInt(item.VENTAS_LAPAZ, 10);
          if (cantidad > 0) {
            branchOffice.cantidad = cantidad;
            branchOffices.push(branchOffice);
          }
          break;
        case '33':
          cantidad = parseInt(item.VENTAS_TIJUANA, 10);
          if (cantidad > 0) {
            branchOffice.cantidad = cantidad;
            branchOffices.push(branchOffice);
          }
          break;
        case '35':
          cantidad = parseInt(item.VENTAS_COLIMA, 10);
          if (cantidad > 0) {
            branchOffice.cantidad = cantidad;
            branchOffices.push(branchOffice);
          }
          break;
        case '36':
          cantidad = parseInt(item.VENTAS_ZACATECAS, 10);
          if (cantidad > 0) {
            branchOffice.cantidad = cantidad;
            branchOffices.push(branchOffice);
          }
          break;
        case '38':
          cantidad = parseInt(item.VENTAS_CAMPECHE, 10);
          if (cantidad > 0) {
            branchOffice.cantidad = cantidad;
            branchOffices.push(branchOffice);
          }
          break;
        case '39':
          cantidad = parseInt(item.VENTAS_TAMPICO, 10);
          if (cantidad > 0) {
            branchOffice.cantidad = cantidad;
            branchOffices.push(branchOffice);
          }
          break;
        case '40':
          cantidad = parseInt(item.VENTAS_PACHUCA, 10);
          if (cantidad > 0) {
            branchOffice.cantidad = cantidad;
            branchOffices.push(branchOffice);
          }
          break;
        case '43':
          cantidad = parseInt(item.VENTAS_ACAPULCO, 10);
          if (cantidad > 0) {
            branchOffice.cantidad = cantidad;
            branchOffices.push(branchOffice);
          }
          break;
        case '46':
          cantidad = parseInt(item.VENTAS_CEDISGUADALAJARA, 10);
          if (cantidad > 0) {
            branchOffice.cantidad = cantidad;
            branchOffices.push(branchOffice);
          }
          break;
        case '47':
          cantidad = parseInt(item.VENTAS_CUERNAVACA, 10);
          if (cantidad > 0) {
            branchOffice.cantidad = cantidad;
            branchOffices.push(branchOffice);
          }
          break;
        case '51':
          cantidad = parseInt(item.VENTAS_CEDISCDMX, 10);
          if (cantidad > 0) {
            branchOffice.cantidad = cantidad;
            branchOffices.push(branchOffice);
          }
          break;
        case '52':
          cantidad = parseInt(item.VENTAS_ASPHALT, 10);
          if (cantidad > 0) {
            branchOffice.cantidad = cantidad;
            branchOffices.push(branchOffice);
          }

          break;
      }
    });
    return branchOffices;
  }

  setProduct(proveedor: string, item: any, productJson: any = null, imagenes: any = null) {
    const itemData = new Product();
    const unidad = new UnidadDeMedida();
    const b = new Brands();
    const c = new Categorys();
    const s = new SupplierProd();
    const bo = new BranchOffices();
    const i = new Picture();
    const is = new Picture();
    const desc = new Descuentos();
    const promo = new Promociones();
    let disponible = 0;
    let salePrice = 0;

    switch (proveedor) {
      case 'ingram':
        const stock = parseInt(item.field26, 10);
        if (stock >= this.stockMinimo) {
          salePrice = 0;
          itemData.id = item.field2;
          itemData.name = item.field5;
          itemData.slug = slugify(item.field5, { lower: true });
          itemData.short_desc = item.field5 + '. ' + item.field6;
          itemData.price = parseFloat(item.field7);
          itemData.sale_price = salePrice;
          itemData.review = 0;
          itemData.ratings = 0;
          itemData.until = this.getFechas(new Date());
          itemData.top = false;
          itemData.featured = false;
          itemData.new = false;
          itemData.sold = null;
          itemData.stock = stock;
          itemData.sku = item.field2;
          itemData.partnumber = item.field8;
          itemData.upc = item.field10;
          unidad.id = 'PZ';
          unidad.name = 'Pieza';
          unidad.slug = 'pieza';
          itemData.unidadDeMedida = unidad;
          // Categorias
          itemData.category = [];
          c.name = 'item.categoria';
          c.slug = ''; // slugify(item.categoria, { lower: true });
          itemData.category.push(c);
          // Marcas
          itemData.brand = item.field4.toUpperCase();
          itemData.brands = [];
          b.name = item.field4;
          b.slug = slugify(item.field4, { lower: true });
          itemData.brands.push(b);
          // SupplierProd
          s.idProveedor = proveedor;
          s.codigo = item.field2;
          s.price = parseFloat(item.field7);
          s.moneda = 'MXN';
          s.branchOffices = [];
          // if (productJson.length > 0) {
          //   productJson.forEach(almacen => {
          //     const branchoffice = new BranchOffices();
          //     branchoffice.name = almacen.localidad;
          //     branchoffice.cantidad = parseInt(almacen.existencia, 10);
          //     s.branchOffices.push(branchoffice);
          //   });
          // }
          itemData.variants = [];
          itemData.suppliersProd = s;
          // Imagenes
          // if (imagenes.length > 0) {
          //   imagenes.forEach(image => {
          //     itemData.pictures = [];
          //     i.width = '600';
          //     i.height = '600';
          //     i.url = image.url;
          //     itemData.pictures.push(i);
          //     // Imagenes pequeñas
          //     itemData.sm_pictures = [];
          //     is.width = '300';
          //     is.height = '300';
          //     is.url = image.url;
          //     itemData.sm_pictures.push(is);
          //   });
          // }
        }
        return itemData;

      case 'syscom':
        salePrice = 0;
        if (item.total_existencia >= this.stockMinimo) {
          itemData.id = item.producto_id;
          itemData.name = item.titulo === '' ? item.modelo : item.titulo;
          itemData.slug = slugify(item.titulo === '' ? item.modelo : item.titulo, { lower: true });
          itemData.short_desc = item.titulo + '. Modelo: ' + item.modelo;
          itemData.price = parseFloat(item.precios.precio_lista);
          itemData.review = 0;
          itemData.ratings = 0;
          itemData.until = this.getFechas(new Date());
          const precioLista = parseFloat(item.precios.precio_lista);
          const precioDescuento = parseFloat(item.precios.precio_descuento);
          const precioEspecial = parseFloat(item.precios.precio_especial);
          let featured = false;
          if (precioEspecial < precioLista) {                   // Catalogar como producto feature
            featured = true;
            desc.total_descuento = precioEspecial;
            desc.moneda_descuento = 'MXN';
            desc.precio_descuento = precioEspecial;
            salePrice = precioEspecial;
          }
          itemData.descuentos = desc;
          if (precioDescuento < precioEspecial) {               // Catalogar como producto TOP
            featured = true;
            promo.clave_promocion = '';
            promo.descripcion_promocion = 'Producto con Descuento';
            promo.vencimiento_promocion = 'Total Existencias: ' + item.total_existencia.toString();
            promo.disponible_en_promocion = precioDescuento;
            salePrice = precioDescuento;
          }
          itemData.sale_price = salePrice;
          itemData.promociones = promo;
          itemData.top = false;
          itemData.featured = featured;
          itemData.new = null;
          itemData.sold = null;
          itemData.stock = item.total_existencia;
          itemData.sku = item.modelo;
          itemData.partnumber = item.producto_id;
          itemData.upc = item.sat_key;
          unidad.id = item.unidad_de_medida.codigo_unidad;
          unidad.name = item.unidad_de_medida.nombre;
          unidad.slug = slugify(item.unidad_de_medida.nombre, { lower: true });
          itemData.unidadDeMedida = unidad;
          // Categorias
          itemData.category = [];
          item.categorias.forEach(categoria => {
            const cat = new Categorys();
            cat.name = categoria.nombre;
            cat.slug = slugify(categoria.nombre, { lower: true });
            itemData.category.push(cat);
          });
          // Marcas
          itemData.brand = item.marca.toUpperCase();
          itemData.brands = [];
          b.name = item.marca;
          b.slug = slugify(item.marca, { lower: true });
          itemData.brands.push(b);
          // SupplierProd
          s.idProveedor = proveedor;
          s.codigo = item.producto_id;
          s.price = parseFloat(item.precios.precio_lista);
          s.moneda = 'MXN';
          s.branchOffices = [];
          bo.name = 'Villahermosa';
          bo.cantidad = item.total_existencia;
          s.branchOffices.push(bo);
          itemData.suppliersProd = s;
          // Imagenes
          itemData.pictures = [];
          i.width = '600';
          i.height = '600';
          i.url = item.img_portada === '' ? item.marca_logo : item.img_portada;
          itemData.pictures.push(i);
          // Imagenes pequeñas
          itemData.sm_pictures = [];
          is.width = '300';
          is.height = '300';
          is.url = item.img_portada === '' ? item.marca_logo : item.img_portada;
          itemData.variants = [];
          itemData.sm_pictures.push(is);
        }
        return itemData;

      case 'cva':
        salePrice = 0;
        let branchOffices: BranchOffices[] = [];
        let disponibilidadAlmacenes = 0;
        if (item.ExsTotal >= this.stockMinimo) {                  // Si existencias totales.
          branchOffices = this.setCvaAlmacenes(item);
          if (branchOffices.length > 0) {
            branchOffices.forEach(branchOffice => {
              disponibilidadAlmacenes += branchOffice.cantidad;
            });
          }
          if (disponibilidadAlmacenes >= this.stockMinimo) {      // Si la sumatoria de los almacenes.
            itemData.id = item.id;
            itemData.name = item.descripcion;
            itemData.slug = slugify(item.descripcion, { lower: true });
            itemData.short_desc = item.clave + '. Grupo: ' + item.grupo;
            itemData.price = parseFloat(item.precio);
            itemData.review = 0;
            itemData.ratings = 0;
            itemData.until = this.getFechas(new Date());
            itemData.top = false;
            if (item.PrecioDescuento !== 'Sin Descuento') {
              desc.total_descuento = item.TotalDescuento === '' ? 0 : parseFloat(item.TotalDescuento);
              desc.moneda_descuento = item.MonedaDescuento;
              desc.precio_descuento = item.PrecioDescuento === '' ? 0 : parseFloat(item.PrecioDescuento);
              salePrice = desc.precio_descuento;
            }
            itemData.descuentos = desc;
            itemData.featured = item.DisponibleEnPromocion !== 'Sin Descuento' ? true : false;
            if (item.DisponibleEnPromocion !== 'Sin Descuento') {
              promo.clave_promocion = item.ClavePromocion;
              promo.descripcion_promocion = item.DescripcionPromocion;
              promo.vencimiento_promocion = item.VencimientoPromocion;
              promo.disponible_en_promocion = item.DisponibleEnPromocion === '' ? 0 : parseFloat(item.DisponibleEnPromocion);
            }
            itemData.sale_price = salePrice;
            itemData.promociones = promo;
            itemData.new = false;
            itemData.sold = null;
            disponible = disponibilidadAlmacenes;
            itemData.stock = disponible;
            itemData.sku = item.clave;
            itemData.partnumber = item.codigo_fabricante;
            itemData.upc = item.codigo_fabricante;
            unidad.id = 'PZ';
            unidad.name = 'Pieza';
            unidad.slug = 'pieza';
            itemData.unidadDeMedida = unidad;
            // Categorias
            itemData.category = [];
            c.name = item.grupo;
            c.slug = slugify(item.grupo, { lower: true });
            itemData.category.push(c);
            // Marcas
            itemData.brand = item.marca.toLowerCase();
            itemData.brands = [];
            b.name = item.marca;
            b.slug = slugify(item.marca, { lower: true });
            itemData.brands.push(b);
            // SupplierProd
            s.idProveedor = proveedor;
            s.codigo = item.clave;
            s.price = parseFloat(item.precio);
            s.moneda = 'MXN';
            s.branchOffices = branchOffices;
            itemData.suppliersProd = s;
            // Imagenes
            itemData.pictures = [];
            // const i = new Picture();
            i.width = '600';
            i.height = '600';
            i.url = item.imagen;
            itemData.pictures.push(i);
            // Imagenes pequeñas
            itemData.sm_pictures = [];
            // const is = new Picture();
            is.width = '300';
            is.height = '300';
            is.url = item.imagen;
            itemData.variants = [];
            itemData.sm_pictures.push(is);
          }
        }
        return itemData;

      case 'ct':
        disponible = 0;
        salePrice = 0;
        if (item.almacenes.length > 0) {
          const branchOfficesCt: BranchOffices[] = [];
          let featured = false;
          item.almacenes.forEach(element => {
            const almacen = this.getAlmacenCant(element);
            disponible += almacen.cantidad;
            branchOfficesCt.push(almacen);
          });
          if (disponible >= this.stockMinimo) {                         // Si hay mas de 10 elementos disponibles
            // Si hay promociones en los almacenes ocupa el primero y asigna el total de disponibilidad
            if (item.almacenes[0].promocion) {
              featured = true;
              promo.clave_promocion = '';
              promo.descripcion_promocion = 'Producto con Descuento';
              promo.inicio_promocion = item.almacenes[0].promocion.vigente.ini;
              promo.vencimiento_promocion = item.almacenes[0].promocion.vigente.fin;
              promo.disponible_en_promocion = item.almacenes[0].promocion.precio;
              salePrice = item.almacenes[0].promocion.precio;
              itemData.promociones = promo;
            }
            itemData.id = productJson.clave;
            itemData.name = productJson.nombre;
            itemData.slug = slugify(productJson.nombre, { lower: true });
            itemData.short_desc = productJson.descripcion_corta;
            // if (item.moneda === 'USD') {
            //   itemData.price = parseFloat((parseFloat(item.precio) * this.exchangeRate).toFixed(2));
            //   itemData.sale_price = parseFloat((salePrice * this.exchangeRate).toFixed(2));
            // } else {
            itemData.price = parseFloat(item.precio);
            itemData.sale_price = salePrice;
            // }
            itemData.review = 0;
            itemData.ratings = 0;
            itemData.until = this.getFechas(new Date());
            itemData.top = false;
            itemData.featured = featured;
            itemData.new = null;
            itemData.sold = null;
            itemData.stock = disponible;
            itemData.sku = productJson.clave;
            itemData.upc = productJson.upc;
            itemData.partnumber = productJson.numParte;
            unidad.id = 'PZ';
            unidad.name = 'Pieza';
            unidad.slug = 'pieza';
            itemData.unidadDeMedida = unidad;
            // Categorias
            itemData.category = [];
            c.name = productJson.subcategoria;
            c.slug = slugify(productJson.subcategoria, { lower: true });
            itemData.category.push(c);
            const c1 = new Categorys();
            c.name = productJson.categoria;
            c.slug = slugify(productJson.categoria, { lower: true });
            itemData.category.push(c1);
            // Marcas
            itemData.brand = productJson.marca.toLowerCase();
            itemData.brands = [];
            b.name = productJson.marca;
            b.slug = slugify(productJson.marca, { lower: true });
            itemData.brands.push(b);
            // SupplierProd
            s.idProveedor = proveedor;
            s.codigo = productJson.numParte;
            // if (item.moneda === 'USD') {
            //   s.price = parseFloat((parseFloat(item.precio) * this.exchangeRate).toFixed(2));
            // } else {
            s.price = parseFloat(item.precio);
            // }
            s.moneda = item.moneda;
            s.branchOffices = branchOfficesCt;
            itemData.suppliersProd = s;
            itemData.model = productJson.modelo;
            // Imagenes
            itemData.pictures = [];
            // const i = new Picture();
            i.width = '600';
            i.height = '600';
            i.url = productJson.imagen;
            itemData.pictures.push(i);
            // Imagenes pequeñas
            itemData.sm_pictures = [];
            // const is = new Picture();
            is.width = '300';
            is.height = '300';
            is.url = productJson.imagen;
            itemData.variants = [];
            itemData.sm_pictures.push(is);
            return itemData;
          }
        }
        return itemData;

      case 'exel':
        salePrice = 0;
        itemData.id = item.id_producto;
        itemData.name = item.descripcion;
        itemData.slug = slugify(item.descripcion, { lower: true });
        itemData.short_desc = item.subcategoria + '. Codigo: ' + item.codigo_proveedor;
        itemData.price = item.precioLista;
        itemData.sale_price = salePrice;
        itemData.review = 0;
        itemData.ratings = 0;
        itemData.until = this.getFechas(new Date());
        itemData.top = false;
        itemData.featured = false;
        itemData.new = item.nuevo = 1 ? true : false;
        itemData.sold = null;
        itemData.stock = item.stock;
        itemData.sku = item.id_producto;
        itemData.partnumber = item.codigo_proveedor;
        itemData.upc = item.codigo_barra;
        unidad.id = 'PZ';
        unidad.name = 'Pieza';
        unidad.slug = 'pieza';
        itemData.unidadDeMedida = unidad;
        // Categorias
        itemData.category = [];
        c.name = item.categoria;
        c.slug = slugify(item.categoria, { lower: true });
        itemData.category.push(c);
        // Marcas
        itemData.brand = item.marca.toUpperCase();
        itemData.brands = [];
        b.name = item.marca;
        b.slug = slugify(item.marca, { lower: true });
        itemData.brands.push(b);
        // SupplierProd
        s.idProveedor = proveedor;
        s.codigo = item.id_producto;
        s.price = parseFloat(item.precioLista);
        s.moneda = 'MXN';
        s.branchOffices = [];
        if (productJson.length > 0) {
          productJson.forEach(almacen => {
            const branchoffice = new BranchOffices();
            branchoffice.name = almacen.localidad;
            branchoffice.cantidad = parseInt(almacen.existencia, 10);
            s.branchOffices.push(branchoffice);
          });
        }
        itemData.variants = [];
        itemData.suppliersProd = s;
        // Imagenes
        if (imagenes.length > 0) {
          imagenes.forEach(image => {
            itemData.pictures = [];
            i.width = '600';
            i.height = '600';
            i.url = image.url;
            itemData.pictures.push(i);
            // Imagenes pequeñas
            itemData.sm_pictures = [];
            is.width = '300';
            is.height = '300';
            is.url = image.url;
            itemData.sm_pictures.push(is);
          });
        }
        return itemData;
      default:
        break;
    }
  }

  onSubmit() {
    const i = 0;
    if (this.catalog === 'productos') {
      const addProduct = new AddProduct();
      addProduct.tipo = 'list';
      addProduct.item = null;
      addProduct.list = this.dataSupplier;
      this.importaChangeProduct.emit(addProduct);
    } else {
      const addCatalog = new AddCatalog();
      addCatalog.tipo = 'list';
      addCatalog.item = null;
      addCatalog.list = this.data; // this.catalogs;
      this.catalogs.shift();
      this.importaChange.emit(addCatalog);
    }
  }

}
