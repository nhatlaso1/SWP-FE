import { Box, Button, Container, CssBaseline, Typography } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function CheckoutSuccess() {
    const navigate = useNavigate();

    const handleGoHome = () => {
        navigate('/'); // Navigate to the homepage
    };

    const handleViewOrderDetail = () => {
        navigate('/order-detail'); // Navigate to the order details page
    };

    return (
        <React.Fragment>
            <CssBaseline />
            <Container fixed>
                <Box
                    sx={{
                        bgcolor: '#E8F5E9', // Light green background
                        height: '60vh',
                        margin: '50px auto',
                        borderRadius: '30px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        textAlign: 'center',
                        color: '#2E7D32',
                    }}
                >
                    <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2 }}>
                        PAYMENT SUCCESSFUL
                    </Typography>
                    <Typography variant="h5" sx={{ maxWidth: '600px', lineHeight: 1.6, mb: 4 }}>
                        Thank you for shopping with us!
                        <br />
                        Please check and track your order. We will deliver it to you as soon as possible.
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button
                            variant="contained"
                            color="success"
                            sx={{
                                fontSize: '1rem',
                                padding: '10px 30px',
                                borderRadius: '8px',
                                ':hover': { bgcolor: '#1B5E20' },
                            }}
                            onClick={handleGoHome}
                        >
                            Continue Shopping
                        </Button>
                        <Button
                            variant="outlined"
                            color="success"
                            sx={{
                                fontSize: '1rem',
                                padding: '10px 30px',
                                borderRadius: '8px',
                                borderColor: '#2E7D32',
                                color: '#2E7D32',
                                ':hover': { bgcolor: '#C8E6C9', borderColor: '#1B5E20' },
                            }}
                            onClick={handleViewOrderDetail}
                        >
                            View Order Details
                        </Button>
                    </Box>
                </Box>
            </Container>
        </React.Fragment>
    );
}
