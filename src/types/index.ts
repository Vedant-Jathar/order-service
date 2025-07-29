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

export interface ToppingMessage {
  _id: string,
  price: number,
  tenantId: number
}