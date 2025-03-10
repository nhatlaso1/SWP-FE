// Interface cho danh mục sản phẩm
export interface OrderCategory {
  categoryId: number;
  categoryName: string;
}

// Interface cho loại da phù hợp với sản phẩm
export interface SkinType {
  skinTypeId: number;
  skinTypeName: string;
}

// Wrapper cho danh sách loại da (do API trả về theo `$values`)
export interface SkinTypeWrapper {
  $id: string;
  $values: SkinType[];
}

// Interface cho OrderDetail (chi tiết đơn hàng)
export interface OrderDetail {
  orderDetailId: number;
  productId: number;
  productName: string;
  size: string;
  quantity: number;
  price: number;
  discount: number;
  productImage?: string;
  category: OrderCategory;
  skinTypes: SkinTypeWrapper;
}

// Wrapper cho trường `details` trong PurchaseDetail (do API trả về `$values`)
export interface OrderDetailWrapper {
  $id: string;
  $values: OrderDetail[];
}

// Interface cho Order (đơn hàng thông thường)
export interface Order {
  orderId: number;
  orderCode: string;
  fullName: string;
  address: string;
  phoneNumber: string;
  shippingPrice: number; // ✅ Thêm shippingPrice
  totalAmount: number;
  paymentMethodName: string;
  status: string;
  createdDate: string;
  details: OrderDetail[];
}

// Interface cho PurchaseDetail (đơn hàng chi tiết từ API)
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
