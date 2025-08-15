import React, { useState } from 'react';
import { Box, Typography, Paper, Button } from '@mui/material';
import ColorSettings from './ColorSettings';

/**
 * Демонстрационный компонент для показа работы новой системы цветов
 */
const ColorSettingsDemo = () => {
  const [colorSettings, setColorSettings] = useState({});

  // Доступные поля для настройки цветов
  const availableFields = [
    {
      name: 'title',
      label: 'Цвет заголовка',
      description: 'Основной цвет заголовка элемента',
      defaultColor: '#1976d2'
    },
    {
      name: 'text',
      label: 'Цвет основного текста',
      description: 'Цвет основного содержимого',
      defaultColor: '#333333'
    },
    {
      name: 'subtitle',
      label: 'Цвет подзаголовка',
      description: 'Цвет дополнительного текста',
      defaultColor: '#666666'
    },
    {
      name: 'link',
      label: 'Цвет ссылок',
      description: 'Цвет интерактивных элементов',
      defaultColor: '#1976d2'
    }
  ];

  // Функция для применения стилей из настроек
  const getAppliedStyles = () => {
    let containerStyles = {
      padding: '24px',
      borderRadius: '8px',
      border: '1px solid #e0e0e0'
    };

    // Применяем настройки фона
    if (colorSettings.sectionBackground?.enabled) {
      const { sectionBackground } = colorSettings;
      if (sectionBackground.useGradient) {
        containerStyles.background = `linear-gradient(${sectionBackground.gradientDirection}, ${sectionBackground.gradientColor1}, ${sectionBackground.gradientColor2})`;
      } else {
        containerStyles.backgroundColor = sectionBackground.solidColor;
      }
      containerStyles.opacity = sectionBackground.opacity;
      containerStyles.border = `${colorSettings.borderWidth || 1}px solid ${colorSettings.borderColor || '#e0e0e0'}`;
      containerStyles.borderRadius = `${colorSettings.borderRadius || 8}px`;
      containerStyles.padding = `${colorSettings.padding || 24}px`;
      if (colorSettings.boxShadow) {
        containerStyles.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
      }
    }

    return containerStyles;
  };

  // Получение цвета для конкретного поля
  const getFieldColor = (fieldName, defaultColor) => {
    return colorSettings.textFields?.[fieldName] || defaultColor;
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        🎨 Демонстрация новой системы цветов
      </Typography>
      
      <Typography variant="body1" paragraph>
        Этот компонент демонстрирует работу единой системы цветовых настроек для всех текстовых элементов.
        Настройте цвета ниже и посмотрите, как они применяются в реальном времени.
      </Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, mt: 3 }}>
        {/* Панель настроек */}
        <Paper sx={{ p: 3 }}>
          <ColorSettings
            title="Настройки цветов элемента"
            colorSettings={colorSettings}
            onUpdate={setColorSettings}
            availableFields={availableFields}
            defaultColors={{
              title: '#1976d2',
              text: '#333333',
              subtitle: '#666666',
              link: '#1976d2'
            }}
          />
        </Paper>

        {/* Предварительный просмотр */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Предварительный просмотр:
          </Typography>
          
          <Box sx={getAppliedStyles()}>
            <Typography 
              variant="h5" 
              sx={{ 
                color: getFieldColor('title', '#1976d2'),
                mb: 2,
                fontWeight: 'bold'
              }}
            >
              Пример заголовка
            </Typography>
            
            <Typography 
              variant="body1" 
              sx={{ 
                color: getFieldColor('text', '#333333'),
                mb: 2,
                lineHeight: 1.6
              }}
            >
              Это основной текст элемента. Здесь может быть любое содержимое, которое будет отображено 
              с выбранными цветами и фоном.
            </Typography>
            
            <Typography 
              variant="subtitle2" 
              sx={{ 
                color: getFieldColor('subtitle', '#666666'),
                mb: 2
              }}
            >
              Дополнительная информация или подзаголовок
            </Typography>
            
            <Typography 
              variant="body2" 
              sx={{ 
                color: getFieldColor('link', '#1976d2'),
                textDecoration: 'underline',
                cursor: 'pointer'
              }}
            >
              Пример ссылки или интерактивного элемента
            </Typography>
          </Box>
        </Paper>
      </Box>

      {/* Информация о структуре данных */}
      <Paper sx={{ p: 3, mt: 3, backgroundColor: '#f5f5f5' }}>
        <Typography variant="h6" gutterBottom>
          📋 Структура данных colorSettings:
        </Typography>
        <pre style={{ fontSize: '12px', overflow: 'auto', maxHeight: '300px' }}>
          {JSON.stringify(colorSettings, null, 2)}
        </pre>
      </Paper>

      {/* Кнопки для тестирования */}
      <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
        <Button 
          variant="outlined" 
          onClick={() => setColorSettings({})}
        >
          Сбросить настройки
        </Button>
        <Button 
          variant="contained" 
          onClick={() => setColorSettings({
            sectionBackground: {
              enabled: true,
              useGradient: true,
              gradientColor1: '#e3f2fd',
              gradientColor2: '#bbdefb',
              gradientDirection: 'to bottom right',
              opacity: 1
            },
            textFields: {
              title: '#1565c0',
              text: '#424242',
              subtitle: '#757575',
              link: '#d32f2f'
            },
            borderWidth: 2,
            borderColor: '#1976d2',
            borderRadius: 12,
            padding: 32,
            boxShadow: true
          })}
        >
          Применить пример настроек
        </Button>
      </Box>
    </Box>
  );
};

export default ColorSettingsDemo;