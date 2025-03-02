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

import { getAllOrders, updateOrderStatusDirect, completeOrder, cancelOrder } from '../../../store/apiOrder';

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
      console.log('Fetching orders with filter: All');
      const allOrders = await Promise.all([
        getAllOrders('Pending'),
        getAllOrders('Shipping'),
        getAllOrders('Complete'),
        getAllOrders('Cancelled'),
      ]);
      setOrders(allOrders.flat());
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
    if (newStatus === 'Complete') {
      const success = await completeOrder(selectedOrder.orderId);
      if (success) {
        updatedStatus = 'Complete';
        setNotification({ open: true, message: 'Đơn hàng đã hoàn tất!', severity: 'success' });
      }
    } else if (newStatus === 'Cancelled') {
      const success = await cancelOrder(selectedOrder.orderId);
      if (success) {
        updatedStatus = 'Cancelled';
        setNotification({ open: true, message: 'Đơn hàng đã bị hủy!', severity: 'success' });
      }
    }
    if (updatedStatus) {
      setSelectedOrder(prev => ({ ...prev, status: updatedStatus }));
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
      case 'Cancelled':
        return 'Đã hủy';
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
      case 'Cancelled':
        return 'Đơn hàng đã bị hủy, không thể phục hồi';
      default:
        return '';
    }
  };

  const getAvailableStatuses = (currentStatus) => {
    switch (currentStatus) {
      case 'Pending':
        return ['Shipping', 'Cancelled'];
      case 'Shipping':
        return ['Complete'];
      case 'Complete':
      case 'Cancelled':
        return [];
      default:
        return [];
    }
  };

  const handleStatusClose = () => {
    setAnchorEl(null);
  };

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
              { label: 'Tổng tiền', value: selectedOrder.totalAmount.toLocaleString() + 'đ' }
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
                  <Button onClick={() => handleStatusChange('Cancelled')} sx={{ marginLeft: 2 }}>Hủy đơn hàng</Button>
                )}
                {item.label === 'Trạng thái' && selectedOrder.status === 'Shipping' && (
                  <Button onClick={() => handleStatusChange('Complete')} sx={{ marginLeft: 2 }}>Hoàn tất đơn hàng</Button>
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


