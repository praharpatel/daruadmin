import gql from 'graphql-tag';

export const PRODUCTSINGRAM_FRAGMENT = gql`
  fragment ProductsIngramObject on PricesIngram {
      productStatusMessage
      ingramPartNumber
      vendorPartNumber
      extendedVendorPartNumber
      upc
      vendorNumber
      vendorName
      description
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
