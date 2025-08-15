import React, { useState, useRef } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { generateCompanyData } from '../utils/deepseekConfig';

const ConfigLoader = ({ onConfigLoad }) => {
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const validateConfig = (config) => {
    console.log('Начало валидации конфигурации:', config);
    
    // Проверка наличия обязательных полей верхнего уровня
    const requiredTopLevelFields = ['header', 'hero', 'contact', 'sections'];
    const missingTopLevelFields = requiredTopLevelFields.filter(field => !config[field]);
    
    if (missingTopLevelFields.length > 0) {
      console.error('Отсутствуют обязательные поля верхнего уровня:', missingTopLevelFields);
      throw new Error(`Отсутствуют обязательные поля: ${missingTopLevelFields.join(', ')}`);
    }

    // Проверка структуры header
    console.log('Проверка структуры header:', config.header);
    if (!config.header.siteName || !config.header.menuItems) {
      console.error('Некорректная структура header:', config.header);
      throw new Error('Некорректная структура header: отсутствуют обязательные поля siteName или menuItems');
    }

    // Проверка структуры hero
    console.log('Проверка структуры hero:', config.hero);
    if (!config.hero.title || !config.hero.subtitle) {
      console.error('Некорректная структура hero:', config.hero);
      throw new Error('Некорректная структура hero: отсутствуют обязательные поля title или subtitle');
    }

    // Проверка структуры contact
    console.log('Проверка структуры contact:', config.contact);
    if (!config.contact.title || !config.contact.description || !config.contact.mapCoordinates) {
      console.error('Некорректная структура contact:', config.contact);
      throw new Error('Некорректная структура contact: отсутствуют обязательные поля');
    }

    // Проверка структуры sections
    console.log('Проверка структуры sections:', config.sections);
    if (!Array.isArray(config.sections) || config.sections.length === 0) {
      console.error('Некорректная структура sections:', config.sections);
      throw new Error('Sections должен быть непустым массивом');
    }

    // Проверка каждой секции
    config.sections.forEach((section, index) => {
      console.log(`Проверка секции ${index}:`, section);
      if (!section.id || !section.title || !section.cards) {
        console.error(`Некорректная структура секции ${index}:`, section);
        throw new Error(`Некорректная структура секции ${index}: отсутствуют обязательные поля`);
      }
    });

    console.log('Валидация конфигурации успешно пройдена');
    return true;
  };

  const handleFileUpload = (event) => {
    console.log('=== Начало handleFileUpload ===');
    console.log('Event type:', event.type);
    console.log('Event target:', event.target);
    console.log('Event target files:', event.target.files);
    console.log('Event target value:', event.target.value);

    if (!event.target.files || event.target.files.length === 0) {
      console.log('Файл не выбран');
      return;
    }

    const file = event.target.files[0];
    console.log('Выбранный файл:', {
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified
    });

    const reader = new FileReader();
    
    reader.onloadstart = () => {
      console.log('Начало чтения файла');
    };

    reader.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentLoaded = Math.round((event.loaded / event.total) * 100);
        console.log(`Прогресс загрузки: ${percentLoaded}%`);
      }
    };

    reader.onload = (e) => {
      console.log('Файл успешно прочитан');
      console.log('Длина содержимого:', e.target.result.length);
      
      try {
        const loadedConfig = JSON.parse(e.target.result);
        console.log('JSON успешно распарсен');
        console.log('Загруженная конфигурация:', loadedConfig);
        
        // Проверяем наличие обязательных полей
        const requiredFields = ['hero', 'contact', 'sections'];
        const missingFields = requiredFields.filter(field => !loadedConfig[field]);
        
        if (missingFields.length > 0) {
          console.error('Отсутствуют обязательные поля:', missingFields);
          throw new Error(`Отсутствуют обязательные поля: ${missingFields.join(', ')}`);
        }

        // Валидация конфигурации
        validateConfig(loadedConfig);

        console.log('Конфигурация успешно загружена');
        onConfigLoad(loadedConfig);
        setError(null);
      } catch (err) {
        console.error('Ошибка при обработке файла:', err);
        setError('Ошибка при чтении файла: ' + err.message);
      }
    };

    reader.onerror = (error) => {
      console.error('Ошибка при чтении файла:', error);
      setError('Ошибка при чтении файла: ' + error.message);
    };

    reader.onabort = () => {
      console.log('Чтение файла прервано');
    };

    reader.onloadend = () => {
      console.log('Чтение файла завершено');
    };

    console.log('Начинаем чтение файла...');
    reader.readAsText(file);
  };

  const handleButtonClick = () => {
    console.log('Кнопка нажата');
    if (fileInputRef.current) {
      console.log('Активируем input');
      fileInputRef.current.click();
    }
  };

  const handleGenerateConfig = (language) => {
    try {
      console.log('Генерация конфигурации для языка:', language);
      const config = generateCompanyData(language);
      console.log('Сгенерированная конфигурация:', config);
      
      // Валидация сгенерированной конфигурации
      validateConfig(config);
      
      onConfigLoad(config);
      setError(null);
    } catch (err) {
      console.error('Ошибка при генерации конфигурации:', err);
      setError('Ошибка при генерации конфигурации: ' + err.message);
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Загрузка конфигурации
      </Typography>
      
      <Box sx={{ mb: 2 }}>
        <Button
          variant="contained"
          onClick={handleButtonClick}
          sx={{ mr: 2 }}
        >
          Загрузить конфигурацию
          <input
            ref={fileInputRef}
            type="file"
            hidden
            accept=".json"
            onChange={handleFileUpload}
            onClick={(e) => {
              console.log('Input clicked');
              e.target.value = null;
            }}
          />
        </Button>
        
        <Button
          variant="contained"
          onClick={() => handleGenerateConfig('ru')}
          sx={{ mr: 2 }}
        >
          Сгенерировать (RU)
        </Button>
        
        <Button
          variant="contained"
          onClick={() => handleGenerateConfig('en')}
          sx={{ mr: 2 }}
        >
          Generate (EN)
        </Button>
        
        <Button
          variant="contained"
          onClick={() => handleGenerateConfig('de')}
        >
          Generieren (DE)
        </Button>
      </Box>

      {error && (
        <Typography color="error">
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default ConfigLoader; 