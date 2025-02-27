import React from 'react';
import { Box, Container, CssBaseline, Typography } from '@mui/material';
import TaskAltIcon from '@mui/icons-material/TaskAlt';

export default function CheckoutSuccess() {
    return (
        <React.Fragment>
            <CssBaseline />
            <Container fixed>
                <Box
                    sx={{
                        bgcolor: '#FFCCCC',
                        height: '60vh',
                        margin: '50px auto',
                        borderRadius: '30px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        textAlign: 'center',
                    }}
                >
                    <TaskAltIcon sx={{ color: 'green', fontSize: 233 }} />
                    <Typography variant="h4" sx={{ color: 'green' }}>
                        Thanh toán thành công!
                    </Typography>
                </Box>
            </Container>
        </React.Fragment>
    );
};
