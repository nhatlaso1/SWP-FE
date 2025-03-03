// types/Order.ts

// Interface cho 1 Order Detail (chi tiết đơn hàng)
export interface OrderDetail {
    orderDetailId: number;
    productId: number;
    productName: string;
    size: string;
    quantity: number;
    price: number;
    discount: number;
    productImage?: string; // optional, bổ sung nếu API trả về image
  }
  
  // Interface cho 1 Order (đơn hàng)
  export interface Order {
    orderId: number;
    totalAmount: number;
    status: string;
    createdDate: string;
    address?: string;
    phoneNumber?: string;
    details: OrderDetail[];
  }
  