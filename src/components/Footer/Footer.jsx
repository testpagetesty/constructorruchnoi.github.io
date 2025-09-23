import React from 'react';
import { 
  Box, 
  Container, 
  Grid, 
  Typography, 
  Link, 
  IconButton,
  Stack,
  Divider
} from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

const Footer = ({ footerData, onMenuClick }) => {
  const navigationLinks = [];

  const handleLinkClick = (e, url) => {
    e.preventDefault();
    const sectionId = url.replace('#', '');
    if (onMenuClick) {
      onMenuClick(sectionId);
    }
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: footerData.backgroundColor || '#f5f5f5'
      }}
    >
      <Container maxWidth={false} sx={{ maxWidth: '100%', px: 2 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Typography
              variant="h6"
              color="text.primary"
              gutterBottom
              sx={{ color: footerData.textColor || '#333333' }}
            >
              {footerData.companyName}
            </Typography>
            <Typography variant="body2" sx={{ color: footerData.textColor || '#333333' }}>
              {footerData.address}
            </Typography>
            <Typography variant="body2" sx={{ color: footerData.textColor || '#333333' }}>
              Телефон: {footerData.phone}
            </Typography>
            <Typography variant="body2" sx={{ color: footerData.textColor || '#333333' }}>
              Email: {footerData.email}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Typography
              variant="h6"
              color="text.primary"
              gutterBottom
              sx={{ color: footerData.textColor || '#333333' }}
            >
              Навигация
            </Typography>
            <Stack spacing={1}>
              {navigationLinks.map((link, index) => (
                <Link
                  key={index}
                  href={link.url}
                  onClick={(e) => handleLinkClick(e, link.url)}
                  color="inherit"
                  sx={{ 
                    color: footerData.textColor || '#333333',
                    textDecoration: 'none',
                    '&:hover': {
                      textDecoration: 'underline'
                    }
                  }}
                >
                  {link.text}
                </Link>
              ))}
            </Stack>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Typography
              variant="h6"
              color="text.primary"
              gutterBottom
              sx={{ color: footerData.textColor || '#333333' }}
            >
              Документы
            </Typography>
            <Stack spacing={1}>
              {footerData.documents?.map((doc, index) => (
                <Link
                  key={index}
                  href={doc.link}
                  color="inherit"
                  sx={{ 
                    color: footerData.textColor || '#333333',
                    textDecoration: 'none',
                    '&:hover': {
                      textDecoration: 'underline'
                    }
                  }}
                >
                  {doc.title}
                </Link>
              ))}
            </Stack>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Typography
              variant="h6"
              color="text.primary"
              gutterBottom
              sx={{ color: footerData.textColor || '#333333' }}
            >
              Социальные сети
            </Typography>
            <Box>
              {footerData.socialLinks?.facebook && (
                <IconButton
                  href={footerData.socialLinks.facebook}
                  target="_blank"
                  sx={{ color: footerData.textColor || '#333333' }}
                >
                  <FacebookIcon />
                </IconButton>
              )}
              {footerData.socialLinks?.twitter && (
                <IconButton
                  href={footerData.socialLinks.twitter}
                  target="_blank"
                  sx={{ color: footerData.textColor || '#333333' }}
                >
                  <TwitterIcon />
                </IconButton>
              )}
              {footerData.socialLinks?.instagram && (
                <IconButton
                  href={footerData.socialLinks.instagram}
                  target="_blank"
                  sx={{ color: footerData.textColor || '#333333' }}
                >
                  <InstagramIcon />
                </IconButton>
              )}
              {footerData.socialLinks?.linkedin && (
                <IconButton
                  href={footerData.socialLinks.linkedin}
                  target="_blank"
                  sx={{ color: footerData.textColor || '#333333' }}
                >
                  <LinkedInIcon />
                </IconButton>
              )}
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
          sx={{ color: footerData.textColor || '#333333' }}
        >
          {`© ${footerData.copyrightYear} ${footerData.copyrightText}`}
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer; 