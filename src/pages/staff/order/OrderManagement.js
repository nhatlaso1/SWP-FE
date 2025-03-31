import React, { useState, useEffect, useRef } from 'react';

import { useNavigate } from 'react-router-dom';



import {

  Box,

  Typography,

  Table,

  TableBody,

  TableCell,

  TableContainer,

  TableHead,

  TableRow,

  Paper,

  Breadcrumbs,

  Link,

  Grid,

  Button,

  Menu,

  MenuItem,

  Dialog,

  DialogTitle,

  DialogContent,

  DialogActions,

  Snackbar,

  Alert,

  Card,

  CardMedia,

  Chip,

  Stack,

  Pagination,

} from '@mui/material';



import { getAllOrders, updateOrderStatusDirect, completeOrder, cancelOrder, denyOrder, confirmOrder, shippingOrder, returnOrder, approveOrder, rejectOrder, getOrderById } from '../../../store/apiOrder';



const OrderManagement = () => {

  const [orders, setOrders] = useState([]);

  const [selectedOrder, setSelectedOrder] = useState(null);

  const [anchorEl, setAnchorEl] = useState(null);

  const [confirmDialog, setConfirmDialog] = useState({ open: false, status: null });

  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

  const [isDetailDialogOpen, setDetailDialogOpen] = useState(false);

  const [rejectConfirmDialog, setRejectConfirmDialog] = useState({ open: false, orderId: null });

  const [lastViewedOrderId, setLastViewedOrderId] = useState(null);

  const orderRowRefs = useRef({});

  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);

  const [ordersPerPage, setOrdersPerPage] = useState(10);



  useEffect(() => {

    fetchOrders();

    const intervalId = setInterval(() => {

      fetchOrders();

    }, 60000);



    return () => clearInterval(intervalId);

  }, []);



  const fetchOrders = async () => {

    try {

      console.log('Fetching all orders');

      const allOrders = await getAllOrders();



      setOrders(allOrders);

    } catch (error) {

      console.error('Error fetching orders:', error);

      setNotification({

        open: true,

        message: 'Cannot load order list. Please try again later.',

        severity: 'error'

      });

    }

  };



  const handleAutoConfirm = async (orderId) => {

    try {

      const success = await confirmOrder(orderId);

      if (success) {

        setNotification({

          open: true,

          message: 'Order automatically confirmed due to successful online payment',

          severity: 'success'

        });

      }

    } catch (error) {

      console.error('Error auto-confirming order:', error);

    }

  };



  const handleAutoCancel = async (orderId) => {

    try {

      const success = await cancelOrder(orderId);

      if (success) {

        setNotification({

          open: true,

          message: 'Order automatically cancelled due to payment timeout',

          severity: 'warning'

        });

      }

    } catch (error) {

      console.error('Error auto-cancelling order:', error);

    }

  };



  const handleRowClick = async (order) => {

    try {

      const detailedOrder = await getOrderById(order.orderId);

      setLastViewedOrderId(order.orderId);

      setSelectedOrder(detailedOrder);

    } catch (error) {

      console.error('Error fetching order details:', error);

      setNotification({ open: true, message: 'Không thể tải chi tiết đơn hàng. Vui lòng thử lại sau.', severity: 'error' });

    }

  };



  const handleBackToList = () => {

    setSelectedOrder(null);

    setTimeout(() => {

      if (lastViewedOrderId && orderRowRefs.current[lastViewedOrderId]) {

        orderRowRefs.current[lastViewedOrderId].scrollIntoView({

          behavior: 'smooth',

          block: 'center'

        });

      }

    }, 100);

  };



  const handleCloseDetail = () => {

    setSelectedOrder(null);

    setDetailDialogOpen(false);

  };



  const handleCloseNotification = (event, reason) => {

    if (reason === 'clickaway') {

      return;

    }

    setNotification({ ...notification, open: false });

  };



  const handleStatusSelect = (newStatus) => {

    setConfirmDialog({ open: true, status: newStatus });

  };



  const handleStatusChange = async (newStatus, orderId = null) => {

    try {

      const targetOrderId = orderId || (selectedOrder ? selectedOrder.orderId : null);

      if (!targetOrderId) {

        setNotification({

          open: true,

          message: 'No order selected',

          severity: 'error'

        });

        return;

      }



      let updatedStatus;

      let targetOrder = orderId

        ? orders.find(order => order.orderId === orderId)

        : selectedOrder;



      const currentStatus = targetOrder.status;

      console.log('Current status:', currentStatus);

      console.log('New status:', newStatus);

      console.log('Target order:', targetOrder);



      if (currentStatus === 'Pending') {

        const paymentMethodId = targetOrder.paymentMethodId ||

          (targetOrder.paymentMethodName && targetOrder.paymentMethodName.toLowerCase().includes('cod') ? 1 : 2);



        console.log('Payment method:', paymentMethodId);



        if (newStatus === 'Confirmed') {

          const success = await confirmOrder(targetOrderId);

          if (success) {

            updatedStatus = 'Confirmed';

            if (paymentMethodId === 2 ||

              (targetOrder.paymentMethodName && !targetOrder.paymentMethodName.toLowerCase().includes('cod'))) {

              targetOrder = { ...targetOrder, isPaid: true };

            }

          }

        } else if (newStatus === 'Denied') {

          console.log('Attempting to deny order:', targetOrderId);

          const success = await denyOrder(targetOrderId);

          console.log('Deny order result:', success);

          if (success) {

            updatedStatus = 'Denied';

          }

        } else if (newStatus === 'Cancel') {

          const success = await cancelOrder(targetOrderId);

          if (success) {

            updatedStatus = 'Cancel';

          }

        }

      } else if (currentStatus === 'Confirmed') {

        if (newStatus === 'Shipping') {

          const success = await shippingOrder(targetOrderId);

          if (success) {

            updatedStatus = 'Shipping';

          }

        } else if (newStatus === 'Cancel') {

          const success = await cancelOrder(targetOrderId);

          if (success) {

            updatedStatus = 'Cancel';

          }

        }

      } else if (currentStatus === 'Shipping') {

        if (newStatus === 'Returned') {

          const success = await returnOrder(targetOrderId);

          if (success) {

            updatedStatus = 'Returned';

          }

        } else if (newStatus === 'Complete') {

          const success = await completeOrder(targetOrderId);

          if (success) {

            updatedStatus = 'Complete';

          }

        }

      }



      if (updatedStatus) {

        if (selectedOrder && selectedOrder.orderId === targetOrderId) {

          setSelectedOrder(prev => ({ ...prev, status: updatedStatus }));

        }



        setOrders(prevOrders =>

          prevOrders.map(order =>

            order.orderId === targetOrderId

              ? { ...order, status: updatedStatus }

              : order

          )

        );



        setNotification({

          open: true,

          message: `Order status has been updated to ${getDisplayStatus(updatedStatus)}!`,

          severity: 'success'

        });



        await fetchOrders();

      } else {

        throw new Error('Status update was not successful');

      }

    } catch (error) {

      console.error('Error in handleStatusChange:', error);

      setNotification({

        open: true,

        message: `Failed to update order status: ${error.message}`,

        severity: 'error'

      });

    }

  };



  const getStatusText = (status) => {

    switch (status) {

      case 'Pending':

        return 'Pending (Chờ xử lý)';

      case 'Shipping':

        return 'Delivery (Đang giao hàng)';

      case 'Complete':

        return 'Complete (Hoàn thành)';

      case 'Cancel':

        return 'Cancelled (Đã hủy)';

      case 'Denied':

        return 'Reject (Từ chối đơn hàng)';

      case 'Confirmed':

        return 'Approve (Đã xác nhận)';

      case 'Returned':

        return 'Return (Trả hàng)';

      default:

        return status;

    }

  };



  const getDisplayStatus = (status) => {

    switch (status) {

      case 'Shipping':

        return 'Delivery';

      case 'Denied':

        return 'Reject';

      case 'Confirmed':

        return 'Approve';

      default:

        return status;

    }

  };



  const getStatusDescription = (status) => {

    switch (status) {

      case 'Pending':

        return 'Trạng thái ban đầu khi đơn hàng được tạo';

      case 'Shipping':

        return 'Đơn hàng đang trong quá trình giao hàng';

      case 'Complete':

        return 'Đơn hàng đã được giao thành công đến khách hàng';

      case 'Cancel':

        return 'Đơn hàng đã bị hủy';

      case 'Denied':

        return 'Đơn hàng đã bị từ chối';

      case 'Confirmed':

        return 'Đơn hàng đã được xác nhận và sẵn sàng để giao hàng';

      case 'Returned':

        return 'Đơn hàng đã được trả lại do khách hàng từ chối nhận hoặc có vấn đề';

      default:

        return '';

    }

  };



  const getAvailableStatuses = (currentStatus, paymentMethodId) => {

    // Default to payment method 1 (COD) if not specified

    const isCOD = paymentMethodId === 1 || paymentMethodId === undefined;



    switch (currentStatus) {

      case 'Pending':

        // For COD (paymentMethodId = 1), show Confirmed and Denied

        // For VNPay (paymentMethodId = 2), show Cancel

        return isCOD ? ['Confirmed', 'Denied'] : ['Cancel'];

      case 'Confirmed':

        return ['Shipping', 'Cancel'];

      case 'Shipping':

        return ['Returned', 'Complete'];

      case 'Returned':

        return [];

      case 'Denied':

      case 'Cancel':

      case 'Complete':

        return [];

      default:

        return [];

    }

  };



  const handleStatusClose = () => {

    setAnchorEl(null);

  };



  const totalAmount = selectedOrder?.details.reduce((total, detail) => {
    // Calculate price after discount for each item
    const priceAfterDiscount = detail.price * (1 - detail.discount);
    return total + (priceAfterDiscount * detail.quantity);
  }, 0) || 0;



  // Add shipping fee to total
  const finalTotalAmount = totalAmount + (selectedOrder?.shippingPrice || 0);



  const OrderInformationCard = ({ selectedOrder }) => (

    <Card sx={{ p: 2 }}>

      <Typography variant="h6" gutterBottom>Order Information</Typography>

      <Stack spacing={1}>

        {[

          { label: 'Order Code', value: selectedOrder.orderCode },

          { label: 'Order Date', value: new Date(selectedOrder.createdDate).toLocaleString() },

          { label: 'Status', value: getStatusText(selectedOrder.status) },

          { label: 'Payment Method', value: selectedOrder.paymentMethodName || 'N/A' },

          { label: 'Shipping Fee', value: selectedOrder.shippingPrice.toLocaleString() + 'đ' },

          { label: 'Total Amount', value: finalTotalAmount.toLocaleString() + 'đ' }

        ].map((item, index) => (

          <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

            <Typography variant="body2" color="text.secondary">{item.label}:</Typography>

            <Typography variant="body1">{item.value}</Typography>

          </Box>

        ))}

      </Stack>

    </Card>

  );



  const handleRejectOrder = async (orderId) => {
    setRejectConfirmDialog({ open: true, orderId });
  };

  const handleConfirmReject = async () => {
    try {
      const success = await denyOrder(rejectConfirmDialog.orderId);
      if (success) {
        setNotification({
          open: true,
          message: 'Order has been rejected successfully',
          severity: 'success'
        });
        await fetchOrders();
        if (selectedOrder && selectedOrder.orderId === rejectConfirmDialog.orderId) {
          setSelectedOrder(prev => ({ ...prev, status: 'Denied' }));
        }
      }
    } catch (error) {
      console.error('Error rejecting order:', error);
      setNotification({
        open: true,
        message: 'Failed to reject order. Please try again.',
        severity: 'error'
      });
    } finally {
      setRejectConfirmDialog({ open: false, orderId: null });
    }
  };

  const handleCloseRejectDialog = () => {
    setRejectConfirmDialog({ open: false, orderId: null });
  };



  const paginatedOrders = orders.slice((currentPage - 1) * ordersPerPage, currentPage * ordersPerPage);



  return (

    <Box p={3}>

      <Breadcrumbs aria-label="breadcrumb">

        <Link color="inherit" onClick={handleBackToList} sx={{ cursor: 'pointer' }}>

          Order Management

        </Link>

        {selectedOrder && <Typography color="text.primary">Order Detail</Typography>}

      </Breadcrumbs>



      {!selectedOrder ? (

        <Grid container spacing={2}>

          <Grid item xs={12}>

            <TableContainer component={Paper}>

              <Table>

                <TableHead>

                  <TableRow>

                    <TableCell>Order ID</TableCell>

                    <TableCell>Order Date</TableCell>

                    <TableCell>Total Amount</TableCell>

                    <TableCell>Status</TableCell>

                  </TableRow>

                </TableHead>

                <TableBody>

                  {paginatedOrders.map(order => (

                    <TableRow
                      key={order.orderId}
                      sx={{
                        cursor: 'pointer',
                        bgcolor: lastViewedOrderId === order.orderId ? 'action.hover' : 'inherit'
                      }}
                      ref={el => orderRowRefs.current[order.orderId] = el}
                    >

                      <TableCell onClick={() => handleRowClick(order)}>{order.orderId}</TableCell>

                      <TableCell onClick={() => handleRowClick(order)}>{new Date(order.createdDate).toLocaleDateString()}</TableCell>

                      <TableCell onClick={() => handleRowClick(order)}>{order.totalAmount.toLocaleString()}đ</TableCell>

                      <TableCell onClick={() => handleRowClick(order)}>{getStatusText(order.status)}</TableCell>

                    </TableRow>

                  ))}

                </TableBody>

              </Table>

            </TableContainer>

          </Grid>

          <Grid item xs={12}>

            <Pagination
              count={Math.ceil(orders.length / ordersPerPage)}
              page={currentPage}
              onChange={(event, value) => setCurrentPage(value)}
              color="primary"
            />

          </Grid>

        </Grid>

      ) : (

        <Box>

          <Typography variant="h6" gutterBottom>Order Details #{selectedOrder.orderCode}</Typography>

          <Grid container spacing={3}>

            <Grid item xs={12} md={6}>

              <OrderInformationCard selectedOrder={selectedOrder} />

            </Grid>

            <Grid item xs={12} md={6}>

              <Card sx={{ p: 2 }}>

                <Typography variant="h6" gutterBottom>Customer Information</Typography>

                <Stack spacing={1}>

                  {[

                    { label: 'Full Name', value: selectedOrder.fullName },

                    { label: 'Phone Number', value: selectedOrder.phoneNumber },

                    { label: 'Address', value: selectedOrder.address },

                    { label: 'Payment Method', value: selectedOrder.paymentMethodName || 'N/A' }

                  ].map((item, index) => (

                    <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

                      <Typography variant="body2" color="text.secondary">{item.label}:</Typography>

                      <Typography variant="body1">{item.value}</Typography>

                    </Box>

                  ))}

                </Stack>

              </Card>

            </Grid>

            <Grid item xs={12}>

              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>

                {selectedOrder.status === 'Pending' && (

                  <Box>

                    {(selectedOrder.paymentMethodId === 1 ||

                      (selectedOrder.paymentMethodName && selectedOrder.paymentMethodName.toLowerCase().includes('cod'))) ? (

                      <>

                        <Button onClick={() => handleRejectOrder(selectedOrder.orderId)} variant="contained" color="error" sx={{ mr: 1 }}>

                          Reject

                        </Button>

                        <Button onClick={() => handleStatusChange('Confirmed', selectedOrder.orderId)} variant="contained" color="primary">

                          Approve

                        </Button>

                      </>

                    ) : (

                      <Button onClick={() => handleStatusChange('Cancel', selectedOrder.orderId)} variant="contained" color="error">

                        Cancel

                      </Button>

                    )}

                  </Box>

                )}

                {selectedOrder.status === 'Confirmed' && (

                  <Box>

                    <Button onClick={() => handleStatusChange('Shipping', selectedOrder.orderId)} variant="contained" color="primary" sx={{ mr: 1 }}>

                      Delivery

                    </Button>

                    <Button onClick={() => handleStatusChange('Cancel', selectedOrder.orderId)} variant="contained" color="error">

                      Cancel

                    </Button>

                  </Box>

                )}

                {selectedOrder.status === 'Shipping' && (

                  <Box>

                    <Button onClick={() => handleStatusChange('Complete', selectedOrder.orderId)} variant="contained" color="success" sx={{ mr: 1 }}>

                      Complete

                    </Button>

                    <Button onClick={() => handleStatusChange('Returned', selectedOrder.orderId)} variant="contained" color="warning">

                      Return

                    </Button>

                  </Box>

                )}

              </Box>

            </Grid>

            <Grid item xs={12}>

              <Card>

                <TableContainer>

                  <Table>

                    <TableHead>

                      <TableRow>

                        <TableCell>Product</TableCell>

                        <TableCell>Information</TableCell>

                        <TableCell align="right">Price</TableCell>

                        <TableCell align="right">Quantity</TableCell>

                        <TableCell align="right">Discount</TableCell>

                        <TableCell align="right">Total</TableCell>

                      </TableRow>

                    </TableHead>

                    <TableBody>

                      {selectedOrder.details.map((detail) => (

                        <TableRow key={detail.orderDetailId}>

                          <TableCell>

                            <Box sx={{ display: 'flex', alignItems: 'center' }}>

                              <CardMedia

                                component="img"

                                sx={{ width: 50, height: 50, objectFit: 'cover', marginRight: 2 }}

                                image={detail.productImage}

                                alt={detail.productName}

                              />

                              <Typography>{detail.productName}</Typography>

                            </Box>

                          </TableCell>

                          <TableCell>

                            <Stack spacing={1}>

                              <Typography variant="body2">Size: {detail.size}</Typography>

                              <Typography variant="body2">Category: {detail.category.categoryName}</Typography>

                              <Box>

                                {detail.skinTypes.map((type) => (

                                  <Chip

                                    key={type.skinTypeId}

                                    label={type.skinTypeName}

                                    size="small"

                                    sx={{ mr: 0.5, mb: 0.5 }}

                                  />

                                ))}

                              </Box>

                            </Stack>

                          </TableCell>

                          <TableCell align="right">{detail.price.toLocaleString()}đ</TableCell>

                          <TableCell align="right">{detail.quantity}</TableCell>

                          <TableCell align="right">{(detail.discount * 100)}%</TableCell>

                          <TableCell align="right">

                            {((detail.price * detail.quantity) * (1 - detail.discount)).toLocaleString()}đ

                          </TableCell>

                        </TableRow>

                      ))}

                      <TableRow>

                        <TableCell colSpan={4} />

                        <TableCell align="right">
                          <Typography variant="subtitle1">Subtotal:</Typography>
                          <Typography variant="subtitle1">Shipping Fee:</Typography>
                          <Typography variant="subtitle1"><strong>Total Amount:</strong></Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="subtitle1">{totalAmount.toLocaleString()}đ</Typography>
                          <Typography variant="subtitle1">{selectedOrder.shippingPrice.toLocaleString()}đ</Typography>
                          <Typography variant="subtitle1"><strong>{finalTotalAmount.toLocaleString()}đ</strong></Typography>
                        </TableCell>
                      </TableRow>

                    </TableBody>

                  </Table>

                </TableContainer>

              </Card>

            </Grid>

            <Grid item xs={12}>

              <Button onClick={handleBackToList} variant="outlined" sx={{ mt: 2 }}>

                Back to Order List

              </Button>

            </Grid>

          </Grid>

          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleStatusClose}>

            {selectedOrder && getAvailableStatuses(selectedOrder.status, selectedOrder.paymentMethodId).map((status) => (

              <MenuItem key={status} onClick={() => handleStatusSelect(status)}>

                {getStatusText(status)}

              </MenuItem>

            ))}

          </Menu>



          <Dialog open={confirmDialog.open} onClose={() => setConfirmDialog({ open: false, status: null })}>

            <DialogTitle>Confirm Status Update</DialogTitle>

            <DialogContent>

              <Typography gutterBottom>

                Are you sure you want to update the order status to {getStatusText(confirmDialog.status)}?

              </Typography>

              <Typography variant="body2" color="text.secondary">

                {getStatusDescription(confirmDialog.status)}

              </Typography>

            </DialogContent>

            <DialogActions>

              <Button onClick={() => setConfirmDialog({ open: false, status: null })}>Cancel</Button>

              <Button onClick={() => handleStatusChange(confirmDialog.status, selectedOrder.orderId)} variant="contained" color="primary">

                Confirm

              </Button>

            </DialogActions>

          </Dialog>



          <Snackbar

            open={notification.open}

            autoHideDuration={6000}

            onClose={handleCloseNotification}

            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}

          >

            <Alert onClose={handleCloseNotification} severity={notification.severity} sx={{ width: '100%' }}>

              {notification.message}

            </Alert>

          </Snackbar>



          <Dialog open={isDetailDialogOpen} onClose={handleCloseDetail}>

            <DialogTitle>Order Details #{selectedOrder?.orderId}</DialogTitle>

            <DialogContent>

              <Typography>

                <strong>Order Date:</strong> {new Date(selectedOrder?.createdDate).toLocaleDateString()}

              </Typography>

              <Typography>

                <strong>Status:</strong> {getStatusText(selectedOrder?.status)}

              </Typography>

              <Typography>

                <strong>Total Amount:</strong> {selectedOrder?.totalAmount.toLocaleString()}đ

              </Typography>

            </DialogContent>

            <DialogActions>

              <Button onClick={handleCloseDetail}>Close</Button>

            </DialogActions>

          </Dialog>



          <Dialog
            open={rejectConfirmDialog.open}
            onClose={handleCloseRejectDialog}
          >
            <DialogTitle>Confirm Reject Order</DialogTitle>
            <DialogContent>
              <Typography>
                Are you sure you want to reject this order?
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseRejectDialog}>Cancel</Button>
              <Button onClick={handleConfirmReject} variant="contained" color="error">
                Reject Order
              </Button>
            </DialogActions>
          </Dialog>

        </Box>

      )}

    </Box>

  );

};



export default OrderManagement;






