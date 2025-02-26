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
import { OrderAPI } from '../../../store/apiOrder';

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
      console.log('Fetching orders...');
      const ordersData = await OrderAPI.getAll();
      console.log('Fetched orders:', ordersData);
      setOrders(ordersData);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]); // Set empty array on error
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
      
      const data = await OrderAPI.createOrder(orderData);
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
        await OrderAPI.completeOrder(orderId);
      } else if (newStatus === 'cancelled') {
        await OrderAPI.cancelOrder(orderId);
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
      Pending: 'warning',
      Processing: 'info',
      Shipped: 'primary',
      Complete: 'success',
      Cancelled: 'error',
    };
    return colors[status] || 'default';
  };

  const filteredOrders = orders.filter(order => {
    if (orderFilter !== 'all' && order.status !== orderFilter) return false;
    if (searchOrder) {
      // Tìm kiếm trong danh sách sản phẩm
      const hasMatchingProduct = order.details?.some(detail =>
        detail.productName.toLowerCase().includes(searchOrder.toLowerCase())
      );
      if (!hasMatchingProduct) return false;
    }
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
          placeholder="Search products..."
          value={searchOrder}
          onChange={(e) => setSearchOrder(e.target.value)}
          InputProps={{ startAdornment: <SearchIcon sx={{ color: 'action.active', mr: 1 }} /> }}
          sx={{ width: 250 }}
        />
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Filter Status</InputLabel>
          <Select value={orderFilter} label="Filter Status" onChange={(e) => setOrderFilter(e.target.value)}>
            <MenuItem value="all">All Orders</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Processing">Processing</MenuItem>
            <MenuItem value="Shipped">Shipped</MenuItem>
            <MenuItem value="Complete">Complete</MenuItem>
            <MenuItem value="Cancelled">Cancelled</MenuItem>
          </Select>
        </FormControl>
      </SearchContainer>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>Products</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Total Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredOrders.map(order => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>
                  <Box>
                    {order.details?.map((detail, index) => (
                      <Typography key={detail.id} variant="body2" sx={{ mb: 0.5 }}>
                        {detail.productName} ({detail.size}) x{detail.quantity}
                      </Typography>
                    ))}
                  </Box>
                </TableCell>
                <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                <TableCell>${order.total.toLocaleString()}</TableCell>
                <TableCell>
                  <StyledChip label={order.status} color={getStatusColor(order.status)} size="small" />
                </TableCell>
                <TableCell>
                  <FormControl size="small" sx={{ minWidth: 120 }}>
                    <Select 
                      value={order.status} 
                      onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                    >
                      <MenuItem value="Pending">Pending</MenuItem>
                      <MenuItem value="Processing">Processing</MenuItem>
                      <MenuItem value="Shipped">Shipped</MenuItem>
                      <MenuItem value="Complete">Complete</MenuItem>
                      <MenuItem value="Cancelled">Cancelled</MenuItem>
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
