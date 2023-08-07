import { CHARGESOPENPAY_FRAGMENT } from '@graphql/operations/fragment/charges/openpay';
import gql from 'graphql-tag';

export const CHARGESOPENAY_LIST_QUERY = gql`
  query listChargesOpenpay {
    listChargesOpenpay {
      status
      message
      listChargesOpenpay {
        ...ChargsOpenpayObject
      }
    }
  }
  ${CHARGESOPENPAY_FRAGMENT}
`;
