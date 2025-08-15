import React, { useState } from 'react';
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Chip,
  Divider,
  Alert
} from '@mui/material';
import LinkIcon from '@mui/icons-material/Link';
import LanguageIcon from '@mui/icons-material/Language';
import ArticleIcon from '@mui/icons-material/Article';

const PageSelector = ({ 
  currentLink = '', 
  onLinkChange, 
  onLinkTypeChange,
  linkType = 'external' 
}) => {
  const [selectedPage, setSelectedPage] = useState('');

  // Список доступных страниц сайта
  const availablePages = [
    { 
      value: 'index', 
      label: 'Главная страница', 
      path: '/', 
      icon: <LanguageIcon fontSize="small" />,
      description: 'Переход на главную страницу сайта'
    },
    { 
      value: 'contact', 
      label: 'Контакты', 
      path: '#contact', 
      icon: <LinkIcon fontSize="small" />,
      description: 'Переход к разделу контактов'
    },
    { 
      value: 'privacy', 
      label: 'Политика конфиденциальности', 
      path: '/privacy-policy.html', 
      icon: <ArticleIcon fontSize="small" />,
      description: 'Открыть страницу политики конфиденциальности'
    },
    { 
      value: 'cookies', 
      label: 'Политика cookies', 
      path: '/cookie-policy.html', 
      icon: <ArticleIcon fontSize="small" />,
      description: 'Открыть страницу политики cookies'
    },
    { 
      value: 'terms', 
      label: 'Условия использования', 
      path: '/terms-of-service.html', 
      icon: <ArticleIcon fontSize="small" />,
      description: 'Открыть страницу условий использования'
    },
    { 
      value: 'merci', 
      label: 'Страница благодарности', 
      path: '/merci.html', 
      icon: <ArticleIcon fontSize="small" />,
      description: 'Переход на страницу благодарности после отправки формы'
    }
  ];

  // Специальные ссылки
  const specialLinks = [
    { 
      value: 'phone', 
      label: 'Звонок', 
      path: 'tel:', 
      icon: <LinkIcon fontSize="small" />,
      description: 'Ссылка для звонка (добавьте номер телефона)'
    },
    { 
      value: 'email', 
      label: 'Email', 
      path: 'mailto:', 
      icon: <LinkIcon fontSize="small" />,
      description: 'Ссылка для отправки email (добавьте email адрес)'
    },
    { 
      value: 'whatsapp', 
      label: 'WhatsApp', 
      path: 'https://wa.me/', 
      icon: <LinkIcon fontSize="small" />,
      description: 'Ссылка на WhatsApp (добавьте номер телефона)'
    },
    { 
      value: 'telegram', 
      label: 'Telegram', 
      path: 'https://t.me/', 
      icon: <LinkIcon fontSize="small" />,
      description: 'Ссылка на Telegram (добавьте username)'
    }
  ];

  const handlePageSelect = (pageValue) => {
    setSelectedPage(pageValue);
    
    if (pageValue === 'external') {
      onLinkTypeChange('external');
      return;
    }

    const page = [...availablePages, ...specialLinks].find(p => p.value === pageValue);
    if (page) {
      onLinkChange(page.path);
      onLinkTypeChange('internal');
    }
  };

  const handleExternalLinkChange = (link) => {
    onLinkChange(link);
    onLinkTypeChange('external');
  };

  const getCurrentPageInfo = () => {
    if (linkType === 'external') return null;
    
    const page = [...availablePages, ...specialLinks].find(p => 
      currentLink.startsWith(p.path) || currentLink === p.path
    );
    
    return page;
  };

  const currentPageInfo = getCurrentPageInfo();

  return (
    <Box>
      <Typography variant="subtitle2" gutterBottom>
        Выберите тип ссылки:
      </Typography>

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Тип ссылки</InputLabel>
        <Select
          value={linkType}
          label="Тип ссылки"
          onChange={(e) => {
            onLinkTypeChange(e.target.value);
            if (e.target.value === 'external') {
              setSelectedPage('');
            }
          }}
        >
          <MenuItem value="internal">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LinkIcon fontSize="small" />
              Страница сайта
            </Box>
          </MenuItem>
          <MenuItem value="external">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LanguageIcon fontSize="small" />
              Внешняя ссылка
            </Box>
          </MenuItem>
        </Select>
      </FormControl>

      {linkType === 'internal' && (
        <>
          <Typography variant="subtitle2" gutterBottom>
            Выберите страницу:
          </Typography>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Страница сайта</InputLabel>
            <Select
              value={selectedPage}
              label="Страница сайта"
              onChange={(e) => handlePageSelect(e.target.value)}
            >
              <MenuItem value="">
                <em>Выберите страницу...</em>
              </MenuItem>
              
              <Divider />
              <Typography variant="caption" sx={{ px: 2, py: 1, color: 'text.secondary' }}>
                Основные страницы
              </Typography>
              
              {availablePages.map((page) => (
                <MenuItem key={page.value} value={page.value}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                    {page.icon}
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2">{page.label}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {page.description}
                      </Typography>
                    </Box>
                  </Box>
                </MenuItem>
              ))}
              
              <Divider />
              <Typography variant="caption" sx={{ px: 2, py: 1, color: 'text.secondary' }}>
                Специальные ссылки
              </Typography>
              
              {specialLinks.map((link) => (
                <MenuItem key={link.value} value={link.value}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                    {link.icon}
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2">{link.label}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {link.description}
                      </Typography>
                    </Box>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {currentPageInfo && (
            <Alert severity="info" sx={{ mb: 2 }}>
              <Typography variant="body2">
                <strong>Выбрана страница:</strong> {currentPageInfo.label}
              </Typography>
              <Typography variant="caption">
                {currentPageInfo.description}
              </Typography>
            </Alert>
          )}
        </>
      )}

      {linkType === 'external' && (
        <>
          <Typography variant="subtitle2" gutterBottom>
            Введите внешнюю ссылку:
          </Typography>
          
          <TextField
            fullWidth
            value={currentLink}
            onChange={(e) => handleExternalLinkChange(e.target.value)}
            label="Внешняя ссылка"
            placeholder="https://example.com"
            sx={{ mb: 2 }}
            helperText="Введите полный URL включая https://"
          />

          {currentLink && !currentLink.startsWith('http') && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              Рекомендуется использовать полный URL с протоколом (https://)
            </Alert>
          )}
        </>
      )}

      {currentLink && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Текущая ссылка:
          </Typography>
          <Chip 
            label={currentLink} 
            variant="outlined" 
            color="primary"
            sx={{ wordBreak: 'break-all' }}
          />
        </Box>
      )}
    </Box>
  );
};

export default PageSelector; 