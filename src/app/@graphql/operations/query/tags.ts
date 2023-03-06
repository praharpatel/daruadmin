import gql from 'graphql-tag';
import { TAG_FRAGMENT } from '../fragment/tag';
import { RESULT_INFO_FRAGMENT } from '../fragment/result-info';

export const TAGS_LIST_QUERY = gql`
  query tagList($page: Int, $itemsPage: Int, $active: ActiveFilterEnum, $filterName: String) {
    tags(page: $page, itemsPage: $itemsPage, active: $active, filterName: $filterName) {
      info {
        ...ResultInfoObject
      }
      status
      message
      tags {
        ...TagObject
      }
    }
  }
  ${TAG_FRAGMENT}
  ${RESULT_INFO_FRAGMENT}
`;

export const TAG_DATA_QUERY = gql`
   query tagData($include: Boolean!) {
      tag{
         status
         message
         tag {
            ...TagObject
         }
      }
   }
   ${TAG_FRAGMENT}
`;

export const TAG_ID_QUERY = gql`
query {
   tagId{
      status
      message
      tagId
   }
}
`;
