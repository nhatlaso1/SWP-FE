import React from 'react';
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
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';

const OrderDetail = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = React.useState(null);

  React.useEffect(() => {
    // Find the order details from localStorage
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const order = orders.find(o => o.orderId === parseInt(orderId));
    if (order) {
      setOrderDetails(order);
    }
  }, [orderId]);

  if (!orderDetails) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box p={3}>
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link
          component="button"
          variant="body1"
          onClick={() => navigate('/staff/order')}
          sx={{ cursor: 'pointer' }}
        >
          All Orders
        </Link>
        <Typography color="text.primary">Order Detail</Typography>
      </Breadcrumbs>

      <Typography variant="h5" gutterBottom>Order Details #{orderId}</Typography>

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
              <TableCell>Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orderDetails.details.map((detail) => (
              <TableRow key={detail.orderDetailId}>
                <TableCell>{detail.orderDetailId}</TableCell>
                <TableCell>{detail.productId}</TableCell>
                <TableCell>{detail.productName}</TableCell>
                <TableCell>{detail.size}</TableCell>
                <TableCell>{detail.quantity}</TableCell>
                <TableCell>${detail.price.toLocaleString()}</TableCell>
                <TableCell>{(detail.discount * 100).toFixed(0)}%</TableCell>
                <TableCell>
                  ${(detail.price * detail.quantity * (1 - detail.discount)).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ mt: 3, textAlign: 'right' }}>
        <Typography variant="h6">
          Total Amount: ${orderDetails.totalAmount.toLocaleString()}
        </Typography>
        <Typography variant="body1">
          Status: {orderDetails.status}
        </Typography>
        <Typography variant="body1">
          Created Date: {new Date(orderDetails.createdDate).toLocaleDateString()}
        </Typography>
      </Box>
    </Box>
  );
};

export default OrderDetail; 