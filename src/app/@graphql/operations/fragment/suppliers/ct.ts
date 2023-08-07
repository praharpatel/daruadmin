import gql from 'graphql-tag';

export const TOKENCT_FRAGMENT = gql`
  fragment TokenCtObject on TokenCt {
    token
    time
  }
`;

export const PRODUCTOSCT_FRAGMENT = gql`
  fragment ProductosCtObject on ResponseCtsStockProducts {
    precio
    moneda
    almacenes {
      almacenPromocion {
        key
        value
        promocionString
      }
    }
    codigo
  }
`;

export const ORDERSCT_FRAGMENT = gql`
  fragment OrdersCtObject on ResponseCtsListOrders {
    idPedido
    almacen
    tipoPago
    guiaConnect {
      generarGuia
      paqueteria
    }
    producto {
      cantidad
      clave
      precio
      moneda
    }
    respuestaCT {
      pedidoWeb
      fecha
      tipoDeCambio
      estatus
      errores {
        errorCode
        errorMessage
        errorReference
      }
    }
  }
`;
