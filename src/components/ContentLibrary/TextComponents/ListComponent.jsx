import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  IconButton,
  Tooltip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Switch,
  FormControlLabel,
  Divider
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import CircleIcon from '@mui/icons-material/Circle';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import StarIcon from '@mui/icons-material/Star';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import AnimationWrapper from '../AnimationWrapper';
import AnimationControls from '../AnimationControls';
import ColorSettings from './ColorSettings';

const ListComponent = ({
  initialItems = ['Первый пункт списка', 'Второй пункт списка', 'Третий пункт списка'],
  listType = 'bulleted',
  bulletStyle = 'circle',
  numberStyle = 'decimal',
  spacing = 'normal',
  showIcons = false,
  iconType = 'check',
  colorSettings = {},
  onUpdate,
  editable = true,
  animationSettings = {},
  constructorMode = false,
  isEditing: externalIsEditing = false,
  onSave = null,
  onCancel = null
}) => {
  const [items, setItems] = useState(initialItems);
  const [currentListType, setCurrentListType] = useState(listType);
  const [currentBulletStyle, setCurrentBulletStyle] = useState(bulletStyle);
  const [currentNumberStyle, setCurrentNumberStyle] = useState(numberStyle);
  const [currentSpacing, setCurrentSpacing] = useState(spacing);
  const [showCustomIcons, setShowCustomIcons] = useState(showIcons);
  const [currentIconType, setCurrentIconType] = useState(iconType);
  const [currentColorSettings, setCurrentColorSettings] = useState(colorSettings || {});
  const [isEditing, setIsEditing] = useState(false);

  // Принудительное обновление при изменении colorSettings
  useEffect(() => {
    console.log('🔄 [ListComponent] colorSettings изменились:', colorSettings);
    
    // Принудительно обновляем состояние ТОЛЬКО если действительно изменились
    if (JSON.stringify(currentColorSettings) !== JSON.stringify(colorSettings || {})) {
      setCurrentColorSettings(colorSettings || {});
    }
    
  }, [colorSettings]);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [newItemText, setNewItemText] = useState('');

  const listTypes = [
    { value: 'bulleted', label: 'Маркированный', description: 'Список с маркерами' },
    { value: 'numbered', label: 'Нумерованный', description: 'Пронумерованный список' },
    { value: 'custom', label: 'С иконками', description: 'Список с пользовательскими иконками' },
    { value: 'checklist', label: 'Чек-лист', description: 'Список с галочками' }
  ];

  const bulletStyles = [
    { value: 'circle', label: '● Круг', icon: '●' },
    { value: 'square', label: '■ Квадрат', icon: '■' },
    { value: 'arrow', label: '→ Стрелка', icon: '→' },
    { value: 'dash', label: '– Тире', icon: '–' },
    { value: 'dot', label: '• Точка', icon: '•' }
  ];

  const numberStyles = [
    { value: 'decimal', label: '1, 2, 3...', example: '1.' },
    { value: 'alpha-lower', label: 'a, b, c...', example: 'a.' },
    { value: 'alpha-upper', label: 'A, B, C...', example: 'A.' },
    { value: 'roman-lower', label: 'i, ii, iii...', example: 'i.' },
    { value: 'roman-upper', label: 'I, II, III...', example: 'I.' }
  ];

  const spacingOptions = [
    { value: 'compact', label: 'Компактный', spacing: '4px' },
    { value: 'normal', label: 'Обычный', spacing: '8px' },
    { value: 'relaxed', label: 'Свободный', spacing: '16px' },
    { value: 'loose', label: 'Разреженный', spacing: '24px' }
  ];

  const iconTypes = [
    { value: 'check', label: 'Галочка', component: CheckCircleIcon },
    { value: 'star', label: 'Звезда', component: StarIcon },
    { value: 'arrow', label: 'Стрелка', component: ArrowRightIcon },
    { value: 'circle', label: 'Круг', component: CircleIcon },
    { value: 'dot', label: 'Точка', component: FiberManualRecordIcon }
  ];

  const getListStyles = () => {
    const spacing = spacingOptions.find(s => s.value === currentSpacing);
    const baseStyles = {
      padding: 0,
      '& .MuiListItem-root': {
        paddingTop: spacing?.spacing,
        paddingBottom: spacing?.spacing,
        paddingLeft: 0,
        paddingRight: 0
      }
    };

    // Применяем настройки фона из colorSettings
    if (currentColorSettings && currentColorSettings.sectionBackground && currentColorSettings.sectionBackground.enabled) {
      const { sectionBackground } = currentColorSettings;
      
      if (sectionBackground.useGradient) {
        baseStyles.background = `linear-gradient(${sectionBackground.gradientDirection}, ${sectionBackground.gradientColor1}, ${sectionBackground.gradientColor2})`;
      } else {
        baseStyles.backgroundColor = sectionBackground.solidColor;
      }
      
      baseStyles.opacity = sectionBackground.opacity;
    }

    // Применяем дополнительные настройки
    if (currentColorSettings) {
      if (currentColorSettings.borderColor) {
        baseStyles.border = `${currentColorSettings.borderWidth || 1}px solid ${currentColorSettings.borderColor}`;
      }
      if (currentColorSettings.borderRadius !== undefined) {
        baseStyles.borderRadius = `${currentColorSettings.borderRadius}px`;
      }
      if (currentColorSettings.padding !== undefined) {
        baseStyles.padding = `${currentColorSettings.padding}px`;
      }
      if (currentColorSettings.boxShadow) {
        baseStyles.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
      }
    }

    return baseStyles;
  };

  const getNumberPrefix = (index) => {
    switch (currentNumberStyle) {
      case 'decimal':
        return `${index + 1}.`;
      case 'alpha-lower':
        return `${String.fromCharCode(97 + index)}.`;
      case 'alpha-upper':
        return `${String.fromCharCode(65 + index)}.`;
      case 'roman-lower':
        return `${toRoman(index + 1).toLowerCase()}.`;
      case 'roman-upper':
        return `${toRoman(index + 1)}.`;
      default:
        return `${index + 1}.`;
    }
  };

  const toRoman = (num) => {
    const values = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
    const symbols = ['M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I'];
    let result = '';
    for (let i = 0; i < values.length; i++) {
      while (num >= values[i]) {
        result += symbols[i];
        num -= values[i];
      }
    }
    return result;
  };

  const getBulletIcon = (style) => {
    const bulletConfig = bulletStyles.find(b => b.value === style);
    return bulletConfig?.icon || '●';
  };

  const renderIcon = (index) => {
    // Получаем цвет маркера из colorSettings или используем стандартный цвет
    const markerColor = currentColorSettings?.textFields?.marker || 
                       currentColorSettings?.textFields?.bullet || 
                       currentColorSettings?.textFields?.title || 
                       '#1976d2';

    if (currentListType === 'checklist') {
      return (
        <CheckCircleIcon 
          sx={{ 
            color: markerColor, 
            fontSize: currentColorSettings?.textFields?.fontSize || '20px' 
          }} 
        />
      );
    }

    if (currentListType === 'custom' && showCustomIcons) {
      const IconComponent = iconTypes.find(icon => icon.value === currentIconType)?.component || CheckCircleIcon;
      return (
        <IconComponent 
          sx={{ 
            color: markerColor, 
            fontSize: currentColorSettings?.textFields?.fontSize || '20px' 
          }} 
        />
      );
    }

    if (currentListType === 'numbered') {
      return (
        <Typography 
          sx={{ 
            color: markerColor, 
            fontWeight: currentColorSettings?.textFields?.fontWeight || 'bold',
            fontSize: currentColorSettings?.textFields?.fontSize || 'inherit',
            fontFamily: currentColorSettings?.textFields?.fontFamily || 'inherit',
            minWidth: '24px'
          }}
        >
          {getNumberPrefix(index)}
        </Typography>
      );
    }

    // Bulleted list
    return (
      <Typography 
        sx={{ 
          color: markerColor, 
          fontSize: currentColorSettings?.textFields?.fontSize || '18px',
          fontWeight: currentColorSettings?.textFields?.fontWeight || 'normal',
          fontFamily: currentColorSettings?.textFields?.fontFamily || 'inherit',
          lineHeight: 1
        }}
      >
        {getBulletIcon(currentBulletStyle)}
      </Typography>
    );
  };

  const handleAddItem = () => {
    if (newItemText.trim()) {
      setItems([...items, newItemText.trim()]);
      setNewItemText('');
    }
  };

  const handleDeleteItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleEditItem = (index, newText) => {
    const updatedItems = [...items];
    updatedItems[index] = newText;
    setItems(updatedItems);
    setEditingIndex(-1);
  };

  const handleSave = () => {
    setIsEditing(false);
    if (onUpdate) {
      onUpdate({
        items,
        listType: currentListType,
        bulletStyle: currentBulletStyle,
        numberStyle: currentNumberStyle,
        spacing: currentSpacing,
        showIcons: showCustomIcons,
        iconType: currentIconType,
        colorSettings: currentColorSettings
      });
    }
  };

  const handleColorUpdate = (newColorSettings) => {
    setCurrentColorSettings(newColorSettings);
    if (onUpdate) {
      onUpdate({
        items,
        listType: currentListType,
        bulletStyle: currentBulletStyle,
        numberStyle: currentNumberStyle,
        spacing: currentSpacing,
        showIcons: showCustomIcons,
        iconType: currentIconType,
        colorSettings: newColorSettings
      });
    }
  };

  const renderList = () => (
    <Paper sx={{ p: 2, position: 'relative' }}>
      {/* Кнопка редактирования */}
      {editable && (
        <Box
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            opacity: 0,
            transition: 'opacity 0.2s ease',
            '.list-container:hover &': {
              opacity: 1
            }
          }}
        >
          <Tooltip title="Редактировать список">
            <IconButton
              size="small"
              onClick={() => setIsEditing(true)}
              sx={{
                backgroundColor: 'rgba(255,255,255,0.9)',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,1)'
                }
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      )}

      <List sx={getListStyles()}>
        {items.map((item, index) => (
          <ListItem key={index} sx={{ alignItems: 'flex-start' }}>
            <ListItemIcon sx={{ 
              minWidth: '32px', 
              marginTop: '2px',
              color: currentColorSettings?.textFields?.bullet || 
                     currentColorSettings?.textFields?.marker || 
                     currentColorSettings?.textFields?.title || 
                     'inherit'
            }}>
              {renderIcon(index)}
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography
                  sx={{
                    color: currentColorSettings?.textFields?.item || 
                           currentColorSettings?.textFields?.listItem || 
                           currentColorSettings?.textFields?.text || 
                           currentColorSettings?.textFields?.content || 
                           '#333333',
                    fontSize: currentColorSettings?.textFields?.fontSize || 'inherit',
                    fontWeight: currentColorSettings?.textFields?.fontWeight || 'normal',
                    fontFamily: currentColorSettings?.textFields?.fontFamily || 'inherit',
                    lineHeight: currentColorSettings?.textFields?.lineHeight || 1.6
                  }}
                >
                  {item}
                </Typography>
              }
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );

  return (
    <AnimationWrapper {...animationSettings}>
      <Box className="list-container">
        {/* Превью */}
        {!isEditing && renderList()}

      {/* Редактор */}
      {isEditing && (
        <Paper sx={{ p: 3, border: '2px solid #1976d2' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
            <Typography variant="h6" color="primary">
              Редактирование списка
            </Typography>
            <Chip label="Активно" color="primary" size="small" />
          </Box>

          {/* Настройки типа списка */}
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <FormControl fullWidth>
              <InputLabel>Тип списка</InputLabel>
              <Select
                value={currentListType}
                label="Тип списка"
                onChange={(e) => setCurrentListType(e.target.value)}
              >
                {listTypes.map(type => (
                  <MenuItem key={type.value} value={type.value}>
                    <Box>
                      <Typography variant="body2">{type.label}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {type.description}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {currentListType === 'bulleted' && (
              <FormControl fullWidth>
                <InputLabel>Стиль маркера</InputLabel>
                <Select
                  value={currentBulletStyle}
                  label="Стиль маркера"
                  onChange={(e) => setCurrentBulletStyle(e.target.value)}
                >
                  {bulletStyles.map(bullet => (
                    <MenuItem key={bullet.value} value={bullet.value}>
                      {bullet.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            {currentListType === 'numbered' && (
              <FormControl fullWidth>
                <InputLabel>Стиль нумерации</InputLabel>
                <Select
                  value={currentNumberStyle}
                  label="Стиль нумерации"
                  onChange={(e) => setCurrentNumberStyle(e.target.value)}
                >
                  {numberStyles.map(number => (
                    <MenuItem key={number.value} value={number.value}>
                      {number.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            <FormControl fullWidth>
              <InputLabel>Интервал</InputLabel>
              <Select
                value={currentSpacing}
                label="Интервал"
                onChange={(e) => setCurrentSpacing(e.target.value)}
              >
                {spacingOptions.map(spacing => (
                  <MenuItem key={spacing.value} value={spacing.value}>
                    {spacing.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Дополнительные настройки */}
          {currentListType === 'custom' && (
            <Box sx={{ mb: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={showCustomIcons}
                    onChange={(e) => setShowCustomIcons(e.target.checked)}
                  />
                }
                label="Показывать иконки"
              />
              {showCustomIcons && (
                <FormControl fullWidth sx={{ mt: 1 }}>
                  <InputLabel>Тип иконки</InputLabel>
                  <Select
                    value={currentIconType}
                    label="Тип иконки"
                    onChange={(e) => setCurrentIconType(e.target.value)}
                  >
                    {iconTypes.map(icon => (
                      <MenuItem key={icon.value} value={icon.value}>
                        {icon.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            </Box>
          )}

          {/* Настройки цветов */}
          {/* Редактирование пунктов */}
          <Typography variant="subtitle2" gutterBottom>
            Пункты списка:
          </Typography>
          <Box sx={{ mb: 2 }}>
            {items.map((item, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <DragIndicatorIcon sx={{ color: '#ccc', cursor: 'grab' }} />
                <TextField
                  fullWidth
                  size="small"
                  value={editingIndex === index ? item : item}
                  onChange={(e) => handleEditItem(index, e.target.value)}
                  onBlur={() => setEditingIndex(-1)}
                  onFocus={() => setEditingIndex(index)}
                />
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => handleDeleteItem(index)}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            ))}

            {/* Добавление нового пункта */}
            <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Добавить новый пункт..."
                value={newItemText}
                onChange={(e) => setNewItemText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddItem()}
              />
              <Button
                variant="outlined"
                size="small"
                startIcon={<AddIcon />}
                onClick={handleAddItem}
              >
                Добавить
              </Button>
            </Box>
          </Box>

          {/* Предварительный просмотр */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Предварительный просмотр:
            </Typography>
            <Box sx={{ border: '1px dashed #ccc', borderRadius: 1, p: 2 }}>
              {renderList()}
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Настройки цветов */}
          <ColorSettings
            title="Настройки цветов списка"
            colorSettings={currentColorSettings}
            onUpdate={handleColorUpdate}
            availableFields={[
              {
                name: 'item',
                label: 'Цвет пунктов',
                description: 'Цвет текста элементов списка',
                defaultColor: '#333333'
              },
              {
                name: 'marker',
                label: 'Цвет маркеров',
                description: 'Цвет маркеров или номеров',
                defaultColor: '#1976d2'
              }
            ]}
            defaultColors={{
              item: '#333333',
              marker: '#1976d2'
            }}
            hideCardBackground={true}
            hideAreaColors={true}
          />

          {/* Кнопки */}
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
            <Button onClick={() => setIsEditing(false)}>
              Отмена
            </Button>
            <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSave}>
              Сохранить
            </Button>
          </Box>
        </Paper>
      )}
    </Box>
    </AnimationWrapper>
  );
};

export default ListComponent; 