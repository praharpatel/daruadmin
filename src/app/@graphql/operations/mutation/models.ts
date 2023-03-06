import gql from 'graphql-tag';
import { MODEL_FRAGMENT } from 'src/app/@graphql/operations/fragment/model';

export const ADD_MODEL = gql`
   mutation addModel($model: CatalogInput!) {
      addModel(model: $model) {
         status
         message
         model {
            ...ModelObject
         }
      }
   }
   ${MODEL_FRAGMENT}
`;

export const UPDATE_MODEL = gql`
   mutation updateModel($model: CatalogInput!) {
      updateModel(model: $model) {
         status
         message
         model {
            ...ModelObject
         }
      }
   }
   ${MODEL_FRAGMENT}
`;

export const BLOCK_MODEL = gql`
   mutation blockModel($id: ID!, $unblock: Boolean, $admin: Boolean) {
      blockModel(id: $id, unblock: $unblock, admin: $admin) {
         status
         message
      }
   }
`;
