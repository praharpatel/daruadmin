import gql from 'graphql-tag';
import { SUBCATEGORIE_FRAGMENT } from 'src/app/@graphql/operations/fragment/subcategorie';

export const ADD_SUBCATEGORIE = gql`
   mutation addSubcategorie($subcategorie: CatalogInput!) {
      addSubcategorie(subcategorie: $subcategorie) {
         status
         message
         subcategorie {
            ...SubcategorieObject
         }
      }
   }
   ${SUBCATEGORIE_FRAGMENT}
`;

export const UPDATE_SUBCATEGORIE = gql`
   mutation updateSubcategorie($subcategorie: CatalogInput!) {
      updateSubcategorie(subcategorie: $subcategorie) {
         status
         message
         subcategorie {
            ...SubcategorieObject
         }
      }
   }
   ${SUBCATEGORIE_FRAGMENT}
`;

export const BLOCK_SUBCATEGORIE = gql`
   mutation blockSubcategorie($id: ID!, $unblock: Boolean, $admin: Boolean) {
      blockSubcategorie(id: $id, unblock: $unblock, admin: $admin) {
         status
         message
      }
   }
`;
