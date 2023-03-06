import gql from 'graphql-tag';
import { SUBCATEGORIE_FRAGMENT } from '../fragment/subcategorie';
import { RESULT_INFO_FRAGMENT } from '../fragment/result-info';

export const SUBCATEGORIES_LIST_QUERY = gql`
  query subcategorieList($page: Int, $itemsPage: Int, $active: ActiveFilterEnum, $filterName: String) {
    subcategories(page: $page, itemsPage: $itemsPage, active: $active, filterName: $filterName) {
      info {
        ...ResultInfoObject
      }
      status
      message
      subcategories {
        ...SubcategorieObject
      }
    }
  }
  ${SUBCATEGORIE_FRAGMENT}
  ${RESULT_INFO_FRAGMENT}
`;

export const CATEGORIE_DATA_QUERY = gql`
   query subcategorieData($include: Boolean!) {
    subcategorie{
         status
         message
         subcategorie {
            ...SubcategorieObject
         }
      }
   }
   ${SUBCATEGORIE_FRAGMENT}
`;

export const SUBCATEGORIE_ID_QUERY = gql`
query {
   subcategorieId{
      status
      message
      subcategorieId
   }
}
`;
