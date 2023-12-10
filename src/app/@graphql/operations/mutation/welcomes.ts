import gql from 'graphql-tag';
import { WELCOME_FRAGMENT } from '../fragment/welcome';

export const ADD_WELCOME = gql`
   mutation addWelcome($welcome: WelcomeInput!) {
      addWelcome(welcome: $welcome) {
         status
         message
         welcome {
            ...WelcomeObject
         }
      }
   }
   ${WELCOME_FRAGMENT}
`;

export const UPDATE_WELCOME = gql`
   mutation updateWelcome($welcome: WelcomeInput!) {
      updateWelcome(welcome: $welcome) {
         status
         message
         welcome {
            ...WelcomeObject
         }
      }
   }
   ${WELCOME_FRAGMENT}
`;

export const BLOCK_WELCOME = gql`
   mutation blockWelcome($id: ID!, $unblock: Boolean, $admin: Boolean) {
      blockWelcome(id: $id, unblock: $unblock, admin: $admin) {
         status
         message
      }
   }
`;

export const DELETE_WELCOME = gql`
   mutation deleteWelcome($id: ID!) {
      deleteWelcome(id: $id) {
         status
         message
      }
   }
`;
