import React from 'react';
import {
  Box,
  Typography,
  Container,
  Grid,
  Paper,
  useTheme,
  alpha
} from '@mui/material';
import { styled } from '@mui/material/styles';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import dynamic from 'next/dynamic';

// Динамически импортируем компоненты только на клиенте
const ContactForm = dynamic(() => import('./ContactForm'), { ssr: false });
const MapIframe = dynamic(() => import('./MapIframe'), { ssr: false });

const MapContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '400px',
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
  boxShadow: theme.shadows[4],
  position: 'relative',
  marginTop: theme.spacing(3),
  zIndex: 1
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  transition: 'all 0.3s ease-in-out',
  position: 'relative',
  zIndex: 1,
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[8],
  },
}));

const ContactSection = React.forwardRef(({
  title = 'Свяжитесь с нами',
  description = 'Оставьте свои контактные данные, и мы свяжемся с вами в ближайшее время',
  companyName = 'Наша компания',
  address = 'г. Москва, ул. Примерная, д. 1',
  phone = '+7 (XXX) XXX-XX-XX',
  email = 'info@example.com',
  titleColor = '#1976d2',
  descriptionColor = '#666666',
  companyInfoColor = '#333333',
  formVariant = 'outlined',
  infoVariant = 'elevation',
  formBackgroundColor = '#ffffff',
  infoBackgroundColor = '#ffffff',
  formBorderColor = '#1976d2',
  infoBorderColor = '#1976d2',
  titleFont = 'default',
  textFont = 'default',
  formBorderWidth,
  infoBorderWidth,
  contactData = {},
  showBorders = false
}, ref) => {
  // Используем значения из contactData, если они есть, иначе используем значения по умолчанию
  const {
    title: dataTitle = title,
    description: dataDescription = description,
    companyName: dataCompanyName = companyName,
    address: dataAddress = address,
    phone: dataPhone = phone,
    email: dataEmail = email,
    titleColor: dataTitleColor = titleColor,
    descriptionColor: dataDescriptionColor = descriptionColor,
    companyInfoColor: dataCompanyInfoColor = companyInfoColor,
    formVariant: dataFormVariant = formVariant,
    infoVariant: dataInfoVariant = infoVariant,
    formBackgroundColor: dataFormBackgroundColor = formBackgroundColor,
    infoBackgroundColor: dataInfoBackgroundColor = infoBackgroundColor,
    formBorderColor: dataFormBorderColor = formBorderColor,
    infoBorderColor: dataInfoBorderColor = infoBorderColor,
    titleFont: dataTitleFont = titleFont,
    textFont: dataTextFont = textFont
  } = contactData;

  const theme = useTheme();

  const getFontStyle = (type) => {
    switch (type) {
      case 'bold':
        return { fontWeight: 700 };
      case 'light':
        return { fontWeight: 300 };
      case 'italic':
        return { fontStyle: 'italic' };
      case 'cursive':
        return { fontFamily: 'cursive' };
      default:
        return {};
    }
  };

  return (
    <Box 
      ref={ref}
      id="contact"
      sx={{ 
        py: 8,
        px: 2,
        backgroundColor: 'inherit'
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="h3"
          component="h2"
          align="center"
          gutterBottom
          sx={{
            mb: 2,
            fontWeight: 700,
            color: dataTitleColor || '#1565c0',
            textShadow: '0 1px 2px rgba(0,0,0,0.1)',
            ...getFontStyle(dataTitleFont)
          }}
        >
          {dataTitle}
        </Typography>
        
        <Typography
          variant="h6"
          align="center"
          sx={{
            mb: 6,
            color: dataDescriptionColor || '#424242',
            fontWeight: 500,
            ...getFontStyle(dataTextFont)
          }}
        >
          {dataDescription}
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <StyledPaper
              variant={dataFormVariant}
              sx={{
                backgroundColor: dataFormBackgroundColor,
                borderColor: dataFormBorderColor,
                borderWidth: formBorderWidth
              }}
            >
              <ContactForm 
                customStyles={{
                  inputBackgroundColor: contactData.inputBackgroundColor,
                  inputTextColor: contactData.inputTextColor,
                  formBorderColor: contactData.formBorderColor,
                  labelColor: contactData.labelColor,
                  buttonColor: contactData.buttonColor,
                  buttonTextColor: contactData.buttonTextColor
                }}
              />
            </StyledPaper>
          </Grid>

          <Grid item xs={12} md={6}>
            <StyledPaper
              variant={dataInfoVariant}
              sx={{
                backgroundColor: dataInfoBackgroundColor,
                borderColor: dataInfoBorderColor,
                borderWidth: infoBorderWidth
              }}
            >
              <Typography 
                variant="h5" 
                gutterBottom 
                sx={{ 
                  mb: 3,
                  color: dataCompanyInfoColor,
                  ...getFontStyle(dataTitleFont)
                }}
              >
                {dataCompanyName}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LocationOnIcon sx={{ mr: 2, color: dataCompanyInfoColor }} />
                <Typography sx={{ color: dataCompanyInfoColor, ...getFontStyle(dataTextFont) }}>{dataAddress}</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PhoneIcon sx={{ mr: 2, color: dataCompanyInfoColor }} />
                <Typography sx={{ color: dataCompanyInfoColor, ...getFontStyle(dataTextFont) }}>{dataPhone}</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <EmailIcon sx={{ mr: 2, color: dataCompanyInfoColor }} />
                <Typography sx={{ color: dataCompanyInfoColor, ...getFontStyle(dataTextFont) }}>{dataEmail}</Typography>
              </Box>

              <MapContainer>
                <MapIframe address={dataAddress} />
              </MapContainer>
            </StyledPaper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
});

ContactSection.displayName = 'ContactSection';

export default ContactSection; 