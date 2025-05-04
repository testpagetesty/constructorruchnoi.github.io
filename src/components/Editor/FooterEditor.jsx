import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Grid,
  Paper,
  IconButton,
  Collapse,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Stack,
  Button
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { styled } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: expand === 1 ? 'rotate(180deg)' : 'rotate(0deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

const FooterEditor = ({ footerData = {}, onFooterChange, expanded, onToggle }) => {
  const defaultFooterData = {
    backgroundColor: '#f5f5f5',
    textColor: '#333333',
    companyName: 'Название компании',
    phone: '+7 (XXX) XXX-XX-XX',
    email: 'info@example.com',
    address: 'г. Москва, ул. Примерная, д. 1',
    showSocialLinks: false,
    socialLinks: {
      facebook: '#',
      twitter: '#',
      instagram: '#',
      linkedin: '#'
    },
    copyrightYear: new Date().getFullYear(),
    copyrightText: 'Все права защищены',
    legalDocuments: {
      privacyPolicyTitle: 'Политика конфиденциальности',
      termsOfServiceTitle: 'Пользовательское соглашение',
      cookiePolicyTitle: 'Политика использования cookie'
    }
  };

  // Инициализируем данные с учетом значений по умолчанию
  const currentFooterData = {
    ...defaultFooterData,
    ...footerData,
    showSocialLinks: footerData.showSocialLinks === undefined ? false : footerData.showSocialLinks
  };

  const handleChange = (field, value) => {
    const newData = {
      ...currentFooterData,
      [field]: value
    };
    
    // Если отключаем социальные сети, сбрасываем их значения
    if (field === 'showSocialLinks' && !value) {
      newData.socialLinks = {
        facebook: '#',
        twitter: '#',
        instagram: '#',
        linkedin: '#'
      };
    }
    
    onFooterChange(newData);
  };

  const handleSocialLinkChange = (platform, value) => {
    onFooterChange({
      ...currentFooterData,
      socialLinks: {
        ...currentFooterData.socialLinks,
        [platform]: value
      }
    });
  };

  return (
    <Paper sx={{ 
      p: 2, 
      mb: 2,
      backgroundColor: '#f0fff0'
    }}>
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center',
          cursor: 'pointer',
          minHeight: '48px'
        }}
        onClick={onToggle}
      >
        <Typography 
          variant="h6" 
          sx={{ 
            flexGrow: 1,
            color: '#333'
          }}
        >
          Настройки подвала
        </Typography>
        <ExpandMore
          expand={expanded ? 1 : 0}
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
          aria-expanded={expanded}
          aria-label="show more"
          sx={{ 
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.04)'
            }
          }}
        >
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </ExpandMore>
      </Box>

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>Основные настройки</Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Цвет фона"
              type="color"
              value={currentFooterData.backgroundColor}
              onChange={(e) => handleChange('backgroundColor', e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Цвет текста"
              type="color"
              value={currentFooterData.textColor}
              onChange={(e) => handleChange('textColor', e.target.value)}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ mb: 1, mt: 2 }}>Социальные сети</Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={currentFooterData.showSocialLinks}
                  onChange={(e) => handleChange('showSocialLinks', e.target.checked)}
                />
              }
              label="Показывать социальные сети"
            />
          </Grid>

          {currentFooterData.showSocialLinks && (
            <>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Facebook"
                  value={currentFooterData.socialLinks.facebook}
                  onChange={(e) => handleSocialLinkChange('facebook', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Twitter"
                  value={currentFooterData.socialLinks.twitter}
                  onChange={(e) => handleSocialLinkChange('twitter', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Instagram"
                  value={currentFooterData.socialLinks.instagram}
                  onChange={(e) => handleSocialLinkChange('instagram', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="LinkedIn"
                  value={currentFooterData.socialLinks.linkedin}
                  onChange={(e) => handleSocialLinkChange('linkedin', e.target.value)}
                />
              </Grid>
            </>
          )}

          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ mb: 1, mt: 2 }}>Копирайт</Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Год создания"
              type="number"
              value={currentFooterData.copyrightYear}
              onChange={(e) => handleChange('copyrightYear', parseInt(e.target.value))}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Текст копирайта"
              value={currentFooterData.copyrightText}
              onChange={(e) => handleChange('copyrightText', e.target.value)}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ mb: 1, mt: 2 }}>Правовые документы</Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Название политики конфиденциальности"
              value={currentFooterData.legalDocuments?.privacyPolicyTitle}
              onChange={(e) => handleChange('legalDocuments', {
                ...currentFooterData.legalDocuments,
                privacyPolicyTitle: e.target.value
              })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Название пользовательского соглашения"
              value={currentFooterData.legalDocuments?.termsOfServiceTitle}
              onChange={(e) => handleChange('legalDocuments', {
                ...currentFooterData.legalDocuments,
                termsOfServiceTitle: e.target.value
              })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Название политики cookie"
              value={currentFooterData.legalDocuments?.cookiePolicyTitle}
              onChange={(e) => handleChange('legalDocuments', {
                ...currentFooterData.legalDocuments,
                cookiePolicyTitle: e.target.value
              })}
            />
          </Grid>
        </Grid>
      </Collapse>
    </Paper>
  );
};

export default FooterEditor; 