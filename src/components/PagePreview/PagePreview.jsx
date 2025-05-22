import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Grid, Fade } from '@mui/material';
import { styled } from '@mui/material/styles';
import { CARD_TYPES } from '../../constants';
import { Global } from '@emotion/react';

const slideDown = keyframes`
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const AnimatedBox = styled(Box)(({ theme, delay }) => ({
  animation: `${slideIn} 0.8s ease-out ${delay}s both`
}));

const AnimatedTypography = styled(Typography)(({ theme, animation }) => ({
  animation: animation
}));

const SimpleCard = ({ title, description, content, showTitle, titleColor, descriptionColor, contentColor }) => (
  <Box sx={{ 
    p: 2,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'transparent',
    width: '100%',
    maxWidth: '280px',
    borderRadius: '12px',
    overflow: 'hidden',
    height: 'auto',
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
      transform: 'translateY(-4px)',
      '& .MuiTypography-h6': {
        color: 'primary.main',
        transform: 'translateX(4px)'
      },
      '& .MuiTypography-body2': {
        color: 'text.primary'
      }
    }
  }}>
    {showTitle && (
      <Typography 
        variant="h6" 
        sx={{ 
          color: titleColor || 'inherit',
          fontSize: '1.1rem',
          fontWeight: 500,
          marginBottom: '0.5rem',
          transition: 'all 0.3s ease-in-out'
        }}
      >
        {title}
      </Typography>
    )}
    {description && (
      <Typography 
        variant="body2" 
        color="text.secondary" 
        sx={{ 
          color: descriptionColor || 'inherit',
          fontSize: '0.9rem',
          lineHeight: 1.5,
          marginBottom: '0.5rem',
          transition: 'all 0.3s ease-in-out'
        }}
      >
        {description}
      </Typography>
    )}
    <Typography 
      variant="body1"
      sx={{ 
        color: contentColor || 'inherit',
        fontSize: '1rem',
        lineHeight: 1.6
      }}
    >
      {content}
    </Typography>
  </Box>
);

const ElevatedCard = ({ title, description, content, showTitle, titleColor, descriptionColor, contentColor }) => (
  <Paper elevation={3} sx={{ 
    p: 2,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'white',
    width: '100%',
    maxWidth: '280px',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    height: 'auto',
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
      '& .MuiTypography-h6': {
        color: 'primary.main',
        transform: 'translateX(4px)'
      },
      '& .MuiTypography-body2': {
        color: 'text.primary'
      }
    }
  }}>
    {showTitle && (
      <Typography 
        variant="h6" 
        sx={{ 
          color: titleColor || 'inherit',
          fontSize: '1.1rem',
          fontWeight: 500,
          marginBottom: '0.5rem',
          transition: 'all 0.3s ease-in-out'
        }}
      >
        {title}
      </Typography>
    )}
    {description && (
      <Typography 
        variant="body2" 
        color="text.secondary" 
        sx={{ 
          color: descriptionColor || 'inherit',
          fontSize: '0.9rem',
          lineHeight: 1.5,
          marginBottom: '0.5rem',
          transition: 'all 0.3s ease-in-out'
        }}
      >
        {description}
      </Typography>
    )}
    <Typography 
      variant="body1"
      sx={{ 
        color: contentColor || 'inherit',
        fontSize: '1rem',
        lineHeight: 1.6
      }}
    >
      {content}
    </Typography>
  </Paper>
);

const OutlinedCard = ({ title, description, content, showTitle, titleColor, descriptionColor, contentColor }) => (
  <Paper variant="outlined" sx={{ 
    p: 2,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'white',
    width: '100%',
    maxWidth: '280px',
    borderRadius: '12px',
    overflow: 'hidden',
    height: 'auto',
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
      transform: 'translateY(-4px)',
      borderColor: 'primary.main',
      '& .MuiTypography-h6': {
        color: 'primary.main',
        transform: 'translateX(4px)'
      },
      '& .MuiTypography-body2': {
        color: 'text.primary'
      }
    }
  }}>
    {showTitle && (
      <Typography 
        variant="h6" 
        sx={{ 
          color: titleColor || 'inherit',
          fontSize: '1.1rem',
          fontWeight: 500,
          marginBottom: '0.5rem',
          transition: 'all 0.3s ease-in-out'
        }}
      >
        {title}
      </Typography>
    )}
    {description && (
      <Typography 
        variant="body2" 
        color="text.secondary" 
        sx={{ 
          color: descriptionColor || 'inherit',
          fontSize: '0.9rem',
          lineHeight: 1.5,
          marginBottom: '0.5rem',
          transition: 'all 0.3s ease-in-out'
        }}
      >
        {description}
      </Typography>
    )}
    <Typography 
      variant="body1"
      sx={{ 
        color: contentColor || 'inherit',
        fontSize: '1rem',
        lineHeight: 1.6
      }}
    >
      {content}
    </Typography>
  </Paper>
);

const AccentCard = ({ title, description, content, showTitle, titleColor, descriptionColor, contentColor }) => (
  <Paper 
    sx={{ 
      p: 2,
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'white',
      width: '100%',
      maxWidth: '280px',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      height: 'auto',
      transition: 'all 0.3s ease-in-out',
      borderLeft: '4px solid',
      borderColor: 'primary.main',
      position: 'relative',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
        '& .MuiTypography-h6': {
          color: 'primary.main',
          transform: 'translateX(4px)'
        },
        '& .MuiTypography-body2': {
          color: 'text.primary'
        }
      }
    }}
  >
    {showTitle && (
      <Typography 
        variant="h6" 
        sx={{ 
          color: titleColor || 'inherit',
          fontSize: '1.1rem',
          fontWeight: 500,
          marginBottom: '0.5rem',
          transition: 'all 0.3s ease-in-out'
        }}
      >
        {title}
      </Typography>
    )}
    {description && (
      <Typography 
        variant="body2" 
        color="text.secondary" 
        sx={{ 
          color: descriptionColor || 'inherit',
          fontSize: '0.9rem',
          lineHeight: 1.5,
          marginBottom: '0.5rem',
          transition: 'all 0.3s ease-in-out'
        }}
      >
        {description}
      </Typography>
    )}
    <Typography 
      variant="body1"
      sx={{ 
        color: contentColor || 'inherit',
        fontSize: '1rem',
        lineHeight: 1.6
      }}
    >
      {content}
    </Typography>
  </Paper>
);

const GradientCard = ({ title, description, content, showTitle, titleColor, descriptionColor, contentColor }) => (
  <Paper 
    sx={{ 
      p: 2,
      display: 'flex',
      flexDirection: 'column',
      background: 'linear-gradient(135deg, #1976d2 0%, #64b5f6 100%)',
      color: 'white',
      width: '100%',
      maxWidth: '280px',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      height: 'auto',
      transition: 'all 0.3s ease-in-out',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
        '& .MuiTypography-h6': {
          color: 'white',
          transform: 'translateX(4px)'
        },
        '& .MuiTypography-body2': {
          color: 'white'
        }
      }
    }}
  >
    {showTitle && (
      <Typography 
        variant="h6" 
        sx={{ 
          color: titleColor || 'white',
          fontSize: '1.1rem',
          fontWeight: 500,
          marginBottom: '0.5rem',
          transition: 'all 0.3s ease-in-out'
        }}
      >
        {title}
      </Typography>
    )}
    {description && (
      <Typography 
        variant="body2" 
        sx={{ 
          color: descriptionColor || 'white',
          fontSize: '0.9rem',
          lineHeight: 1.5,
          marginBottom: '0.5rem',
          transition: 'all 0.3s ease-in-out'
        }}
      >
        {description}
      </Typography>
    )}
    <Typography 
      variant="body1"
      sx={{ 
        color: contentColor || 'white',
        fontSize: '1rem',
        lineHeight: 1.6
      }}
    >
      {content}
    </Typography>
  </Paper>
);

const NoCardSection = ({ section }) => {
  return (
    <Box sx={{
      background: 'linear-gradient(135deg, #f6f9fc 0%, #ffffff 100%)',
      borderRadius: '30px',
      padding: '4rem 2rem',
      margin: '3rem auto',
      maxWidth: '1400px',
      boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
      position: 'relative',
      overflow: 'hidden',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '6px',
        background: 'linear-gradient(90deg, #FF6B6B, #4ECDC4)',
      }
    }}>
      <Box sx={{
        maxWidth: '1000px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 1
      }}>
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: '2.5rem', md: '4rem' },
            fontWeight: 900,
            textAlign: 'center',
            marginBottom: '2rem',
            background: 'linear-gradient(45deg, #2C3E50, #3498DB)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            fontFamily: '"Montserrat", sans-serif',
            textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
          }}
        >
          {section.title}
        </Typography>

        {section.description && (
          <Typography
            variant="h4"
            sx={{
              fontSize: { xs: '1.2rem', md: '1.6rem' },
              textAlign: 'center',
              marginBottom: '4rem',
              color: '#34495E',
              fontFamily: '"Playfair Display", serif',
              fontStyle: 'italic',
              lineHeight: 1.6,
              maxWidth: '800px',
              margin: '0 auto 4rem',
              padding: '0 1rem'
            }}
          >
            {section.description}
          </Typography>
        )}

        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '3rem'
        }}>
          {section.cards?.map((card, index) => (
            <Box
              key={card.id}
              sx={{
                background: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '20px',
                padding: '3rem',
                boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                border: '1px solid rgba(0,0,0,0.05)',
                transition: 'all 0.4s ease',
                transform: 'translateY(0)',
                '&:hover': {
                  transform: 'translateY(-10px)',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                  borderColor: '#4ECDC4'
                }
              }}
            >
              {card.title && (
                <Typography
                  variant="h3"
                  sx={{
                    fontSize: { xs: '1.8rem', md: '2.4rem' },
                    fontWeight: 700,
                    marginBottom: '2rem',
                    color: '#2C3E50',
                    fontFamily: '"Montserrat", sans-serif',
                    borderBottom: '3px solid #4ECDC4',
                    paddingBottom: '1rem'
                  }}
                >
                  {card.title}
                </Typography>
              )}
              {card.content && (
                <Typography
                  variant="body1"
                  sx={{
                    fontSize: { xs: '1.1rem', md: '1.3rem' },
                    lineHeight: 1.8,
                    color: '#34495E',
                    fontFamily: '"Playfair Display", serif',
                    whiteSpace: 'pre-wrap'
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
  );
};

const Section = ({ section }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const CardComponent = {
    [CARD_TYPES.SIMPLE]: SimpleCard,
    [CARD_TYPES.ELEVATED]: ElevatedCard,
    [CARD_TYPES.OUTLINED]: OutlinedCard,
    [CARD_TYPES.ACCENT]: AccentCard,
    [CARD_TYPES.GRADIENT]: GradientCard
  }[section.cardType] || SimpleCard;

  if (section.cardType === CARD_TYPES.NONE) {
    return <NoCardSection section={section} />;
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography 
        variant="h4" 
        gutterBottom
        sx={{ color: section.titleColor || 'inherit' }}
      >
        {section.title}
      </Typography>
      {section.description && (
        <Typography 
          variant="body1" 
          gutterBottom
          sx={{ color: section.descriptionColor || 'inherit' }}
        >
          {section.description}
        </Typography>
      )}
      <Grid container spacing={2}>
        {section.cards?.map((card) => (
          <Grid item xs={12} sm={6} md={4} key={card.id}>
            <CardComponent
              title={card.title}
              description={section.description}
              content={card.content}
              showTitle={card.showTitle}
              titleColor={card.titleColor}
              descriptionColor={section.descriptionColor}
              contentColor={card.contentColor}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Section;