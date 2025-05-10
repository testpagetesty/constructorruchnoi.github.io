import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link as MuiLink,
  IconButton,
  useTheme,
  Divider,
  Button
} from '@mui/material';
import { styled } from '@mui/material/styles';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const getFontFamily = (fontType) => {
  switch (fontType) {
    case 'bold':
      return '"Roboto", "Helvetica", "Arial", sans-serif';
    case 'light':
      return '"Roboto Light", "Helvetica", "Arial", sans-serif';
    case 'italic':
      return '"Roboto Italic", "Helvetica", "Arial", sans-serif';
    case 'cursive':
      return '"Dancing Script", cursive';
    default:
      return '"Roboto", "Helvetica", "Arial", sans-serif';
  }
};

const FooterContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(6, 0),
  marginTop: 'auto'
}));

const FooterSection = ({
  footerData = {},
  contactData = {},
  legalDocuments = {},
  companyName = 'Название компании',
  phone = '+7 (XXX) XXX-XX-XX',
  email = 'info@example.com',
  address = 'г. Москва, ул. Примерная, д. 1',
  showSocialLinks = false,
  socialLinks = {
    facebook: '#',
    twitter: '#',
    instagram: '#',
    linkedin: '#'
  },
  copyrightYear = new Date().getFullYear(),
  copyrightText = 'Все права защищены',
  menuItems = [],
  onMenuClick,
  headerData
}) => {
  const theme = useTheme();

  // Цвета: сначала из футера, если не задан — из шапки, если и там нет — дефолт
  const backgroundColor = footerData.backgroundColor || headerData?.backgroundColor || '#f5f5f5';
  const textColor = footerData.textColor || headerData?.titleColor || '#333333';
  const linksColor = footerData.linksColor || headerData?.linksColor || '#1976d2';

  const handleLinkClick = (e, sectionId) => {
    e.preventDefault();
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

  const legalDocumentsLinks = [
    { 
      title: legalDocuments?.privacyPolicyTitle || 'Политика конфиденциальности', 
      link: '/privacy-policy' 
    },
    { 
      title: legalDocuments?.termsOfServiceTitle || 'Пользовательское соглашение', 
      link: '/terms-of-service' 
    },
    { 
      title: legalDocuments?.cookiePolicyTitle || 'Политика использования cookie', 
      link: '/cookie-policy' 
    }
  ];

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor,
        color: textColor,
        padding: '40px 0',
        marginTop: 'auto'
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              {contactData?.companyName || companyName}
            </Typography>
            <Typography variant="body2" paragraph>
              {contactData?.address || address}
            </Typography>
            <Typography variant="body2" paragraph sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PhoneIcon fontSize="small" />
              {contactData?.phone || phone}
            </Typography>
            <Typography variant="body2" paragraph>
              Email: {contactData?.email || email}
            </Typography>
            
            {showSocialLinks && (
              <Box sx={{ mt: 2 }}>
                <MuiLink
                  href={socialLinks.facebook}
                  color={linksColor}
                  sx={{ mx: 1, '&:hover': { color: theme.palette.primary.main } }}
                >
                  Facebook
                </MuiLink>
                <MuiLink
                  href={socialLinks.twitter}
                  color={linksColor}
                  sx={{ mx: 1, '&:hover': { color: theme.palette.primary.main } }}
                >
                  Twitter
                </MuiLink>
                <MuiLink
                  href={socialLinks.instagram}
                  color={linksColor}
                  sx={{ mx: 1, '&:hover': { color: theme.palette.primary.main } }}
                >
                  Instagram
                </MuiLink>
                <MuiLink
                  href={socialLinks.linkedin}
                  color={linksColor}
                  sx={{ mx: 1, '&:hover': { color: theme.palette.primary.main } }}
                >
                  LinkedIn
                </MuiLink>
              </Box>
            )}
          </Grid>

          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {menuItems.slice(0, Math.ceil(menuItems.length / 2)).map((item) => (
                <MuiLink
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => handleLinkClick(e, item.id)}
                  color={linksColor}
                  sx={{
                    textDecoration: 'none',
                    '&:hover': {
                      color: theme.palette.primary.main
                    }
                  }}
                >
                  {item.text}
                </MuiLink>
              ))}
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {menuItems.slice(Math.ceil(menuItems.length / 2)).map((item) => (
                <MuiLink
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => handleLinkClick(e, item.id)}
                  color={linksColor}
                  sx={{
                    textDecoration: 'none',
                    '&:hover': {
                      color: theme.palette.primary.main
                    }
                  }}
                >
                  {item.text}
                </MuiLink>
              ))}
              <MuiLink
                href="#contact"
                onClick={(e) => handleLinkClick(e, 'contact')}
                color={linksColor}
                sx={{
                  textDecoration: 'none',
                  '&:hover': {
                    color: theme.palette.primary.main
                  }
                }}
              >
                {contactData?.title || 'Свяжитесь с нами'}
              </MuiLink>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {legalDocumentsLinks.map((doc, index) => (
                <Typography
                  key={index}
                  variant="body2"
                  component="a"
                  href={doc.link}
                  onClick={(e) => {
                    e.preventDefault();
                    if (doc.link.startsWith('#')) {
                      const element = document.querySelector(doc.link);
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                      }
                    } else {
                      window.location.href = doc.link;
                    }
                  }}
                  sx={{
                    color: 'inherit',
                    textDecoration: 'none',
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  {doc.title}
                </Typography>
              ))}
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ 
          mt: 4, 
          pt: 2, 
          borderTop: '1px solid rgba(0, 0, 0, 0.12)',
          textAlign: 'center'
        }}>
          <Typography variant="body2">
            © {copyrightYear} {companyName}. {copyrightText}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default FooterSection; 