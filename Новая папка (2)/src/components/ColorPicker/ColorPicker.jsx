import React from 'react';
import { Box, Typography } from '@mui/material';

const ColorPicker = ({ label, value, onChange }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Box
        component="input"
        type="color"
        value={value}
        onChange={onChange}
        sx={{
          width: 30,
          height: 30,
          padding: 0,
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          '&::-webkit-color-swatch-wrapper': {
            padding: 0,
          },
          '&::-webkit-color-swatch': {
            border: 'none',
            borderRadius: '4px',
          },
        }}
      />
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
    </Box>
  );
};

export default ColorPicker; 