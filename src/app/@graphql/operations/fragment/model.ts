import gql from 'graphql-tag';

export const MODEL_FRAGMENT = gql`
  fragment ModelObject on Model {
    id
    description
    slug
    order
    active
  }
`;
