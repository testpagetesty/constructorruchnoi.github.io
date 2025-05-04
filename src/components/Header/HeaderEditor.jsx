import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Grid,
  Paper,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  FormControlLabel,
  Switch,
  Slider,
  InputAdornment,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const defaultMenuItems = [
  { id: 1, title: 'Главная', url: '/' },
  { id: 2, title: 'О нас', url: '/about' },
  { id: 3, title: 'Услуги', url: '/services' },
  { id: 4, title: 'Портфолио', url: '/portfolio' },
  { id: 5, title: 'Блог', url: '/blog' },
  { id: 6, title: 'FAQ', url: '/faq' }
];

const initialHeaderData = {
  siteName: 'Мой сайт',
  titleColor: '#000000',
  backgroundColor: '#ffffff',
  linksColor: '#000000',
  menuItems: [
    { id: 1, title: 'Главная' },
    { id: 2, title: 'О нас' },
    { id: 3, title: 'Услуги' }
  ]
};

const HeaderEditor = ({ headerData, onHeaderChange }) => {
  const [editingItem, setEditingItem] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [menuExpanded, setMenuExpanded] = useState(false);

  useEffect(() => {
    if (!headerData.menuItems || headerData.menuItems.length === 0) {
      onHeaderChange({
        ...headerData,
        menuItems: defaultMenuItems
      });
    }
  }, []);

  const handleAddItem = () => {
    const newId = Math.max(...headerData.menuItems.map(item => item.id), 0) + 1;
    const newItem = {
      id: newId,
      title: `Новый пункт ${newId}`,
      url: `/new-${newId}`
    };
    onHeaderChange({
      ...headerData,
      menuItems: [...headerData.menuItems, newItem]
    });
  };

  const handleDeleteItem = (id) => {
    onHeaderChange({
      ...headerData,
      menuItems: headerData.menuItems.filter(item => item.id !== id)
    });
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
  };

  const handleSaveItem = () => {
    onHeaderChange({
      ...headerData,
      menuItems: headerData.menuItems.map(item =>
        item.id === editingItem.id ? editingItem : item
      )
    });
    setEditingItem(null);
  };

  return (
    <Box>
      <Accordion expanded={expanded} onChange={() => setExpanded(!expanded)}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
          sx={{ minHeight: '48px', '& .MuiAccordionSummary-content': { my: 0 } }}
        >
          <Typography variant="subtitle1">Настройки шапки</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 1 }}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                size="small"
                label="Название сайта"
                value={headerData.title}
                onChange={(e) => onHeaderChange({ ...headerData, title: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                size="small"
                label="Цвет фона"
                type="color"
                value={headerData.backgroundColor}
                onChange={(e) => onHeaderChange({ ...headerData, backgroundColor: e.target.value })}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <IconButton size="small">
                        <ColorLensIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                size="small"
                label="Цвет текста названия"
                type="color"
                value={headerData.titleColor}
                onChange={(e) => onHeaderChange({ ...headerData, titleColor: e.target.value })}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <IconButton size="small">
                        <ColorLensIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                size="small"
                label="Цвет текста ссылок"
                type="color"
                value={headerData.linksColor}
                onChange={(e) => onHeaderChange({ ...headerData, linksColor: e.target.value })}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <IconButton size="small">
                        <ColorLensIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 1 }} />

          <Accordion 
            expanded={menuExpanded} 
            onChange={() => setMenuExpanded(!menuExpanded)}
            sx={{ 
              boxShadow: 'none',
              '&:before': {
                display: 'none',
              },
              '&.Mui-expanded': {
                margin: 0,
              }
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2a-content"
              id="panel2a-header"
              sx={{ 
                minHeight: '36px', 
                '& .MuiAccordionSummary-content': { my: 0 },
                p: 0
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <Typography variant="subtitle2">Пункты меню</Typography>
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<AddIcon fontSize="small" />}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddItem();
                  }}
                >
                  Добавить
                </Button>
              </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 0 }}>
              {headerData.menuItems.map((item) => (
                <Paper
                  key={item.id}
                  elevation={0}
                  sx={{ 
                    p: 1, 
                    mb: 1, 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    backgroundColor: 'rgba(0, 0, 0, 0.02)'
                  }}
                >
                  {editingItem?.id === item.id ? (
                    <Box sx={{ flexGrow: 1, mr: 1 }}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Название"
                        value={editingItem.title}
                        onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                        sx={{ mb: 1 }}
                      />
                      <TextField
                        fullWidth
                        size="small"
                        label="URL"
                        value={editingItem.url}
                        onChange={(e) => setEditingItem({ ...editingItem, url: e.target.value })}
                      />
                    </Box>
                  ) : (
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="body2">{item.title}</Typography>
                      <Typography variant="caption" color="text.secondary">{item.url}</Typography>
                    </Box>
                  )}
                  <Box>
                    {editingItem?.id === item.id ? (
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={handleSaveItem}
                        sx={{ mr: 0.5 }}
                      >
                        Сохранить
                      </Button>
                    ) : (
                      <IconButton
                        color="primary"
                        size="small"
                        onClick={() => handleEditItem(item)}
                        sx={{ mr: 0.5 }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    )}
                    <IconButton
                      color="error"
                      size="small"
                      onClick={() => handleDeleteItem(item.id)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Paper>
              ))}
            </AccordionDetails>
          </Accordion>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default HeaderEditor; 