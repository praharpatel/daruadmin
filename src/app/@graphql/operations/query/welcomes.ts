import gql from 'graphql-tag';
import { WELCOME_FRAGMENT } from '../fragment/welcome';
import { RESULT_INFO_FRAGMENT } from '../fragment/result-info';

export const WELCOME_LIST_QUERY = gql`
  query welcomes($page: Int, $itemsPage: Int, $active: ActiveFilterEnum, $filterName: String) {
    welcomes(page: $page, itemsPage: $itemsPage, active: $active, filterName: $filterName) {
      info {
        ...ResultInfoObject
      }
      status
      message
      welcomes {
        ...WelcomeObject
      }
    }
  }
  ${WELCOME_FRAGMENT}
  ${RESULT_INFO_FRAGMENT}
`;

export const WELCOME_QUERY = gql`
   query welcome($include: Boolean!) {
      welcome{
         status
         message
         welcome {
            ...WelcomeObject
         }
      }
   }
   ${WELCOME_FRAGMENT}
`;

export const WELCOME_ID_QUERY = gql`
query {
   welcomeId{
      status
      message
      welcomeId
   }
}
`;
