import gql from 'graphql-tag';
import { PRODUCTSINGRAM_FRAGMENT } from '@graphql/operations/fragment/suppliers/ingram';

export const PRODUCTSINGRAM_LIST_QUERY = gql`
  query pricesIngram {
    pricesIngram {
      status
      message
      pricesIngram {
        ...ProductsIngramObject
      }
    }
  }
  ${PRODUCTSINGRAM_FRAGMENT}
`;
