import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box, IconButton, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme, testimonial }) => ({
  backgroundColor: testimonial?.backgroundType === 'solid' 
    ? (testimonial?.backgroundColor || theme.palette.background.paper)
    : 'transparent',
  background: testimonial?.backgroundType === 'gradient' 
    ? `linear-gradient(${testimonial?.gradientDirection || 'to right'}, ${testimonial?.gradientColor1 || '#ffffff'}, ${testimonial?.gradientColor2 || '#f5f5f5'})`
    : undefined,
  borderRadius: testimonial?.style?.borderRadius || '15px',
  boxShadow: testimonial?.style?.shadow || theme.shadows[2],
  border: `1px solid ${testimonial?.borderColor || theme.palette.divider}`,
  transition: 'all 0.3s ease-in-out',
  height: 'auto',
  minHeight: '200px',
  display: 'flex',
  flexDirection: 'column',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[8],
  }
}));

const TestimonialCard = ({ testimonial }) => {
  const [showExpandButton, setShowExpandButton] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const contentRef = React.useRef(null);

  // Устанавливаем значения по умолчанию
  const defaultTestimonial = {
    ...testimonial
  };

  useEffect(() => {
    const checkOverflow = () => {
      if (contentRef.current) {
        const element = contentRef.current;
        const isOverflowing = element.scrollHeight > element.clientHeight;
        setShowExpandButton(isOverflowing);
      }
    };

    setTimeout(checkOverflow, 0);
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, [defaultTestimonial.content]);

  const handleOpenModal = (e) => {
    e.stopPropagation();
    setOpenModal(true);
  };

  const handleCloseModal = (e) => {
    e.stopPropagation();
    setOpenModal(false);
  };

  return (
    <>
      <StyledCard testimonial={defaultTestimonial}>
        <CardContent sx={{ 
          p: 3,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          '&:last-child': {
            pb: 3
          }
        }}>
          {/* Заголовок */}
          {defaultTestimonial.showTitle && (
            <Box sx={{ mb: 2, flexShrink: 0 }}>
              <Typography 
                variant="h6" 
                component="div" 
                sx={{ 
                  color: defaultTestimonial.titleColor || 'text.primary',
                  fontWeight: 600,
                  mb: 1,
                  wordBreak: 'break-word'
                }}
              >
                {defaultTestimonial.title}
              </Typography>
            </Box>
          )}

          {/* Текст отзыва */}
          <Box sx={{ 
            position: 'relative',
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            minHeight: 0
          }}>
            <Typography
              ref={contentRef}
              variant="body1"
              sx={{
                color: defaultTestimonial.contentColor || 'text.secondary',
                lineHeight: 1.6,
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                wordBreak: 'break-word'
              }}
            >
              {defaultTestimonial.content}
            </Typography>
            {showExpandButton && (
              <Typography
                component="span"
                className="expand-arrow"
                onClick={handleOpenModal}
                sx={{
                  color: 'primary.main',
                  cursor: 'pointer',
                  display: 'inline-block',
                  mt: 0.5,
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'translateX(5px)'
                  }
                }}
              >
                Читать далее →
              </Typography>
            )}
          </Box>
        </CardContent>
      </StyledCard>

      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {defaultTestimonial.title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {defaultTestimonial.content}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Закрыть</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TestimonialCard;