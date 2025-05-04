import React, { useRef, useState, useEffect, useCallback } from 'react';
import { 
  Box, 
  Typography, 
  AppBar, 
  Toolbar, 
  Container,
  Button,
  Grid,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
  Fade,
  Grow,
  Switch
} from '@mui/material';
import { styled } from '@mui/material/styles';
import HeroSection from '../Hero/HeroSection';
import ContactSection from '../Contact/ContactSection';
import FooterSection from '../Footer/FooterSection';
import Header from '../Header/Header';
import TestimonialCard from '../Testimonial/TestimonialCard';
import ReactDOM from 'react-dom/client';

const SimpleCard = styled(Card)(({ theme, card }) => ({
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: card?.backgroundType === 'solid' ? (card?.backgroundColor || 'transparent') : 'transparent',
  background: card?.backgroundType === 'gradient' 
    ? `linear-gradient(${card?.gradientDirection || 'to right'}, ${card?.gradientColor1 || '#ffffff'}, ${card?.gradientColor2 || '#f5f5f5'})`
    : undefined,
  border: `3px solid ${card?.borderColor || theme.palette.divider}`,
  width: '100%',
  maxWidth: '280px',
  borderRadius: '12px',
  overflow: 'hidden',
  height: 'auto',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[4],
    '& .MuiTypography-h6': {
      color: theme.palette.primary.main
    },
    '& .MuiTypography-body2': {
      color: theme.palette.text.primary
    }
  }
}));

const ElevatedCard = styled(Card)(({ theme, card }) => ({
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: card?.backgroundType === 'solid' ? (card?.backgroundColor || 'transparent') : 'transparent',
  background: card?.backgroundType === 'gradient' 
    ? `linear-gradient(${card?.gradientDirection || 'to right'}, ${card?.gradientColor1 || '#ffffff'}, ${card?.gradientColor2 || '#f5f5f5'})`
    : undefined,
  border: `3px solid ${card?.borderColor || theme.palette.divider}`,
  width: '100%',
  maxWidth: '280px',
  borderRadius: '12px',
  overflow: 'hidden',
  boxShadow: theme.shadows[2],
  height: 'auto',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8],
    '& .MuiTypography-h6': {
      color: theme.palette.primary.main,
      transform: 'translateX(4px)'
    },
    '& .MuiTypography-body2': {
      color: theme.palette.text.primary
    }
  }
}));

const OutlinedCard = styled(Card)(({ theme, card }) => ({
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: card?.backgroundType === 'solid' ? (card?.backgroundColor || 'transparent') : 'transparent',
  background: card?.backgroundType === 'gradient' 
    ? `linear-gradient(${card?.gradientDirection || 'to right'}, ${card?.gradientColor1 || '#e8f5e9'}, ${card?.gradientColor2 || '#c8e6c9'})`
    : `linear-gradient(to right, #e8f5e9, #c8e6c9)`,
  border: `3px solid ${card?.borderColor || theme.palette.divider}`,
  width: '100%',
  maxWidth: '280px',
  borderRadius: '12px',
  overflow: 'hidden',
  height: 'auto',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    borderColor: theme.palette.primary.main,
    '& .MuiTypography-h6': {
      color: theme.palette.primary.main
    },
    '& .MuiTypography-body2': {
      color: theme.palette.text.primary
    }
  }
}));

