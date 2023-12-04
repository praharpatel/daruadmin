export class ProductIngram {
  productStatusMessage: string;
  ingramPartNumber: string;
  vendorPartNumber: string;
  extendedVendorPartNumber: string;
  upc: string;
  vendorNumber: string;
  vendorName: string;
  description: string;
  productClass: string;
  uom: string;
  acceptBackOrder: boolean;
  productAuthorized: boolean;
  returnableProduct: boolean;
  endUserInfoRequired: boolean;
  govtSpecialPriceAvailable: boolean;
  availability: {
    available: boolean;
    totalAvailability: number;
    availabilityByWarehouse: AvailabilityByWarehouse[];
  };
  pricing: {
    mapPrice: number;
    currencyCode: string;
    retailPrice: number;
    customerPrice: number;
  };
  discounts: {
    specialPricing: SpecialPricing[];
    quantityDiscounts: QuantityDiscounts[];
  };
  bundlePartIndicator: string;
  serviceFees: ServiceFees[];
}

export class AvailabilityByWarehouse {
  warehouseId: number;
  location: string;
  quantityAvailable: number;
  quantityBackordered: number;
  backOrderInfo?: {
    quantity: number;
    etaDate: string;
  }
}

export class SpecialPricing {
  specialPricingAvailableQuantity: number;
  specialPricingExpirationDate: string;
  specialBidNumber: string;
  specialPricingMinQuantity: number;
  specialPricingEffectiveDate: string;
  discountType: string;
  specialPricingDiscount: number;
  governmentDiscountType: string;
  governmentDiscountedCustomerPrice: number;
}

export class QuantityDiscounts {
  currencyType: string;
  amount: number;
  quantity: number;
  conditionType: string;
  currencyCode: string;
}

export class ServiceFees {
  conditionType: string;
  description: string;
  amount: string;
  endDate: string;
  currencyCode: string;
}
