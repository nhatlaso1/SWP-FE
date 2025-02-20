import React, { useState, useEffect } from 'react';
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
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { orderApi } from './api';

const SearchContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(3),
  alignItems: 'center',
  backgroundColor: '#fff',
  padding: theme.spacing(2),
  borderRadius: theme.spacing(1),
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
}));

const StyledChip = styled(Chip)(({ theme }) => ({
  fontWeight: 500,
  '&.MuiChip-colorWarning': {
    backgroundColor: '#fff3e0',
    color: '#f57c00',
  },
  '&.MuiChip-colorSuccess': {
    backgroundColor: '#e8f5e9',
    color: '#2e7d32',
  },
  '&.MuiChip-colorError': {
    backgroundColor: '#fdecea',
    color: '#d32f2f',
  },
}));

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [orderFilter, setOrderFilter] = useState('all');
  const [searchOrder, setSearchOrder] = useState('');
  const [openNewOrderDialog, setOpenNewOrderDialog] = useState(false);
  const [newOrder, setNewOrder] = useState({
    customerName: '',
    email: '',
    items: '',
    total: '',
    address: '',
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await orderApi.getAllOrders();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const handleAddOrder = async () => {
    if (!newOrder.customerName || !newOrder.total) return;

    try {
      const orderData = {
        customerName: newOrder.customerName,
        email: newOrder.email,
        items: newOrder.items.split(',').map(item => item.trim()),
        total: newOrder.total,
        address: newOrder.address,
      };
      
      const data = await orderApi.createOrder(orderData);
      setOrders([...orders, data]);
      setOpenNewOrderDialog(false);
      setNewOrder({ customerName: '', email: '', items: '', total: '', address: '' });
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      if (newStatus === 'delivered') {
        await orderApi.completeOrder(orderId);
      } else if (newStatus === 'cancelled') {
        await orderApi.cancelOrder(orderId);
      }
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (error) {
      console.error(`Error updating order status: ${error}`);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'warning',
      processing: 'info',
      shipped: 'primary',
      delivered: 'success',
      cancelled: 'error',
    };
    return colors[status] || 'default';
  };

  const filteredOrders = orders.filter(order => {
    if (orderFilter !== 'all' && order.status !== orderFilter) return false;
    if (searchOrder && !order.customerName.toLowerCase().includes(searchOrder.toLowerCase())) return false;
    return true;
  });

  return (
    <Box>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5">Order Management</Typography>
        <Button variant="contained" color="primary" onClick={() => setOpenNewOrderDialog(true)}>
          Add New Order
        </Button>
      </Box>

      <SearchContainer>
        <TextField
          size="small"
          placeholder="Search orders..."
          value={searchOrder}
          onChange={(e) => setSearchOrder(e.target.value)}
          InputProps={{ startAdornment: <SearchIcon sx={{ color: 'action.active', mr: 1 }} /> }}
          sx={{ width: 250 }}
        />
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Filter Status</InputLabel>
          <Select value={orderFilter} label="Filter Status" onChange={(e) => setOrderFilter(e.target.value)}>
            <MenuItem value="all">All Orders</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="processing">Processing</MenuItem>
            <MenuItem value="shipped">Shipped</MenuItem>
            <MenuItem value="delivered">Delivered</MenuItem>
            <MenuItem value="cancelled">Cancelled</MenuItem>
          </Select>
        </FormControl>
      </SearchContainer>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredOrders.map(order => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar sx={{ width: 24, height: 24 }}>{order.customerName[0]}</Avatar>
                    {order.customerName}
                  </Box>
                </TableCell>
                <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                <TableCell>${parseFloat(order.total).toFixed(2)}</TableCell>
                <TableCell>
                  <StyledChip label={order.status} color={getStatusColor(order.status)} size="small" />
                </TableCell>
                <TableCell>
                  <FormControl size="small" sx={{ minWidth: 120 }}>
                    <Select value={order.status} onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}>
                      <MenuItem value="pending">Pending</MenuItem>
                      <MenuItem value="processing">Processing</MenuItem>
                      <MenuItem value="shipped">Shipped</MenuItem>
                      <MenuItem value="delivered">Delivered</MenuItem>
                      <MenuItem value="cancelled">Cancelled</MenuItem>
                    </Select>
                  </FormControl>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default OrderManagement;
