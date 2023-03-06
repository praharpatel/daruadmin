import gql from 'graphql-tag';
import { MODEL_FRAGMENT } from '../fragment/model';
import { RESULT_INFO_FRAGMENT } from '../fragment/result-info';

export const MODELS_LIST_QUERY = gql`
  query modelList($page: Int, $itemsPage: Int, $active: ActiveFilterEnum, $filterName: String) {
    models(page: $page, itemsPage: $itemsPage, active: $active, filterName: $filterName) {
      info {
        ...ResultInfoObject
      }
      status
      message
      models {
        ...ModelObject
      }
    }
  }
  ${MODEL_FRAGMENT}
  ${RESULT_INFO_FRAGMENT}
`;

export const MODEL_DATA_QUERY = gql`
   query modelData($include: Boolean!) {
      model{
         status
         message
         model {
            ...ModelObject
         }
      }
   }
   ${MODEL_FRAGMENT}
`;

export const MODEL_ID_QUERY = gql`
query {
   modelId{
      status
      message
      modelId
   }
}
`;
