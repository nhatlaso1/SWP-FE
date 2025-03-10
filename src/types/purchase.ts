// Interface cho 1 Order Detail (chi tiết đơn hàng)
export interface OrderDetail {
  orderDetailId: number;
  productId: number;
  productName: string;
  size: string;
  quantity: number;
  price: number;
  discount: number;
  productImage?: string;
}

// Interface cho 1 Order (đơn hàng)
export interface Order {
  orderId: number;
  orderCode: string;
  fullName: string;
  address?: string;
  phoneNumber?: string;
  totalAmount: number;
  paymentMethodName: string;
  status: string;
  createdDate: string;
  details: OrderDetail[];
}

// Interface cho 1 Order Detail (chi tiết đơn hàng)
export interface OrderDetail {
  orderDetailId: number;
  productId: number;
  productName: string;
  size: string;
  quantity: number;
  price: number;
  discount: number;
  productImage?: string;
}

// Wrapper cho trường details trong PurchaseDetail (do API trả về theo cấu trúc $values)
export interface OrderDetailWrapper {
  $id: string;
  $values: OrderDetail[];
}

// Interface cho PurchaseDetail (đơn hàng chi tiết)
export interface PurchaseDetail {
  $id: string;
  orderId: number;
  orderCode: string;
  fullName: string;
  address: string;
  phoneNumber: string;
  totalAmount: number;
  status: string;
  createdDate: string;
  details: OrderDetailWrapper;
}

