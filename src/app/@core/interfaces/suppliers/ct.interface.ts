export class IProductoCt {
  precio: number;
  moneda: string;
  almacenes: IAlmacenes[];
  codigo: string;
}

export class IAlmacenes {
  promociones: IPromocion[];
  almacen: IAlmacen;
}

export class IAlmacen {
  key: string
  value: number;
}

export class IPromocion {
  precio: number;
  porciento: number;
  vigente: IVigencia;
}

export class IVigencia {
  ini: string;
  fin: string;
}
