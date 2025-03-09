import { Box, Button, Container, CssBaseline, Typography } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function CheckoutFail() {
    const navigate = useNavigate();

    const handleGoHome = () => {
        navigate('/'); // Navigate to the homepage
    };

    return (
        <React.Fragment>
            <CssBaseline />
            <Container fixed>
                <Box
                    sx={{
                        bgcolor: '#fef1f1', // Light background
                        height: '60vh',
                        margin: '50px auto',
                        borderRadius: '30px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        textAlign: 'center',
                        color: 'f2e0de',
                    }}
                >
                    <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2 }}>
                        TRANSACTION FAILED
                    </Typography>
                    <Typography variant="h6" sx={{ maxWidth: '600px', lineHeight: 1.6, mb: 4 }}>
                        The transaction was unsuccessful. Please check your payment information.
                        <br />
                        Thank you sincerely!
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{
                            bgcolor: '#FF5C5C',
                            fontSize: '1rem',
                            padding: '10px 30px',
                            borderRadius: '8px',
                            ':hover': { bgcolor: '#FF1E1E' },
                        }}
                        onClick={handleGoHome}
                    >
                        Return to Homepage
                    </Button>
                </Box>
            </Container>
        </React.Fragment>
    );
}
