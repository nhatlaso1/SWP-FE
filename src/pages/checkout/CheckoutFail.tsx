import { CheckCircle } from '@mui/icons-material'
import { Box, Container, CssBaseline, Typography } from '@mui/material'
import React from 'react'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
export default function CheckoutFail() {
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
                    <ErrorOutlineIcon sx={{ color: 'red', fontSize: 233 }} />
                    <Typography variant="h4" sx={{ color: 'red' }}>
                        Thanh toán không thành công!
                    </Typography>
                </Box>
            </Container>
        </React.Fragment>
  )
}
