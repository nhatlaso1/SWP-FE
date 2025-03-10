import { Order, OrderDetail, PurchaseDetail } from "../types/purchase";
import { apiClient, apiEndpoints } from "./utils.api";

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


export const mapApiToOrder = (apiOrder: any): Order => {
  return {
    orderId: apiOrder.orderId,
    orderCode: apiOrder.orderCode, // Sửa lại đúng tên trường
    fullName: apiOrder.fullName || "Unknown", // Thêm fullName
    address: apiOrder.address,
    phoneNumber: apiOrder.phoneNumber,
    totalAmount: apiOrder.totalAmount,
    paymentMethodName: apiOrder.paymentMethodName || "N/A", // Thêm paymentMethodName
    status: apiOrder.status,
    createdDate: apiOrder.createdDate,
    details:
      apiOrder.details?.$values?.map((detail: any) => ({
        orderDetailId: detail.orderDetailId,
        productId: detail.productId,
        productName: detail.productName,
        size: detail.size,
        quantity: detail.quantity,
        price: detail.price,
        discount: detail.discount,
        productImage: detail.productImage || "https://via.placeholder.com/100",
      })) || [],
  };
};


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
    phoneNumber: apiData.phoneNumber,
    totalAmount: apiData.totalAmount,
    status: apiData.status,
    createdDate: apiData.createdDate,
    details: {
      $id: apiData.details.$id,
      $values: apiData.details.$values.map((detail: any): OrderDetail => ({
        orderDetailId: detail.orderDetailId,
        productId: detail.productId,
        productName: detail.productName,
        size: detail.size,
        quantity: detail.quantity,
        price: detail.price,
        discount: detail.discount,
        productImage: detail.productImage || "https://via.placeholder.com/100",
      })),
    },
  };
};