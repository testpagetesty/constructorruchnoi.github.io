import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Box, 
  Link,
  Button,
  IconButton,
  useTheme,
  useMediaQuery
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

const Header = ({ headerData, onMenuClick, contactData }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleLinkClick = (e, sectionId) => {
    e.preventDefault();
    if (onMenuClick) {
      onMenuClick(sectionId);
    }
    
    // Добавляем плавную прокрутку к разделу
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <AppBar 
      position="sticky" 
      sx={{ 
        backgroundColor: headerData.backgroundColor,
        boxShadow: 'none',
        borderBottom: '1px solid rgba(0, 0, 0, 0.12)'
      }}
    >
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{
            color: headerData.titleColor,
            flexGrow: 1
          }}
        >
          {headerData.siteName}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {headerData.menuItems?.map((item) => (
            <Link
              key={item.id}
              href={item.url}
              onClick={(e) => handleLinkClick(e, item.id)}
              sx={{
                color: headerData.linksColor,
                textDecoration: 'none',
                fontSize: headerData.styles?.menuItemFontSize || '16px',
                fontWeight: headerData.styles?.menuItemFontWeight || '500',
                transition: headerData.styles?.menuItemTransition || '0.3s',
                '&:hover': {
                  color: headerData.styles?.menuItemHoverColor || '#1976d2'
                }
              }}
            >
              {item.text}
            </Link>
          ))}
          <Link
            href="#contact"
            onClick={(e) => handleLinkClick(e, 'contact')}
            sx={{
              color: headerData.linksColor,
              textDecoration: 'none',
              fontSize: headerData.styles?.menuItemFontSize || '16px',
              fontWeight: headerData.styles?.menuItemFontWeight || '500',
              transition: headerData.styles?.menuItemTransition || '0.3s',
              '&:hover': {
                color: headerData.styles?.menuItemHoverColor || '#1976d2'
              }
            }}
          >
            {contactData?.title || 'Свяжитесь с нами'}
          </Link>
        </Box>

        {/* Мобильное меню */}
        {isMobile && (
          <IconButton
            color="inherit"
            aria-label="menu"
            onClick={() => {/* TODO: Добавить открытие мобильного меню */}}
          >
            <MenuIcon />
          </IconButton>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header; 