const AccentCard = styled(Card)(({ theme, card, section }) => ({
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: card?.backgroundType === 'solid' ? (card?.backgroundColor || 'transparent') : 'transparent',
  background: card?.backgroundType === 'gradient' 
    ? `linear-gradient(${card?.gradientDirection || 'to right'}, ${card?.gradientColor1 || '#ffffff'}, ${card?.gradientColor2 || '#f5f5f5'})`
    : undefined,
  border: `3px solid ${card?.borderColor || theme.palette.divider}`,
  position: 'relative',
  width: '100%',
  maxWidth: '280px',
  borderRadius: '12px',
  overflow: 'hidden',
  boxShadow: theme.shadows[1],
  height: 'auto',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[4],
    '& .MuiTypography-h6': {
      color: theme.palette.primary.main
    },
    '& .MuiTypography-body2': {
      color: theme.palette.text.primary
    },
    '&::before': {
      width: '6px'
    }
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '4px',
    background: `linear-gradient(to bottom, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
    transition: 'width 0.3s ease-in-out'
  }
}));

const GradientCard = styled(Card)(({ theme, card }) => ({
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: card?.backgroundType === 'solid' ? (card?.backgroundColor || 'transparent') : 'transparent',
  background: card?.backgroundType === 'gradient' 
    ? `linear-gradient(${card?.gradientDirection || 'to right'}, ${card?.gradientColor1 || '#ffffff'}, ${card?.gradientColor2 || '#f5f5f5'})`
    : `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
  border: `3px solid ${card?.borderColor || theme.palette.divider}`,
  width: '100%',
  maxWidth: '280px',
  borderRadius: '12px',
  overflow: 'hidden',
  boxShadow: theme.shadows[1],
  height: 'auto',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[4],
    background: card?.backgroundType === 'solid' 
      ? card?.backgroundColor 
      : `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
    '& .MuiTypography-h6': {
      color: theme.palette.primary.contrastText
    },
    '& .MuiTypography-body2': {
      color: theme.palette.primary.contrastText
    }
  }
}));

const CARD_TYPES = {
  NONE: 'none',
  SIMPLE: 'simple',
  ELEVATED: 'elevated',
  OUTLINED: 'outlined',
  ACCENT: 'accent',
  GRADIENT: 'gradient'
};

const CARD_COMPONENTS = {
  [CARD_TYPES.SIMPLE]: SimpleCard,
  [CARD_TYPES.ELEVATED]: ElevatedCard,
  [CARD_TYPES.OUTLINED]: OutlinedCard,
  [CARD_TYPES.ACCENT]: AccentCard,
  [CARD_TYPES.GRADIENT]: GradientCard
};

const PagePreview = ({
  headerData,
  heroData,
  sectionsData = {},
  contactData,
  footerData,
  legalDocuments
}) => {
  const sectionRefs = useRef({});
  const cardRefs = useRef({});
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const contactSectionRef = useRef(null);
  const heroSectionRef = useRef(null);
  const [backgroundSettings, setBackgroundSettings] = useState({
    blur: headerData?.siteBackgroundBlur || 0,
    darkness: headerData?.siteBackgroundDarkness || 0
  });
  const [showBorders, setShowBorders] = useState(true);

  // Добавляем стили для анимации рамки
  const globalStyles = `
    @keyframes borderPulse {
      0% {
        border-width: 4px;
        box-shadow: 0 0 0 0 rgba(25, 118, 210, 0.4);
      }
      50% {
        border-width: 5px;
        box-shadow: 0 0 20px 10px rgba(25, 118, 210, 0.2);
      }
      100% {
        border-width: 4px;
        box-shadow: 0 0 0 0 rgba(25, 118, 210, 0.4);
      }
    }

    @keyframes glowPulse {
      0% {
        box-shadow: 0 0 5px 0 rgba(25, 118, 210, 0.4);
      }
      50% {
        box-shadow: 0 0 20px 10px rgba(25, 118, 210, 0.2);
      }
      100% {
        box-shadow: 0 0 5px 0 rgba(25, 118, 210, 0.4);
      }
    }
  `;

  const renderCard = (card, cardType, section) => {
    const CardComponent = CARD_COMPONENTS[cardType] || SimpleCard;
    
    return (
      <CardComponent
        ref={el => {
          if (el) {
            cardRefs.current[`${section.id}-${card.id}`] = el;
          }
        }}
        card={card}
        section={section}
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <CardContent sx={{ flexGrow: 1 }}>
          {card.showTitle && (
            <Typography 
              variant="h6" 
              component="h2" 
              gutterBottom
              sx={{ 
                color: card.titleColor || 'inherit',
                fontWeight: 600
              }}
            >
              {card.title}
            </Typography>
          )}
          <Typography 
            variant="body2" 
            sx={{ 
              color: card.contentColor || 'inherit',
              flexGrow: 1
            }}
          >
            {card.content}
          </Typography>
        </CardContent>
      </CardComponent>
    );
  };

  const renderSection = (section) => {
    // Получаем цвета из карточек секции для градиента рамки
    const getBorderColors = () => {
      if (section.cards && section.cards.length > 0) {
        const firstCard = section.cards[0];
        const lastCard = section.cards[section.cards.length - 1];
        
        // Используем только цвет обводки карточки
        const startColor = firstCard.borderColor || theme.palette.primary.main;
        const endColor = lastCard.borderColor || theme.palette.primary.light;

        return {
          start: startColor,
          end: endColor
        };
      }
      
      // Если карточек нет, используем цвета из темы
      return {
        start: theme.palette.primary.main,
        end: theme.palette.primary.light
      };
    };

    const borderColors = getBorderColors();

    if (section.id === 'about') {
      const showCards = section.cardType !== CARD_TYPES.NONE && section.cards?.length > 0;
      const isNoCards = section.cardType === CARD_TYPES.NONE;
      return (
        <Box className="about-section" sx={{ 
          display: 'flex', 
          alignItems: 'flex-start',
          flexDirection: { xs: 'column', md: isNoCards ? 'column' : 'row' },
          gap: 4,
          p: 4,
          borderRadius: '16px',
          background: 'linear-gradient(145deg, #ffffff, #f5f5f5)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderRadius: '16px',
            padding: '2px',
            background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
            mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            maskComposite: 'exclude',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            zIndex: 0
          }
        }}>
          {/* Если без карточек — картинка справа, текст обтекает */}
          {isNoCards ? (
            <Box sx={{ width: '100%', display: { xs: 'block', md: 'flex' }, alignItems: 'flex-start', position: 'relative' }}>
              {section.imagePath && (
                <Box
                  sx={{
                    flex: '0 0 50%',
                    maxWidth: { xs: '100%', md: '520px' },
                    width: { xs: '100%', md: '50%' },
                    mr: { xs: 0, md: 4 },
                    mb: { xs: 2, md: 0 },
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                    transition: 'transform 0.3s ease',
                    '&:hover img': {
                      transform: 'scale(1.02)'
                    }
                  }}
                >
                  <img
                    src={section.imagePath}
                    alt="About us"
                    style={{
                      width: '100%',
                      height: 'auto',
                      borderRadius: '12px',
                      display: 'block',
                      transition: 'transform 0.3s ease'
                    }}
                  />
                </Box>
              )}
              <Box sx={{ overflow: 'hidden', flex: 1 }}>
                <Typography 
                  variant="h3" 
                  component="h2"
                  sx={{ 
                    fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' },
                    fontWeight: 700,
                    mb: 2,
                    textAlign: 'left',
                    color: section.titleColor || '#000000',
                    position: 'relative',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: '-8px',
                      left: 0,
                      width: '60px',
                      height: '4px',
                      background: 'linear-gradient(to right, #1976d2, #42a5f5)',
                      borderRadius: '2px'
                    }
                  }}
                >
                  {section.title || ''}
                </Typography>
                {section.description && (
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      fontSize: { xs: '1rem', sm: '1.1rem' },
                      lineHeight: 1.6,
                      textAlign: 'left',
                      color: section.descriptionColor || '#666666',
                      mb: 2
                    }}
                  >
                    {section.description}
                    {section.cards?.length > 0 && (
                      <>
                        {section.cards.map((card, idx) => (
                          <span key={card.id}>
                            {card.title && (
                              <><br /><strong style={{color: card.titleColor || '#1976d2'}}>{card.title}</strong></>
                            )}
                            {card.content && (
                              <><br />{card.content}</>
                            )}
                            {idx !== section.cards.length - 1 && <br />}
                          </span>
                        ))}
                      </>
                    )}
                  </Typography>
                )}
              </Box>
            </Box>
          ) : (
            <>
              <Box className="about-image" sx={{ 
                flex: 1,
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  top: '-8px',
                  left: '-8px',
                  right: '-8px',
                  bottom: '-8px',
                  background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                  borderRadius: '16px',
                  zIndex: -1,
                  opacity: 0.3
                }
              }}>
                {section.imagePath ? (
                  <img 
                    src={section.imagePath}
                    alt="About us"
                    style={{
                      width: '100%',
                      maxWidth: '600px',
                      height: 'auto',
                      borderRadius: '12px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                      transition: 'transform 0.3s ease'
                    }}
                    onMouseOver={(e) => { e.currentTarget.style.transform = 'scale(1.02)' }}
                    onMouseOut={(e) => { e.currentTarget.style.transform = 'scale(1)' }}
                  />
                ) : (
                  <Box sx={{ 
                    width: '100%', 
                    maxWidth: '600px',
                    height: '400px', 
                    backgroundColor: '#f0f0f0',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#999'
                  }}>
                    <Typography>Изображение не выбрано</Typography>
                  </Box>
                )}
              </Box>
              <Box className="about-content" sx={{ 
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                pl: { xs: 0, md: 2 },
                pt: { xs: 2, md: 0 },
                position: 'relative',
                textAlign: 'left',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  left: { xs: 0, md: 0 },
                  top: { xs: 0, md: 0 },
                  bottom: { xs: 'auto', md: 0 },
                  width: { xs: '40px', md: '4px' },
                  height: { xs: '4px', md: 'auto' },
                  background: {
                    xs: 'linear-gradient(to right, #1976d2, #42a5f5)',
                    md: 'linear-gradient(to bottom, #1976d2, #42a5f5)'
                  },
                  borderRadius: '2px'
                }
              }}>
                <Typography 
                  variant="h3" 
                  component="h2"
                  sx={{ 
                    fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' },
                    fontWeight: 700,
                    mb: 2,
                    textAlign: 'left',
                    color: section.titleColor || '#000000',
                    position: 'relative',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: '-8px',
                      left: 0,
                      width: '60px',
                      height: '4px',
                      background: 'linear-gradient(to right, #1976d2, #42a5f5)',
                      borderRadius: '2px'
                    }
                  }}
                >
                  {section.title || ''}
                </Typography>
                {section.description && (
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      fontSize: { xs: '1rem', sm: '1.1rem' },
                      lineHeight: 1.6,
                      textAlign: 'left',
                      color: section.descriptionColor || '#666666',
                      mb: 2
                    }}
                  >
                    {section.description}
                  </Typography>
                )}
                {/* Если карточки нужны, отображаем их */}
                {showCards && (
                  <Box sx={{ 
                    width: '100%',
                    mt: 4,
                    display: 'flex',
                    justifyContent: 'center'
                  }}>
                    <Grid container spacing={4} sx={{ 
                      maxWidth: '1200px',
                      justifyContent: 'center'
                    }}>
                      {section.cards?.map((card, index) => (
                        <Grid item xs={12} sm={6} md={4} key={card.id} sx={{ 
                          display: 'flex',
                          justifyContent: 'center'
                        }}>
                          <Grow in timeout={1000 + index * 200}>
                            <Box sx={{ width: '100%', maxWidth: '300px' }}>
                              {renderCard(card, section.cardType, section)}
                            </Box>
                          </Grow>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                )}
              </Box>
            </>
          )}
        </Box>
      );
    }
    
    if (!section) return null;

    return (
      <Box
        key={section.id}
        id={section.id}
        ref={el => {
          if (el) {
            sectionRefs.current[section.id] = el;
          }
        }}
        sx={{
          py: 8,
          px: 2,
          backgroundColor: section.backgroundColor || 'transparent',
          color: section.textColor || 'inherit',
          position: 'relative',
          overflow: 'hidden',
          '&::before': showBorders ? {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            border: '4px solid transparent',
            borderRadius: '20px',
            background: `linear-gradient(45deg, ${borderColors.start}, ${borderColors.end}) border-box`,
            WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
            zIndex: 1,
            transition: 'all 0.3s ease-in-out',
            animation: 'borderPulse 3s infinite, glowPulse 3s infinite',
          } : {},
          '&:hover::before': showBorders ? {
            border: '5px solid transparent',
            boxShadow: `0 0 25px 15px ${borderColors.start}`,
            animation: 'none',
          } : {}
        }}
      >
        <Box sx={{ position: 'absolute', top: 10, right: 10, zIndex: 2 }}>
          <Switch
            checked={showBorders}
            onChange={() => setShowBorders(!showBorders)}
            color="primary"
            size="small"
          />
        </Box>
        {/* Фоновое изображение с размытием */}
        {section.backgroundImage && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: `url(${section.backgroundImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: `blur(${section.blurAmount || 0}px)`,
              transition: 'filter 0.3s ease-in-out',
              zIndex: 0
            }}
          />
        )}
        
        {/* Затемнение */}
        {section.enableOverlay && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: `rgba(0, 0, 0, ${Number(section.overlayOpacity)})`,
              transition: 'background-color 0.3s ease-in-out',
              zIndex: 1
            }}
          />
        )}

        <Container maxWidth="lg">
          <Box sx={{ 
            position: 'relative', 
            zIndex: 2,
            maxWidth: '800px',
            margin: '0 auto',
            textAlign: 'center'
          }}>
            <Fade in timeout={1000}>
              <Typography 
                variant="h3" 
                component="h2" 
                gutterBottom
                sx={{ 
                  textAlign: 'center',
                  mb: 4,
                  color: section.titleColor || 'inherit',
                  fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                  fontWeight: 700,
                  fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                  lineHeight: 1.2,
                  letterSpacing: '-0.01562em',
                  textTransform: 'none',
                  marginBottom: '1.5rem',
                  wordWrap: 'break-word'
                }}
              >
                {section.title}
              </Typography>
            </Fade>
            
            {section.description && (
              <Fade in timeout={1500}>
                <Typography 
                  variant="h6" 
                  component="p" 
                  sx={{ 
                    textAlign: 'center',
                    mb: 4,
                    color: section.descriptionColor || 'inherit',
                    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                    fontWeight: 400,
                    fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' },
                    lineHeight: 1.5,
                    letterSpacing: '0.00938em',
                    maxWidth: '100%',
                    wordWrap: 'break-word'
                  }}
                >
                  {section.description}
                </Typography>
              </Fade>
            )}
            
            {/* Добавляем отображение изображения секции только если есть карточки */}
            {section.cardType !== CARD_TYPES.NONE && section.cards?.length > 0 && section.imagePath && (
              <Fade in timeout={1800}>
                <Box className="section-image" sx={{ 
                  mt: 3, 
                  mb: 4,
                  textAlign: 'center',
                  maxWidth: '100%'
                }}>
                  <img 
                    src={section.imagePath} 
                    alt={section.title || 'Section image'} 
                    loading="lazy"
                    style={{
                      maxWidth: '100%',
                      height: 'auto',
                      borderRadius: '12px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                      transition: 'transform 0.3s ease'
                    }}
                    onMouseOver={(e) => { e.currentTarget.style.transform = 'scale(1.02)' }}
                    onMouseOut={(e) => { e.currentTarget.style.transform = 'scale(1)' }}
                  />
                </Box>
              </Fade>
            )}
          </Box>

          {section.cardType !== CARD_TYPES.NONE && section.cards?.length > 0 ? (
            <Box sx={{ 
              mt: section.description ? 0 : 16,
              pt: section.description ? 8 : 0
            }} className="cards-container">
              <Grid container spacing={4}>
                {section.cards?.map((card, index) => (
                  <Grid item xs={12} sm={6} md={4} key={card.id}>
                    <Grow in timeout={1000 + index * 200}>
                      <Box>
                        {section.id === 'testimonials' ? (
                          <TestimonialCard testimonial={card} />
                        ) : (
                          <Box sx={{ height: '100%' }}>
                            {renderCard(card, section.cardType, section)}
                          </Box>
                        )}
                      </Box>
                    </Grow>
                  </Grid>
                ))}
              </Grid>
            </Box>
          ) : (
            <Box sx={{ 
              mt: 4,
              p: 4,
              borderRadius: '16px',
              background: 'linear-gradient(145deg, #ffffff, #f5f5f5)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                borderRadius: '16px',
                padding: '2px',
                background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                maskComposite: 'exclude',
                WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                WebkitMaskComposite: 'xor',
                zIndex: 0
              }
            }}>
              <Box sx={{ 
                position: 'relative',
                textAlign: 'left',
                overflow: 'hidden'
              }}>
                <Typography 
                  variant="h3" 
                  component="h2"
                  sx={{ 
                    fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' },
                    fontWeight: 700,
                    mb: 2,
                    textAlign: 'left',
                    color: section.titleColor || '#000000',
                    position: 'relative',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: '-8px',
                      left: 0,
                      width: '60px',
                      height: '4px',
                      background: 'linear-gradient(to right, #1976d2, #42a5f5)',
                      borderRadius: '2px'
                    }
                  }}
                >
                  {section.title}
                </Typography>
                {section.imagePath && (
                  <Box sx={{ 
                    float: 'right',
                    margin: '0 0 1rem 1.5rem',
                    maxWidth: '300px',
                    width: '100%',
                    position: 'relative',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      top: '-8px',
                      left: '-8px',
                      right: '-8px',
                      bottom: '-8px',
                      background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                      borderRadius: '16px',
                      zIndex: -1,
                      opacity: 0.3
                    }
                  }}>
                    <img 
                      src={section.imagePath} 
                      alt={section.title || 'Section image'} 
                      style={{
                        width: '100%',
                        height: 'auto',
                        borderRadius: '12px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        transition: 'transform 0.3s ease',
                        display: 'block'
                      }}
                      onMouseOver={(e) => { e.currentTarget.style.transform = 'scale(1.02)' }}
                      onMouseOut={(e) => { e.currentTarget.style.transform = 'scale(1)' }}
                    />
                  </Box>
                )}
                <Box sx={{ pl: 2 }}>
                  {section.description && (
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        fontSize: { xs: '1rem', sm: '1.1rem' },
                        lineHeight: 1.6,
                        textAlign: 'left',
                        color: section.descriptionColor || '#666666',
                        mb: 2
                      }}
                    >
                      {section.description}
                    </Typography>
                  )}
                  {section.cards?.map((card, index) => (
                    <Box key={card.id} sx={{ mb: 2 }}>
                      {card.title && (
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            color: card.titleColor || '#1976d2',
                            mb: 1,
                            fontWeight: 600
                          }}
                        >
                          {card.title}
                        </Typography>
                      )}
                      {card.content && (
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            fontSize: { xs: '1rem', sm: '1.1rem' },
                            lineHeight: 1.6,
                            textAlign: 'left',
                            color: card.contentColor || '#666666'
                          }}
                        >
                          {card.content}
                        </Typography>
                      )}
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>
          )}
        </Container>
      </Box>
    );
  };

  useEffect(() => {
    const updateCardHeights = () => {
      Object.entries(sectionsData || {}).forEach(([sectionId, sectionContent]) => {
        if (!sectionContent.cards || sectionContent.cards.length === 0) return;

        // Reset all card heights to auto first
        sectionContent.cards.forEach(card => {
          const ref = cardRefs.current[`${sectionId}-${card.id}`];
          if (ref) {
            ref.style.height = 'auto';
          }
        });

        // Force reflow
        void document.body.offsetHeight;

        // Get current heights of all cards
        const currentHeights = sectionContent.cards.map(card => {
          const ref = cardRefs.current[`${sectionId}-${card.id}`];
          return ref ? ref.getBoundingClientRect().height : 0;
        });

        // Find the maximum height
        const maxHeight = Math.max(...currentHeights);

        // Update all cards in this section to match the max height
        sectionContent.cards.forEach(card => {
          const ref = cardRefs.current[`${sectionId}-${card.id}`];
          if (ref) {
            ref.style.height = `${maxHeight}px`;
          }
        });
      });
    };

    // Initial update
    updateCardHeights();

    // Set up mutation observer to watch for content changes
    const observer = new MutationObserver(updateCardHeights);
    const config = { 
      childList: true, 
      subtree: true, 
      characterData: true
    };

    // Observe all card content
    Object.entries(sectionsData || {}).forEach(([sectionId, sectionContent]) => {
      if (!sectionContent.cards || sectionContent.cards.length === 0) return;
      sectionContent.cards.forEach(card => {
        const ref = cardRefs.current[`${sectionId}-${card.id}`];
        if (ref) {
          observer.observe(ref, config);
        }
      });
    });

    return () => {
      observer.disconnect();
    };
  }, [sectionsData]);

  const scrollToSection = (id) => {
    setTimeout(() => {
      const element = sectionRefs.current[id];
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        console.warn(`Section with id ${id} not found`);
      }
    }, 100);
  };

  const handleMenuClick = (id) => {
    scrollToSection(id);
  };

  // Apply background styles to preview area
  React.useEffect(() => {
    const previewArea = document.querySelector('.preview-area');
    if (!previewArea) return;

    // Remove any existing overlay
    const existingOverlay = previewArea.querySelector('.site-overlay');
    if (existingOverlay) {
      existingOverlay.remove();
    }

    // Apply background only to main content area
    const mainContent = previewArea.querySelector('main');
    if (!mainContent) return;

    if (headerData?.siteBackgroundType === 'solid') {
      mainContent.style.background = 'none';
      mainContent.style.backgroundColor = headerData.siteBackgroundColor || '#ffffff';
    } else if (headerData?.siteBackgroundType === 'gradient') {
      mainContent.style.background = `linear-gradient(${headerData?.siteGradientDirection || 'to right'}, 
        ${headerData?.siteGradientColor1 || '#ffffff'}, 
        ${headerData?.siteGradientColor2 || '#f5f5f5'})`;
      mainContent.style.backgroundColor = 'transparent';
    } else if (headerData?.siteBackgroundType === 'image') {
      // Remove any existing background elements
      const existingBackground = mainContent.querySelector('.background-image');
      if (existingBackground) {
        existingBackground.remove();
      }

      // Create background image element
      const backgroundImage = document.createElement('div');
      backgroundImage.className = 'background-image';
      backgroundImage.style.position = 'absolute';
      backgroundImage.style.top = '0';
      backgroundImage.style.left = '0';
      backgroundImage.style.right = '0';
      backgroundImage.style.bottom = '0';
      backgroundImage.style.background = `url('/images/hero/fon.jpg') no-repeat center center fixed`;
      backgroundImage.style.backgroundSize = 'cover';
      backgroundImage.style.zIndex = '-2';
      
      // Apply blur to background image
      if (headerData?.siteBackgroundBlur > 0) {
        backgroundImage.style.filter = `blur(${headerData.siteBackgroundBlur}px)`;
      }
      
      mainContent.appendChild(backgroundImage);
      
      // Add overlay if enabled
      if (headerData?.siteBackgroundDarkness > 0) {
        const overlay = document.createElement('div');
        overlay.className = 'site-overlay';
        overlay.style.position = 'absolute';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = `rgba(0, 0, 0, ${headerData.siteBackgroundDarkness / 100})`;
        overlay.style.zIndex = '-1';
        mainContent.appendChild(overlay);
      }

      // Reset main content styles
      mainContent.style.background = 'none';
      mainContent.style.backgroundColor = 'transparent';
      mainContent.style.filter = 'none';
    }
  }, [headerData]);

  // Обработчик сообщений для обновления фона и изображений секций
  const handleMessage = useCallback((event) => {
    if (event.data.type === 'UPDATE_BACKGROUND') {
      const backgroundImage = document.querySelector('.background-image');
      if (backgroundImage) {
        backgroundImage.style.backgroundImage = `url(${event.data.imageUrl})`;
      }
    } else if (event.data.type === 'UPDATE_SECTION_IMAGE') {
      // Обновляем изображение для конкретной секции
      const { sectionId, imagePath } = event.data;
      if (sectionId && imagePath) {
        console.log(`Updating image for section ${sectionId}: ${imagePath}`);
        // Добавляем параметр времени, чтобы избежать кеширования браузером
        const imageUrl = `${imagePath}?t=${Date.now()}`;
        
        // Найти элемент изображения секции
        const sectionElement = document.getElementById(sectionId);
        if (sectionElement) {
          const imgElement = sectionElement.querySelector('.section-image img');
          if (imgElement) {
            imgElement.src = imageUrl;
          } else if (sectionId === 'about') {
            // Для секции "О нас" структура может быть другой
            const aboutImgElement = sectionElement.querySelector('.about-image img');
            if (aboutImgElement) {
              aboutImgElement.src = imageUrl;
            }
          }
        }
      }
    } else if (event.data.type === 'REMOVE_SECTION_IMAGE') {
      // Обрабатываем удаление изображения секции
      const { sectionId } = event.data;
      if (sectionId) {
        console.log(`Removing image for section ${sectionId}`);
        
        // Найти элемент изображения секции
        const sectionElement = document.getElementById(sectionId);
        if (sectionElement) {
          // В зависимости от структуры секции, ищем разные элементы
          if (sectionId === 'about') {
            // Для секции "О нас"
            const aboutImgElement = sectionElement.querySelector('.about-image img');
            if (aboutImgElement) {
              // Можно скрыть или поставить заглушку
              aboutImgElement.style.display = 'none';
              // Или установить заглушку 
              // aboutImgElement.src = '/placeholder.jpg'; 
            }
          } else {
            // Для обычных секций
            const sectionImageDiv = sectionElement.querySelector('.section-image');
            if (sectionImageDiv) {
              sectionImageDiv.style.display = 'none';
            }
          }
        }
      }
    } else if (event.data.type === 'SCROLL_TO_SECTION') {
      const element = sectionRefs.current[event.data.sectionId];
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [sectionRefs]);

  useEffect(() => {
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [handleMessage]);

  // Обработчик изменений настроек фона
  useEffect(() => {
    const mainContent = document.querySelector('.main-content');
    if (!mainContent) return;

    const backgroundImage = mainContent.querySelector('.background-image');
    const overlay = mainContent.querySelector('.site-overlay');

    if (backgroundImage) {
      backgroundImage.style.transition = 'filter 0.3s ease-in-out';
      backgroundImage.style.filter = `blur(${backgroundSettings.blur}px)`;
    }

    if (overlay) {
      overlay.style.transition = 'background-color 0.3s ease-in-out';
      overlay.style.backgroundColor = `rgba(0, 0, 0, ${backgroundSettings.darkness / 100})`;
    }
  }, [backgroundSettings]);

  // Обновление настроек при изменении headerData
  useEffect(() => {
    setBackgroundSettings({
      blur: headerData?.siteBackgroundBlur || 0,
      darkness: headerData?.siteBackgroundDarkness || 0
    });
  }, [headerData]);

  return (
    <>
      <style>{globalStyles}</style>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        minHeight: '100vh',
        position: 'relative'
      }} className="preview-area">
        <Box
          ref={el => {
            if (el) {
              sectionRefs.current['header'] = el;
            }
          }}
          id="header"
        >
          <Header 
            headerData={headerData} 
            onMenuClick={handleMenuClick}
            contactData={contactData}
          />
        </Box>
        <Box component="main" sx={{ 
          flexGrow: 1,
          position: 'relative'
        }}>
          <Box
            ref={heroSectionRef}
            id="hero"
          >
            <HeroSection 
              title={heroData.title}
              subtitle={heroData.subtitle}
              backgroundType={heroData.backgroundType}
              backgroundImage={heroData.backgroundImage}
              backgroundColor={heroData.backgroundColor}
              gradientColor1={heroData.gradientColor1}
              gradientColor2={heroData.gradientColor2}
              gradientDirection={heroData.gradientDirection}
              titleColor={heroData.titleColor}
              subtitleColor={heroData.subtitleColor}
              animationType={heroData.animationType}
              enableOverlay={heroData.enableOverlay}
              overlayOpacity={heroData.overlayOpacity}
              enableBlur={heroData.enableBlur}
              blurAmount={heroData.blurAmount}
            />
          </Box>
          {Object.entries(sectionsData || {}).map(([sectionId, sectionContent]) => (
            <Box
              key={sectionId}
              id={sectionId}
              ref={el => {
                if (el) {
                  sectionRefs.current[sectionId] = el;
                }
              }}
              sx={{
                position: 'relative',
                mb: 4,
                p: 2,
                border: showBorders ? '1px dashed rgba(0, 0, 0, 0.12)' : 'none',
                borderRadius: 1,
                '&:hover': {
                  border: showBorders ? '1px dashed #1976d2' : 'none'
                }
              }}
            >
              {renderSection(sectionContent)}
            </Box>
          ))}
          <Box
            ref={contactSectionRef}
            id="contact"
            sx={{ py: 8 }}
          >
            <ContactSection 
              contactData={contactData}
              showBorders={showBorders}
            />
          </Box>
        </Box>
        <Box
          ref={el => {
            if (el) {
              sectionRefs.current['footer'] = el;
            }
          }}
          id="footer"
        >
          <FooterSection 
            footerData={footerData}
            contactData={contactData}
            legalDocuments={legalDocuments}
          />
        </Box>
      </Box>
    </>
  );
};

export default PagePreview; 