import gql from 'graphql-tag';
import { CONFIG_FRAGMENT } from '../fragment/config';

export const ADD_CONFIG = gql`
   mutation addConfig($config: ConfigInput!) {
      addConfig(config: $config) {
         status
         message
         config {
            ...ConfigObject
         }
      }
   }
   ${CONFIG_FRAGMENT}
`;

export const UPDATE_CONFIG = gql`
   mutation updateConfig($config: ConfigInput!) {
      updateConfig(config: $config) {
         status
         message
         config {
            ...ConfigObject
         }
      }
   }
   ${CONFIG_FRAGMENT}
`;

export const BLOCK_CONFIG = gql`
   mutation blockConfig($id: ID!, $unblock: Boolean, $admin: Boolean) {
      blockConfig(id: $id, unblock: $unblock, admin: $admin) {
         status
         message
      }
   }
`;
