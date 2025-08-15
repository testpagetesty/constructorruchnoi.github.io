import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Paper,
  Stack,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import CardsGridManager from './CardsGridManager';
import ImageUploadPreview from './ImageUploadPreview';

const CardsGridEditor = ({
  title = '',
  description = '',
  cards = [],
  cardType = 'image-card',
  gridSize = 'medium',
  onSave,
  onCancel,
  isPreview = true
}) => {
  const [editingData, setEditingData] = useState({
    title,
    description,
    cards,
    cardType,
    gridSize
  });

  const handleSave = () => {
    onSave(editingData);
  };

  const handleCancel = () => {
    onCancel();
  };

  const handleCardsChange = (newCards) => {
    setEditingData(prev => ({ ...prev, cards: newCards }));
  };

  const handleGridSizeChange = (newGridSize) => {
    setEditingData(prev => ({ ...prev, gridSize: newGridSize }));
  };

  return (
    <Paper sx={{ p: 3, border: '2px solid #1976d2', borderRadius: 2 }}>
      <Stack spacing={3}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6" color="primary">
            Редактирование сетки карточек
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSave}
              size="small"
            >
              Сохранить
            </Button>
            <Button
              variant="outlined"
              startIcon={<CancelIcon />}
              onClick={handleCancel}
              size="small"
            >
              Отмена
            </Button>
          </Box>
        </Box>

        <Divider />

        <Stack spacing={2}>
          <TextField
            fullWidth
            label="Заголовок секции"
            value={editingData.title}
            onChange={(e) => setEditingData(prev => ({ ...prev, title: e.target.value }))}
            size="small"
          />
          
          <TextField
            fullWidth
            label="Описание секции"
            value={editingData.description}
            onChange={(e) => setEditingData(prev => ({ ...prev, description: e.target.value }))}
            multiline
            rows={2}
            size="small"
          />

          <FormControl fullWidth size="small">
            <InputLabel>Тип карточек</InputLabel>
            <Select
              value={editingData.cardType}
              onChange={(e) => setEditingData(prev => ({ ...prev, cardType: e.target.value }))}
            >
              <MenuItem value="image-card">Карточки с изображениями</MenuItem>
              <MenuItem value="basic-card">Базовые карточки</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth size="small">
            <InputLabel>Количество столбцов</InputLabel>
            <Select
              value={editingData.gridSize}
              onChange={(e) => setEditingData(prev => ({ ...prev, gridSize: e.target.value }))}
            >
              <MenuItem value="xs">1 столбец</MenuItem>
              <MenuItem value="small">2 столбца</MenuItem>
              <MenuItem value="medium">3 столбца</MenuItem>
              <MenuItem value="large">4 столбца</MenuItem>
              <MenuItem value="xl">5 столбцов</MenuItem>
              <MenuItem value="full">6 столбцов</MenuItem>
            </Select>
          </FormControl>
        </Stack>

        <Divider />

        <Typography variant="subtitle2" gutterBottom>
          Управление карточками:
        </Typography>

        <CardsGridManager
          cards={editingData.cards}
          onCardsChange={handleCardsChange}
          cardType={editingData.cardType}
          gridSize={editingData.gridSize}
          onGridSizeChange={handleGridSizeChange}
          editable={true}
        />
      </Stack>
    </Paper>
  );
};

export default CardsGridEditor; 