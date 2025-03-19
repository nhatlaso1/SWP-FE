import { Voucher } from './../types/purchase';
import { Order, OrderDetail, PurchaseDetail, OrderCategory, SkinTypeWrapper } from "../types/purchase";
import { apiClient, apiEndpoints } from "./utils.api";

// Lấy danh sách đơn hàng của người dùng
export const getAllUserOrders = async (
  status: string | undefined,
  token: string
): Promise<Order[]> => {
  try {
    const url =
      status && status !== ""
        ? `${apiEndpoints.Order}/get-user-order?status=${status}`
        : `${apiEndpoints.Order}/get-user-order`;

    const response = await apiClient.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = response.data;
    const ordersArray = data?.$values || [];
    return ordersArray.map((order: any) => mapApiToOrder(order));
  } catch (error) {
    console.error("Error fetching user orders:", error);
    throw error;
  }
};

// Map API Order response -> Order interface
export const mapApiToOrder = (apiOrder: any): Order => {
  return {
    orderId: apiOrder.orderId,
    orderCode: apiOrder.orderCode,
    fullName: apiOrder.fullName || "Unknown",
    address: apiOrder.address,
    shippingPrice: apiOrder.shippingPrice,
    voucher: apiOrder.voucher ||  "None",
    phoneNumber: apiOrder.phoneNumber,
    totalAmount: apiOrder.totalAmount,
    paymentMethodName: apiOrder.paymentMethodName || "N/A",
    status: apiOrder.status,
    createdDate: apiOrder.createdDate,
    details: apiOrder.details?.$values?.map((detail: any) => mapApiToOrderDetail(detail)) || [],
  };
};

// Map API OrderDetail response -> OrderDetail interface
export const mapApiToOrderDetail = (apiDetail: any): OrderDetail => {
  return {
    orderDetailId: apiDetail.orderDetailId,
    productId: apiDetail.productId,
    productName: apiDetail.productName,
    size: apiDetail.size,
    quantity: apiDetail.quantity,
    price: apiDetail.price,
    discount: apiDetail.discount,
    productImage: apiDetail.productImage || "https://via.placeholder.com/100",
    category: {
      categoryId: apiDetail.category?.categoryId || 0,
      categoryName: apiDetail.category?.categoryName || "Unknown",
    } as OrderCategory,
    skinTypes: {
      $id: apiDetail.skinTypes?.$id || "",
      $values: apiDetail.skinTypes?.$values || [],
    } as SkinTypeWrapper,
  };
};

// Lấy thông tin chi tiết đơn hàng theo orderId
export const getPurchaseDetail = async (
  orderId: string,
  token: string
): Promise<PurchaseDetail> => {
  try {
    const url = `${apiEndpoints.Order}/get_order_by_id?orderId=${orderId}`;

    const response = await apiClient.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = response.data;
    console.log(data);
    return mapApiToPurchaseDetail(data);
  } catch (error) {
    console.error("Error fetching purchase detail:", error);
    throw error;
  }
};

export const mapApiToPurchaseDetail = (apiData: any): PurchaseDetail => {
  return {
    $id: apiData.$id,
    orderId: apiData.orderId,
    orderCode: apiData.orderCode,
    fullName: apiData.fullName,
    address: apiData.address,
    shippingPrice: apiData.shippingPrice,
    paymentMethodName: apiData.paymentMethodName,
    voucher: apiData.voucher
      ? {
        $id: apiData.voucher.$id || "",
        voucherId: apiData.voucher.voucherId || 0,
        voucherName: apiData.voucher.voucherName || "",
        voucherCode: apiData.voucher.voucherCode || "",
        description: apiData.voucher.description || "",
        discountAmount: apiData.voucher.discountAmount || 0,
        startDate: apiData.voucher.startDate || "",
        endDate: apiData.voucher.endDate || "",
        status: apiData.voucher.status ?? false,
        minimumPurchase: apiData.voucher.minimumPurchase || 0,
      }
      : {
        $id: "",
        voucherId: 0,
        voucherName: "",
        voucherCode: "",
        description: "",
        discountAmount: 0,
        startDate: "",
        endDate: "",
        status: false,
        minimumPurchase: 0
      },
    phoneNumber: apiData.phoneNumber,
    totalAmount: apiData.totalAmount,
    status: apiData.status,
    createdDate: apiData.createdDate,
    details: {
      $id: apiData.details?.$id || "",
      $values: apiData.details?.$values.map((detail: any) => detail) || [],
    },
  };
};

