import React, { useState, useEffect } from 'react';
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
} from '@mui/material';

import { getAllOrders, updateOrderStatusDirect, completeOrder, cancelOrder, denyOrder, confirmOrder, shippingOrder, returnOrder, approveOrder, rejectOrder } from '../../../store/apiOrder';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({ open: false, status: null });
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  const [isDetailDialogOpen, setDetailDialogOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      console.log('Fetching all orders');
      const allOrders = await getAllOrders();
      setOrders(allOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setNotification({ open: true, message: 'Không thể tải danh sách đơn hàng. Vui lòng thử lại sau.', severity: 'error' });
    }
  };

  const handleRowClick = (order) => {
    setSelectedOrder(order);
  };

  const handleBackToList = () => {
    setSelectedOrder(null);
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

  const handleStatusChange = async (newStatus) => {
    let updatedStatus;
    if (selectedOrder.status === 'Pending') {
      if (newStatus === 'Confirmed') {
        const success = await confirmOrder(selectedOrder.orderId);
        if (success) {
          updatedStatus = 'Confirmed';
        }
      } else if (newStatus === 'Denied') {
        const success = await denyOrder(selectedOrder.orderId);
        if (success) {
          updatedStatus = 'Denied';
        }
      }
    } else if (selectedOrder.status === 'Confirmed') {
      if (newStatus === 'Shipping') {
        const success = await shippingOrder(selectedOrder.orderId);
        if (success) {
          updatedStatus = 'Shipping';
        }
      }
    } else if (selectedOrder.status === 'Shipping') {
      if (newStatus === 'Returned') {
        const success = await returnOrder(selectedOrder.orderId);
        if (success) {
          updatedStatus = 'Returned';
        }
      } else if (newStatus === 'Complete') {
        const success = await completeOrder(selectedOrder.orderId);
        if (success) {
          updatedStatus = 'Complete';
        }
      }
    }
    if (updatedStatus) {
      setSelectedOrder(prev => ({ ...prev, status: updatedStatus }));
      setNotification({ open: true, message: `Đơn hàng đã chuyển sang trạng thái ${updatedStatus}!`, severity: 'success' });
      await fetchOrders();
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'Pending':
        return 'Chờ xử lý';
      case 'Shipping':
        return 'Đang giao hàng';
      case 'Complete':
        return 'Hoàn tất';
      case 'Cancel':
        return 'Đã hủy';
      case 'Denied':
        return 'Đã bị từ chối';
      case 'Confirmed':
        return 'Đã được xác nhận';
      case 'Delivered':
        return 'Đã giao thành công';
      case 'Returned':
        return 'Đã được trả';
      default:
        return status;
    }
  };

  const getStatusDescription = (status) => {
    switch (status) {
      case 'Pending':
        return 'Đơn hàng mới tạo, chờ xử lý';
      case 'Shipping':
        return 'Đơn hàng đang trong quá trình vận chuyển';
      case 'Complete':
        return 'Đơn hàng đã giao thành công';
      case 'Cancel':
        return 'Đơn hàng đã bị hủy, không thể phục hồi';
      case 'Denied':
        return 'Đơn hàng đã bị từ chối, không thể phục hồi';
      case 'Confirmed':
        return 'Đơn hàng đã được xác nhận, chờ giao hàng';
      case 'Delivered':
        return 'Đơn hàng đã giao thành công';
      case 'Returned':
        return 'Đơn hàng đã được trả, không thể phục hồi';
      default:
        return '';
    }
  };

  const getAvailableStatuses = (currentStatus) => {
    switch (currentStatus) {
      case 'Pending':
        return ['Confirmed', 'Denied'];
      case 'Confirmed':
        return ['Shipping'];
      case 'Shipping':
        return ['Returned', 'Complete'];
      case 'Delivered':
        return ['Complete'];
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
    return total + (detail.price * detail.quantity);
  }, 0) || 0;

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
                    <TableCell>Mã đơn hàng</TableCell>
                    <TableCell>Ngày đặt</TableCell>
                    <TableCell>Tổng tiền</TableCell>
                    <TableCell>Trạng thái</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orders.map(order => (
                    <TableRow key={order.orderId} onClick={() => handleRowClick(order)} sx={{ cursor: 'pointer' }}>
                      <TableCell>{order.orderId}</TableCell>
                      <TableCell>{new Date(order.createdDate).toLocaleDateString()}</TableCell>
                      <TableCell>{order.totalAmount.toLocaleString()}đ</TableCell>
                      <TableCell>{getStatusText(order.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      ) : (
        <Box>
          <Typography variant="h6">Chi tiết đơn hàng #{selectedOrder.orderId}</Typography>
          <Box sx={{ paddingLeft: 2, display: 'flex', flexDirection: 'column' }}>
            {[
              { label: 'Customer ID', value: selectedOrder.customerId },
              { label: 'Tên', value: selectedOrder.name },
              { label: 'Số điện thoại', value: selectedOrder.phoneNumber },
              { label: 'Email', value: selectedOrder.email },
              { label: 'Địa chỉ', value: selectedOrder.address },
              { label: 'Ngày đặt', value: new Date(selectedOrder.createdDate).toLocaleDateString() },
              { label: 'Trạng thái', value: getStatusText(selectedOrder.status) },
              { label: 'Tổng tiền', value: totalAmount.toLocaleString() + 'đ' }
            ].map((item, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center', marginBottom: 0.5 }}>
                <Typography sx={{ width: '20%', textAlign: 'left', marginRight: '2px' }}>
                  <strong>{item.label}:</strong>
                </Typography>
                <span
                  style={{
                    border: '1px solid #ccc',
                    padding: '2px 5px',
                    borderRadius: '4px',
                    width: '35%',
                    display: 'inline-block',
                    minWidth: '150px',
                    minHeight: '30px',
                    textAlign: 'left'
                  }}
                >
                  {item.value || '-'}
                </span>
                {item.label === 'Trạng thái' && selectedOrder.status === 'Pending' && (
                  <> 
                    <Button onClick={() => handleStatusChange('Confirmed')} sx={{ marginLeft: 2 }}>Xác nhận</Button>
                    <Button onClick={() => handleStatusChange('Denied')} sx={{ marginLeft: 2 }}>Từ chối</Button>
                  </>
                )}
                {item.label === 'Trạng thái' && selectedOrder.status === 'Confirmed' && (
                  <> 
                    <Button onClick={() => handleStatusChange('Shipping')} sx={{ marginLeft: 2 }}>Giao hàng</Button>
                  </>
                )}
                {item.label === 'Trạng thái' && selectedOrder.status === 'Shipping' && (
                  <> 
                    <Button onClick={() => handleStatusChange('Returned')} sx={{ marginLeft: 2 }}>Trả hàng</Button>
                    <Button onClick={() => handleStatusChange('Complete')} sx={{ marginLeft: 2 }}>Hoàn tất</Button>
                  </>
                )}
              </Box>
            ))}
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Tên sản phẩm</TableCell>
                  <TableCell>Danh mục</TableCell>
                  <TableCell>Giá</TableCell>
                  <TableCell>Số lượng</TableCell>
                  <TableCell>Tổng</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedOrder.details.map((detail) => (
                  <TableRow key={detail.orderDetailId}>
                    <TableCell>{detail.productName}</TableCell>
                    <TableCell>{detail.category}</TableCell>
                    <TableCell>{detail.price.toLocaleString()}đ</TableCell>
                    <TableCell>{detail.quantity}</TableCell>
                    <TableCell>{(detail.price * detail.quantity).toLocaleString()}đ</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Button onClick={handleBackToList}>Quay lại danh sách đơn hàng</Button>
        </Box>
      )}

      {/* Status Update Menu */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleStatusClose}>
        {selectedOrder && getAvailableStatuses(selectedOrder.status).map((status) => (
          <MenuItem key={status} onClick={() => handleStatusSelect(status)}>
            {getStatusText(status)}
          </MenuItem>
        ))}
      </Menu>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialog.open} onClose={() => setConfirmDialog({ open: false, status: null })}>
        <DialogTitle>Xác nhận cập nhật trạng thái</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            Bạn có chắc chắn muốn cập nhật trạng thái đơn hàng thành {getStatusText(confirmDialog.status)}?
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {getStatusDescription(confirmDialog.status)}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog({ open: false, status: null })}>Hủy</Button>
          <Button onClick={handleStatusChange} variant="contained" color="primary">
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notification Snackbar */}
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

      {/* Modal for Order Details */}
      <Dialog open={isDetailDialogOpen} onClose={handleCloseDetail}>
        <DialogTitle>Chi tiết đơn hàng #{selectedOrder?.orderId}</DialogTitle>
        <DialogContent>
          <Typography>
            <strong>Ngày đặt:</strong> {new Date(selectedOrder?.createdDate).toLocaleDateString()}
          </Typography>
          <Typography>
            <strong>Trạng thái:</strong> {getStatusText(selectedOrder?.status)}
          </Typography>
          <Typography>
            <strong>Tổng tiền:</strong> {selectedOrder?.totalAmount.toLocaleString()}đ
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetail}>Đóng</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OrderManagement;


