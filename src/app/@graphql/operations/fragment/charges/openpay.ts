import gql from 'graphql-tag';

export const CHARGESOPENPAY_FRAGMENT = gql`
  fragment ChargsOpenpayObject on ChargeOpenpay {
    id
    authorization
    transaction_type
    operation_type
    method
    creation_date
    order_id
    status
    amount
    description
    error_message
    customer_id
    currency
    card {
      id
      type
      card_number
      holder_name
      expiration_year
      expiration_month
      allows_charges
      allows_payouts
      creation_date
      bank_name
      bank_code
    }
  }
`;
