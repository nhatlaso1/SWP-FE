import { Order } from "../types/purchase";
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
    totalAmount: apiOrder.totalAmount,
    status: apiOrder.status,
    createdDate: apiOrder.createdDate,
    address: apiOrder.address,
    phoneNumber: apiOrder.phoneNumber,
    details: apiOrder.details?.$values?.map((detail: any) => ({
      orderDetailId: detail.orderDetailId,
      productId: detail.productId,
      productName: detail.productName,
      size: detail.size,
      quantity: detail.quantity,
      price: detail.price,
      discount: detail.discount,
      // Nếu API không trả về image, ta gán URL mặc định:
      productImage: detail.productImage || "https://via.placeholder.com/100",
    })) || [],
  };
};
