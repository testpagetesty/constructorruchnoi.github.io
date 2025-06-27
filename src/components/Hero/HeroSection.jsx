import React from 'react';
import { Box, Typography, Container, useTheme } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';

const zoomAnimation = keyframes`
  from {
    transform: scale(1);
  }
  to {
    transform: scale(1.1);
  }
`;

const panAnimation = keyframes`
  0% {
    background-position: 0% 0%;
  }
  50% {
    background-position: 100% 100%;
  }
  100% {
    background-position: 0% 0%;
  }
`;

const fadeAnimation = keyframes`
  from {
    opacity: 0.8;
  }
  to {
    opacity: 1;
  }
`;

const pulseAnimation = keyframes`
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.02);
    opacity: 0.9;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

const HeroContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  minHeight: '500px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
}));

const BackgroundLayer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  zIndex: 1,
}));

const OverlayLayer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 2,
}));

const HeroContent = styled(Box)(({ theme }) => ({
  position: 'relative',
  zIndex: 3,
  textAlign: 'center',
  padding: theme.spacing(4),
  maxWidth: '800px',
  margin: '0 auto'
}));

const HeroSection = ({ 
  title, 
  subtitle, 
  backgroundType = 'solid',
  backgroundImage = '',
  backgroundColor = '#ffffff',
  gradientColor1 = '#ffffff',
  gradientColor2 = '#f5f5f5',
  gradientDirection = 'to right',
  titleColor = '#ffffff',
  subtitleColor = '#ffffff',
  animationType = 'none',
  enableOverlay = false,
  overlayOpacity = 50,
  enableBlur = false,
  blurAmount = 0
}) => {
  const theme = useTheme();

  const getAnimation = () => {
    switch (animationType) {
      case 'zoom':
        return `${zoomAnimation} 20s infinite alternate`;
      case 'pan':
        return `${panAnimation} 30s infinite alternate`;
      case 'fade':
        return `${fadeAnimation} 5s infinite alternate`;
      case 'pulse':
        return `${pulseAnimation} 10s infinite ease-in-out`;
      default:
        return 'none';
    }
  };

  const getBackgroundStyle = () => {
    const baseStyle = {
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      animation: getAnimation()
    };

    switch (backgroundType) {
      case 'image':
        let imageUrl = backgroundImage;
        if (imageUrl && !imageUrl.startsWith('/images/hero/')) {
          imageUrl = `/images/hero/${imageUrl}`;
        }
        
        return {
          ...baseStyle,
          backgroundImage: `url(${imageUrl})`,
          filter: enableBlur ? `blur(${blurAmount}px)` : 'none',
        };

      case 'solid':
        return {
          ...baseStyle,
          backgroundColor: backgroundColor
        };

      case 'gradient':
        return {
          ...baseStyle,
          background: `linear-gradient(${gradientDirection}, ${gradientColor1}, ${gradientColor2})`
        };

      default:
        return baseStyle;
    }
  };

  return (
    <HeroContainer>
      <BackgroundLayer sx={getBackgroundStyle()} />
      {enableOverlay && (
        <OverlayLayer 
          sx={{ 
            backgroundColor: `rgba(0, 0, 0, ${overlayOpacity / 100})`,
            transition: 'background-color 0.3s ease'
          }} 
        />
      )}
      <HeroContent>
        <Typography
          variant="h2"
          component="h1"
          gutterBottom
          sx={{
            color: titleColor,
            fontWeight: 700,
            marginBottom: theme.spacing(0.5),
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
          }}
        >
          {title}
        </Typography>
        <Typography
          variant="h5"
          component="p"
          sx={{
            color: subtitleColor,
            fontWeight: 400,
            textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
          }}
        >
          {subtitle}
        </Typography>
      </HeroContent>
    </HeroContainer>
  );
};

export default HeroSection; 