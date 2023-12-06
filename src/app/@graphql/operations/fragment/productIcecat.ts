import gql from 'graphql-tag';

export const PRODUCT_ICECAT_FRAGMENT = gql`
  fragment ProductIcecatObject on ProductIcecatObject {
      Requested_prod_id
      Requested_GTIN_EAN_UPC
      Requested_Icecat_id
      Supplier
      Prod_id
      Icecat_id
      GTIN_EAN_UPC
      Category
      CatId
      Model
      Updated
      Quality
      On_Market
      Product_Views
      HighPic
      HighPic_Resolution
      LowPic
      Pic500x500
      ThumbPic
      Folder_PDF
      ProductTitle
      ShortDesc
      ShortSummaryDescription
      LongSummaryDescription
      LongDesc
      ProductGallery
      ProductGallery_Resolution
      ProductGallery_ExpirationDate
      BulletPoints
      Your_product_ID
  }
`;
