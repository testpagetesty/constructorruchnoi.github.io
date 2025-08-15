import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Grid,
  Alert,
  AlertTitle
} from '@mui/material';
import ImageCard from '../components/ContentLibrary/CardComponents/ImageCard';
import ImageCacheStats from '../components/ContentLibrary/CardComponents/ImageCacheStats';
import { v4 as uuidv4 } from 'uuid';

const TestImageSystem = () => {
  const [cards, setCards] = useState([
    {
      id: uuidv4(),
      title: 'Тестовая карточка 1',
      content: 'Это тестовая карточка для проверки новой системы загрузки изображений с градиентным фоном.',
      imageUrl: 'https://via.placeholder.com/300x200?text=Тест+1',
      imageAlt: 'Тестовое изображение 1',
      buttonText: 'Подробнее',
      buttonLink: '#',
      variant: 'elevated',
      size: 'medium',
      alignment: 'left',
      showActions: true,
      titleColor: '#333333',
      contentColor: '#666666',
      backgroundColor: '#ffffff',
      borderColor: '#e0e0e0',
      gradientStart: '#667eea',
      gradientEnd: '#764ba2',
      gradientDirection: 'to right',
      useGradient: true,
      gridSize: 'medium',
      animationSettings: {
        animationType: 'fadeIn',
        delay: 0,
        triggerOnView: true,
        triggerOnce: true,
        threshold: 0.1,
        disabled: false
      }
    },
    {
      id: uuidv4(),
      title: 'Тестовая карточка 2',
      content: 'Вторая тестовая карточка с обычным фоном для сравнения.',
      imageUrl: 'https://via.placeholder.com/300x200?text=Тест+2',
      imageAlt: 'Тестовое изображение 2',
      buttonText: 'Узнать больше',
      buttonLink: '#',
      variant: 'outlined',
      size: 'medium',
      alignment: 'left',
      showActions: true,
      titleColor: '#1976d2',
      contentColor: '#666666',
      backgroundColor: '#f5f5f5',
      borderColor: '#1976d2',
      gradientStart: '#ffffff',
      gradientEnd: '#f5f5f5',
      gradientDirection: 'to right',
      useGradient: false,
      gridSize: 'medium',
      animationSettings: {
        animationType: 'slideInUp',
        delay: 0.2,
        triggerOnView: true,
        triggerOnce: true,
        threshold: 0.1,
        disabled: false
      }
    }
  ]);

  const handleCardUpdate = (index, updatedData) => {
    const newCards = [...cards];
    newCards[index] = { ...newCards[index], ...updatedData };
    setCards(newCards);
  };

  // Обработка создания новых карточек из ImageCard (например, "Создать несколько карточек")
  const handleAddElement = (newElement) => {
    if (Array.isArray(newElement.cards)) {
      // Если это массив карточек (multiple-cards)
      const newCards = newElement.cards.map(card => ({
        ...card,
        id: uuidv4(), // Гарантируем уникальный id для каждой новой карточки
      }));
      setCards(prev => [...prev, ...newCards]);
    } else if (Array.isArray(newElement)) {
      // Если это массив карточек напрямую
      const newCards = newElement.map(card => ({
        ...card,
        id: uuidv4(),
      }));
      setCards(prev => [...prev, ...newCards]);
    } else if (newElement && typeof newElement === 'object') {
      // Одиночная карточка
      setCards(prev => [...prev, { ...newElement, id: uuidv4() }]);
    }
  };

  const handleAddCard = () => {
    const newCard = {
      id: uuidv4(),
      title: `Новая карточка ${cards.length + 1}`,
      content: 'Описание новой карточки с автоматической конвертацией изображений в JPG.',
      imageUrl: 'https://via.placeholder.com/300x200?text=Новая',
      imageAlt: 'Новое изображение',
      buttonText: 'Действие',
      buttonLink: '#',
      variant: 'elevated',
      size: 'medium',
      alignment: 'left',
      showActions: true,
      titleColor: '#333333',
      contentColor: '#666666',
      backgroundColor: '#ffffff',
      borderColor: '#e0e0e0',
      gradientStart: '#ff9a9e',
      gradientEnd: '#fecfef',
      gradientDirection: '45deg',
      useGradient: true,
      gridSize: 'medium',
      animationSettings: {
        animationType: 'zoomIn',
        delay: 0.4,
        triggerOnView: true,
        triggerOnce: true,
        threshold: 0.1,
        disabled: false
      }
    };
    setCards([...cards, newCard]);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" gutterBottom align="center">
        🖼️ Тест системы изображений
      </Typography>
      
      <Alert severity="info" sx={{ mb: 4 }}>
        <AlertTitle>Новая система загрузки изображений</AlertTitle>
        <Typography variant="body2">
          • Автоматическая конвертация в JPG формат<br/>
          • Уникальные имена файлов на основе ID карточки<br/>
          • Кеширование в IndexedDB + LocalStorage<br/>
          • Поддержка градиентных фонов<br/>
          • Оптимизация для Vercel
        </Typography>
      </Alert>

      {/* Статистика кеша */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          📊 Статистика кеша изображений
        </Typography>
        <ImageCacheStats />
      </Paper>

      {/* Управление карточками */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Button 
          variant="contained" 
          size="large"
          onClick={handleAddCard}
          sx={{ mb: 2 }}
        >
          Добавить тестовую карточку
        </Button>
        <Typography variant="body2" color="text.secondary">
          Загрузите изображения в карточки для тестирования новой системы
        </Typography>
      </Box>

      {/* Карточки */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        {cards.map((card, index) => (
          <Box key={card.id} sx={{ minWidth: '300px', flexGrow: 1 }}>
            <ImageCard
              {...card}
              onUpdate={(updatedData) => handleCardUpdate(index, updatedData)}
              onAddElement={handleAddElement}
              editable={true}
            />
          </Box>
        ))}
      </Box>

      {/* Инструкции */}
      <Paper sx={{ p: 3, mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          📋 Инструкции по тестированию
        </Typography>
        <Typography variant="body2" paragraph>
          1. <strong>Загрузка изображений:</strong> Нажмите "Загрузить изображение" в любой карточке
        </Typography>
        <Typography variant="body2" paragraph>
          2. <strong>Проверка конвертации:</strong> Все изображения автоматически конвертируются в JPG
        </Typography>
        <Typography variant="body2" paragraph>
          3. <strong>Градиентные фоны:</strong> Включите "Использовать градиентный фон" и настройте цвета
        </Typography>
        <Typography variant="body2" paragraph>
          4. <strong>Кеширование:</strong> Проверьте статистику кеша выше
        </Typography>
        <Typography variant="body2">
          5. <strong>Уникальные имена:</strong> Каждое изображение получает уникальное имя на основе ID карточки
        </Typography>
      </Paper>
    </Container>
  );
};

export default TestImageSystem; 