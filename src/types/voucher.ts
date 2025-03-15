export interface Voucher {
    voucherId: number;
    voucherName: string;
    voucherCode: string;
    description: string;
    discountAmount: number; // số tiền giảm giá (VND)
    startDate: string; // ISO Date String
    endDate: string; // ISO Date String
    status: boolean; // Trạng thái kích hoạt
    minimumPurchase: number; // Giá trị đơn hàng tối thiểu (VND)
}
