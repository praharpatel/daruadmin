import gql from 'graphql-tag';
import { TAG_FRAGMENT } from 'src/app/@graphql/operations/fragment/tag';

export const ADD_TAG = gql`
   mutation addTag($tag: CatalogInput!) {
      addTag(tag: $tag) {
         status
         message
         tag {
            ...TagObject
         }
      }
   }
   ${TAG_FRAGMENT}
`;

export const UPDATE_TAG = gql`
   mutation updateTag($tag: CatalogInput!) {
      updateTag(tag: $tag) {
         status
         message
         tag {
            ...TagObject
         }
      }
   }
   ${TAG_FRAGMENT}
`;

export const BLOCK_TAG = gql`
   mutation blockTag($id: ID!, $unblock: Boolean, $admin: Boolean) {
      blockTag(id: $id, unblock: $unblock, admin: $admin) {
         status
         message
      }
   }
`;
