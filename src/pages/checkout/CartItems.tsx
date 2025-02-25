import React, { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

interface CartItem {
  id: number;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

const CartItems: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const storedCart = sessionStorage.getItem('cart');
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  return (
    <Box sx={{ padding: '12px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
      <Grid container spacing={1}>
        {cartItems.map((item) => (
          <Grid item xs={12} key={item.id}>
            <Card
              sx={{
                display: 'flex',
                alignItems: 'center',
                padding: '8px',
                boxShadow: '0px 2px 6px rgba(0,0,0,0.08)',
                borderRadius: '6px',
              }}
            >
              <CardMedia
                component="img"
                sx={{ width: 60, height: 60, borderRadius: '6px', objectFit: 'cover', marginRight: '8px' }}
                image={item.image}
                alt={item.name}
              />
              <CardContent sx={{ flexGrow: 1, padding: '0' }}>
                <Typography variant="body2" fontWeight="bold" color="#333">
                  {item.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  SL: {item.quantity}
                </Typography>
              </CardContent>
              <CardContent sx={{ padding: '0' }}>
                <Typography variant="body2" color="primary" fontWeight="bold">
                  {item.price.toLocaleString('vi-VN')} đ
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default CartItems;
