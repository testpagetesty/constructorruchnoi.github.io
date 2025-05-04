import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

const MapIframe = ({ address, city = 'Москва' }) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [mapError, setMapError] = React.useState(null);

  const getMapSrc = () => {
    const query = address ? encodeURIComponent(address) : encodeURIComponent(city);
    return `https://maps.google.com/maps?q=${query}&output=embed&z=15`;
  };

  const handleMapClick = () => {
    const query = address ? encodeURIComponent(address) : encodeURIComponent(city);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  return (
    <Box
      sx={{
        width: '100%',
        height: '400px',
        backgroundColor: '#f5f5f5',
        borderRadius: 1,
        overflow: 'hidden',
        position: 'relative',
        cursor: 'pointer'
      }}
      onClick={handleMapClick}
    >
      {isLoading && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            zIndex: 1
          }}
        >
          <CircularProgress />
        </Box>
      )}
      {mapError && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            zIndex: 1,
            color: 'error.main',
            textAlign: 'center',
            p: 2
          }}
        >
          <Typography variant="body1">{mapError}</Typography>
        </Box>
      )}
      <iframe
        src={getMapSrc()}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setMapError('Ошибка загрузки карты. Пожалуйста, попробуйте позже.');
          setIsLoading(false);
        }}
      />
    </Box>
  );
};

export default MapIframe; 