// src/components/common/LoadingSpinner.jsx
import React from 'react';
import { CircularProgress, Box, Typography } from '@mui/material';

const LoadingSpinner = ({ message = 'جاري التحميل...', size = 40, thickness = 3.6 }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '200px',
        gap: 2
      }}
    >
      <CircularProgress 
        size={size} 
        thickness={thickness}
        sx={{ color: 'primary.main' }}
      />
      <Typography 
        variant="body1" 
        color="textSecondary"
        sx={{ mt: 2 }}
      >
        {message}
      </Typography>
    </Box>
  );
};

export default LoadingSpinner;