import gql from 'graphql-tag';
import { PRODUCTOSCT_FRAGMENT, TOKENCT_FRAGMENT } from '@graphql/operations/fragment/suppliers/ct';

export const PRODUCTOSCT_LIST_QUERY = gql`
  query stockProductsCt {
    stockProductsCt {
      status
      message
      stockProductsCt {
        ...ProductosCtObject
      }
    }
  }
  ${PRODUCTOSCT_FRAGMENT}
`;
