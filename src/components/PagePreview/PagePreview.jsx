import React from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';
import { CARD_TYPES } from '../../constants';

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

const Section = ({ section }) => {
  const CardComponent = {
    [CARD_TYPES.SIMPLE]: SimpleCard,
    [CARD_TYPES.ELEVATED]: ElevatedCard,
    [CARD_TYPES.OUTLINED]: OutlinedCard,
    [CARD_TYPES.ACCENT]: AccentCard,
    [CARD_TYPES.GRADIENT]: GradientCard
  }[section.cardType] || SimpleCard;

  if (section.cardType === CARD_TYPES.NONE) {
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
        <Typography 
          variant="body1"
          sx={{ color: section.contentColor || 'inherit' }}
        >
          {section.content}
        </Typography>
      </Box>
    );
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