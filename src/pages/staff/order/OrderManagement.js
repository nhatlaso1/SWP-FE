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

  Breadcrumbs,

  Link,

  Grid,

  IconButton,

  Button,

  Menu,

  MenuItem,

  Dialog,

  DialogTitle,

  DialogContent,

  DialogActions,

} from '@mui/material';

import CloseIcon from '@mui/icons-material/Close';

import { getAllOrders } from '../../../store/apiOrder';



const OrderManagement = () => {

  const [orders, setOrders] = useState([]);

  const [selectedOrder, setSelectedOrder] = useState(null);

  const [anchorEl, setAnchorEl] = useState(null);

  const [confirmDialog, setConfirmDialog] = useState({ open: false, status: null });



  useEffect(() => {

    fetchOrders();

  }, []);



  const fetchOrders = async () => {

    try {

      const ordersData = await getAllOrders('Complete');

      setOrders(ordersData);

    } catch (error) {

      console.error('Error fetching orders:', error);

      setOrders([]);

    }

  };



  const handleRowClick = (order) => {

    setSelectedOrder(order);

  };



  const handleCloseDetail = () => {

    setSelectedOrder(null);

  };



  const handleStatusClick = (event) => {

    setAnchorEl(event.currentTarget);

  };



  const handleStatusClose = () => {

    setAnchorEl(null);

  };



  const getAvailableStatuses = (currentStatus) => {

    switch (currentStatus) {

      case 'Pending':

        return ['Processing', 'Cancelled'];

      case 'Processing':

        return ['Complete'];

      case 'Complete':

      case 'Cancelled':

        return [];

      default:

        return [];

    }

  };



  const handleStatusSelect = (newStatus) => {

    setConfirmDialog({ open: true, status: newStatus });

    handleStatusClose();

  };



  const handleConfirmStatusChange = async () => {

    try {

      // Implement the API call to update status here

      console.log(`Updating order ${selectedOrder.orderId} to ${confirmDialog.status}`);

      setConfirmDialog({ open: false, status: null });

      await fetchOrders(); // Refresh the orders list

    } catch (error) {

      console.error('Error updating order status:', error);

    }

  };



  return (

    <Box p={3}>

      <Typography variant="h5" gutterBottom>Orders Management</Typography>

      

      <Grid container spacing={2}>

        {/* Orders List - Left Side */}

        <Grid item xs={selectedOrder ? 6 : 12}>

          <TableContainer component={Paper}>

            <Table>

              <TableHead>

                <TableRow>

                  <TableCell>Order ID</TableCell>

                  <TableCell>Date</TableCell>

                  <TableCell>Total Amount</TableCell>

                  <TableCell>Status</TableCell>

                </TableRow>

              </TableHead>

              <TableBody>

                {orders.map(order => (

                  <TableRow 

                    key={order.orderId}

                    onClick={() => handleRowClick(order)}

                    sx={{ 

                      cursor: 'pointer',

                      backgroundColor: selectedOrder?.orderId === order.orderId ? 'rgba(0, 0, 0, 0.04)' : 'inherit',

                      '&:hover': {

                        backgroundColor: 'rgba(0, 0, 0, 0.04)'

                      }

                    }}

                  >

                    <TableCell>{order.orderId}</TableCell>

                    <TableCell>{new Date(order.createdDate).toLocaleDateString()}</TableCell>

                    <TableCell>${order.totalAmount.toLocaleString()}</TableCell>

                    <TableCell>{order.status}</TableCell>

                  </TableRow>

                ))}

              </TableBody>

            </Table>

          </TableContainer>

        </Grid>



        {/* Order Details - Right Side */}

        {selectedOrder && (

          <Grid item xs={6}>

            <Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>

                <Breadcrumbs>

                  <Link

                    component="button"

                    variant="body1"

                    onClick={handleCloseDetail}

                    sx={{ 

                      cursor: 'pointer',

                      textDecoration: 'none',

                      '&:hover': {

                        textDecoration: 'underline'

                      }

                    }}

                  >

                    Orders Management

                  </Link>

                  <Typography color="text.primary">Order Detail #{selectedOrder.orderId}</Typography>

                </Breadcrumbs>

                <Box>

                  {getAvailableStatuses(selectedOrder.status).length > 0 && (

                    <Button

                      variant="contained"

                      onClick={handleStatusClick}

                      sx={{ mr: 2 }}

                    >

                      Update Status

                    </Button>

                  )}

                  <IconButton onClick={handleCloseDetail} size="small">

                    <CloseIcon />

                  </IconButton>

                </Box>

              </Box>



              <TableContainer component={Paper}>

                <Table>

                  <TableHead>

                    <TableRow>

                      <TableCell>Detail ID</TableCell>

                      <TableCell>Product ID</TableCell>

                      <TableCell>Product Name</TableCell>

                      <TableCell>Size</TableCell>

                      <TableCell>Quantity</TableCell>

                      <TableCell>Price</TableCell>

                      <TableCell>Discount</TableCell>

                    </TableRow>

                  </TableHead>

                  <TableBody>

                    {selectedOrder.details.map((detail) => (

                      <TableRow key={detail.orderDetailId}>

                        <TableCell>{detail.orderDetailId}</TableCell>

                        <TableCell>{detail.productId}</TableCell>

                        <TableCell>{detail.productName}</TableCell>

                        <TableCell>{detail.size}</TableCell>

                        <TableCell>{detail.quantity}</TableCell>

                        <TableCell>${detail.price.toLocaleString()}</TableCell>

                        <TableCell>{(detail.discount * 100).toFixed(0)}%</TableCell>

                      </TableRow>

                    ))}

                  </TableBody>

                </Table>

              </TableContainer>



              <Box sx={{ mt: 3, textAlign: 'right' }}>

                <Typography variant="h6">

                  Total Amount: ${selectedOrder.totalAmount.toLocaleString()}

                </Typography>

                <Typography variant="body1">

                  Status: {selectedOrder.status}

                </Typography>

                <Typography variant="body1">

                  Created Date: {new Date(selectedOrder.createdDate).toLocaleDateString()}

                </Typography>

              </Box>

            </Box>

          </Grid>

        )}

      </Grid>



      {/* Status Update Menu */}

      <Menu

        anchorEl={anchorEl}

        open={Boolean(anchorEl)}

        onClose={handleStatusClose}

      >

        {selectedOrder && getAvailableStatuses(selectedOrder.status).map((status) => (

          <MenuItem key={status} onClick={() => handleStatusSelect(status)}>

            {status}

          </MenuItem>

        ))}

      </Menu>



      {/* Confirmation Dialog */}

      <Dialog

        open={confirmDialog.open}

        onClose={() => setConfirmDialog({ open: false, status: null })}

      >

        <DialogTitle>Confirm Status Update</DialogTitle>

        <DialogContent>

          Are you sure you want to update the order status to {confirmDialog.status}?

        </DialogContent>

        <DialogActions>

          <Button onClick={() => setConfirmDialog({ open: false, status: null })}>Cancel</Button>

          <Button onClick={handleConfirmStatusChange} variant="contained" color="primary">

            Confirm

          </Button>

        </DialogActions>

      </Dialog>

    </Box>

  );

};



export default OrderManagement;


