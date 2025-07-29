import { Request } from "express";

export type AuthCookie = {
  accessToken: string;
};

export interface AuthRequest extends Request {
  auth: {
    sub: string;
    role: string;
    id?: string;
    tenant: string;
  };
}

export interface ProductMessage {
  _id: string,
  priceConfiguration: {
    priceType: "base" | "additional",
    availableOptions: {
      [key: string]: number
    }
  }
}

export interface cachedProduct {
  productId: string,
  priceConfiguration: Map<string, {
    priceType: 'base' | 'additional';
    availableOptions: Map<string, number>
  }>
}

export interface ToppingMessage {
  _id: string,
  price: number,
  tenantId: number
}

export interface cachedTopping {
  toppingId: string,
  price: number,
  tenantId: string
}


export type ProductAttribute = {
  name: string;
  value: string | boolean;
};

export interface ProductPriceConfiguration {
  [key: string]: {
    priceType: 'base' | 'additional';
    availableOptions: {
      [key: string]: number;
    };
  };
}

export interface PriceConfiguration {
  [key: string]: {
    priceType: "base" | "additional",
    availableOptions: string[]
  }
}



export interface Attribute {
  name: string
  widgetType: "switch" | "radio"
  defaultValue: string
  availableOptions: string[]
}

export interface Category {
  _id?: string
  name: string
  priceConfiguration: PriceConfiguration,
  attributes: Attribute[]
  hasToppings: boolean
}

export type Product = {
  _id: string;
  name: string;
  image: string;
  description: string;
  category: Category;
  priceConfiguration: ProductPriceConfiguration;
  attributes: ProductAttribute[];
  isPublish: boolean;
  createdAt: string;
  updatedAt: string
};

export type Topping = {
  _id: string
  name: string
  price: number
  image: string
  isPublished: boolean
}

export interface CartItem {
  product: Product
  chosenConfig: {
    priceConfig: {
      [key: string]: string
    }
    selectedToppings: Topping[]
  },
  hash?: string
  qty?: number
  pricePerUnit?: number
}