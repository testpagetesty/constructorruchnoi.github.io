import React from 'react';
import { Box, CircularProgress, Typography, Button } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const MapIframe = ({ address, city = 'Москва' }) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [mapError, setMapError] = React.useState(null);
  const [useStaticMap, setUseStaticMap] = React.useState(false);
  const [mapLoaded, setMapLoaded] = React.useState(false);
  const [iframeBlocked, setIframeBlocked] = React.useState(false);
  const iframeRef = React.useRef(null);

  // Логируем входные параметры
  React.useEffect(() => {
    console.log('[MapIframe] Rendering with:', { address, city });
  }, [address, city]);

  // Проверка видимости iframe после загрузки
  React.useEffect(() => {
    const checkIframeVisibility = () => {
      if (iframeRef.current) {
        try {
          // Проверяем, загрузилась ли карта
          const computedStyle = window.getComputedStyle(iframeRef.current);
          const isVisible = computedStyle.display !== 'none' && 
                           computedStyle.visibility !== 'hidden' && 
                           computedStyle.opacity !== '0';
          
          console.log('[MapIframe] iframe visibility check:', { isVisible });
          
          // Если iframe не видим, возможно он заблокирован
          if (!isVisible && !mapError) {
            console.log('[MapIframe] iframe might be blocked, switching to static map');
            setIframeBlocked(true);
            setUseStaticMap(true);
          } else {
            setMapLoaded(true);
            setIsLoading(false);
          }
        } catch (e) {
          console.log('[MapIframe] Error checking iframe visibility:', e);
        }
      }
    };

    // Проверяем через небольшую задержку после рендера
    const timer = setTimeout(checkIframeVisibility, 1500);
    return () => clearTimeout(timer);
  }, [mapError]);

  const getMapSrc = () => {
    const fullAddress = address ? `${address}, ${city}` : city;
    const query = encodeURIComponent(fullAddress);
    // Используем Embed API 
    const src = `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${query}&language=ru`;
    console.log('[MapIframe] Map URL:', src);
    return src;
  };

  // Статичная карта как резервный вариант
  const getStaticMapSrc = () => {
    const fullAddress = address ? `${address}, ${city}` : city;
    const query = encodeURIComponent(fullAddress);
    // Используем Google Static Maps API
    return `https://maps.googleapis.com/maps/api/staticmap?center=${query}&zoom=14&size=600x400&scale=2&key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&markers=color:red%7C${query}&language=ru`;
  };

  const handleMapClick = () => {
    const fullAddress = address ? `${address}, ${city}` : city;
    const query = encodeURIComponent(fullAddress);
    const url = `https://www.google.com/maps/search/?api=1&query=${query}`;
    console.log('[MapIframe] Opening external map:', url);
    window.open(url, '_blank');
  };
  
  const handleMapLoad = () => {
    console.log('[MapIframe] Map load event triggered');
    setTimeout(() => {
      // Дополнительная проверка после загрузки
      try {
        const iframeDoc = iframeRef.current?.contentDocument || iframeRef.current?.contentWindow?.document;
        if (iframeDoc && iframeDoc.body.innerHTML.includes('Этот контент заблокирован')) {
          console.log('[MapIframe] Map content blocked, switching to static map');
          setIframeBlocked(true);
          setUseStaticMap(true);
        } else {
          setMapLoaded(true);
          setIsLoading(false);
        }
      } catch (e) {
        // Если не удалось проверить содержимое из-за CSP, считаем карту загруженной
        console.log('[MapIframe] Cannot access iframe due to CSP, assuming loaded');
        setMapLoaded(true);
        setIsLoading(false);
      }
    }, 500);
  };
  
  const handleMapError = (e) => {
    console.error('[MapIframe] Error loading map, trying static map', e);
    if (!useStaticMap) {
      setUseStaticMap(true);
      setIsLoading(true);
    } else {
      const errorMsg = 'Ошибка загрузки карты. Пожалуйста, попробуйте позже.';
      setMapError(errorMsg);
      setIsLoading(false);
    }
  };

  const handleStaticMapLoad = () => {
    console.log('[MapIframe] Static map loaded successfully');
    setIsLoading(false);
  };

  const handleStaticMapError = (e) => {
    const errorMsg = 'Ошибка загрузки карты. Пожалуйста, попробуйте позже.';
    console.error('[MapIframe] Error loading static map', e);
    setMapError(errorMsg);
    setIsLoading(false);
  };

  const fullAddress = address ? `${address}, ${city}` : city;

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
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            zIndex: 1,
            color: 'error.main',
            textAlign: 'center',
            p: 2
          }}
        >
          <Typography variant="body1" gutterBottom>{mapError}</Typography>
          <Button 
            variant="contained" 
            color="primary"
            onClick={handleMapClick}
            sx={{ mt: 2 }}
          >
            Открыть в Google Maps
          </Button>
        </Box>
      )}
      
      {!useStaticMap ? (
        <iframe
          ref={iframeRef}
          src={getMapSrc()}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          importance="high"
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
          referrerPolicy="no-referrer-when-downgrade"
          onLoad={handleMapLoad}
          onError={handleMapError}
          title={`Карта: ${fullAddress}`}
        />
      ) : (
        <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
          <img
            src={getStaticMapSrc()}
            alt={`Карта: ${fullAddress}`}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onLoad={handleStaticMapLoad}
            onError={handleStaticMapError}
          />
          <Box 
            sx={{ 
              position: 'absolute',
              bottom: 10,
              left: 10,
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              padding: 1,
              borderRadius: 1,
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <LocationOnIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="body2">{fullAddress}</Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default MapIframe; 