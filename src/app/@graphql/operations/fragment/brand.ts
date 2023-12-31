import gql from 'graphql-tag';

export const BRAND_FRAGMENT = gql`
  fragment BrandObject on Brand {
    id
    description
    slug
    order
    active
    suppliersCat {
      idProveedor
      name
      slug
    }
  }
`;
