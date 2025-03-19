import axios from 'axios';

const API_URL = 'https://beautysc-api.purpleforest-f01817f2.southeastasia.azurecontainerapps.io/api';

// Helper function to get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Helper function to create config with auth header
const createAuthConfig = (additionalConfig = {}) => {
  const token = getAuthToken();
  return {
    ...additionalConfig,
    headers: {
      ...additionalConfig.headers,
      Authorization: `Bearer ${token}`
    }
  };
};

export const getAllOrders = async (status) => {
  try {
    const apiStatus = status === 'Cancelled' ? 'Cancel' : status;
    console.log(`Fetching orders with status: ${apiStatus}`);
    //  const response = await axios.get(`${API_URL}/Order/get_all_order`, {

    const config = createAuthConfig({
      params: apiStatus ? { status: apiStatus } : {}
    });

    const response = await axios.get(`${API_URL}/Order/get_all_order`, config);

    console.log('API Response:', response.data);

    if (!response.data || !response.data.$values) {
      console.log('No $values in response data');
      return [];
    }

    const orders = response.data.$values.map(order => ({
      orderId: order.orderId,
      totalAmount: order.totalAmount,
      status: order.status,
      createdDate: order.createdDate,
      details: (order.details?.$values || []).map(detail => ({
        orderDetailId: detail.orderDetailId,
        productId: detail.productId,
        productName: detail.productName,
        size: detail.size,
        quantity: detail.quantity,
        price: detail.price,
        discount: detail.discount
      }))
    }));

    console.log(`Found ${orders.length} orders with status:`, apiStatus);
    return orders;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

export const updateOrderStatus = async (orderId, newStatus) => {
  try {
    let endpoint;
    const apiStatus = newStatus === 'Cancelled' ? 'Cancel' : newStatus;
    switch (apiStatus) {
      case 'Shipping':
        endpoint = `${API_URL}/Order/shipping/${orderId}`;
        break;
      case 'Complete':
        endpoint = `${API_URL}/Order/complete/${orderId}`;
        break;
      case 'Cancel':
        endpoint = `${API_URL}/Order/cancel/${orderId}`;
        break;
      default:
        throw new Error('Invalid status');
    }
    // await axios.put(endpoint);

    await axios.put(endpoint, null, createAuthConfig());
  } catch (error) {
    throw error;
  }
};

export const updateOrderStatusDirect = async (orderId, newStatus) => {
  try {
    //    const response = await axios.put(`${API_URL}/Order/update-status/${orderId}`, {
    // status: newStatus
    // });

    const response = await axios.put(
      `${API_URL}/Order/update-status/${orderId}`,
      { status: newStatus },
      createAuthConfig()
    );
    if (response.status === 200) {
      console.log(`Successfully updated order ${orderId} to status ${newStatus}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};

export const getOrderStatuses = () => {
  return ['Pending', 'Shipping', 'Complete', 'Cancelled'];
};

export const completeOrder = async (orderId) => {
  try {
    // const response = await axios.patch(`${API_URL}/Order/complete-order`, null, {
    //  params: { orderId }
    // });

    const response = await axios.patch(
      `${API_URL}/Order/complete-order`,
      null,
      createAuthConfig({ params: { orderId } })
    );
    return response.status === 200;
  } catch (error) {
    console.error('Error completing order:', error);
    throw error;
  }
};

export const cancelOrder = async (orderId) => {
  try {
    //const response = await axios.patch(`${API_URL}/Order/cancel-order`, null, {
    // params: { orderId }
    // });

    const response = await axios.patch(
      `${API_URL}/Order/cancel-order`,
      null,
      createAuthConfig({ params: { orderId } })
    );
    return response.status === 200;
  } catch (error) {
    console.error('Error canceling order:', error);
    throw error;
  }
};

export const denyOrder = async (orderId) => {
  try {
    console.log('Denying order:', orderId);
    const response = await axios.patch(
      `${API_URL}/Order/deny-order`,
      null,
      createAuthConfig({ params: { orderId } })
    );
    console.log('Deny order response:', response);
    return response.status === 200;
  } catch (error) {
    console.error('Error denying order:', error);
    throw error;
  }
};

export const confirmOrder = async (orderId) => {
  try {
    // const response = await axios.patch(`${API_URL}/Order/confirm-order`, null, {
    //   params: { orderId }
    // });

    const response = await axios.patch(
      `${API_URL}/Order/confirm-order`,
      null,
      createAuthConfig({ params: { orderId } })
    );
    return response.status === 200;
  } catch (error) {
    console.error('Error confirming order:', error);
    throw error;
  }
};

export const shippingOrder = async (orderId) => {
  try {
    //const response = await axios.patch(`${API_URL}/Order/shipping-order`, null, {
    //  params: { orderId }
    //});

    const response = await axios.patch(
      `${API_URL}/Order/shipping-order`,
      null,
      createAuthConfig({ params: { orderId } })
    );
    return response.status === 200;
  } catch (error) {
    console.error('Error shipping order:', error);
    throw error;
  }
};

export const returnOrder = async (orderId) => {
  try {
    //const response = await axios.patch(`${API_URL}/Order/return-order`, null, {
    //  params: { orderId }
    //});

    const response = await axios.patch(
      `${API_URL}/Order/return-order`,
      null,
      createAuthConfig({ params: { orderId } })
    );
    return response.status === 200;
  } catch (error) {
    console.error('Error returning order:', error);
    throw error;
  }
};

export const approveOrder = async (orderId) => {
  try {
    //    const response = await axios.patch(`${API_URL}/Order/approve/${orderId}`);

    const response = await axios.patch(
      `${API_URL}/Order/approve/${orderId}`,
      null,
      createAuthConfig()
    );
    return response.status === 200;
  } catch (error) {
    console.error('Error approving order:', error);
    throw error;
  }
};

export const rejectOrder = async (orderId) => {
  try {
    //    const response = await axios.patch(`${API_URL}/Order/reject/${orderId}`);

    const response = await axios.patch(
      `${API_URL}/Order/reject/${orderId}`,
      null,
      createAuthConfig()
    );
    return response.status === 200;
  } catch (error) {
    console.error('Error rejecting order:', error);
    throw error;
  }
};

export const getOrderById = async (orderId) => {
  try {
    //    const response = await axios.get(`${API_URL}/Order/get_order_by_id`, {

    const config = createAuthConfig({
      params: { orderId }
    });

    const response = await axios.get(`${API_URL}/Order/get_order_by_id`, config);

    if (!response.data) {
      throw new Error('No data received from the API');
    }

    const order = response.data;
    return {
      orderId: order.orderId,
      orderCode: order.orderCode,
      fullName: order.fullName,
      address: order.address,
      phoneNumber: order.phoneNumber,
      shippingPrice: order.shippingPrice,
      totalAmount: order.totalAmount,
      paymentMethodName: order.paymentMethodName,
      status: order.status,
      createdDate: order.createdDate,
      details: (order.details?.$values || []).map(detail => ({
        orderDetailId: detail.orderDetailId,
        productId: detail.productId,
        productName: detail.productName,
        productImage: detail.productImage,
        size: detail.size,
        quantity: detail.quantity,
        price: detail.price,
        discount: detail.discount,
        category: detail.category,
        skinTypes: detail.skinTypes?.$values || []
      }))
    };
  } catch (error) {
    console.error('Error fetching order details:', error);
    throw error;
  }
};


