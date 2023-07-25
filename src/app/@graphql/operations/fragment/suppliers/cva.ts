import gql from 'graphql-tag';

export const BRANDSCVA_FRAGMENT = gql`
  fragment BrandsCvaObject on ResponseBrandsCva {
    clave
    descripcion
  }
`;

export const GROUPSCVA_FRAGMENT = gql`
  fragment GroupsCvaObject on ResponseGroupsCva {
    grupo
  }
`;

export const SOLUCIONESCVA_FRAGMENT = gql`
  fragment SolucionesCvaObject on ResponseSolucionesCva {
    clave
    descripcion
  }
`;

export const SUCURSALESCVA_FRAGMENT = gql`
  fragment SucursalCvaObject on ResponseSucursalesCva {
    clave
    nombre
    cp
  }
`;

export const PAQUETERIASCVA_FRAGMENT = gql`
  fragment PaqueteriasCvaObject on ResponsePaqueteriasCva {
    clave
    descripcion
  }
`;

export const PRODUCTOSCVA_FRAGMENT = gql`
  fragment ProductosCvaObject on ResponseProductCva {
    clave
    codigo_fabricante
    descripcion
    solucion
    grupo
    marca
    garantia
    clase
    disponible
    precio
    moneda
    ficha_tecnica
    ficha_comercial
    imagen
    disponibleCD
  }
`;
