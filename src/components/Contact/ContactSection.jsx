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

const StyledPaper = styled(Paper)(({ theme, customStyles }) => ({
  padding: theme.spacing(3),
  transition: 'all 0.3s ease-in-out',
  position: 'relative',
  zIndex: 1,
  backgroundColor: customStyles?.backgroundColor || '#ffffff',
  border: customStyles?.borderColor ? `1px solid ${customStyles.borderColor}` : 'none',
  boxShadow: customStyles?.variant === 'elevation' ? theme.shadows[4] : 'none',
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
  labelColor = '#333333',
  inputBackgroundColor = '#f5f9ff',
  inputTextColor = '#1a1a1a',
  buttonColor = '#1976d2',
  buttonTextColor = '#ffffff',
  iconColor = '#1976d2',
  infoTitleColor = '#1976d2',
  infoTextColor = '#424242',
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
    labelColor: dataLabelColor = labelColor,
    inputBackgroundColor: dataInputBackgroundColor = inputBackgroundColor,
    inputTextColor: dataInputTextColor = inputTextColor,
    buttonColor: dataButtonColor = buttonColor,
    buttonTextColor: dataButtonTextColor = buttonTextColor,
    iconColor: dataIconColor = iconColor,
    infoTitleColor: dataInfoTitleColor = infoTitleColor,
    infoTextColor: dataInfoTextColor = infoTextColor,
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
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            variant="h2"
            component="h2"
            sx={{
              color: dataTitleColor,
              mb: 2,
              ...getFontStyle(dataTitleFont)
            }}
          >
            {dataTitle}
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: dataDescriptionColor,
              mb: 4,
              ...getFontStyle(dataTextFont)
            }}
          >
            {dataDescription}
          </Typography>
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <StyledPaper
              customStyles={{
                backgroundColor: dataFormBackgroundColor,
                borderColor: dataFormBorderColor,
                variant: dataFormVariant
              }}
            >
              <ContactForm 
                customStyles={{
                  inputBackgroundColor: dataInputBackgroundColor,
                  inputTextColor: dataInputTextColor,
                  formBorderColor: dataFormBorderColor,
                  labelColor: dataLabelColor,
                  buttonColor: dataButtonColor,
                  buttonTextColor: dataButtonTextColor
                }}
              />
            </StyledPaper>
          </Grid>

          <Grid item xs={12} md={6}>
            <StyledPaper
              customStyles={{
                backgroundColor: dataInfoBackgroundColor,
                borderColor: dataInfoBorderColor,
                variant: dataInfoVariant
              }}
            >
              <Typography
                variant="h5"
                component="h3"
                sx={{
                  color: dataInfoTitleColor,
                  mb: 3,
                  ...getFontStyle(dataTitleFont)
                }}
              >
                {dataCompanyName}
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <LocationOnIcon sx={{ color: dataIconColor }} />
                  <Typography
                    sx={{
                      color: dataInfoTextColor,
                      ...getFontStyle(dataTextFont)
                    }}
                  >
                    {dataAddress}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <PhoneIcon sx={{ color: dataIconColor }} />
                  <Typography
                    sx={{
                      color: dataInfoTextColor,
                      ...getFontStyle(dataTextFont)
                    }}
                  >
                    {dataPhone}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <EmailIcon sx={{ color: dataIconColor }} />
                  <Typography
                    sx={{
                      color: dataInfoTextColor,
                      ...getFontStyle(dataTextFont)
                    }}
                  >
                    {dataEmail}
                  </Typography>
                </Box>
              </Box>
            </StyledPaper>

            <MapContainer>
              <MapIframe address={dataAddress} />
            </MapContainer>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
});

ContactSection.displayName = 'ContactSection';

export default ContactSection; 