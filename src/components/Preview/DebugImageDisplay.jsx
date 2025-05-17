import React from 'react';
import { Box, Typography, Chip, Tooltip } from '@mui/material';

// Компонент для отображения отладочной информации о загруженных изображениях секции
const DebugImageDisplay = ({ sectionId, imageData }) => {
  if (!imageData || !imageData.length) {
    return (
      <Box sx={{ 
        width: '100%',
        border: '1px solid #e0e0e0',
        borderRadius: 1,
        bgcolor: '#fafafa',
        overflow: 'hidden'
      }}>
        <Typography 
          variant="subtitle2" 
          sx={{
            p: 1,
            borderBottom: '1px solid #e0e0e0',
            bgcolor: '#f5f5f5',
            fontWeight: 600
          }}
        >
          Секция: {sectionId}
        </Typography>
        <Typography 
          variant="body2" 
          color="error"
          sx={{ 
            p: 1,
            textAlign: 'center',
            bgcolor: '#fff3f3'
          }}
        >
          Нет изображений
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      width: '100%',
      border: '1px solid #e0e0e0',
      borderRadius: 1,
      bgcolor: '#fafafa',
      overflow: 'hidden'
    }}>
      <Typography 
        variant="subtitle2" 
        sx={{
          p: 1,
          borderBottom: '1px solid #e0e0e0',
          bgcolor: '#f5f5f5',
          fontWeight: 600
        }}
      >
        Секция: {sectionId}
      </Typography>
      
      <Box sx={{ 
        p: 1,
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: 0.5,
        alignItems: 'flex-start'
      }}>
        {imageData.map((img, index) => {
          const isBlob = img.startsWith('blob:');
          const filename = isBlob 
            ? img.split('/').pop().substring(0, 8) + '...' 
            : img.split('/').pop();
          
          return (
            <Tooltip 
              key={index} 
              title={
                <React.Fragment>
                  <Typography color="inherit">{`Изображение ${index + 1}`}</Typography>
                  <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>{img}</Typography>
                </React.Fragment>
              } 
              arrow
              placement="top"
            >
              <Chip 
                label={`${index + 1}: ${filename}`} 
                size="small" 
                color={isBlob ? "success" : "primary"}
                sx={{ 
                  maxWidth: '100%',
                  height: '24px',
                  '& .MuiChip-label': {
                    px: 1,
                    fontSize: '0.75rem'
                  }
                }}
              />
            </Tooltip>
          );
        })}
      </Box>
    </Box>
  );
};

export default DebugImageDisplay; 