import React from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Typography,
  IconButton,
  Switch,
  FormControlLabel,
  TextField,
  Grid,
  Collapse,
  Divider
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { styled } from '@mui/material/styles';

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

const SECTIONS_DISPLAY_MODES = {
  CARDS: 'cards'
};

const SECTIONS_DISPLAY_LABELS = {
  [SECTIONS_DISPLAY_MODES.CARDS]: 'Карточки'
};

const HomePageSettingsEditor = ({ 
  homePageSettings = {}, 
  onHomePageSettingsChange, 
  expanded, 
  onToggle, 
  sectionsData = {} 
}) => {
  const defaultHomePageSettings = {
    showFeaturedSection: false,
    featuredSectionId: '', // Будет автоматически выбран первый доступный раздел
    showSectionsPreview: false,
    sectionsDisplayMode: 'cards',
    maxSectionsToShow: 6,
    sectionsOrder: [],
    showContactPreview: false
  };

  // Принудительное обновление при изменении sectionsData
  const [forceUpdate, setForceUpdate] = React.useState(0);
  React.useEffect(() => {
    console.log('🔄 [HomePageSettingsEditor] sectionsData изменился, принудительно обновляем');
    console.log('📊 sectionsData keys:', Object.keys(sectionsData || {}));
    console.log('📊 sectionsData length:', Object.keys(sectionsData || {}).length);
    console.log('📊 showFeaturedSection:', homePageSettings?.showFeaturedSection);
    
    // Автоматически выбираем первый раздел, если ничего не выбрано и есть доступные разделы
    // НО ТОЛЬКО если включен showFeaturedSection
    if (sectionsData && Object.keys(sectionsData).length > 0 && homePageSettings?.showFeaturedSection) {
      const currentFeaturedId = homePageSettings?.featuredSectionId || '';
      const availableSections = Object.keys(sectionsData);
      
      // Если ничего не выбрано или выбранный раздел больше не существует
      if (!currentFeaturedId || !availableSections.includes(currentFeaturedId)) {
        const firstSectionId = availableSections[0];
        console.log('🎯 Автоматически выбираем первый раздел:', firstSectionId);
        
        // Обновляем featuredSectionId через onHomePageSettingsChange
        const updatedHomePageSettings = {
          ...homePageSettings,
          featuredSectionId: firstSectionId
        };
        
        onHomePageSettingsChange(updatedHomePageSettings);
      }
    }
    
    setForceUpdate(prev => prev + 1);
  }, [sectionsData, homePageSettings?.showFeaturedSection]);

  const handleChange = (field, value) => {
    console.log('HomePageSettingsEditor handleChange:', field, value);
    console.log('Current homePageSettings:', homePageSettings);
    
    const newHomePageSettings = {
      ...defaultHomePageSettings,
      ...homePageSettings,
      [field]: value
    };
    console.log('New homePageSettings:', newHomePageSettings);
    
    onHomePageSettingsChange(newHomePageSettings);
  };

  return (
    <Paper sx={{ 
      p: 2, 
      mb: 2,
      backgroundColor: '#ff6b35',
      border: '2px solid #ff4500',
      boxShadow: '0 4px 8px rgba(255, 107, 53, 0.3)'
    }}>
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center',
          cursor: 'pointer'
        }}
        onClick={onToggle}
      >
        <Typography variant="h6" sx={{ flexGrow: 1, color: 'white', fontWeight: 'bold' }}>
          Настройка index
        </Typography>
        <ExpandMore
          expand={expanded}
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
          aria-expanded={expanded}
          aria-label="show more"
          sx={{ cursor: 'pointer' }}
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

          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={homePageSettings?.showFeaturedSection ?? defaultHomePageSettings.showFeaturedSection}
                  onChange={(e) => handleChange('showFeaturedSection', e.target.checked)}
                />
              }
              label="Показывать выделенный раздел"
            />
          </Grid>

          {(homePageSettings?.showFeaturedSection ?? defaultHomePageSettings.showFeaturedSection) && (
            <Grid item xs={12}>
              <FormControl fullWidth size="small">
                <InputLabel>Выделенный раздел</InputLabel>
                <Select
                  value={homePageSettings?.featuredSectionId || ''}
                  label="Выделенный раздел"
                  onChange={(e) => handleChange('featuredSectionId', e.target.value)}
                >
                  {sectionsData && Object.keys(sectionsData).length > 0 ? (
                    Object.entries(sectionsData).map(([sectionId, sectionData], index) => (
                      <MenuItem key={sectionId} value={sectionId}>
                        {sectionData.title || sectionId}
                        {index === 0 && ' (выбран по умолчанию)'}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem value="" disabled>
                      Нет доступных разделов
                    </MenuItem>
                  )}
                </Select>
              </FormControl>
            </Grid>
          )}

          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={homePageSettings?.showSectionsPreview ?? defaultHomePageSettings.showSectionsPreview}
                  onChange={(e) => handleChange('showSectionsPreview', e.target.checked)}
                />
              }
              label="Показывать превью разделов"
            />
          </Grid>

          {homePageSettings?.showSectionsPreview && (
            <>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Режим отображения</InputLabel>
                  <Select
                    value={homePageSettings?.sectionsDisplayMode || defaultHomePageSettings.sectionsDisplayMode}
                    label="Режим отображения"
                    onChange={(e) => handleChange('sectionsDisplayMode', e.target.value)}
                  >
                    <MenuItem value={SECTIONS_DISPLAY_MODES.CARDS}>{SECTIONS_DISPLAY_LABELS[SECTIONS_DISPLAY_MODES.CARDS]}</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Максимум разделов"
                  type="number"
                  value={homePageSettings?.maxSectionsToShow || defaultHomePageSettings.maxSectionsToShow}
                  onChange={(e) => handleChange('maxSectionsToShow', parseInt(e.target.value) || 6)}
                  inputProps={{ min: 1, max: 12 }}
                />
              </Grid>
            </>
          )}

          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={homePageSettings?.showContactPreview ?? defaultHomePageSettings.showContactPreview}
                  onChange={(e) => handleChange('showContactPreview', e.target.checked)}
                />
              }
              label="Показывать превью контактов"
            />
          </Grid>
        </Grid>
      </Collapse>
    </Paper>
  );
};

export default HomePageSettingsEditor;
