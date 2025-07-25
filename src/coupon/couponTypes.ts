export interface Coupon {
    title: string,
    code: string,
    validUpto: Date,
    discount: number,
    tenantId: string
}