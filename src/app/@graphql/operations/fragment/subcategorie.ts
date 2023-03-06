import gql from 'graphql-tag';

export const SUBCATEGORIE_FRAGMENT = gql`
  fragment SubcategorieObject on Subcategorie {
    id
    description
    slug
    active
  }
`;
