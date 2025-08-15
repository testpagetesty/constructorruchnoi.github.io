import React, { useRef, useState } from 'react';
import { Box, Button, Alert } from '@mui/material';
import { styled } from '@mui/material/styles';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const ConfigLoader = ({ onConfigLoaded }) => {
  const fileInputRef = useRef(null);
  const [error, setError] = useState(null);

  const handleFileUpload = (event) => {
    console.log('handleFileUpload called');
    console.log('Event:', event);
    console.log('Event target:', event.target);
    console.log('Files:', event.target.files);

    const file = event.target.files?.[0];
    if (!file) {
      console.log('No file selected');
      return;
    }

    console.log('Selected file:', {
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified
    });

    const reader = new FileReader();
    
    reader.onloadstart = () => {
      console.log('File reading started');
    };

    reader.onprogress = (event) => {
      console.log('File reading progress:', event);
    };

    reader.onabort = () => {
      console.log('File reading aborted');
    };

    reader.onloadend = () => {
      console.log('File reading completed');
    };

    reader.onload = (e) => {
      console.log('File read successfully');
      try {
        const content = e.target.result;
        console.log('File content:', content);
        
        const config = JSON.parse(content);
        console.log('Parsed config:', config);

        // Проверка обязательных полей
        const requiredFields = ['header', 'hero', 'contact', 'sections'];
        const missingFields = requiredFields.filter(field => !config[field]);
        
        if (missingFields.length > 0) {
          console.error('Missing required fields:', missingFields);
          throw new Error(`Отсутствуют обязательные поля: ${missingFields.join(', ')}`);
        }

        console.log('Config validation passed');
        onConfigLoaded(config);
      } catch (error) {
        console.error('Error loading config:', error);
        setError('Ошибка загрузки конфигурации: ' + error.message);
      }
    };

    reader.onerror = (error) => {
      console.error('File reading error:', error);
      setError('Ошибка при чтении файла');
    };

    reader.readAsText(file);
  };

  const handleButtonClick = () => {
    console.log('Button clicked');
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Сбрасываем значение input
      fileInputRef.current.click();
    }
  };

  return (
    <Box>
      <Button
        variant="contained"
        component="label"
        onClick={handleButtonClick}
        sx={{ height: '48px' }}
      >
        Загрузить конфигурацию
      </Button>
      <VisuallyHiddenInput
        type="file"
        accept=".json"
        onChange={handleFileUpload}
        ref={fileInputRef}
      />
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
    </Box>
  );
};

export default ConfigLoader; 