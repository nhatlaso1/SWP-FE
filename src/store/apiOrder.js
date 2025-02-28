import axios from 'axios';

const API_URL = 'https://localhost:7130/api';

export const getAllOrders = async (status) => {
  try {
    const response = await axios.get(`${API_URL}/Order/get_all_order`, {
      params: { status }
    });
    
    // Transform the response to remove the $id and $values structure
    const orders = response.data.$values.map(order => ({
      orderId: order.orderId,
      totalAmount: order.totalAmount,
      status: order.status,
      createdDate: order.createdDate,
      details: order.details.$values.map(detail => ({
        orderDetailId: detail.orderDetailId,
        productId: detail.productId,
        productName: detail.productName,
        size: detail.size,
        quantity: detail.quantity,
        price: detail.price,
        discount: detail.discount
      }))
    }));

    return orders;
  } catch (error) {
    throw error;
  }
};

export const completeOrder = async (orderId) => {
  try {
    await axios.put(`${API_URL}/Order/complete/${orderId}`);
  } catch (error) {
    throw error;
  }
};

export const cancelOrder = async (orderId) => {
  try {
    await axios.put(`${API_URL}/Order/cancel/${orderId}`);
  } catch (error) {
    throw error;
  }
};

export const getOrderStatuses = () => {
  return [
    'Complete'
  ];
};
