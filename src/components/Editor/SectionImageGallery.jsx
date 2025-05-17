import React, { useState, useEffect } from 'react';
import { Box, Grid, IconButton, Typography, Tooltip, FormControlLabel, Switch } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SlideshowIcon from '@mui/icons-material/Slideshow';
import StopIcon from '@mui/icons-material/Stop';

const SectionImageGallery = ({ sectionId, images = [], onReorder, onDelete }) => {
  const [draggingIndex, setDraggingIndex] = useState(null);
  const [autoScroll, setAutoScroll] = useState(true);

  useEffect(() => {
    if (images.length > 1) {
      sendAutoScrollMessage(true);
    }
  }, []);

  const handleDragStart = (index) => {
    setDraggingIndex(index);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggingIndex === null || draggingIndex === index) return;

    onReorder(draggingIndex, index);
    setDraggingIndex(index);
  };

  const handleDragEnd = () => {
    setDraggingIndex(null);
  };

  const formatImageUrl = (url) => {
    if (!url) return 'Нет URL';
    
    if (typeof url === 'string' && url.startsWith('blob:')) {
      return 'blob:...' + url.slice(-12);
    }
    
    if (typeof url === 'string') {
      const parts = url.split('/');
      if (parts.length > 2) {
        return '.../' + parts.slice(-2).join('/');
      }
      return url;
    }
    
    return 'Неизвестный формат';
  };

  const sendAutoScrollMessage = (enabled) => {
    console.log(`[SectionImageGallery] Sending autoScroll=${enabled} for section ${sectionId}`);
    
    window.postMessage({
      type: 'UPDATE_AUTOSCROLL_SETTING',
      sectionId,
      autoScroll: enabled
    }, '*');
    
    const previewIframe = document.getElementById('preview-iframe');
    if (previewIframe && previewIframe.contentWindow) {
      previewIframe.contentWindow.postMessage({
        type: 'UPDATE_AUTOSCROLL_SETTING',
        sectionId,
        autoScroll: enabled
      }, '*');
    }
    
    if (window.parent && window !== window.parent) {
      window.parent.postMessage({
        type: 'UPDATE_AUTOSCROLL_SETTING',
        sectionId,
        autoScroll: enabled
      }, '*');
    }
  };

  const handleAutoScrollChange = (event) => {
    const newValue = event.target.checked;
    setAutoScroll(newValue);
    sendAutoScrollMessage(newValue);
  };

  return (
    <Box sx={{ mt: 2 }}>
      {images.length > 1 && (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <FormControlLabel
            control={
              <Switch
                checked={autoScroll}
                onChange={handleAutoScrollChange}
                color="primary"
                size="small"
              />
            }
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {autoScroll ? <SlideshowIcon fontSize="small" sx={{ mr: 0.5 }} /> : <StopIcon fontSize="small" sx={{ mr: 0.5 }} />}
                <Typography variant="body2">
                  {autoScroll ? "Автопрокрутка включена" : "Автопрокрутка выключена"}
                </Typography>
              </Box>
            }
          />
        </Box>
      )}
      
      <Grid container spacing={2}>
        {images.map((image, index) => (
          <Grid 
            item 
            xs={6} 
            sm={4} 
            md={3} 
            key={index}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
            sx={{
              cursor: 'move',
              opacity: draggingIndex === index ? 0.5 : 1,
              transition: 'opacity 0.2s'
            }}
          >
            <Tooltip 
              title={
                <React.Fragment>
                  <Typography color="inherit">Изображение {index + 1}</Typography>
                  <Typography variant="body2" sx={{ wordBreak: 'break-all', fontSize: '0.75rem' }}>
                    {image.url || image.path}
                  </Typography>
                </React.Fragment>
              }
              arrow
              placement="top"
            >
              <Box
                sx={{
                  position: 'relative',
                  paddingTop: '100%',
                  border: '1px solid #ddd',
                  borderRadius: 1,
                  overflow: 'hidden',
                  '&:hover': {
                    '& .image-overlay': {
                      opacity: 1
                    }
                  }
                }}
              >
                <Box
                  component="img"
                  src={image.url || image.path}
                  alt={`Изображение ${index + 1}`}
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
                <Box
                  className="image-overlay"
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    bgcolor: 'rgba(0,0,0,0.3)',
                    opacity: 0,
                    transition: 'opacity 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => onDelete(index)}
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.8)',
                      '&:hover': {
                        bgcolor: 'rgba(255,255,255,0.9)'
                      }
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
                <Typography
                  variant="caption"
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    bgcolor: 'rgba(0,0,0,0.6)',
                    color: 'white',
                    p: 0.5,
                    textAlign: 'center',
                    fontSize: '0.7rem',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {index + 1} из {images.length}
                </Typography>
              </Box>
            </Tooltip>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default SectionImageGallery; 