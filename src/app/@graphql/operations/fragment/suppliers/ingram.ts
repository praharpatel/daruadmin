import gql from 'graphql-tag';

export const PRODUCTSINGRAM_FRAGMENT = gql`
  fragment ProductsIngramObject on ResponsePricesIngram {
      productStatusMessage
      ingramPartNumber
      vendorPartNumber
      extendedVendorPartNumber
      upc
      vendorNumber
      vendorName
      description
      category
      subCategory
      newProduct
      productClass
      uom
      acceptBackOrder
      productAuthorized
      returnableProduct
      endUserInfoRequired
      govtSpecialPriceAvailable
      availability {
        available
        totalAvailability
        availabilityByWarehouse {
          warehouseId
          location
          quantityAvailable
          quantityBackordered
          backOrderInfo {
            quantity
            etaDate
          }
        }
      }
      pricing {
        mapPrice
        currencyCode
        retailPrice
        customerPrice
      }
      discounts {
        specialPricing {
          specialPricingAvailableQuantity
          specialPricingExpirationDate
          specialBidNumber
          specialPricingMinQuantity
          specialPricingEffectiveDate
          discountType
          specialPricingDiscount
          governmentDiscountType
          governmentDiscountedCustomerPrice
        }
        quantityDiscounts {
          currencyType
          amount
          quantity
          conditionType
          currencyCode
        }
      }
      bundlePartIndicator
      serviceFees {
        conditionType
        description
        amount
        endDate
        currencyCode
      }
  }
`;

export const CATALOGINGRAM_FRAGMENT = gql`
  fragment CatalogIngramObject on ResponseCatalogoIngram {
    changeCode
    imSKU
    vendorNumber
    vendorName
    descriptionLine1
    descriptionLine2
    retailPriceMSRP
    vendorPartNumber
    weight
    upcCode
    length
    width
    height
    customerCostChangeCode
    customerCost
    specialPricingChangeCode
    stockAvailableYN
    partStatus
    allianceProduct
    cpuCode
    mediaCode
    ingramCatSubcategory
    yIfPartStockedAtIM
    rebateAppliedToCostYN
    substituteIMPartNumber
  }
`;
