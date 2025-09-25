import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Box, Paper, Typography, Grid, TextField, Button, Collapse, Stack, IconButton, FormControl, InputLabel, Select, MenuItem, FormControlLabel, Switch, Container, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import HeaderEditor from './HeaderEditor';
import HeroEditor from './HeroEditor';
import ContactEditor from './ContactEditor';
import FooterEditor from './FooterEditor';
import LegalDocumentsEditor from './LegalDocumentsEditor';
import AiParser from '../AiParser/AiParser';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ExpandLess from '@mui/icons-material/ExpandLess';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import ImageIcon from '@mui/icons-material/Image';
import { CARD_TYPES } from '../../utils/configUtils';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { exportSite } from '../../utils/siteExporter';
import { exportMultiPageSite, generateHeroSection } from '../../utils/multiPageSiteExporter';
import { generateLiveChatHTML, generateLiveChatCSS, generateLiveChatJS } from '../../utils/liveChatExporter';

import LiveChatEditor from './LiveChatEditor';
import Slider from '@mui/material/Slider';
import { imageCacheService } from '../../utils/imageCacheService';
import imageCompression from 'browser-image-compression';
import AuthPanel from '../Auth/AuthPanel';
import SectionImageGallery from './SectionImageGallery';
import EnhancedSectionEditor from './EnhancedSectionEditor';
import { STYLE_PRESETS } from '../../utils/editorStylePresets';

// Локальные стили больше не нужны - используем импорт
const UNUSED_LOCAL_STYLE_PRESETS = {
  CORPORATE: {
    titleColor: '#1a237e',
    descriptionColor: '#455a64',
    cardType: CARD_TYPES.ELEVATED,
    backgroundColor: '#ffffff',
    borderColor: '#e0e0e0',
    cardBackgroundColor: '#f5f5f5',
    cardBorderColor: '#e0e0e0',
    cardTitleColor: '#1a237e',
    cardContentColor: '#455a64',
    cardBackgroundType: 'solid',
    cardGradientColor1: '#f5f5f5',
    cardGradientColor2: '#e0e0e0',
    cardGradientDirection: 'to bottom',
    style: {
      shadow: '0 2px 4px rgba(0,0,0,0.1)',
      borderRadius: '8px'
    }
  },
  MODERN: {
    titleColor: '#6200ea',
    descriptionColor: '#424242',
    cardType: CARD_TYPES.GRADIENT,
    backgroundColor: '#fafafa',
    borderColor: '#e0e0e0',
    cardBackgroundColor: '#ffffff',
    cardBorderColor: '#7c4dff',
    cardTitleColor: '#ffffff',
    cardContentColor: '#ffffff',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#6200ea',
    cardGradientColor2: '#9c27b0',
    cardGradientDirection: '45deg',
    style: {
      shadow: '0 4px 6px rgba(0,0,0,0.1)',
      borderRadius: '12px',
      padding: '16px'
    }
  },
  MINIMAL: {
    titleColor: '#212121',
    descriptionColor: '#757575',
    cardType: CARD_TYPES.SIMPLE,
    backgroundColor: '#ffffff',
    borderColor: '#e0e0e0',
    cardBackgroundColor: '#ffffff',
    cardBorderColor: '#eeeeee',
    cardTitleColor: '#212121',
    cardContentColor: '#757575',
    cardBackgroundType: 'solid',
    cardGradientColor1: '#ffffff',
    cardGradientColor2: '#f5f5f5',
    cardGradientDirection: 'to bottom',
    style: {
      shadow: 'none',
      borderRadius: '4px'
    }
  },
  NATURE: {
    titleColor: '#1b5e20',
    descriptionColor: '#2e7d32',
    cardType: CARD_TYPES.ELEVATED,
    backgroundColor: '#f1f8e9',
    borderColor: '#c5e1a5',
    cardBackgroundColor: '#ffffff',
    cardBorderColor: '#a5d6a7',
    cardTitleColor: '#1b5e20',
    cardContentColor: '#2e7d32',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#e8f5e9',
    cardGradientColor2: '#c8e6c9',
    cardGradientDirection: 'to bottom',
    style: {
      shadow: '0 2px 4px rgba(0,0,0,0.1)',
      borderRadius: '8px'
    }
  },
  OCEAN: {
    titleColor: '#01579b',
    descriptionColor: '#0277bd',
    cardType: CARD_TYPES.GRADIENT,
    backgroundColor: '#e1f5fe',
    borderColor: '#b3e5fc',
    cardBackgroundColor: '#ffffff',
    cardBorderColor: '#81d4fa',
    cardTitleColor: '#ffffff',
    cardContentColor: '#e1f5fe',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#0288d1',
    cardGradientColor2: '#039be5',
    cardGradientDirection: '45deg',
    style: {
      shadow: '0 4px 6px rgba(0,0,0,0.1)',
      borderRadius: '12px',
      padding: '16px'
    }
  },
  SUNSET: {
    titleColor: '#bf360c',
    descriptionColor: '#d84315',
    cardType: CARD_TYPES.GRADIENT,
    backgroundColor: '#fff3e0',
    borderColor: '#ffe0b2',
    cardBackgroundColor: '#ffffff',
    cardBorderColor: '#ffab91',
    cardTitleColor: '#ffffff',
    cardContentColor: '#fff3e0',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#e64a19',
    cardGradientColor2: '#f4511e',
    cardGradientDirection: '45deg',
    style: {
      shadow: '0 4px 6px rgba(0,0,0,0.1)',
      borderRadius: '12px',
      padding: '16px'
    }
  },
  DARK_MODE: {
    titleColor: '#ffffff',
    descriptionColor: '#b0bec5',
    cardType: 'elevated',
    backgroundColor: '#263238',
    borderColor: '#37474f',
    cardBackgroundColor: '#37474f',
    cardBorderColor: '#455a64',
    cardTitleColor: '#ffffff',
    cardContentColor: '#b0bec5',
    cardBackgroundType: 'solid',
    cardGradientColor1: '#37474f',
    cardGradientColor2: '#455a64',
    cardGradientDirection: 'to bottom',
    style: {
      shadow: '0 4px 6px rgba(0,0,0,0.2)',
      borderRadius: '8px'
    }
  },
  PASTEL: {
    titleColor: '#6a1b9a',
    descriptionColor: '#8e24aa',
    cardType: 'simple',
    backgroundColor: '#f3e5f5',
    borderColor: '#e1bee7',
    cardBackgroundColor: '#ffffff',
    cardBorderColor: '#ce93d8',
    cardTitleColor: '#6a1b9a',
    cardContentColor: '#8e24aa',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#f3e5f5',
    cardGradientColor2: '#e1bee7',
    cardGradientDirection: 'to bottom',
    style: {
      shadow: '0 2px 4px rgba(0,0,0,0.05)',
      borderRadius: '12px'
    }
  },
  FOREST: {
    titleColor: '#1b5e20',
    descriptionColor: '#2e7d32',
    cardType: 'elevated',
    backgroundColor: '#e8f5e9',
    borderColor: '#c8e6c9',
    cardBackgroundColor: '#ffffff',
    cardBorderColor: '#a5d6a7',
    cardTitleColor: '#1b5e20',
    cardContentColor: '#2e7d32',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#81c784',
    cardGradientColor2: '#66bb6a',
    cardGradientDirection: '45deg',
    style: {
      shadow: '0 4px 6px rgba(0,0,0,0.1)',
      borderRadius: '8px'
    }
  },
  ROYAL: {
    titleColor: '#4a148c',
    descriptionColor: '#6a1b9a',
    cardType: 'gradient',
    backgroundColor: '#f3e5f5',
    borderColor: '#e1bee7',
    cardBackgroundColor: '#ffffff',
    cardBorderColor: '#ce93d8',
    cardTitleColor: '#ffffff',
    cardContentColor: '#f3e5f5',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#6a1b9a',
    cardGradientColor2: '#8e24aa',
    cardGradientDirection: '45deg',
    style: {
      shadow: '0 4px 6px rgba(0,0,0,0.1)',
      borderRadius: '12px',
      padding: '16px'
    }
  },
  CRIMSON_TIDE: {
    titleColor: '#b71c1c',
    descriptionColor: '#c62828',
    cardType: 'elevated',
    backgroundColor: '#ffebee',
    borderColor: '#ffcdd2',
    cardBackgroundColor: '#ffffff',
    cardBorderColor: '#ef9a9a',
    cardTitleColor: '#b71c1c',
    cardContentColor: '#c62828',
    cardBackgroundType: 'solid',
    cardGradientColor1: '#ffebee',
    cardGradientColor2: '#ffcdd2',
    cardGradientDirection: 'to bottom',
    style: {
      shadow: '0 2px 4px rgba(0,0,0,0.1)',
      borderRadius: '8px'
    }
  },
  AMBER_GOLD: {
    titleColor: '#ff6f00',
    descriptionColor: '#ff8f00',
    cardType: 'gradient',
    backgroundColor: '#fff8e1',
    borderColor: '#ffecb3',
    cardBackgroundColor: '#ffffff',
    cardBorderColor: '#ffe082',
    cardTitleColor: '#ffffff',
    cardContentColor: '#fff8e1',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#ff8f00',
    cardGradientColor2: '#ffb300',
    cardGradientDirection: '45deg',
    style: {
      shadow: '0 4px 6px rgba(0,0,0,0.1)',
      borderRadius: '12px',
      padding: '16px'
    }
  },
  TEAL_ELEGANCE: {
    titleColor: '#00695c',
    descriptionColor: '#00796b',
    cardType: 'elevated',
    backgroundColor: '#e0f2f1',
    borderColor: '#b2dfdb',
    cardBackgroundColor: '#ffffff',
    cardBorderColor: '#80cbc4',
    cardTitleColor: '#00695c',
    cardContentColor: '#00796b',
    cardBackgroundType: 'solid',
    cardGradientColor1: '#e0f2f1',
    cardGradientColor2: '#b2dfdb',
    cardGradientDirection: 'to bottom',
    style: {
      shadow: '0 2px 4px rgba(0,0,0,0.1)',
      borderRadius: '8px'
    }
  },
  CYBER_NEON: {
    titleColor: '#00e5ff',
    descriptionColor: '#00b8d4',
    cardType: 'gradient',
    backgroundColor: '#0a0a1f',
    borderColor: '#121236',
    cardBackgroundColor: '#0a0a1f',
    cardBorderColor: '#121236',
    cardTitleColor: '#ffffff',
    cardContentColor: '#e0f7fa',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#121236',
    cardGradientColor2: '#1a1a4a',
    cardGradientDirection: '135deg',
    style: {
      shadow: '0 4px 8px rgba(0,229,255,0.3)',
      borderRadius: '12px',
      padding: '16px'
    }
  },
  GRAPE_SODA: {
    titleColor: '#4a148c',
    descriptionColor: '#6a1b9a',
    cardType: 'gradient',
    backgroundColor: '#f3e5f5',
    borderColor: '#e1bee7',
    cardBackgroundColor: '#4a148c',
    cardBorderColor: '#7b1fa2',
    cardTitleColor: '#ffffff',
    cardContentColor: '#f3e5f5',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#4a148c',
    cardGradientColor2: '#7b1fa2',
    cardGradientDirection: 'to right',
    style: {
      shadow: '0 4px 8px rgba(0,0,0,0.2)',
      borderRadius: '12px',
      padding: '16px'
    }
  },
  COFFEE_CREAM: {
    titleColor: '#3e2723',
    descriptionColor: '#4e342e',
    cardType: 'elevated',
    backgroundColor: '#efebe9',
    borderColor: '#d7ccc8',
    cardBackgroundColor: '#ffffff',
    cardBorderColor: '#bcaaa4',
    cardTitleColor: '#3e2723',
    cardContentColor: '#4e342e',
    cardBackgroundType: 'solid',
    cardGradientColor1: '#efebe9',
    cardGradientColor2: '#d7ccc8',
    cardGradientDirection: 'to bottom',
    style: {
      shadow: '0 2px 4px rgba(0,0,0,0.1)',
      borderRadius: '8px'
    }
  },
  SPRING_BLOOM: {
    titleColor: '#ad1457',
    descriptionColor: '#c2185b',
    cardType: 'elevated',
    backgroundColor: '#fce4ec',
    borderColor: '#f8bbd0',
    cardBackgroundColor: '#ffffff',
    cardBorderColor: '#f48fb1',
    cardTitleColor: '#ad1457',
    cardContentColor: '#c2185b',
    cardBackgroundType: 'solid',
    cardGradientColor1: '#fce4ec',
    cardGradientColor2: '#f8bbd0',
    cardGradientDirection: 'to bottom',
    style: {
      shadow: '0 2px 4px rgba(0,0,0,0.1)',
      borderRadius: '12px'
    }
  },
  BRIGHT_FUTURE: {
    titleColor: '#0d47a1',
    descriptionColor: '#1565c0',
    cardType: 'gradient',
    backgroundColor: '#e3f2fd',
    borderColor: '#bbdefb',
    cardBackgroundColor: '#ffffff',
    cardBorderColor: '#90caf9',
    cardTitleColor: '#ffffff',
    cardContentColor: '#e3f2fd',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#1565c0',
    cardGradientColor2: '#1976d2',
    cardGradientDirection: '45deg',
    style: {
      shadow: '0 4px 6px rgba(0,0,0,0.1)',
      borderRadius: '12px',
      padding: '16px'
    }
  },
  LAVENDER_MIST: {
    titleColor: '#4527a0',
    descriptionColor: '#512da8',
    cardType: 'elevated',
    backgroundColor: '#ede7f6',
    borderColor: '#d1c4e9',
    cardBackgroundColor: '#ffffff',
    cardBorderColor: '#b39ddb',
    cardTitleColor: '#4527a0',
    cardContentColor: '#512da8',
    cardBackgroundType: 'solid',
    cardGradientColor1: '#ede7f6',
    cardGradientColor2: '#d1c4e9',
    cardGradientDirection: 'to bottom',
    style: {
      shadow: '0 2px 4px rgba(0,0,0,0.1)',
      borderRadius: '8px'
    }
  },
  MIDNIGHT_SKY: {
    titleColor: '#e1f5fe',
    descriptionColor: '#b3e5fc',
    cardType: 'gradient',
    backgroundColor: '#0d47a1',
    borderColor: '#1565c0',
    cardBackgroundColor: '#1a237e',
    cardBorderColor: '#283593',
    cardTitleColor: '#e1f5fe',
    cardContentColor: '#b3e5fc',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#1a237e',
    cardGradientColor2: '#283593',
    cardGradientDirection: '135deg',
    style: {
      shadow: '0 4px 8px rgba(0,0,0,0.3)',
      borderRadius: '12px',
      padding: '16px'
    }
  },
  CORAL_REEF: {
    titleColor: '#bf360c',
    descriptionColor: '#d84315',
    cardType: 'gradient',
    backgroundColor: '#fff3e0',
    borderColor: '#ffe0b2',
    cardBackgroundColor: '#ffffff',
    cardBorderColor: '#ffcc80',
    cardTitleColor: '#ffffff',
    cardContentColor: '#fff3e0',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#ff7043',
    cardGradientColor2: '#ff8a65',
    cardGradientDirection: 'to right',
    style: {
      shadow: '0 4px 6px rgba(0,0,0,0.1)',
      borderRadius: '12px',
      padding: '16px'
    }
  },
  EMERALD_DREAM: {
    titleColor: '#004d40',
    descriptionColor: '#00695c',
    cardType: 'gradient',
    backgroundColor: '#e0f2f1',
    borderColor: '#b2dfdb',
    cardBackgroundColor: '#ffffff',
    cardBorderColor: '#80cbc4',
    cardTitleColor: '#ffffff',
    cardContentColor: '#e0f2f1',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#00695c',
    cardGradientColor2: '#00796b',
    cardGradientDirection: '45deg',
    style: {
      shadow: '0 4px 6px rgba(0,0,0,0.1)',
      borderRadius: '12px',
      padding: '16px'
    }
  },
  DARK_ELEGANCE: {
    titleColor: '#f5f5f5',
    descriptionColor: '#e0e0e0',
    cardType: 'elevated',
    backgroundColor: '#212121',
    borderColor: '#424242',
    cardBackgroundColor: '#333333',
    cardBorderColor: '#616161',
    cardTitleColor: '#f5f5f5',
    cardContentColor: '#e0e0e0',
    cardBackgroundType: 'solid',
    cardGradientColor1: '#333333',
    cardGradientColor2: '#424242',
    cardGradientDirection: 'to bottom',
    style: {
      shadow: '0 4px 8px rgba(0,0,0,0.3)',
      borderRadius: '8px'
    }
  },
  GOLDEN_LUXURY: {
    titleColor: '#3e2723',
    descriptionColor: '#4e342e',
    cardType: 'gradient',
    backgroundColor: '#fef9e7',
    borderColor: '#f9e9ca',
    cardBackgroundColor: '#ffffff',
    cardBorderColor: '#f5d7a1',
    cardTitleColor: '#3e2723',
    cardContentColor: '#4e342e',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#ffd700',
    cardGradientColor2: '#ffecb3',
    cardGradientDirection: '135deg',
    style: {
      shadow: '0 4px 8px rgba(218,165,32,0.2)',
      borderRadius: '12px',
      padding: '16px'
    }
  },
  CHERRY_BLOSSOM: {
    titleColor: '#ad1457',
    descriptionColor: '#c2185b',
    cardType: 'elevated',
    backgroundColor: '#fce4ec',
    borderColor: '#f8bbd0',
    cardBackgroundColor: '#ffffff',
    cardBorderColor: '#f48fb1',
    cardTitleColor: '#ad1457',
    cardContentColor: '#c2185b',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#fce4ec',
    cardGradientColor2: '#f8bbd0',
    cardGradientDirection: 'to right',
    style: {
      shadow: '0 4px 6px rgba(0,0,0,0.1)',
      borderRadius: '12px'
    }
  },
  NORDIC_FROST: {
    titleColor: '#0d47a1',
    descriptionColor: '#1565c0',
    cardType: 'elevated',
    backgroundColor: '#eceff1',
    borderColor: '#cfd8dc',
    cardBackgroundColor: '#ffffff',
    cardBorderColor: '#b0bec5',
    cardTitleColor: '#0d47a1',
    cardContentColor: '#1565c0',
    cardBackgroundType: 'solid',
    cardGradientColor1: '#eceff1',
    cardGradientColor2: '#cfd8dc',
    cardGradientDirection: 'to bottom',
    style: {
      shadow: '0 2px 4px rgba(0,0,0,0.1)',
      borderRadius: '8px'
    }
  },
  NEON_LIFE: {
    titleColor: '#f50057',
    descriptionColor: '#ff4081',
    cardType: 'gradient',
    backgroundColor: '#1a1a2e',
    borderColor: '#282846',
    cardBackgroundColor: '#1a1a2e',
    cardBorderColor: '#282846',
    cardTitleColor: '#ffffff',
    cardContentColor: '#e0e0e0',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#282846',
    cardGradientColor2: '#16213e',
    cardGradientDirection: '135deg',
    style: {
      shadow: '0 4px 8px rgba(245,0,87,0.3)',
      borderRadius: '12px',
      padding: '16px'
    }
  },
  EARTH_TONES: {
    titleColor: '#33691e',
    descriptionColor: '#558b2f',
    cardType: 'elevated',
    backgroundColor: '#f1f8e9',
    borderColor: '#dcedc8',
    cardBackgroundColor: '#ffffff',
    cardBorderColor: '#c5e1a5',
    cardTitleColor: '#33691e',
    cardContentColor: '#558b2f',
    cardBackgroundType: 'solid',
    cardGradientColor1: '#f1f8e9',
    cardGradientColor2: '#dcedc8',
    cardGradientDirection: 'to bottom',
    style: {
      shadow: '0 2px 4px rgba(0,0,0,0.1)',
      borderRadius: '8px'
    }
  },
  AZURE_DREAMS: {
    titleColor: '#01579b',
    descriptionColor: '#0277bd',
    cardType: 'gradient',
    backgroundColor: '#e1f5fe',
    borderColor: '#b3e5fc',
    cardBackgroundColor: '#ffffff',
    cardBorderColor: '#81d4fa',
    cardTitleColor: '#ffffff',
    cardContentColor: '#e1f5fe',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#039be5',
    cardGradientColor2: '#29b6f6',
    cardGradientDirection: '135deg',
    style: {
      shadow: '0 4px 6px rgba(0,0,0,0.1)',
      borderRadius: '12px',
      padding: '16px'
    }
  },
  SUNSET_VIBES: {
    titleColor: '#b71c1c',
    descriptionColor: '#c62828',
    cardType: 'gradient',
    backgroundColor: '#ffebee',
    borderColor: '#ffcdd2',
    cardBackgroundColor: '#ffffff',
    cardBorderColor: '#ef9a9a',
    cardTitleColor: '#ffffff',
    cardContentColor: '#ffebee',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#ff8a80',
    cardGradientColor2: '#ff5252',
    cardGradientDirection: 'to right',
    style: {
      shadow: '0 4px 6px rgba(0,0,0,0.1)',
      borderRadius: '12px',
      padding: '16px'
    }
  },
  LIME_FRESH: {
    titleColor: '#1b5e20',
    descriptionColor: '#2e7d32',
    cardType: 'elevated',
    backgroundColor: '#f9fbe7',
    borderColor: '#f0f4c3',
    cardBackgroundColor: '#ffffff',
    cardBorderColor: '#e6ee9c',
    cardTitleColor: '#1b5e20',
    cardContentColor: '#2e7d32',
    cardBackgroundType: 'solid',
    cardGradientColor1: '#f9fbe7',
    cardGradientColor2: '#f0f4c3',
    cardGradientDirection: 'to bottom',
    style: {
      shadow: '0 2px 4px rgba(0,0,0,0.1)',
      borderRadius: '8px'
    }
  },
  OCEAN_WAVE: {
    titleColor: '#ffffff',
    descriptionColor: '#e0f2f1',
    cardType: 'gradient',
    backgroundColor: '#006064',
    borderColor: '#00838f',
    cardBackgroundColor: '#006064',
    cardBorderColor: '#00acc1',
    cardTitleColor: '#ffffff',
    cardContentColor: '#e0f7fa',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#006064',
    cardGradientColor2: '#00838f',
    cardGradientDirection: '45deg',
    style: {
      shadow: '0 6px 12px rgba(0,96,100,0.4)',
      borderRadius: '16px',
      padding: '20px'
    }
  },
  MAGENTA_GLOW: {
    titleColor: '#880e4f',
    descriptionColor: '#ad1457',
    cardType: 'gradient',
    backgroundColor: '#fce4ec',
    borderColor: '#f8bbd0',
    cardBackgroundColor: '#ffffff',
    cardBorderColor: '#f48fb1',
    cardTitleColor: '#ffffff',
    cardContentColor: '#fce4ec',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#e91e63',
    cardGradientColor2: '#f06292',
    cardGradientDirection: '135deg',
    style: {
      shadow: '0 4px 8px rgba(233,30,99,0.3)',
      borderRadius: '14px',
      padding: '18px'
    }
  },
  STEEL_BLUE: {
    titleColor: '#102027',
    descriptionColor: '#263238',
    cardType: 'elevated',
    backgroundColor: '#eceff1',
    borderColor: '#cfd8dc',
    cardBackgroundColor: '#ffffff',
    cardBorderColor: '#90a4ae',
    cardTitleColor: '#102027',
    cardContentColor: '#263238',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#eceff1',
    cardGradientColor2: '#cfd8dc',
    cardGradientDirection: 'to bottom',
    style: {
      shadow: '0 3px 6px rgba(0,0,0,0.15)',
      borderRadius: '10px'
    }
  },
  FIRE_BURST: {
    titleColor: '#ffffff',
    descriptionColor: '#fff3e0',
    cardType: 'gradient',
    backgroundColor: '#e65100',
    borderColor: '#f57c00',
    cardBackgroundColor: '#e65100',
    cardBorderColor: '#ff9800',
    cardTitleColor: '#ffffff',
    cardContentColor: '#fff3e0',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#ff3d00',
    cardGradientColor2: '#ff6d00',
    cardGradientDirection: '45deg',
    style: {
      shadow: '0 6px 12px rgba(255,61,0,0.4)',
      borderRadius: '16px',
      padding: '20px'
    }
  },
  MINT_CHOCOLATE: {
    titleColor: '#1b5e20',
    descriptionColor: '#2e7d32',
    cardType: 'gradient',
    backgroundColor: '#e8f5e8',
    borderColor: '#c8e6c9',
    cardBackgroundColor: '#ffffff',
    cardBorderColor: '#a5d6a7',
    cardTitleColor: '#ffffff',
    cardContentColor: '#e8f5e8',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#4caf50',
    cardGradientColor2: '#66bb6a',
    cardGradientDirection: '135deg',
    style: {
      shadow: '0 4px 8px rgba(76,175,80,0.3)',
      borderRadius: '14px',
      padding: '18px'
    }
  },
  VIOLET_STORM: {
    titleColor: '#ffffff',
    descriptionColor: '#ede7f6',
    cardType: 'gradient',
    backgroundColor: '#4a148c',
    borderColor: '#6a1b9a',
    cardBackgroundColor: '#4a148c',
    cardBorderColor: '#8e24aa',
    cardTitleColor: '#ffffff',
    cardContentColor: '#ede7f6',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#6a1b9a',
    cardGradientColor2: '#9c27b0',
    cardGradientDirection: '45deg',
    style: {
      shadow: '0 6px 12px rgba(106,27,154,0.4)',
      borderRadius: '16px',
      padding: '20px'
    }
  },
  BRONZE_ELEGANCE: {
    titleColor: '#3e2723',
    descriptionColor: '#5d4037',
    cardType: 'elevated',
    backgroundColor: '#efebe9',
    borderColor: '#d7ccc8',
    cardBackgroundColor: '#ffffff',
    cardBorderColor: '#bcaaa4',
    cardTitleColor: '#3e2723',
    cardContentColor: '#5d4037',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#efebe9',
    cardGradientColor2: '#d7ccc8',
    cardGradientDirection: 'to right',
    style: {
      shadow: '0 3px 6px rgba(0,0,0,0.12)',
      borderRadius: '10px'
    }
  },
  ELECTRIC_LIME: {
    titleColor: '#33691e',
    descriptionColor: '#558b2f',
    cardType: 'gradient',
    backgroundColor: '#f1f8e9',
    borderColor: '#dcedc8',
    cardBackgroundColor: '#ffffff',
    cardBorderColor: '#aed581',
    cardTitleColor: '#ffffff',
    cardContentColor: '#f1f8e9',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#689f38',
    cardGradientColor2: '#8bc34a',
    cardGradientDirection: '135deg',
    style: {
      shadow: '0 4px 8px rgba(104,159,56,0.3)',
      borderRadius: '14px',
      padding: '18px'
    }
  },
  DEEP_OCEAN: {
    titleColor: '#ffffff',
    descriptionColor: '#b3e5fc',
    cardType: 'gradient',
    backgroundColor: '#01579b',
    borderColor: '#0277bd',
    cardBackgroundColor: '#01579b',
    cardBorderColor: '#0288d1',
    cardTitleColor: '#ffffff',
    cardContentColor: '#b3e5fc',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#0277bd',
    cardGradientColor2: '#03a9f4',
    cardGradientDirection: '45deg',
    style: {
      shadow: '0 6px 12px rgba(2,119,189,0.4)',
      borderRadius: '16px',
      padding: '20px'
    }
  },
  ROSE_GOLD: {
    titleColor: '#ad1457',
    descriptionColor: '#c2185b',
    cardType: 'gradient',
    backgroundColor: '#fce4ec',
    borderColor: '#f8bbd0',
    cardBackgroundColor: '#ffffff',
    cardBorderColor: '#f48fb1',
    cardTitleColor: '#ffffff',
    cardContentColor: '#fce4ec',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#ec407a',
    cardGradientColor2: '#f06292',
    cardGradientDirection: '45deg',
    style: {
      shadow: '0 4px 8px rgba(236,64,122,0.3)',
      borderRadius: '14px',
      padding: '18px'
    }
  },
  ARCTIC_BLUE: {
    titleColor: '#0d47a1',
    descriptionColor: '#1565c0',
    cardType: 'elevated',
    backgroundColor: '#e3f2fd',
    borderColor: '#bbdefb',
    cardBackgroundColor: '#ffffff',
    cardBorderColor: '#64b5f6',
    cardTitleColor: '#0d47a1',
    cardContentColor: '#1565c0',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#e3f2fd',
    cardGradientColor2: '#bbdefb',
    cardGradientDirection: 'to bottom',
    style: {
      shadow: '0 3px 6px rgba(0,0,0,0.12)',
      borderRadius: '10px'
    }
  },
  SUNSET_ORANGE: {
    titleColor: '#ffffff',
    descriptionColor: '#fff3e0',
    cardType: 'gradient',
    backgroundColor: '#e65100',
    borderColor: '#f57c00',
    cardBackgroundColor: '#e65100',
    cardBorderColor: '#ff9800',
    cardTitleColor: '#ffffff',
    cardContentColor: '#fff3e0',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#ff5722',
    cardGradientColor2: '#ff7043',
    cardGradientDirection: '135deg',
    style: {
      shadow: '0 6px 12px rgba(255,87,34,0.4)',
      borderRadius: '16px',
      padding: '20px'
    }
  },
  JADE_TEMPLE: {
    titleColor: '#1b5e20',
    descriptionColor: '#2e7d32',
    cardType: 'elevated',
    backgroundColor: '#e8f5e8',
    borderColor: '#c8e6c9',
    cardBackgroundColor: '#ffffff',
    cardBorderColor: '#81c784',
    cardTitleColor: '#1b5e20',
    cardContentColor: '#2e7d32',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#e8f5e8',
    cardGradientColor2: '#c8e6c9',
    cardGradientDirection: 'to right',
    style: {
      shadow: '0 3px 6px rgba(0,0,0,0.12)',
      borderRadius: '10px'
    }
  },
  ROYAL_PURPLE: {
    titleColor: '#ffffff',
    descriptionColor: '#ede7f6',
    cardType: 'gradient',
    backgroundColor: '#311b92',
    borderColor: '#512da8',
    cardBackgroundColor: '#311b92',
    cardBorderColor: '#673ab7',
    cardTitleColor: '#ffffff',
    cardContentColor: '#ede7f6',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#512da8',
    cardGradientColor2: '#7986cb',
    cardGradientDirection: '45deg',
    style: {
      shadow: '0 6px 12px rgba(81,45,168,0.4)',
      borderRadius: '16px',
      padding: '20px'
    }
  },
  GOLDEN_HOUR: {
    titleColor: '#e65100',
    descriptionColor: '#f57c00',
    cardType: 'gradient',
    backgroundColor: '#fff8e1',
    borderColor: '#ffecb3',
    cardBackgroundColor: '#ffffff',
    cardBorderColor: '#ffe082',
    cardTitleColor: '#ffffff',
    cardContentColor: '#fff8e1',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#ffc107',
    cardGradientColor2: '#ffeb3b',
    cardGradientDirection: '135deg',
    style: {
      shadow: '0 4px 8px rgba(255,193,7,0.3)',
      borderRadius: '14px',
      padding: '18px'
    }
  },
  MIDNIGHT_FOREST: {
    titleColor: '#ffffff',
    descriptionColor: '#e8f5e8',
    cardType: 'gradient',
    backgroundColor: '#1b5e20',
    borderColor: '#2e7d32',
    cardBackgroundColor: '#1b5e20',
    cardBorderColor: '#388e3c',
    cardTitleColor: '#ffffff',
    cardContentColor: '#e8f5e8',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#2e7d32',
    cardGradientColor2: '#4caf50',
    cardGradientDirection: '45deg',
    style: {
      shadow: '0 6px 12px rgba(46,125,50,0.4)',
      borderRadius: '16px',
      padding: '20px'
    }
  },
  CORAL_SUNSET: {
    titleColor: '#bf360c',
    descriptionColor: '#d84315',
    cardType: 'elevated',
    backgroundColor: '#fff3e0',
    borderColor: '#ffe0b2',
    cardBackgroundColor: '#ffffff',
    cardBorderColor: '#ffab91',
    cardTitleColor: '#bf360c',
    cardContentColor: '#d84315',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#fff3e0',
    cardGradientColor2: '#ffe0b2',
    cardGradientDirection: 'to bottom',
    style: {
      shadow: '0 3px 6px rgba(0,0,0,0.12)',
      borderRadius: '10px'
    }
  },
  SPACE_NEBULA: {
    titleColor: '#e1bee7',
    descriptionColor: '#ce93d8',
    cardType: 'gradient',
    backgroundColor: '#1a0033',
    borderColor: '#2d0052',
    cardBackgroundColor: '#1a0033',
    cardBorderColor: '#4a0e7a',
    cardTitleColor: '#e1bee7',
    cardContentColor: '#ce93d8',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#2d0052',
    cardGradientColor2: '#4a0e7a',
    cardGradientDirection: '135deg',
    style: {
      shadow: '0 6px 12px rgba(74,14,122,0.5)',
      borderRadius: '16px',
      padding: '20px'
    }
  },
  CRIMSON_FLAME: {
    titleColor: '#ffffff',
    descriptionColor: '#ffebee',
    cardType: 'gradient',
    backgroundColor: '#b71c1c',
    borderColor: '#c62828',
    cardBackgroundColor: '#b71c1c',
    cardBorderColor: '#d32f2f',
    cardTitleColor: '#ffffff',
    cardContentColor: '#ffebee',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#d32f2f',
    cardGradientColor2: '#f44336',
    cardGradientDirection: '45deg',
    style: {
      shadow: '0 6px 12px rgba(211,47,47,0.4)',
      borderRadius: '16px',
      padding: '20px'
    }
  },
  EMERALD_SHINE: {
    titleColor: '#1b5e20',
    descriptionColor: '#2e7d32',
    cardType: 'elevated',
    backgroundColor: '#e8f5e8',
    borderColor: '#c8e6c9',
    cardBackgroundColor: '#ffffff',
    cardBorderColor: '#66bb6a',
    cardTitleColor: '#1b5e20',
    cardContentColor: '#2e7d32',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#e8f5e8',
    cardGradientColor2: '#c8e6c9',
    cardGradientDirection: '45deg',
    style: {
      shadow: '0 4px 8px rgba(27,94,32,0.2)',
      borderRadius: '12px'
    }
  },
  SILVER_MIST: {
    titleColor: '#263238',
    descriptionColor: '#37474f',
    cardType: 'gradient',
    backgroundColor: '#eceff1',
    borderColor: '#cfd8dc',
    cardBackgroundColor: '#ffffff',
    cardBorderColor: '#90a4ae',
    cardTitleColor: '#ffffff',
    cardContentColor: '#eceff1',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#607d8b',
    cardGradientColor2: '#78909c',
    cardGradientDirection: '135deg',
    style: {
      shadow: '0 4px 8px rgba(96,125,139,0.3)',
      borderRadius: '14px',
      padding: '18px'
    }
  },
  TROPICAL_PARADISE: {
    titleColor: '#004d40',
    descriptionColor: '#00695c',
    cardType: 'gradient',
    backgroundColor: '#e0f2f1',
    borderColor: '#b2dfdb',
    cardBackgroundColor: '#ffffff',
    cardBorderColor: '#4db6ac',
    cardTitleColor: '#ffffff',
    cardContentColor: '#e0f2f1',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#00897b',
    cardGradientColor2: '#26a69a',
    cardGradientDirection: '45deg',
    style: {
      shadow: '0 4px 8px rgba(0,137,123,0.3)',
      borderRadius: '14px',
      padding: '18px'
    }
  },
  NEON_CYAN: {
    titleColor: '#ffffff',
    descriptionColor: '#e0f7fa',
    cardType: 'gradient',
    backgroundColor: '#006064',
    borderColor: '#00838f',
    cardBackgroundColor: '#006064',
    cardBorderColor: '#00acc1',
    cardTitleColor: '#ffffff',
    cardContentColor: '#e0f7fa',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#00acc1',
    cardGradientColor2: '#00e5ff',
    cardGradientDirection: '135deg',
    style: {
      shadow: '0 6px 12px rgba(0,229,255,0.4)',
      borderRadius: '16px',
      padding: '20px'
    }
  },
  AUTUMN_LEAVES: {
    titleColor: '#bf360c',
    descriptionColor: '#d84315',
    cardType: 'elevated',
    backgroundColor: '#fff3e0',
    borderColor: '#ffe0b2',
    cardBackgroundColor: '#ffffff',
    cardBorderColor: '#ffb74d',
    cardTitleColor: '#bf360c',
    cardContentColor: '#d84315',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#fff3e0',
    cardGradientColor2: '#ffe0b2',
    cardGradientDirection: 'to right',
    style: {
      shadow: '0 3px 6px rgba(0,0,0,0.12)',
      borderRadius: '10px'
    }
  },
  LAVENDER_FIELD: {
    titleColor: '#4527a0',
    descriptionColor: '#512da8',
    cardType: 'gradient',
    backgroundColor: '#f3e5f5',
    borderColor: '#e1bee7',
    cardBackgroundColor: '#ffffff',
    cardBorderColor: '#ba68c8',
    cardTitleColor: '#ffffff',
    cardContentColor: '#f3e5f5',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#7b1fa2',
    cardGradientColor2: '#ab47bc',
    cardGradientDirection: '45deg',
    style: {
      shadow: '0 4px 8px rgba(123,31,162,0.3)',
      borderRadius: '14px',
      padding: '18px'
    }
  },
  COSMIC_BLUE: {
    titleColor: '#ffffff',
    descriptionColor: '#e3f2fd',
    cardType: 'gradient',
    backgroundColor: '#0d47a1',
    borderColor: '#1565c0',
    cardBackgroundColor: '#0d47a1',
    cardBorderColor: '#1976d2',
    cardTitleColor: '#ffffff',
    cardContentColor: '#e3f2fd',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#1976d2',
    cardGradientColor2: '#42a5f5',
    cardGradientDirection: '135deg',
    style: {
      shadow: '0 6px 12px rgba(25,118,210,0.4)',
      borderRadius: '16px',
      padding: '20px'
    }
  },
  HONEY_GOLD: {
    titleColor: '#e65100',
    descriptionColor: '#f57c00',
    cardType: 'elevated',
    backgroundColor: '#fff8e1',
    borderColor: '#ffecb3',
    cardBackgroundColor: '#ffffff',
    cardBorderColor: '#ffc107',
    cardTitleColor: '#e65100',
    cardContentColor: '#f57c00',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#fff8e1',
    cardGradientColor2: '#ffecb3',
    cardGradientDirection: 'to bottom',
    style: {
      shadow: '0 3px 6px rgba(0,0,0,0.12)',
      borderRadius: '10px'
    }
  },
  RUBY_RED: {
    titleColor: '#ffffff',
    descriptionColor: '#ffebee',
    cardType: 'gradient',
    backgroundColor: '#ad1457',
    borderColor: '#c2185b',
    cardBackgroundColor: '#ad1457',
    cardBorderColor: '#e91e63',
    cardTitleColor: '#ffffff',
    cardContentColor: '#ffebee',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#e91e63',
    cardGradientColor2: '#ec407a',
    cardGradientDirection: '45deg',
    style: {
      shadow: '0 6px 12px rgba(233,30,99,0.4)',
      borderRadius: '16px',
      padding: '20px'
    }
  },
  FOREST_MIST: {
    titleColor: '#1b5e20',
    descriptionColor: '#2e7d32',
    cardType: 'elevated',
    backgroundColor: '#e8f5e8',
    borderColor: '#c8e6c9',
    cardBackgroundColor: '#ffffff',
    cardBorderColor: '#81c784',
    cardTitleColor: '#1b5e20',
    cardContentColor: '#2e7d32',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#e8f5e8',
    cardGradientColor2: '#c8e6c9',
    cardGradientDirection: '135deg',
    style: {
      shadow: '0 3px 6px rgba(0,0,0,0.1)',
      borderRadius: '12px'
    }
  },
  SAPPHIRE_DREAM: {
    titleColor: '#ffffff',
    descriptionColor: '#e8eaf6',
    cardType: 'gradient',
    backgroundColor: '#283593',
    borderColor: '#3f51b5',
    cardBackgroundColor: '#283593',
    cardBorderColor: '#5c6bc0',
    cardTitleColor: '#ffffff',
    cardContentColor: '#e8eaf6',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#3f51b5',
    cardGradientColor2: '#7986cb',
    cardGradientDirection: '45deg',
    style: {
      shadow: '0 6px 12px rgba(63,81,181,0.4)',
      borderRadius: '16px',
      padding: '20px'
    }
  },
  PEACH_SUNSET: {
    titleColor: '#bf360c',
    descriptionColor: '#d84315',
    cardType: 'gradient',
    backgroundColor: '#fff3e0',
    borderColor: '#ffe0b2',
    cardBackgroundColor: '#ffffff',
    cardBorderColor: '#ffab91',
    cardTitleColor: '#ffffff',
    cardContentColor: '#fff3e0',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#ff7043',
    cardGradientColor2: '#ffab91',
    cardGradientDirection: '135deg',
    style: {
      shadow: '0 4px 8px rgba(255,112,67,0.3)',
      borderRadius: '14px',
      padding: '18px'
    }
  },
  ELECTRIC_PURPLE: {
    titleColor: '#ffffff',
    descriptionColor: '#f3e5f5',
    cardType: 'gradient',
    backgroundColor: '#6a1b9a',
    borderColor: '#8e24aa',
    cardBackgroundColor: '#6a1b9a',
    cardBorderColor: '#ab47bc',
    cardTitleColor: '#ffffff',
    cardContentColor: '#f3e5f5',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#8e24aa',
    cardGradientColor2: '#ba68c8',
    cardGradientDirection: '135deg',
    style: {
      shadow: '0 6px 12px rgba(142,36,170,0.4)',
      borderRadius: '16px',
      padding: '20px'
    }
  }
}; // UNUSED_LOCAL_STYLE_PRESETS - заменен на импорт из editorStylePresets.js

// Define image handling functions before the main component
const handleReorderImages = (sectionsData, sectionId, startIndex, endIndex) => {
  const section = sectionsData[sectionId];
  if (!section?.images) return sectionsData;

  const newImages = [...section.images];
  const [movedImage] = newImages.splice(startIndex, 1);
  newImages.splice(endIndex, 0, movedImage);

  return {
    ...sectionsData,
    [sectionId]: {
      ...sectionsData[sectionId],
      images: newImages
    }
  };
};
// Предустановленные секции
const PREDEFINED_SECTIONS = {
  about: {
    text: '📋 О нас',
    title: 'О нас',
    description: 'Узнайте больше о нашей компании, миссии и ценностях'
  },
  services: {
    text: '🔧 Услуги',
    title: 'Наши услуги',
    description: 'Полный спектр услуг для решения ваших задач'
  },
  features: {
    text: '⭐ Преимущества',
    title: 'Наши преимущества',
    description: 'Что делает нас лучшими в своей области'
  },
  testimonials: {
    text: '💬 Отзывы',
    title: 'Отзывы клиентов',
    description: 'Что говорят о нас наши довольные клиенты'
  },
  faq: {
    text: '❓ FAQ',
    title: 'Часто задаваемые вопросы',
    description: 'Ответы на самые популярные вопросы'
  },
  news: {
    text: '📰 Новости',
    title: 'Новости и события',
    description: 'Последние новости и обновления'
  },
  portfolio: {
    text: '💼 Портфолио',
    title: 'Наши работы',
    description: 'Примеры успешно реализованных проектов'
  },
  blog: {
    text: '📝 Блог',
    title: 'Блог',
    description: 'Полезные статьи и советы от экспертов'
  },
  team: {
    text: '👥 Команда',
    title: 'Наша команда',
    description: 'Познакомьтесь с нашими специалистами'
  },
  gallery: {
    text: '🖼️ Галерея',
    title: 'Галерея',
    description: 'Фотографии наших работ и мероприятий'
  },
  pricing: {
    text: '💰 Цены',
    title: 'Цены и тарифы',
    description: 'Прозрачные цены на все наши услуги'
  }
};
const EditorPanel = ({
  headerData = {
    siteName: 'My Site',
    titleColor: '#000000',
    backgroundColor: '#ffffff',
    linksColor: '#000000',
    siteBackgroundColor: '#f8f9fa',
    siteBackgroundType: 'solid',
    siteGradientColor1: '#ffffff',
    siteGradientColor2: '#f5f5f5',
    siteGradientDirection: 'to right',
    menuItems: [],
    language: 'en'
  },
  onHeaderChange,
  sectionsData,
  onSectionsChange,
  heroData,
  onHeroChange,
  contactData,
  onContactChange,
  footerData,
  onFooterChange,
  legalDocuments,
  onLegalDocumentsChange,
  liveChatData = { enabled: false, apiKey: '' },
  onLiveChatChange,
  constructorMode = true,
  onConstructorModeChange,
  selectedElement = null,
  onElementDeselect = () => {},
  onElementUpdate = () => {}
}) => {
  console.log('🎯🎯🎯 EditorPanel COMPONENT LOADED! Time:', new Date().toISOString());
  console.log('EditorPanel received props:', {
    headerData,
    heroData,
    sectionsData,
    contactData,
    footerData,
    legalDocuments
  });

  // Принудительное обновление при изменении sectionsData
  const [forceUpdate, setForceUpdate] = React.useState(0);
  React.useEffect(() => {
    console.log('🔄 [EditorPanel] sectionsData изменился, принудительно обновляем');
    setForceUpdate(prev => prev + 1);
  }, [sectionsData]);

  const [expandedSections, setExpandedSections] = React.useState({
    header: false,
    hero: false,
    menu: false,
    menuItems: {},
    contact: false,
    footer: false,
    legal: false,
    liveChat: false
  });

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [sectionToDelete, setSectionToDelete] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Используем переданное состояние режима конструктора или локальное по умолчанию
  const [localConstructorMode, setLocalConstructorMode] = useState(constructorMode);
  
  // Обработчик изменения режима конструктора
  const handleConstructorModeChange = (newMode) => {
    setLocalConstructorMode(newMode);
    if (onConstructorModeChange) {
      onConstructorModeChange(newMode);
    }
    console.log('Constructor mode changed to:', newMode ? 'Constructor' : 'Manual');
  };

  // Используем переданный режим или локальный
  const currentConstructorMode = onConstructorModeChange ? constructorMode : localConstructorMode;

  // Effect для обработки выбранного элемента
  useEffect(() => {
    if (selectedElement) {
      console.log('Selected element changed:', selectedElement);
      // Автоматически открываем секцию с выбранным элементом
      const sectionKey = `menuItem_${selectedElement.sectionId}`;
      setExpandedSections(prev => ({
        ...prev,
        [sectionKey]: true,
        // Закрываем другие секции
        ...Object.keys(prev).reduce((acc, key) => {
          if (key !== sectionKey && key !== 'menuItems') {
            acc[key] = false;
          }
          return acc;
        }, {}),
        // Закрываем другие пункты меню
        menuItems: {
          [selectedElement.sectionId]: true
        }
      }));
    }
  }, [selectedElement]);

  // Combined useEffect for all checks and tracking
  useEffect(() => {
          // Check authentication
    const auth = localStorage.getItem('editorAuth');
    const authTime = localStorage.getItem('editorAuthTime');
    const currentTime = new Date().getTime();
    
          // Check if authentication time has expired (2 hours = 7200000 milliseconds)
    if (auth === 'true' && authTime && (currentTime - parseInt(authTime)) < 7200000) {
      setIsAuthenticated(true);
    } else {
              // If time has expired, clear authentication data
      localStorage.removeItem('editorAuth');
      localStorage.removeItem('editorAuthTime');
      setIsAuthenticated(false);
    }

          // Navigation prevention handler
    const handlePreventNavigation = (event) => {
      // Navigation is always allowed now
    };

    window.addEventListener('preventNavigation', handlePreventNavigation);

          // Track changes in sectionsData
    console.log('sectionsData changed:', sectionsData);
    if (sectionsData.features) {
      console.log('Features section current state:', sectionsData.features);
    }

    return () => {
      window.removeEventListener('preventNavigation', handlePreventNavigation);
    };
  }, [headerData.language, sectionsData]);

  // Автоматическая инициализация секций отключена - пользователь может добавлять секции вручную
  // useEffect(() => {
  //   // Проверяем, есть ли уже секции в меню
  //   const hasExistingMenuItems = headerData.menuItems && headerData.menuItems.length > 0;
  //   
  //   // Если меню пустое, автоматически добавляем все предустановленные секции
  //   if (!hasExistingMenuItems) {
  //     console.log('Меню пустое, автоматически добавляем все предустановленные секции...');
  //     
  //     const newMenuItems = [];
  //     const newSections = { ...sectionsData }; // Сохраняем существующие секции

  //     Object.entries(PREDEFINED_SECTIONS).forEach(([sectionKey, sectionTemplate]) => {
  //       const newMenuItem = {
  //         id: sectionKey,
  //         text: sectionTemplate.text,
  //         title: sectionTemplate.title,
  //         description: sectionTemplate.description,
  //         image: '',
  //         link: `#${sectionKey}`,
  //         cardType: CARD_TYPES.SIMPLE,
  //         backgroundColor: '#ffffff',
  //         textColor: '#000000',
  //         borderColor: '#e0e0e0',
  //         shadowColor: 'rgba(0,0,0,0.1)',
  //         gradientStart: '#ffffff',
  //         gradientEnd: '#f5f5f5',
  //         gradientDirection: 'to right'
  //       };

  //       newMenuItems.push(newMenuItem);

  //       // Создаем новую секцию только если её ещё нет
  //       if (!newSections[sectionKey]) {
  //         const newSection = {
  //           id: sectionKey,
  //           title: sectionTemplate.title,
  //           description: sectionTemplate.description,
  //           cardType: CARD_TYPES.SIMPLE,
  //           cards: [],
  //           titleColor: '#1a237e',
  //           descriptionColor: '#455a64'
  //         };
  //         newSections[sectionKey] = newSection;
  //       }
  //     });

  //     // Обновляем данные только если есть что добавить
  //     if (newMenuItems.length > 0) {
  //       onHeaderChange({ ...headerData, menuItems: newMenuItems });
  //       onSectionsChange(newSections);
  //       console.log(`Автоматически инициализировано ${newMenuItems.length} предустановленных секций`);
  //     }
  //   }
  // }, [headerData.menuItems, sectionsData, onHeaderChange, onSectionsChange]);

  const handleAuth = (success) => {
    if (success) {
      setIsAuthenticated(true);
      localStorage.setItem('editorAuth', 'true');
      localStorage.setItem('editorAuthTime', new Date().getTime().toString());
    }
  };

  if (!isAuthenticated) {
    return <AuthPanel onAuth={handleAuth} />;
  }

  const toggleSection = (section) => {
    setExpandedSections(prev => {
      const newState = { ...prev };
      
      // If this is a menu subitem (starts with menuItem_)
      if (section.startsWith('menuItem_')) {
        const menuItemId = section.replace('menuItem_', '');
                  // Create a new menuItems object where all items are closed
        const newMenuItems = {};
                  // If item was already open, just close it
        if (prev.menuItems[menuItemId]) {
          newState.menuItems = newMenuItems;
        } else {
                      // If item was closed, close all others and open it
          newMenuItems[menuItemId] = true;
          newState.menuItems = newMenuItems;
          
          // Scroll to corresponding section on the site
          setTimeout(() => {
            const targetSection = document.getElementById(menuItemId);
            if (targetSection) {
              targetSection.scrollIntoView({ behavior: 'smooth' });
            }
          }, 100);
        }
        return newState;
      }
      
      // If this is a main section
      // If section is already open, just close it
      if (newState[section]) {
        newState[section] = false;
        return newState;
      }
      
      // If section is closed, close all others and open it
      Object.keys(newState).forEach(key => {
        if (key !== 'menuItems') {
          newState[key] = key === section;
        }
      });

      // Scroll to corresponding section on the site
      setTimeout(() => {
        const targetSection = document.getElementById(section);
        if (targetSection) {
          targetSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);

      return newState;
    });
  };

  const handleChange = (field, value) => {
    console.log('handleChange called in EditorPanel:', { field, value });
    console.log('Current heroData:', heroData);
    
    // Ensure we're working with a fresh copy of the data
    const newHeroData = { ...heroData };
    
    // Handle color fields specifically
    if (field.includes('Color')) {
      console.log('Color field detected:', field);
      // Ensure the color value is properly formatted
      if (!value.startsWith('#')) {
        value = `#${value}`;
      }
      console.log('Formatted color value:', value);
    }
    
    newHeroData[field] = value;
    console.log('New heroData to be set:', newHeroData);
    onHeroChange(newHeroData);
  };

  const handleAddMenuItem = (sectionId) => {
    const newId = `section_${Date.now()}`;
    const newMenuItem = {
      id: newId,
      text: 'New Menu Item',
      title: '',
      description: '',
      image: '',
      link: `#${newId}`,
      cardType: CARD_TYPES.NONE,
      backgroundColor: '#ffffff',
      textColor: '#000000',
      borderColor: '#e0e0e0',
      shadowColor: 'rgba(0,0,0,0.1)',
      gradientStart: '#ffffff',
      gradientEnd: '#f5f5f5',
      gradientDirection: 'to right'
    };

    // Check that ID is unique
    const isIdUnique = !headerData.menuItems.some(item => item.id === newId);
    if (!isIdUnique) {
      console.error('ID already exists, generating new one');
      return handleAddMenuItem(sectionId);
    }

    // Add new menu item to headerData
    const updatedMenuItems = [...headerData.menuItems, newMenuItem];
    onHeaderChange({ ...headerData, menuItems: updatedMenuItems });

    // Create new section with the same ID
    const newSection = {
      id: newId,
      title: '',
      description: '',
      cardType: CARD_TYPES.NONE,
      cards: []
    };

    // Update sectionsData as object
    onSectionsChange({ ...sectionsData, [newId]: newSection });

    // Open new section in editor
    setExpandedSections(prev => ({
      ...prev,
      menuItems: {
        ...prev.menuItems,
        [newId]: true
      }
    }));
  };



  // Функция для добавления предустановленной секции
  const handleAddPredefinedSection = (sectionKey) => {
    const sectionTemplate = PREDEFINED_SECTIONS[sectionKey];
    if (!sectionTemplate) return;

    // Проверяем, не существует ли уже такая секция
    const existingSection = headerData.menuItems.find(item => item.id === sectionKey);
    if (existingSection) {
      alert(`Секция "${sectionTemplate.text}" уже существует!`);
      return;
    }

    const newMenuItem = {
      id: sectionKey,
      text: sectionTemplate.text,
      title: sectionTemplate.title,
      description: sectionTemplate.description,
      image: '',
      link: `#${sectionKey}`,
      cardType: CARD_TYPES.SIMPLE,
      backgroundColor: '#ffffff',
      textColor: '#000000',
      borderColor: '#e0e0e0',
      shadowColor: 'rgba(0,0,0,0.1)',
      gradientStart: '#ffffff',
      gradientEnd: '#f5f5f5',
      gradientDirection: 'to right'
    };

    // Add new menu item to headerData
    const updatedMenuItems = [...headerData.menuItems, newMenuItem];
    onHeaderChange({ ...headerData, menuItems: updatedMenuItems });

    // Create new section with the same ID
    const newSection = {
      id: sectionKey,
      title: sectionTemplate.title,
      description: sectionTemplate.description,
      cardType: CARD_TYPES.SIMPLE,
      cards: [],
      titleColor: '#1a237e',
      descriptionColor: '#455a64'
    };

    // Update sectionsData as object
    onSectionsChange({ ...sectionsData, [sectionKey]: newSection });

    // Open new section in editor
    setExpandedSections(prev => ({
      ...prev,
      menuItems: {
        ...prev.menuItems,
        [sectionKey]: true
      }
    }));

    console.log(`Добавлена предустановленная секция: ${sectionTemplate.text}`);
  };
  // Функция для создания детального сайта по тематике мобильных платежей в ОАЭ
  const handleCreateUAEPaymentsSite = () => {
    // Переключаемся в ручной режим для многостраничного сайта
    if (constructorMode) {
      setCurrentConstructorMode(false);
      onConstructorModeChange(false);
    }

    // Настраиваем заголовок сайта
    onHeaderChange({
      ...headerData,
      siteName: 'UAE Mobile Payments',
      title: 'UAE Mobile Payments - Мобильные платежи в ОАЭ',
      description: 'Лучшие решения для мобильных платежей в Объединенных Арабских Эмиратах',
      language: 'ru',
      backgroundColor: '#1e3a8a',
      titleColor: '#ffffff',
      linksColor: '#fbbf24',
      siteBackgroundColor: '#f8fafc',
      menuItems: []
    });

    // Настраиваем Hero секцию
    onHeroChange({
      ...heroData,
      title: 'Мобильные платежи в ОАЭ',
      subtitle: 'Быстрые, безопасные и удобные платежные решения для всех жителей и бизнеса в Объединенных Арабских Эмиратах',
      description: 'Присоединяйтесь к революции цифровых платежей в ОАЭ',
      buttonText: 'Начать использовать',
      buttonLink: '#about',
      backgroundType: 'gradient',
      backgroundColor: '#1e3a8a',
      gradientColor1: '#1e3a8a',
      gradientColor2: '#3b82f6',
      gradientDirection: 'to right',
      titleColor: '#ffffff',
      subtitleColor: '#e2e8f0',
      showButton: true,
      animationType: 'fadeIn'
    });

    // Создаем детальные секции с множеством элементов
    const newSections = {};
    
    // Секция "О нас" - расширенная версия
    newSections.about = {
      id: 'about',
      title: 'О нас',
      description: 'Мы - ведущий провайдер мобильных платежных решений в ОАЭ',
      titleColor: '#1e3a8a',
      descriptionColor: '#6b7280',
      backgroundColor: '#ffffff',
      showBackground: true,
      cards: [],
      aiElements: [],
      contentElements: [
        {
          id: 'about-title',
          type: 'typography',
          text: 'Лидер мобильных платежей в ОАЭ',
          elementType: 'h2',
          color: '#1e3a8a',
          alignment: 'center',
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
          id: 'about-description',
          type: 'rich-text',
          title: 'Наша компания',
          content: 'UAE Mobile Payments революционизирует цифровые транзакции в Эмиратах. Мы предоставляем **надежные**, *быстрые* и ***безопасные*** мобильные платежные решения для:\n\n• Физических лиц\n• Малого и среднего бизнеса\n• Крупных корпораций\n• Государственных учреждений\n\n### Наши достижения:\n- 🏆 Лучшая финтех-компания ОАЭ 2023\n- 🛡️ Сертификация ISO 27001\n- 📱 Более 1 млн скачиваний приложения\n- 🌟 Рейтинг 4.9/5 в App Store\n\n[Узнать больше о наших услугах](#services)',
          showTitle: true,
          titleColor: '#1e3a8a',
          textColor: '#333333',
          animationSettings: {
            animationType: 'slideInLeft',
            delay: 0.2,
            triggerOnView: true,
            triggerOnce: true,
            threshold: 0.1,
            disabled: false
          }
        },
        {
          id: 'user-counter',
          type: 'animated-counter',
          title: 'Активных пользователей',
          startValue: 0,
          endValue: 750000,
          suffix: '+',
          duration: 2000,
          titleColor: '#1e3a8a',
          countColor: '#059669',
          animationSettings: {
            animationType: 'zoomIn',
            delay: 0.6,
            triggerOnView: true,
            triggerOnce: true,
            threshold: 0.1,
            disabled: false
          }
        },
        {
          id: 'transactions-counter',
          type: 'animated-counter',
          title: 'Транзакций в месяц',
          startValue: 0,
          endValue: 5000000,
          suffix: '+',
          duration: 2500,
          titleColor: '#1e3a8a',
          countColor: '#3b82f6',
          animationSettings: {
            animationType: 'zoomIn',
            delay: 0.8,
            triggerOnView: true,
            triggerOnce: true,
            threshold: 0.1,
            disabled: false
          }
        },
        {
          id: 'volume-counter',
          type: 'animated-counter',
          title: 'Млрд AED оборот',
          startValue: 0,
          endValue: 12,
          suffix: '+',
          duration: 1800,
          titleColor: '#1e3a8a',
          countColor: '#f59e0b',
          animationSettings: {
            animationType: 'zoomIn',
            delay: 1.0,
            triggerOnView: true,
            triggerOnce: true,
            threshold: 0.1,
            disabled: false
          }
        },
        {
          id: 'compliance-callout',
          type: 'callout',
          title: 'Регулятивное соответствие',
          content: 'UAE Mobile Payments полностью соответствует требованиям Центрального банка ОАЭ (CBUAE), регулированию Emirates ID и международным стандартам безопасности финансовых операций. Мы регулярно проходим аудит и сертификацию.',
          type: 'success',
          showIcon: true,
          backgroundColor: '#dcfce7',
          borderColor: '#16a34a',
          textColor: '#15803d',
          animationSettings: {
            animationType: 'slideInRight',
            delay: 0.7,
            triggerOnView: true,
            triggerOnce: true,
            threshold: 0.1,
            disabled: false
          }
        },
        {
          id: 'about-testimonial',
          type: 'testimonial-card',
          name: 'Ахмед Аль-Мактум',
          role: 'Предприниматель',
          company: 'Dubai Business Hub',
          content: 'UAE Mobile Payments изменили мой подход к финансам. Теперь все операции занимают секунды, а безопасность на высшем уровне. Рекомендую всем!',
          rating: 5,
          avatar: '',
          animationSettings: {
            animationType: 'slideInUp',
            delay: 0.5,
            triggerOnView: true,
            triggerOnce: true,
            threshold: 0.1,
            disabled: false
          }
        }
      ]
    };

    // Секция "Услуги" - значительно расширенная
    newSections.services = {
      id: 'services',
      title: 'Наши услуги',
      description: 'Полный спектр мобильных платежных решений и финансовых услуг',
      titleColor: '#1e3a8a',
      descriptionColor: '#6b7280',
      backgroundColor: '#f8fafc',
      showBackground: true,
      cards: [],
      aiElements: [],
      contentElements: [
        {
          id: 'services-title',
          type: 'typography',
          text: 'Комплексные платежные решения для всех',
          elementType: 'h2',
          color: '#1e3a8a',
          alignment: 'center',
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
          id: 'services-description',
          type: 'rich-text',
          title: 'Наши основные направления',
          content: '### 💸 P2P Переводы\n- Мгновенные переводы между пользователями\n- Поддержка всех банков ОАЭ\n- Минимальные комиссии\n- Международные переводы\n\n### 🧾 Оплата счетов\n- Коммунальные услуги\n- Интернет и телефония\n- Страхование\n- Государственные услуги\n\n### 🏢 Бизнес-решения\n- Корпоративные счета\n- Массовые выплаты\n- API интеграция\n- Аналитика и отчеты\n\n### 📈 Инвестиции\n- Торговля акциями\n- Криптовалюты\n- Взаимные фонды\n- Роботы-советники',
          showTitle: true,
          titleColor: '#1e3a8a',
          textColor: '#333333',
          animationSettings: {
            animationType: 'slideInLeft',
            delay: 0.2,
            triggerOnView: true,
            triggerOnce: true,
            threshold: 0.1,
            disabled: false
          }
        },
        {
          id: 'services-chart',
          type: 'advanced-pie-chart',
          title: 'Распределение использования услуг',
          data: [
            { name: 'P2P переводы', value: 35, fill: '#1e3a8a' },
            { name: 'Оплата счетов', value: 28, fill: '#3b82f6' },
            { name: 'Бизнес-решения', value: 15, fill: '#60a5fa' },
            { name: 'Инвестиции', value: 12, fill: '#8b5cf6' },
            { name: 'Страхование', value: 6, fill: '#ef4444' },
            { name: 'Кредиты', value: 4, fill: '#06b6d4' }
          ],
          showLabels: true,
          animationSettings: {
            animationType: 'zoomIn',
            delay: 0.5,
            triggerOnView: true,
            triggerOnce: true,
            threshold: 0.1,
            disabled: false
          }
        },
        {
          id: 'services-timeline',
          type: 'timeline-component',
          title: 'Этапы развития наших услуг',
          events: [
            {
              year: '2019',
              title: 'Запуск P2P переводов',
              description: 'Начали с базовых переводов между пользователями в ОАЭ'
            },
            {
              year: '2020',
              title: 'Оплата счетов',
              description: 'Добавили возможность оплаты коммунальных услуг и телефонии'
            },
            {
              year: '2021',
              title: 'Бизнес-решения',
              description: 'Запустили корпоративные функции и API для бизнеса'
            },
            {
              year: '2022',
              title: 'Инвестиционные продукты',
              description: 'Интегрировали торговлю акциями и криптовалютами'
            },
            {
              year: '2023',
              title: 'Полная экосистема',
              description: 'Добавили страхование, кредиты и AI-консультанта'
            }
          ],
          animationSettings: {
            animationType: 'slideInRight',
            delay: 0.3,
            triggerOnView: true,
            triggerOnce: true,
            threshold: 0.1,
            disabled: false
          }
        },
        {
          id: 'services-testimonial',
          type: 'testimonial-card',
          name: 'Фатима Аль-Заhra',
          role: 'Финансовый директор',
          company: 'Abu Dhabi Trading LLC',
          content: 'Благодаря UAE Mobile Payments наш бизнес стал более эффективным. Особенно впечатляет скорость обработки массовых выплат сотрудникам.',
          rating: 5,
          avatar: '',
          animationSettings: {
            animationType: 'slideInUp',
            delay: 0.4,
            triggerOnView: true,
            triggerOnce: true,
            threshold: 0.1,
            disabled: false
          }
        }
      ]
    };

    // Секция "Безопасность" - детальная
    newSections.security = {
      id: 'security',
      title: 'Безопасность и защита',
      description: 'Многоуровневая система защиты ваших средств и персональных данных',
      titleColor: '#1e3a8a',
      descriptionColor: '#6b7280',
      backgroundColor: '#ffffff',
      showBackground: true,
      cards: [],
      aiElements: [],
      contentElements: [
        {
          id: 'security-title',
          type: 'typography',
          text: 'Ваша безопасность - наш приоритет',
          elementType: 'h2',
          color: '#1e3a8a',
          alignment: 'center',
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
          id: 'security-description',
          type: 'rich-text',
          title: 'Технологии защиты',
          content: '### 🔐 Многофакторная аутентификация\n- Биометрическое распознавание (отпечаток пальца, Face ID)\n- SMS и push-уведомления\n- Голосовое распознавание\n- Аппаратные токены для VIP-клиентов\n\n### 🛡️ Шифрование данных\n- 256-битное AES шифрование\n- End-to-end шифрование сообщений\n- Квантовое шифрование для крупных транзакций\n- Secure Element на устройстве\n\n### 🔍 Мониторинг и анализ\n- AI-система обнаружения мошенничества\n- Поведенческий анализ пользователей\n- Геолокационная проверка\n- Мониторинг темной сети',
          showTitle: true,
          titleColor: '#1e3a8a',
          textColor: '#333333',
          animationSettings: {
            animationType: 'slideInLeft',
            delay: 0.2,
            triggerOnView: true,
            triggerOnce: true,
            threshold: 0.1,
            disabled: false
          }
        },
        {
          id: 'security-timeline',
          type: 'timeline-component',
          title: 'Уровни защиты',
          events: [
            {
              year: 'Уровень 1',
              title: 'Базовая защита',
              description: 'PIN-код, SMS-подтверждение, базовое шифрование для всех пользователей'
            },
            {
              year: 'Уровень 2',
              title: 'Усиленная защита',
              description: 'Биометрия, двухфакторная аутентификация, мониторинг транзакций'
            },
            {
              year: 'Уровень 3',
              title: 'Максимальная защита',
              description: 'Аппаратная защита, квантовое шифрование, AI-анализ поведения'
            },
            {
              year: 'Уровень 4',
              title: 'Корпоративная защита',
              description: 'Выделенная инфраструктура, персональные HSM, 24/7 мониторинг'
            }
          ],
          animationSettings: {
            animationType: 'slideInRight',
            delay: 0.3,
            triggerOnView: true,
            triggerOnce: true,
            threshold: 0.1,
            disabled: false
          }
        },
        {
          id: 'security-stats',
          type: 'animated-counter',
          title: '% времени безотказной работы',
          startValue: 0,
          endValue: 99.99,
          suffix: '%',
          duration: 2000,
          titleColor: '#1e3a8a',
          countColor: '#059669',
          animationSettings: {
            animationType: 'zoomIn',
            delay: 0.6,
            triggerOnView: true,
            triggerOnce: true,
            threshold: 0.1,
            disabled: false
          }
        },
        {
          id: 'incidents-counter',
          type: 'animated-counter',
          title: 'Успешных взломов за все время',
          startValue: 0,
          endValue: 0,
          suffix: '',
          duration: 1000,
          titleColor: '#1e3a8a',
          countColor: '#ef4444',
          animationSettings: {
            animationType: 'zoomIn',
            delay: 0.8,
            triggerOnView: true,
            triggerOnce: true,
            threshold: 0.1,
            disabled: false
          }
        },
        {
          id: 'security-warning',
          type: 'alert-component',
          content: 'Важно: Никогда не делитесь своим PIN-кодом, OTP или биометрическими данными с кем-либо. UAE Mobile Payments никогда не будет запрашивать эти данные по телефону или электронной почте.',
          type: 'warning',
          showIcon: true,
          backgroundColor: '#fef3c7',
          borderColor: '#f59e0b',
          textColor: '#92400e',
          animationSettings: {
            animationType: 'slideInUp',
            delay: 0.4,
            triggerOnView: true,
            triggerOnce: true,
            threshold: 0.1,
            disabled: false
          }
        },
        {
          id: 'security-callout',
          type: 'callout',
          title: 'Сертификация безопасности',
          content: 'Наша платформа прошла независимый аудит безопасности от ведущих международных компаний и получила сертификаты ISO 27001, PCI DSS Level 1 и SOC 2 Type II.',
          type: 'success',
          showIcon: true,
          backgroundColor: '#d1fae5',
          borderColor: '#059669',
          textColor: '#065f46',
          animationSettings: {
            animationType: 'slideInUp',
            delay: 0.5,
            triggerOnView: true,
            triggerOnce: true,
            threshold: 0.1,
            disabled: false
          }
        }
      ]
    };

    // Секция "Тарифы" - детальная с множеством элементов
    newSections.pricing = {
      id: 'pricing',
      title: 'Прозрачные тарифы',
      description: 'Выберите подходящий план для ваших потребностей без скрытых комиссий',
      titleColor: '#1e3a8a',
      descriptionColor: '#6b7280',
      backgroundColor: '#f8fafc',
      showBackground: true,
      cards: [],
      aiElements: [],
      contentElements: [
        {
          id: 'pricing-title',
          type: 'typography',
          text: 'Выберите идеальный план',
          elementType: 'h2',
          color: '#1e3a8a',
          alignment: 'center',
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
          id: 'pricing-description',
          type: 'rich-text',
          title: 'Тарифные планы',
          content: '### 🆓 Базовый план - БЕСПЛАТНО\n- До 20 переводов в месяц\n- Комиссия 0.5% за перевод\n- Оплата счетов без комиссии\n- Поддержка 24/7\n- Лимит 10,000 AED за операцию\n\n### ⭐ Премиум план - 99 AED/месяц\n- Безлимитные переводы\n- Комиссия 0.3% за перевод\n- Приоритетная поддержка\n- Инвестиционные продукты\n- Лимит 50,000 AED за операцию\n\n### 🏢 Бизнес план - 499 AED/месяц\n- Корпоративные функции\n- Комиссия 0.2% за перевод\n- Массовые выплаты\n- API интеграция\n- Лимит 500,000 AED за операцию\n\n### 🏆 Корпоративный план - По запросу\n- Индивидуальные условия\n- Выделенная инфраструктура\n- Персональный менеджер\n- Без лимитов',
          showTitle: true,
          titleColor: '#1e3a8a',
          textColor: '#333333',
          animationSettings: {
            animationType: 'slideInLeft',
            delay: 0.2,
            triggerOnView: true,
            triggerOnce: true,
            threshold: 0.1,
            disabled: false
          }
        },
        {
          id: 'pricing-table',
          type: 'data-table',
          title: 'Подробное сравнение функций',
          columns: [
            { id: 'feature', label: 'Функция' },
            { id: 'basic', label: 'Базовый' },
            { id: 'premium', label: 'Премиум' },
            { id: 'business', label: 'Бизнес' },
            { id: 'enterprise', label: 'Корпоративный' }
          ],
          rows: [
            { id: 1, feature: 'P2P переводы', basic: 'До 20/месяц', premium: 'Безлимит', business: 'Безлимит', enterprise: 'Безлимит' },
            { id: 2, feature: 'Комиссия', basic: '0.5%', premium: '0.3%', business: '0.2%', enterprise: 'Договорная' },
            { id: 3, feature: 'Оплата счетов', basic: 'Бесплатно', premium: 'Бесплатно', business: 'Бесплатно', enterprise: 'Бесплатно' },
            { id: 4, feature: 'Поддержка', basic: '24/7', premium: 'Приоритетная', business: 'Персональная', enterprise: 'Выделенная' },
            { id: 5, feature: 'API доступ', basic: 'Нет', premium: 'Базовый', business: 'Полный', enterprise: 'Расширенный' },
            { id: 6, feature: 'Лимит операции', basic: '10,000 AED', premium: '50,000 AED', business: '500,000 AED', enterprise: 'Без лимита' },
            { id: 7, feature: 'Международные переводы', basic: 'Нет', premium: 'Есть', business: 'Есть', enterprise: 'Есть' },
            { id: 8, feature: 'Аналитика', basic: 'Базовая', premium: 'Расширенная', business: 'Полная', enterprise: 'Кастомная' }
          ],
          animationSettings: {
            animationType: 'slideInUp',
            delay: 0.5,
            triggerOnView: true,
            triggerOnce: true,
            threshold: 0.1,
            disabled: false
          }
        },
        {
          id: 'pricing-bar-chart',
          type: 'bar-chart',
          title: 'Популярность тарифов среди пользователей',
          data: [
            { label: 'Базовый', value: 45, color: '#10b981' },
            { label: 'Премиум', value: 35, color: '#3b82f6' },
            { label: 'Бизнес', value: 15, color: '#f59e0b' },
            { label: 'Корпоративный', value: 5, color: '#8b5cf6' }
          ],
          showValues: true,
          showGrid: true,
          animate: true,
          orientation: 'vertical',
          animationSettings: {
            animationType: 'slideInRight',
            delay: 0.3,
            triggerOnView: true,
            triggerOnce: true,
            threshold: 0.1,
            disabled: false
          }
        },
        {
          id: 'savings-counter',
          type: 'animated-counter',
          title: 'AED экономии клиентов в месяц',
          startValue: 0,
          endValue: 150000,
          suffix: '+',
          duration: 3000,
          titleColor: '#1e3a8a',
          countColor: '#059669',
          animationSettings: {
            animationType: 'zoomIn',
            delay: 0.6,
            triggerOnView: true,
            triggerOnce: true,
            threshold: 0.1,
            disabled: false
          }
        },
        {
          id: 'pricing-callout',
          type: 'callout',
          title: 'Специальное предложение',
          content: 'Новые пользователи получают 3 месяца премиум-плана бесплатно при регистрации до конца месяца. Без обязательств и автопродления.',
          type: 'success',
          showIcon: true,
          backgroundColor: '#d1fae5',
          borderColor: '#059669',
          textColor: '#065f46',
          animationSettings: {
            animationType: 'slideInUp',
            delay: 0.4,
            triggerOnView: true,
            triggerOnce: true,
            threshold: 0.1,
            disabled: false
          }
        }
      ]
    };
    // Секция "Дополнительные возможности"
    newSections.features = {
      id: 'features',
      title: 'Дополнительные возможности',
      description: 'Инновационные функции для максимального удобства пользователей',
      titleColor: '#1e3a8a',
      descriptionColor: '#6b7280',
      backgroundColor: '#ffffff',
      showBackground: true,
      cards: [],
      aiElements: [],
      contentElements: [
        {
          id: 'features-title',
          type: 'typography',
          text: 'Инновационные функции',
          elementType: 'h2',
          color: '#1e3a8a',
          alignment: 'center',
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
          id: 'features-description',
          type: 'rich-text',
          title: 'Уникальные возможности',
          content: '### 📱 QR-платежи\n- Мгновенная оплата в магазинах\n- Генерация персональных QR-кодов\n- Поддержка динамических QR-кодов\n- Интеграция с кассовыми системами\n\n### 📡 Бесконтактные платежи\n- NFC-технология\n- Поддержка Apple Pay и Google Pay\n- Оплата транспорта\n- Интеграция с умными часами\n\n### 🗣️ Голосовые команды\n- Управление на арабском и английском\n- Голосовые переводы\n- Проверка баланса голосом\n- Настройка голосовых уведомлений\n\n### 🤖 AI-помощник\n- Персональный финансовый консультант\n- Анализ трат и рекомендации\n- Прогнозирование расходов\n- Автоматическая категоризация',
          showTitle: true,
          titleColor: '#1e3a8a',
          textColor: '#333333',
          animationSettings: {
            animationType: 'slideInLeft',
            delay: 0.2,
            triggerOnView: true,
            triggerOnce: true,
            threshold: 0.1,
            disabled: false
          }
        },
        {
          id: 'features-testimonial',
          type: 'testimonial-card',
          name: 'Мария Петрова',
          role: 'Менеджер по маркетингу',
          company: 'Dubai Marketing Solutions',
          content: 'QR-платежи изменили мою жизнь! Теперь я не ношу с собой кошелек - все платежи через телефон. Особенно удобно в торговых центрах.',
          rating: 5,
          avatar: '',
          animationSettings: {
            animationType: 'slideInUp',
            delay: 0.3,
            triggerOnView: true,
            triggerOnce: true,
            threshold: 0.1,
            disabled: false
          }
        }
      ]
    };
    // Секция "Отзывы клиентов" - новая страница
    newSections.reviews = {
      id: 'reviews',
      title: 'Отзывы клиентов',
      description: 'Что говорят наши клиенты о UAE Mobile Payments',
      titleColor: '#1e3a8a',
      descriptionColor: '#6b7280',
      backgroundColor: '#ffffff',
      showBackground: true,
      cards: [],
      aiElements: [],
      contentElements: [
        {
          id: 'reviews-title',
          type: 'typography',
          text: 'Более 750,000 довольных клиентов',
          elementType: 'h2',
          color: '#1e3a8a',
          alignment: 'center',
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
          id: 'reviews-description',
          type: 'rich-text',
          title: 'Доверие клиентов',
          content: 'Наши клиенты - это наша главная ценность. Мы гордимся тем, что помогаем людям и бизнесу в ОАЭ управлять своими финансами быстро, безопасно и удобно.\n\n### 📊 Статистика отзывов:\n- **4.9/5** - средняя оценка в App Store\n- **4.8/5** - средняя оценка в Google Play\n- **98%** - уровень удовлетворенности клиентов\n- **95%** - клиенты рекомендуют нас друзьям\n\n### 🏆 Награды и признание:\n- Лучшее финтех-приложение ОАЭ 2023\n- Премия за инновации в области платежей\n- Сертификат качества обслуживания клиентов',
          showTitle: true,
          titleColor: '#1e3a8a',
          textColor: '#333333',
          animationSettings: {
            animationType: 'slideInLeft',
            delay: 0.2,
            triggerOnView: true,
            triggerOnce: true,
            threshold: 0.1,
            disabled: false
          }
        },
        {
          id: 'rating-counter',
          type: 'animated-counter',
          title: 'Средняя оценка пользователей',
          startValue: 0,
          endValue: 4.9,
          suffix: '/5',
          duration: 2000,
          titleColor: '#1e3a8a',
          countColor: '#f59e0b',
          animationSettings: {
            animationType: 'zoomIn',
            delay: 0.4,
            triggerOnView: true,
            triggerOnce: true,
            threshold: 0.1,
            disabled: false
          }
        },
        {
          id: 'satisfaction-counter',
          type: 'animated-counter',
          title: '% довольных клиентов',
          startValue: 0,
          endValue: 98,
          suffix: '%',
          duration: 2500,
          titleColor: '#1e3a8a',
          countColor: '#10b981',
          animationSettings: {
            animationType: 'zoomIn',
            delay: 0.6,
            triggerOnView: true,
            triggerOnce: true,
            threshold: 0.1,
            disabled: false
          }
        },
        {
          id: 'recommendation-counter',
          type: 'animated-counter',
          title: '% рекомендуют друзьям',
          startValue: 0,
          endValue: 95,
          suffix: '%',
          duration: 2200,
          titleColor: '#1e3a8a',
          countColor: '#8b5cf6',
          animationSettings: {
            animationType: 'zoomIn',
            delay: 0.8,
            triggerOnView: true,
            triggerOnce: true,
            threshold: 0.1,
            disabled: false
          }
        },
        {
          id: 'review-1',
          type: 'testimonial-card',
          name: 'Ахмед Аль-Мансури',
          role: 'Предприниматель',
          company: 'Dubai Business Solutions',
          content: 'UAE Mobile Payments революционизировали мой бизнес! Теперь я могу мгновенно переводить зарплату сотрудникам и оплачивать поставщиков. Безопасность на высшем уровне, а поддержка клиентов просто фантастическая. Рекомендую всем!',
          rating: 5,
          avatar: '',
          animationSettings: {
            animationType: 'slideInUp',
            delay: 0.3,
            triggerOnView: true,
            triggerOnce: true,
            threshold: 0.1,
            disabled: false
          }
        },
        {
          id: 'review-2',
          type: 'testimonial-card',
          name: 'Сара Аль-Заhra',
          role: 'Менеджер по продажам',
          company: 'Emirates Retail Group',
          content: 'Пользуюсь UAE Mobile Payments уже 2 года. Это лучшее приложение для платежей в ОАЭ! Особенно нравится функция QR-платежей - больше не нужно носить с собой наличные. Все быстро, удобно и безопасно.',
          rating: 5,
          avatar: '',
          animationSettings: {
            animationType: 'slideInUp',
            delay: 0.5,
            triggerOnView: true,
            triggerOnce: true,
            threshold: 0.1,
            disabled: false
          }
        },
        {
          id: 'review-3',
          type: 'testimonial-card',
          name: 'Михаил Петров',
          role: 'IT-директор',
          company: 'Abu Dhabi Tech Hub',
          content: 'Интегрировали API UAE Mobile Payments в нашу систему зарплат. Процесс интеграции был простым, документация отличная, а техническая поддержка помогла на каждом этапе. Сэкономили массу времени и денег!',
          rating: 5,
          avatar: '',
          animationSettings: {
            animationType: 'slideInUp',
            delay: 0.7,
            triggerOnView: true,
            triggerOnce: true,
            threshold: 0.1,
            disabled: false
          }
        },
        {
          id: 'review-4',
          type: 'testimonial-card',
          name: 'Фатима Аль-Нахян',
          role: 'Домохозяйка',
          company: 'Дубай',
          content: 'Как мама троих детей, я ценю удобство UAE Mobile Payments. Оплачиваю школьные взносы, коммунальные услуги, покупки в супермаркете - все через одно приложение. Даже мой муж теперь пользуется только этим приложением!',
          rating: 5,
          avatar: '',
          animationSettings: {
            animationType: 'slideInUp',
            delay: 0.9,
            triggerOnView: true,
            triggerOnce: true,
            threshold: 0.1,
            disabled: false
          }
        },
        {
          id: 'review-5',
          type: 'testimonial-card',
          name: 'Джон Смит',
          role: 'Экспат',
          company: 'British Council UAE',
          content: 'Переехал в Дубай год назад, и UAE Mobile Payments стали моим спасением. Переводы в Великобританию быстрые и недорогие, а местные платежи вообще без комиссии. Поддержка на английском языке отличная!',
          rating: 5,
          avatar: '',
          animationSettings: {
            animationType: 'slideInUp',
            delay: 1.1,
            triggerOnView: true,
            triggerOnce: true,
            threshold: 0.1,
            disabled: false
          }
        },
        {
          id: 'review-6',
          type: 'testimonial-card',
          name: 'Амина Хасан',
          role: 'Студентка',
          company: 'American University of Sharjah',
          content: 'Будучи студенткой, я очень ценю низкие комиссии и удобство UAE Mobile Payments. Родители легко переводят мне деньги на учебу, а я могу оплачивать все необходимое. Приложение простое и понятное!',
          rating: 5,
          avatar: '',
          animationSettings: {
            animationType: 'slideInUp',
            delay: 1.3,
            triggerOnView: true,
            triggerOnce: true,
            threshold: 0.1,
            disabled: false
          }
        },
        {
          id: 'reviews-callout',
          type: 'callout',
          title: 'Присоединяйтесь к нашему сообществу',
          content: 'Каждый день тысячи новых пользователей выбирают UAE Mobile Payments для своих финансовых потребностей. Станьте частью нашего растущего сообщества довольных клиентов!',
          type: 'success',
          showIcon: true,
          backgroundColor: '#d1fae5',
          borderColor: '#059669',
          textColor: '#065f46',
          animationSettings: {
            animationType: 'slideInUp',
            delay: 1.0,
            triggerOnView: true,
            triggerOnce: true,
            threshold: 0.1,
            disabled: false
          }
        },
        {
          id: 'reviews-chart',
          type: 'advanced-pie-chart',
          title: 'Распределение пользователей по типам',
          data: [
            { name: 'Физические лица', value: 65, fill: '#3b82f6' },
            { name: 'Малый бизнес', value: 20, fill: '#10b981' },
            { name: 'Корпорации', value: 10, fill: '#f59e0b' },
            { name: 'Студенты', value: 5, fill: '#8b5cf6' }
          ],
          showLabels: true,
          animationSettings: {
            animationType: 'zoomIn',
            delay: 0.6,
            triggerOnView: true,
            triggerOnce: true,
            threshold: 0.1,
            disabled: false
          }
        },
        {
          id: 'reviews-timeline',
          type: 'timeline-component',
          title: 'Рост доверия клиентов',
          events: [
            {
              year: '2019',
              title: 'Первые 1,000 пользователей',
              description: 'Запуск с фокусом на качество и безопасность'
            },
            {
              year: '2020',
              title: '50,000 активных пользователей',
              description: 'Рост доверия благодаря надежности сервиса'
            },
            {
              year: '2021',
              title: '200,000 довольных клиентов',
              description: 'Расширение функций и улучшение UX'
            },
            {
              year: '2022',
              title: '500,000 пользователей',
              description: 'Лидерство в сфере мобильных платежей'
            },
            {
              year: '2023',
              title: '750,000+ активных клиентов',
              description: 'Признание как лучшая финтех-платформа ОАЭ'
            }
          ],
          animationSettings: {
            animationType: 'slideInLeft',
            delay: 0.8,
            triggerOnView: true,
            triggerOnce: true,
            threshold: 0.1,
            disabled: false
          }
        }
      ]
    };

    // Секция "FAQ" - расширенная
    newSections.faq = {
      id: 'faq',
      title: 'Часто задаваемые вопросы',
      description: 'Ответы на самые популярные вопросы о наших услугах и платформе',
      titleColor: '#1e3a8a',
      descriptionColor: '#6b7280',
      backgroundColor: '#f8fafc',
      showBackground: true,
      cards: [],
      aiElements: [],
      contentElements: [
        {
          id: 'faq-title',
          type: 'typography',
          text: 'Есть вопросы? У нас есть ответы!',
          elementType: 'h2',
          color: '#1e3a8a',
          alignment: 'center',
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
          id: 'faq-accordion',
          type: 'accordion',
          title: 'Популярные вопросы',
          items: [
            {
              id: 1,
              title: 'Как зарегистрироваться в UAE Mobile Payments?',
              content: 'Скачайте наше приложение из App Store или Google Play, затем следуйте процессу регистрации, используя ваш Emirates ID и номер мобильного телефона. Верификация обычно занимает 2-3 минуты и включает биометрическую проверку.'
            },
            {
              id: 2,
              title: 'Какие банки поддерживаются?',
              content: 'Мы поддерживаем все основные банки ОАЭ: Emirates NBD, ADCB, FAB, RAKBANK, CBD, ENBD, Mashreq Bank, HSBC UAE, Citibank UAE, Standard Chartered UAE и многие другие лицензированные банки.'
            },
            {
              id: 3,
              title: 'Есть ли комиссия за транзакции?',
              content: 'Базовые P2P переводы до 20 операций в месяц с комиссией 0.5%. Премиум планы предлагают неограниченные переводы с комиссией 0.3%. Бизнес планы имеют комиссию 0.2%. Первые 5 переводов каждый месяц бесплатны для всех.'
            },
            {
              id: 4,
              title: 'Насколько безопасны мои транзакции?',
              content: 'Все транзакции используют банковское 256-битное шифрование, биометрическую аутентификацию и мониторинг мошенничества в реальном времени. Мы соблюдаем все требования безопасности CBUAE и международные стандарты. Средства застрахованы до 100,000 AED.'
            },
            {
              id: 5,
              title: 'Могут ли бизнесы использовать этот сервис?',
              content: 'Да! Мы предлагаем комплексные бизнес-решения: массовые платежи, интеграцию с API, персональную поддержку, расширенную отчетность и соответствие корпоративным стандартам безопасности.'
            },
            {
              id: 6,
              title: 'Поддерживаются ли международные переводы?',
              content: 'Да, мы поддерживаем переводы в более чем 50 стран мира через партнерскую сеть. Доступны переводы в USD, EUR, GBP, INR и другие валюты с конкурентными курсами.'
            },
            {
              id: 7,
              title: 'Как работает техническая поддержка?',
              content: 'Наша поддержка работает 24/7 на арабском и английском языках. Доступны: чат в приложении, телефонная линия, email-поддержка и видеоконсультации для премиум-пользователей.'
            },
            {
              id: 8,
              title: 'Есть ли лимиты на операции?',
              content: 'Лимиты зависят от тарифа: базовый план - 10,000 AED за операцию, премиум - 50,000 AED, бизнес - 500,000 AED. Суточные лимиты можно увеличить через дополнительную верификацию.'
            }
          ],
          allowMultiple: false,
          variant: 'outlined',
          size: 'medium',
          spacing: 'normal',
          showIcons: true,
          animationSettings: {
            animationType: 'slideInUp',
            delay: 0.2,
            triggerOnView: true,
            triggerOnce: true,
            threshold: 0.1,
            disabled: false
          }
        },
        {
          id: 'support-stats',
          type: 'animated-counter',
          title: 'Средняя оценка поддержки',
          startValue: 0,
          endValue: 4.9,
          suffix: '/5',
          duration: 2000,
          titleColor: '#1e3a8a',
          countColor: '#f59e0b',
          animationSettings: {
            animationType: 'zoomIn',
            delay: 0.4,
            triggerOnView: true,
            triggerOnce: true,
            threshold: 0.1,
            disabled: false
          }
        },
        {
          id: 'response-time',
          type: 'animated-counter',
          title: 'Секунд среднее время ответа',
          startValue: 0,
          endValue: 30,
          suffix: 'сек',
          duration: 1500,
          titleColor: '#1e3a8a',
          countColor: '#10b981',
          animationSettings: {
            animationType: 'zoomIn',
            delay: 0.6,
            triggerOnView: true,
            triggerOnce: true,
            threshold: 0.1,
            disabled: false
          }
        },
        {
          id: 'cta-section',
          type: 'cta-section',
          title: 'Готовы начать?',
          description: 'Присоединяйтесь к тысячам довольных клиентов, использующих UAE Mobile Payments для безопасных и быстрых платежей',
          buttonText: 'Скачать приложение',
          targetPage: 'contact',
          alignment: 'center',
          backgroundColor: '#1e3a8a',
          textColor: '#ffffff',
          buttonColor: '#fbbf24',
          buttonTextColor: '#000000',
          animationSettings: {
            animationType: 'zoomIn',
            delay: 0.8,
            triggerOnView: true,
            triggerOnce: true,
            threshold: 0.1,
            disabled: false
          }
        }
      ]
    };

    // Создаем расширенные пункты меню (добавляем к существующим)
    const newMenuItems = [
      ...headerData.menuItems,
      { id: 'about', text: '🏢 О нас', title: 'О нас', description: 'Мы - ведущий провайдер мобильных платежных решений в ОАЭ', link: '#about' },
      { id: 'services', text: '💳 Услуги', title: 'Наши услуги', description: 'Полный спектр мобильных платежных решений', link: '#services' },
      { id: 'security', text: '🔒 Безопасность', title: 'Безопасность', description: 'Максимальная защита ваших средств и данных', link: '#security' },
      { id: 'pricing', text: '💰 Тарифы', title: 'Тарифы', description: 'Прозрачные и выгодные тарифы', link: '#pricing' },
      { id: 'features', text: '⚡ Возможности', title: 'Возможности', description: 'Инновационные функции для удобства', link: '#features' },
      { id: 'reviews', text: '⭐ Отзывы', title: 'Отзывы клиентов', description: 'Что говорят наши довольные клиенты', link: '#reviews' },
      { id: 'faq', text: '❓ FAQ', title: 'FAQ', description: 'Ответы на популярные вопросы', link: '#faq' }
    ];

    // Обновляем данные
    onHeaderChange({
      ...headerData,
      siteName: 'UAE Mobile Payments',
      title: 'UAE Mobile Payments - Мобильные платежи в ОАЭ',
      description: 'Лучшие решения для мобильных платежей в Объединенных Арабских Эмиратах',
      language: 'ru',
      backgroundColor: '#1e3a8a',
      titleColor: '#ffffff',
      linksColor: '#fbbf24',
      siteBackgroundColor: '#f8fafc',
      menuItems: newMenuItems
    });

    onSectionsChange(newSections);

    // Настраиваем расширенную контактную информацию
    onContactChange({
      ...contactData,
      title: 'Свяжитесь с нами',
      description: 'Мы готовы ответить на все ваши вопросы о мобильных платежах в ОАЭ 24/7 на арабском и английском языках',
      phone: '+971 4 123 4567',
      email: 'info@uaemobilepayments.ae',
      address: 'Dubai International Financial Centre, Gate Village 10, Level 2, Dubai, UAE',
      backgroundColor: '#1e3a8a',
      titleColor: '#ffffff',
      descriptionColor: '#e2e8f0',
      showBackground: true,
      backgroundType: 'solid'
    });

    // Настраиваем расширенный футер
    onFooterChange({
      ...footerData,
      siteName: 'UAE Mobile Payments',
      description: 'Надежные мобильные платежи в Объединенных Арабских Эмиратах',
      backgroundColor: '#1e3a8a',
      textColor: '#ffffff',
      linkColor: '#fbbf24',
      showSocialLinks: true,
      showLegalLinks: true,
      contacts: 'Dubai, UAE | +971 4 123 4567 | info@uaemobilepayments.ae',
      copyright: '© 2024 UAE Mobile Payments. Все права защищены. Лицензия CBUAE #12345.'
    });

    console.log('Создан расширенный сайт UAE Mobile Payments с множеством элементов и детальным содержанием');
    alert('Расширенный сайт "UAE Mobile Payments" создан! Добавлены детализированные разделы с множеством элементов и богатым содержанием. Переключен в ручной режим для многостраничного превью.');
  };

  // Функция для автоматического добавления всех предустановленных секций
  const handleAddAllPredefinedSections = () => {
    const newMenuItems = [...headerData.menuItems];
    const newSections = { ...sectionsData };
    let addedCount = 0;

    Object.entries(PREDEFINED_SECTIONS).forEach(([sectionKey, sectionTemplate]) => {
      // Проверяем, не существует ли уже такая секция
      const existingSection = headerData.menuItems.find(item => item.id === sectionKey);
      if (existingSection) return;

      const newMenuItem = {
        id: sectionKey,
        text: sectionTemplate.text,
        title: sectionTemplate.title,
        description: sectionTemplate.description,
        image: '',
        link: `#${sectionKey}`,
        cardType: CARD_TYPES.SIMPLE,
        backgroundColor: '#ffffff',
        textColor: '#000000',
        borderColor: '#e0e0e0',
        shadowColor: 'rgba(0,0,0,0.1)',
        gradientStart: '#ffffff',
        gradientEnd: '#f5f5f5',
        gradientDirection: 'to right'
      };

      newMenuItems.push(newMenuItem);

      // Create new section with the same ID
      const newSection = {
        id: sectionKey,
        title: sectionTemplate.title,
        description: sectionTemplate.description,
        cardType: CARD_TYPES.SIMPLE,
        cards: [],
        titleColor: '#1a237e',
        descriptionColor: '#455a64'
      };

      newSections[sectionKey] = newSection;
      addedCount++;
    });

    if (addedCount > 0) {
      onHeaderChange({ ...headerData, menuItems: newMenuItems });
      onSectionsChange(newSections);
      console.log(`Автоматически добавлено ${addedCount} предустановленных секций`);
      alert(`Добавлено ${addedCount} новых секций в меню!`);
    } else {
      alert('Все предустановленные секции уже добавлены!');
    }
  };
  const handleMenuItemChange = (id, field, value) => {
    console.log('handleMenuItemChange called:', { id, field, value });
    console.log('Current headerData:', headerData);
    
    // Update menu item
      const updatedMenuItems = headerData.menuItems.map(item => {
        if (item.id === id) {
        // If ID changes, update link as well
        if (field === 'id') {
          return { ...item, [field]: value, link: `#${value}` };
        }
        return { ...item, [field]: value };
      }
      return item;
    });
    
    const newHeaderData = { ...headerData, menuItems: updatedMenuItems };
    console.log('New headerData to be set:', newHeaderData);
    onHeaderChange(newHeaderData);

    // Check if section exists
    let sectionExists = sectionsData[id] !== undefined;
    
    if (!sectionExists) {
      // If section doesn't exist, create new one with basic parameters
      const newSection = {
        id: id,
        title: '',
        description: '',
        cardType: CARD_TYPES.NONE,
        cards: [],
        titleColor: '#000000',
        descriptionColor: '#666666'
      };
      onSectionsChange({ ...sectionsData, [id]: newSection });
    }

    // If ID changes, update section ID as well
    if (field === 'id') {
      const { [id]: oldSection, ...restSections } = sectionsData;
      if (oldSection) {
        onSectionsChange({ ...restSections, [value]: { ...oldSection, id: value } });
      }
    }
  };

  const handleDeleteMenuItem = (id) => {
    setSectionToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (sectionToDelete) {
      const updatedMenuItems = headerData.menuItems.filter(item => item.id !== sectionToDelete);
      onHeaderChange({ ...headerData, menuItems: updatedMenuItems });
      
      // Delete section from sectionsData object
      const { [sectionToDelete]: deletedSection, ...restSections } = sectionsData;
      onSectionsChange(restSections);
      
      setExpandedSections(prev => {
        const newState = { ...prev };
        delete newState.menuItems[sectionToDelete];
        return newState;
      });
    }
    setDeleteDialogOpen(false);
    setSectionToDelete(null);
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setSectionToDelete(null);
  };

  const handleSectionChange = (sectionId, field, value) => {
    if (!sectionsData[sectionId]) return;
    
    // If card type changes, check its value
    if (field === 'cardType' && !Object.values(CARD_TYPES).includes(value)) {
      console.error('Invalid card type value:', value);
      return;
    }

    console.log(`[EditorPanel] handleSectionChange - sectionId: ${sectionId}, field: ${field}, value:`, value);

    const updatedSections = {
      ...sectionsData,
      [sectionId]: {
        ...sectionsData[sectionId],
        [field]: value
      }
    };
    
    console.log('[EditorPanel] Updated sections data:', updatedSections);
    
    onSectionsChange(updatedSections);
  };

  const applyPreset = (presetName, sectionId) => {
    const preset = STYLE_PRESETS[presetName];
    if (!preset || !sectionId) return;

    // Update only selected section
    const updatedSections = {
      ...sectionsData,
      [sectionId]: {
        ...sectionsData[sectionId],
        titleColor: preset.titleColor,
        descriptionColor: preset.descriptionColor,
        cardType: preset.cardType,
        backgroundColor: preset.backgroundColor,
        borderColor: preset.borderColor,
        // Update cards only in selected section
        cards: sectionsData[sectionId]?.cards?.map(card => ({
          ...card,
          titleColor: preset.cardTitleColor,
          contentColor: preset.cardContentColor,
          backgroundColor: preset.cardBackgroundColor,
          borderColor: preset.cardBorderColor,
          backgroundType: preset.cardBackgroundType,
          gradientColor1: preset.cardGradientColor1,
          gradientColor2: preset.cardGradientColor2,
          gradientDirection: preset.cardGradientDirection,
          style: {
            ...card.style,
            ...preset.style
          }
        })) || []
      }
    };

    onSectionsChange(updatedSections);
  };

  const processImage = async (file, sectionId) => {
    try {
      // Image compression
      const compressedFile = await imageCompression(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true
      });

              // Convert to Blob
      const blob = new Blob([compressedFile], { type: 'image/jpeg' });
      
              // Generate unique filename using section ID and timestamp
      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).substring(2, 8);
      const filename = `${sectionId}_${timestamp}_${randomStr}.jpg`;

              // Save to cache
      await imageCacheService.saveImage(filename, blob);

              // Create URL for preview
      const url = URL.createObjectURL(blob);

              // Save image metadata
      const imageMetadata = {
        filename,
        type: 'image/jpeg',
        size: blob.size,
        lastModified: new Date().toISOString()
      };

      // Save metadata to cache
      const metadataKey = `section_${sectionId}_metadata`;
      await imageCacheService.saveMetadata(metadataKey, imageMetadata);
      console.log('✓ Image metadata saved to cache:', imageMetadata);

      return { url, filename, blob };
    } catch (error) {
      console.error('Error processing image:', error);
      throw error;
    }
  };

  const handleSectionImageUpload = async (id, event) => {
    const files = Array.from(event.target.files);
    if (!files.length) return;

    try {
      const newImages = [];
      
      for (const file of files) {
        // Check format
        if (!file.type.startsWith('image/')) {
          throw new Error('Please select only images');
        }

        const { url, filename } = await processImage(file, id);
        const imagePath = `/images/sections/${filename}`;
        
        newImages.push({
          path: imagePath,
          url: url,
          filename: filename
        });
      }

      console.log('[EditorPanel] Processed images:', newImages);

      // Update section data
      const currentImages = sectionsData[id]?.images || [];
      const updatedSectionsData = {
        ...sectionsData,
        [id]: {
          ...sectionsData[id],
          images: [...currentImages, ...newImages]
        }
      };
      
      onSectionsChange(updatedSectionsData);

      // Send message to preview for image update
      try {
        const previewIframe = document.querySelector('iframe.preview-iframe');
        if (previewIframe && previewIframe.contentWindow) {
          console.log('[EditorPanel] Sending images to preview:', newImages);
          previewIframe.contentWindow.postMessage({
            type: 'UPDATE_SECTION_IMAGES',
            sectionId: id,
            images: newImages
          }, '*');
        }
      } catch (error) {
        console.error('Error sending message to preview:', error);
      }

      alert('Section images successfully processed and saved');
    } catch (error) {
      console.error('Error loading:', error);
      alert('Error loading images: ' + error.message);
    }
  };
  const handleCardChange = (sectionId, cardId, field, value) => {
    const section = sectionsData[sectionId];
    if (!section) return;

    const updatedCards = section.cards.map(card => {
      // Apply changes only to selected card
      if (card.id === cardId) {
        return { ...card, [field]: value };
      }
      return card;
    });

    onSectionsChange({
      ...sectionsData,
      [sectionId]: {
        ...section,
        cards: updatedCards
      }
    });
  };

  const handleAddCard = (sectionId) => {
    const section = sectionsData[sectionId];
    if (!section) return;

    // Check that section supports cards
    if (section.cardType === CARD_TYPES.NONE) {
      console.warn('Cannot add card to section with type NONE');
      return;
    }

    // Generate new ID for card
    let newCardId;
    if (!section.cards || section.cards.length === 0) {
      newCardId = 1;
      } else {
      // Find maximum ID among existing cards
      const maxId = Math.max(...section.cards.map(card => {
        const id = parseInt(card.id);
        return isNaN(id) ? 0 : id;
      }));
      newCardId = maxId + 1;
    }

    console.log('Generating new card with ID:', newCardId);
    
    // Take styles from first card if it exists
    const firstCard = (section.cards && section.cards[0]) || {};
    
    // Create new card
    const newCard = {
      id: newCardId,
      title: `Card ${newCardId}`,
      content: 'Card content',
      showTitle: true,
      titleColor: firstCard.titleColor || '#333333',
      contentColor: firstCard.contentColor || '#666666',
      backgroundType: firstCard.backgroundType || 'solid',
      backgroundColor: firstCard.backgroundColor || '#ffffff',
      gradientColor1: firstCard.gradientColor1 || '#ffffff',
      gradientColor2: firstCard.gradientColor2 || '#f5f5f5',
      gradientDirection: firstCard.gradientDirection || 'to right',
      borderColor: firstCard.borderColor || '#e0e0e0',
      style: {
        shadow: firstCard.style?.shadow || '0 2px 4px rgba(0,0,0,0.05)',
        borderRadius: firstCard.style?.borderRadius || '12px'
      }
    };

    // Update section with new card
    onSectionsChange({
      ...sectionsData,
      [sectionId]: {
        ...section,
        cards: [...section.cards, newCard]
      }
    });
  };

  const handleDeleteCard = (sectionId, cardId) => {
    const section = sectionsData[sectionId];
    if (!section) return;

    const updatedCards = section.cards.filter(card => card.id !== cardId);
    
    onSectionsChange({
      ...sectionsData,
      [sectionId]: {
        ...section,
        cards: updatedCards
      }
    });
  };

  const handleLegalDocumentsSave = (documents) => {
    console.log('Saving legal documents:', documents);
    if (onLegalDocumentsChange) {
      onLegalDocumentsChange(documents);
    }
  };
  // Функция для генерации HTML элементов контента
  const generateContentElementHTML = (element, isMultiPage = false, currentSectionId = null) => {
    const elementId = `element-${element.id}`;
    
    // Извлекаем данные элемента
    const elementData = element.data || element;
    
    // Функция для применения стилей из данных элемента
    const getElementStyles = (data) => {
      const styles = {};
      
      // Цвета
      if (data.titleColor) styles.color = data.titleColor;
      if (data.textColor) styles.color = data.textColor;
      if (data.countColor) styles.color = data.countColor;
      if (data.backgroundColor) styles.backgroundColor = data.backgroundColor;
      if (data.borderColor) styles.borderColor = data.borderColor;
      
      // Размеры шрифта
      if (data.fontSize) styles.fontSize = `${data.fontSize}px`;
      if (data.fontWeight) styles.fontWeight = data.fontWeight;
      if (data.fontFamily) styles.fontFamily = data.fontFamily;
      
      // Выравнивание
      if (data.textAlign) styles.textAlign = data.textAlign;
      
      // Отступы и границы
      if (data.padding) styles.padding = `${data.padding}px`;
      if (data.borderRadius) styles.borderRadius = `${data.borderRadius}px`;
      
      return styles;
    };
    
    // Функция для создания inline стилей
    const createInlineStyles = (styles) => {
      return Object.entries(styles)
        .map(([key, value]) => `${key}: ${value}`)
        .join('; ');
    };
    
    switch (element.type) {
      case 'gradient-text':
      // Применяем colorSettings если они есть
      const gradientColorSettings = element.colorSettings || element.data?.colorSettings || {};
      
      // Получаем цвета градиента из ColorSettings или fallback на старые значения
      const gradientColor1 = gradientColorSettings.textFields?.gradientStart || gradientColorSettings.textGradient?.gradientStart || elementData.color1 || '#ff6b6b';
      const gradientColor2 = gradientColorSettings.textFields?.gradientEnd || gradientColorSettings.textGradient?.gradientEnd || elementData.color2 || '#4ecdc4';
      
      // Получаем направление градиента
      const gradientDirection = gradientColorSettings.textGradient?.gradientDirection || elementData.direction || 'to right';
      
      // Отладочная информация
      console.log('🎨 [GradientText] Применяем градиент:', {
        gradientColor1,
        gradientColor2,
        gradientDirection,
        colorSettings: gradientColorSettings
      });
      
      // Стили контейнера с фоном
      let gradientContainerStyles = `margin: 1rem 0; text-align: center; padding: ${elementData.padding || 16}px; border-radius: ${elementData.borderRadius || 8}px;`;
      
      if (gradientColorSettings.sectionBackground?.enabled) {
        const { sectionBackground } = gradientColorSettings;
        if (sectionBackground.useGradient) {
          gradientContainerStyles += ` background: linear-gradient(${sectionBackground.gradientDirection}, ${sectionBackground.gradientColor1}, ${sectionBackground.gradientColor2});`;
        } else {
          gradientContainerStyles += ` background-color: ${sectionBackground.solidColor};`;
        }
        gradientContainerStyles += ` opacity: ${sectionBackground.opacity || 1};`;
      }
      
      // Применяем дополнительные настройки
      if (gradientColorSettings.borderColor) {
        gradientContainerStyles += ` border: ${gradientColorSettings.borderWidth || 1}px solid ${gradientColorSettings.borderColor};`;
      }
      if (gradientColorSettings.borderRadius !== undefined) {
        gradientContainerStyles += ` border-radius: ${gradientColorSettings.borderRadius}px;`;
      }
      if (gradientColorSettings.padding !== undefined) {
        gradientContainerStyles += ` padding: ${gradientColorSettings.padding}px;`;
      }
      if (gradientColorSettings.boxShadow) {
        gradientContainerStyles += ` box-shadow: 0 2px 8px rgba(0,0,0,0.1);`;
      }
      
        return `
        <div id="${elementId}" class="content-element gradient-text" style="${gradientContainerStyles}">
            <h2 style="
              background: linear-gradient(${gradientDirection}, ${gradientColor1}, ${gradientColor2});
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;
              font-size: ${elementData.fontSize || 24}px;
              font-weight: ${elementData.fontWeight || 'bold'};
              margin: 0;
              display: inline-block;
              color: transparent;
            ">${elementData.text || 'Градиентный текст'}</h2>
          </div>
        `;

      case 'animated-counter':
        // Применяем colorSettings если они есть
        const animatedCounterColorSettings = element.colorSettings || element.data?.colorSettings || {};
        const animatedCounterTitleColor = animatedCounterColorSettings.textFields?.title || elementData.titleColor || '#333333';
        const animatedCounterCountColor = animatedCounterColorSettings.textFields?.content || elementData.countColor || '#1976d2';
        const animatedCounterDescriptionColor = animatedCounterColorSettings.textFields?.author || elementData.descriptionColor || '#666666';
        
        // Стили контейнера с фоном
        let animatedCounterContainerStyles = `margin: 2rem 0; text-align: center; padding: 2rem;`;
        
        if (animatedCounterColorSettings.sectionBackground?.enabled) {
          const { sectionBackground } = animatedCounterColorSettings;
          if (sectionBackground.useGradient) {
            animatedCounterContainerStyles += ` background: linear-gradient(${sectionBackground.gradientDirection}, ${sectionBackground.gradientColor1}, ${sectionBackground.gradientColor2});`;
          } else {
            animatedCounterContainerStyles += ` background-color: ${sectionBackground.solidColor};`;
          }
          animatedCounterContainerStyles += ` opacity: ${sectionBackground.opacity || 1};`;
        } else {
          animatedCounterContainerStyles += ` background: rgba(255,255,255,0.1);`;
        }
        
        // Применяем дополнительные настройки
        if (animatedCounterColorSettings.borderColor) {
          animatedCounterContainerStyles += ` border: ${animatedCounterColorSettings.borderWidth || 1}px solid ${animatedCounterColorSettings.borderColor};`;
        }
        if (animatedCounterColorSettings.borderRadius !== undefined) {
          animatedCounterContainerStyles += ` border-radius: ${animatedCounterColorSettings.borderRadius}px;`;
        } else {
          animatedCounterContainerStyles += ` border-radius: 12px;`;
        }
        if (animatedCounterColorSettings.padding !== undefined) {
          animatedCounterContainerStyles += ` padding: ${animatedCounterColorSettings.padding}px;`;
        }
        if (animatedCounterColorSettings.boxShadow) {
          animatedCounterContainerStyles += ` box-shadow: 0 2px 8px rgba(0,0,0,0.1);`;
        }
        
        return `
          <div id="${elementId}" class="content-element animated-counter" style="${animatedCounterContainerStyles}">
            <h3 style="
              color: ${animatedCounterTitleColor};
              margin-bottom: 1rem;
              font-size: 1.5rem;
            ">${elementData.title || 'Статистика'}</h3>
            <div style="
              font-size: 3rem;
              font-weight: bold;
              color: ${animatedCounterCountColor};
              margin-bottom: 0.5rem;
            ">
              <span class="counter" 
                    data-start="${elementData.startValue || 0}" 
                    data-end="${elementData.endValue || 100}"
                    data-duration="${elementData.duration || 2000}">
                ${elementData.startValue || 0}
              </span>
              <span> ${elementData.suffix || ''}</span>
            </div>
            ${elementData.description ? `
              <p style="
                color: ${animatedCounterDescriptionColor};
                font-size: 1rem;
                margin-top: 0.5rem;
              ">${elementData.description}</p>
            ` : ''}
          </div>
        `;

      case 'typewriter-text':
        const texts = Array.isArray(elementData.texts) ? elementData.texts : ['Привет, мир!', 'Добро пожаловать', 'На наш сайт'];
        
        // Применяем colorSettings если они есть
        const typewriterColorSettings = element.colorSettings || element.data?.colorSettings || {};
        const typewriterTextColor = typewriterColorSettings.textFields?.content || elementData.textColor || '#333333';
        
        // Стили контейнера с фоном
        let typewriterContainerStyles = `margin: 2rem 0; text-align: center; min-height: 60px; display: flex; align-items: center; justify-content: center;`;
        
        if (typewriterColorSettings.sectionBackground?.enabled) {
          const { sectionBackground } = typewriterColorSettings;
          if (sectionBackground.useGradient) {
            typewriterContainerStyles += ` background: linear-gradient(${sectionBackground.gradientDirection}, ${sectionBackground.gradientColor1}, ${sectionBackground.gradientColor2});`;
          } else {
            typewriterContainerStyles += ` background-color: ${sectionBackground.solidColor};`;
          }
          typewriterContainerStyles += ` opacity: ${sectionBackground.opacity || 1};`;
        }
        
        // Применяем дополнительные настройки
        if (typewriterColorSettings.borderColor) {
          typewriterContainerStyles += ` border: ${typewriterColorSettings.borderWidth || 1}px solid ${typewriterColorSettings.borderColor};`;
        }
        if (typewriterColorSettings.borderRadius !== undefined) {
          typewriterContainerStyles += ` border-radius: ${typewriterColorSettings.borderRadius}px;`;
        }
        if (typewriterColorSettings.padding !== undefined) {
          typewriterContainerStyles += ` padding: ${typewriterColorSettings.padding}px;`;
        }
        if (typewriterColorSettings.boxShadow) {
          typewriterContainerStyles += ` box-shadow: 0 2px 8px rgba(0,0,0,0.1);`;
        }
        
        return `
          <style>
            .typewriter-container {
              min-height: ${(elementData.fontSize || 32) * 1.2}px;
            display: flex;
            align-items: center;
            justify-content: center;
              position: relative;
            }
            
            .typewriter-text-content {
              font-family: ${elementData.fontFamily || 'Courier New, monospace'};
              white-space: nowrap;
              overflow: hidden;
            }
            
            .typewriter-cursor {
              animation: blink 1s infinite;
              margin-left: 2px;
              color: ${typewriterTextColor};
              font-family: ${elementData.fontFamily || 'Courier New, monospace'};
              user-select: none;
            }
            
            @keyframes blink {
              0%, 50% { opacity: 1; }
              51%, 100% { opacity: 0; }
            }
          </style>
          <div id="${elementId}" class="content-element typewriter-text" style="${typewriterContainerStyles}">
            <div class="typewriter typewriter-container" 
                data-texts='${JSON.stringify(texts)}'
                data-speed="${elementData.speed || 150}"
                data-pause="${elementData.pauseTime || 2000}"
                data-repeat="${elementData.repeat !== false}"
                style="
                  color: ${typewriterTextColor};
                  font-size: ${elementData.fontSize || 32}px;
                  font-weight: ${elementData.fontWeight || 'normal'};
                  font-family: ${elementData.fontFamily || 'Courier New, monospace'};
                  margin: 0;
                ">
                <span class="typewriter-text-content"></span><span class="typewriter-cursor">|</span>
            </div>
          </div>
        `;

      case 'highlight-text':
        // Применяем colorSettings если они есть
        const highlightColorSettings = element.colorSettings || element.data?.colorSettings || {};
        const highlightTextColor = highlightColorSettings.textFields?.content || elementData.textColor || '#333333';
        const highlightBgColor = highlightColorSettings.textFields?.highlight || elementData.highlightColor || '#ffeb3b';
        
        // Стили контейнера с фоном
        let highlightContainerStyles = `margin: 1.5rem 0; padding: 1rem; text-align: center;`;
        
        if (highlightColorSettings.sectionBackground?.enabled) {
          const { sectionBackground } = highlightColorSettings;
          if (sectionBackground.useGradient) {
            highlightContainerStyles += ` background: linear-gradient(${sectionBackground.gradientDirection}, ${sectionBackground.gradientColor1}, ${sectionBackground.gradientColor2});`;
          } else {
            highlightContainerStyles += ` background-color: ${sectionBackground.solidColor};`;
          }
          highlightContainerStyles += ` opacity: ${sectionBackground.opacity || 1};`;
        }
        
        // Применяем дополнительные настройки
        if (highlightColorSettings.borderColor) {
          highlightContainerStyles += ` border: ${highlightColorSettings.borderWidth || 1}px solid ${highlightColorSettings.borderColor};`;
        }
        if (highlightColorSettings.borderRadius !== undefined) {
          highlightContainerStyles += ` border-radius: ${highlightColorSettings.borderRadius}px;`;
        }
        if (highlightColorSettings.padding !== undefined) {
          highlightContainerStyles += ` padding: ${highlightColorSettings.padding}px;`;
        }
        if (highlightColorSettings.boxShadow) {
          highlightContainerStyles += ` box-shadow: 0 2px 8px rgba(0,0,0,0.1);`;
        }
        
        return `
          <div id="${elementId}" class="content-element highlight-text" style="${highlightContainerStyles}">
            <p style="
              font-size: ${elementData.fontSize || 16}px;
              color: ${highlightTextColor};
              background: ${highlightBgColor};
              padding: 0.5rem 1rem;
              border-radius: 8px;
              display: inline-block;
              margin: 0;
            ">${elementData.text || 'Это важный текст с выделением'}</p>
          </div>
        `;

      case 'testimonial-card':
        const stars = '★'.repeat(Math.floor(elementData.rating || 5)) + '☆'.repeat(5 - Math.floor(elementData.rating || 5));
        
        // Применяем colorSettings если они есть
        const testimonialColorSettings = element.colorSettings || element.data?.colorSettings || {};
        const testimonialNameColor = testimonialColorSettings.textFields?.name || elementData.nameColor || '#1976d2';
        const testimonialRoleColor = testimonialColorSettings.textFields?.role || elementData.roleColor || '#666666';
        const testimonialCompanyColor = testimonialColorSettings.textFields?.company || elementData.companyColor || '#888888';
        const testimonialContentColor = testimonialColorSettings.textFields?.content || elementData.contentColor || '#333333';
        const testimonialRatingColor = testimonialColorSettings.textFields?.rating || '#ffc107';
        
        // Базовые стили контейнера
        let testimonialContainerStyles = `
            margin: 2rem 0;
          display: flex;
          flex-direction: column;
          width: 100%;
        `;
        
        // Применяем настройки фона из sectionBackground
        if (testimonialColorSettings.sectionBackground?.enabled) {
          const { sectionBackground } = testimonialColorSettings;
          if (sectionBackground.useGradient) {
            testimonialContainerStyles += ` background: linear-gradient(${sectionBackground.gradientDirection}, ${sectionBackground.gradientColor1}, ${sectionBackground.gradientColor2});`;
          } else {
            testimonialContainerStyles += ` background-color: ${sectionBackground.solidColor};`;
          }
          testimonialContainerStyles += ` opacity: ${sectionBackground.opacity || 1};`;
        } else {
          testimonialContainerStyles += ` background: rgba(255,255,255,0.9);`;
        }
        
        // Применяем настройки границы
        if (testimonialColorSettings.borderColor) {
          testimonialContainerStyles += ` border: ${testimonialColorSettings.borderWidth || 1}px solid ${testimonialColorSettings.borderColor};`;
        }
        
        // Применяем радиус углов
        if (testimonialColorSettings.borderRadius !== undefined) {
          testimonialContainerStyles += ` border-radius: ${testimonialColorSettings.borderRadius}px;`;
        } else {
          testimonialContainerStyles += ` border-radius: 8px;`;
        }
        
        // Применяем внутренние отступы
        if (testimonialColorSettings.padding !== undefined) {
          testimonialContainerStyles += ` padding: ${testimonialColorSettings.padding}px;`;
        } else {
          testimonialContainerStyles += ` padding: 16px;`;
        }
        
        // Применяем тень
        if (testimonialColorSettings.boxShadow) {
          testimonialContainerStyles += ` box-shadow: 0 2px 8px rgba(0,0,0,0.1);`;
        }
        
        return `
          <div id="${elementId}" class="content-element testimonial-card" style="${testimonialContainerStyles}">
            <div style="display: flex; align-items: center; margin-bottom: 1rem;">
              ${elementData.avatar ? `
                <img src="${elementData.avatar}" alt="${elementData.name}" style="
                  width: 60px;
                  height: 60px;
                  border-radius: 50%;
                  margin-right: 1rem;
                  object-fit: cover;
                ">
              ` : `
                <div style="
                  width: 60px;
                  height: 60px;
                  border-radius: 50%;
                  background: linear-gradient(45deg, #1976d2, #64b5f6);
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  color: white;
                  font-weight: bold;
                  font-size: 1.5rem;
                  margin-right: 1rem;
                ">
                  ${(elementData.name || 'И').charAt(0).toUpperCase()}
                </div>
              `}
              <div>
                <h4 style="margin: 0; color: ${testimonialNameColor}; font-size: 1.2rem;">${elementData.name || 'Иван Иванов'}</h4>
                <p style="margin: 0; color: ${testimonialRoleColor}; font-size: 0.9rem;">${elementData.role || 'Генеральный директор'}</p>
                <p style="margin: 0; color: ${testimonialCompanyColor}; font-size: 0.8rem;">${elementData.company || 'ООО "Компания"'}</p>
              </div>
            </div>
            <div style="color: ${testimonialRatingColor}; margin-bottom: 1rem; font-size: 1.2rem;">
              ${stars}
            </div>
            <p style="
              color: ${testimonialContentColor};
              font-style: italic;
              line-height: 1.6;
              margin: 0;
            ">"${elementData.content || 'Отличный сервис! Рекомендую всем.'}"</p>
          </div>
        `;

      case 'alert-component':
        const alertColors = {
          info: { bg: '#e3f2fd', border: '#1976d2', icon: 'ℹ️' },
          warning: { bg: '#fff3e0', border: '#f57c00', icon: '⚠️' },
          error: { bg: '#ffebee', border: '#d32f2f', icon: '❌' },
          success: { bg: '#e8f5e8', border: '#388e3c', icon: '✅' }
        };
        const alertType = alertColors[element.type] || alertColors.info;
        
        return `
          <div id="${elementId}" class="content-element alert-component" style="
            margin: 1.5rem 0;
            padding: 1rem 1.5rem;
            background: ${alertType.bg};
            border: 1px solid ${alertType.border};
            border-radius: 8px;
            border-left: 4px solid ${alertType.border};
          ">
            <div style="display: flex; align-items: flex-start; gap: 0.5rem;">
              ${element.showIcon !== false ? `
                <span style="font-size: 1.2rem; margin-top: 0.1rem;">
                  ${alertType.icon}
                </span>
              ` : ''}
              <div style="flex: 1;">
                <h4 style="
                  margin: 0 0 0.5rem 0;
                  color: ${alertType.border};
                  font-size: 1.1rem;
                  font-weight: 600;
                ">${element.title || 'Внимание!'}</h4>
                <p style="
                  margin: 0;
                  color: #333;
                  line-height: 1.5;
                ">${element.message || 'Это важное уведомление'}</p>
              </div>
            </div>
          </div>
        `;

      // Базовые текстовые элементы
      case 'typography':
        const headingTag = element.headingType || 'h2';
        // Применяем colorSettings если они есть
        const typographyColorSettings = element.colorSettings || element.data?.colorSettings || {};
        const typographyTextColor = typographyColorSettings.textFields?.text || element.textColor || '#333333';
        
        // Стили контейнера с фоном
        let typographyContainerStyles = `margin: 1rem 0; text-align: ${element.textAlign || 'left'};`;
        if (typographyColorSettings.sectionBackground?.enabled) {
          const { sectionBackground } = typographyColorSettings;
          if (sectionBackground.useGradient) {
            typographyContainerStyles += ` background: linear-gradient(${sectionBackground.gradientDirection}, ${sectionBackground.gradientColor1}, ${sectionBackground.gradientColor2});`;
          } else {
            typographyContainerStyles += ` background-color: ${sectionBackground.solidColor};`;
          }
          typographyContainerStyles += ` opacity: ${sectionBackground.opacity || 1};`;
          typographyContainerStyles += ` border: ${typographyColorSettings.borderWidth || 1}px solid ${typographyColorSettings.borderColor || '#e0e0e0'};`;
          typographyContainerStyles += ` border-radius: ${typographyColorSettings.borderRadius || 8}px;`;
          typographyContainerStyles += ` padding: ${typographyColorSettings.padding || 16}px;`;
          if (typographyColorSettings.boxShadow) {
            typographyContainerStyles += ` box-shadow: 0 2px 8px rgba(0,0,0,0.1);`;
          }
        }
        
        return `
          <div id="${elementId}" class="content-element typography" style="${typographyContainerStyles}">
            <${headingTag} style="
              color: ${typographyTextColor};
              margin: 0;
              font-size: ${headingTag === 'h1' ? '2.5rem' : headingTag === 'h2' ? '2rem' : headingTag === 'h3' ? '1.5rem' : '1.2rem'};
            ">${element.text || 'Заголовок или текст'}</${headingTag}>
          </div>
        `;

      case 'rich-text':
        const parseMarkdown = (text) => {
          if (!text) return '';
          return text
            .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
            .replace(/\`([^\`]+)\`/g, '<code style="background: #f4f4f4; padding: 2px 4px; border-radius: 3px; font-family: \'Courier New\', monospace; font-size: 0.9em;">$1</code>')
            .replace(/\n\n/g, '</p><p>')
            .replace(/\n/g, '<br>');
        };
        
        // Применяем colorSettings если они есть
        const richTextColorSettings = element.colorSettings || element.data?.colorSettings || {};
        const richTextTitleColor = richTextColorSettings.textFields?.title || (element.data?.titleColor || element.titleColor || '#1976d2');
        const richTextContentColor = richTextColorSettings.textFields?.content || (element.data?.textColor || element.textColor || '#333333');
        const richTextBorderColor = richTextColorSettings.textFields?.border || (element.data?.borderColor || element.borderColor || '#1976d2');
        
        // Стили контейнера с фоном
        let richTextContainerStyles = `margin: 1.5rem 0; padding: ${element.data?.padding || element.padding || 16}px; border-radius: ${element.data?.borderRadius || element.borderRadius || 8}px; border-left: 4px solid ${richTextBorderColor};`;
        
        if (richTextColorSettings.sectionBackground?.enabled) {
          const { sectionBackground } = richTextColorSettings;
          if (sectionBackground.useGradient) {
            richTextContainerStyles += ` background: linear-gradient(${sectionBackground.gradientDirection}, ${sectionBackground.gradientColor1}, ${sectionBackground.gradientColor2});`;
          } else {
            richTextContainerStyles += ` background-color: ${sectionBackground.solidColor};`;
          }
          richTextContainerStyles += ` opacity: ${sectionBackground.opacity || 1};`;
        } else {
          richTextContainerStyles += ` background: ${element.data?.backgroundColor || element.backgroundColor || '#fafafa'};`;
        }
        
        // Применяем дополнительные настройки
        if (richTextColorSettings) {
          if (richTextColorSettings.borderColor) {
            richTextContainerStyles += ` border: ${richTextColorSettings.borderWidth || 1}px solid ${richTextColorSettings.borderColor};`;
          }
          if (richTextColorSettings.borderRadius !== undefined) {
            richTextContainerStyles += ` border-radius: ${richTextColorSettings.borderRadius}px;`;
          }
          if (richTextColorSettings.padding !== undefined) {
            richTextContainerStyles += ` padding: ${richTextColorSettings.padding}px;`;
          }
          if (richTextColorSettings.boxShadow) {
            richTextContainerStyles += ` box-shadow: 0 2px 8px rgba(0,0,0,0.1);`;
          }
        } else if (element.boxShadow) {
          richTextContainerStyles += ` box-shadow: 0 2px 8px rgba(0,0,0,0.1);`;
        }
        
        return `
          <div id="${elementId}" class="content-element rich-text" style="${richTextContainerStyles}">
            ${(element.data?.showTitle !== undefined ? element.data.showTitle : element.showTitle) !== false ? `
              <h3 style="
                color: ${richTextTitleColor};
                margin: 0 0 1rem 0;
                font-size: ${element.data?.titleFontSize || element.titleFontSize || '1.25rem'};
                font-family: ${element.data?.fontFamily || element.fontFamily || 'inherit'};
                font-weight: ${element.data?.titleFontWeight || element.titleFontWeight || 'normal'};
              ">${element.data?.title || element.title || 'Богатый текст'}</h3>
            ` : ''}
            <div class="rich-content" style="
              color: ${richTextContentColor};
              line-height: 1.6;
              font-size: ${element.data?.fontSize || element.fontSize || '1rem'};
              font-family: ${element.data?.fontFamily || element.fontFamily || 'inherit'};
              text-align: ${element.data?.textAlign || element.textAlign || 'left'};
            ">
              <p>${parseMarkdown(element.data?.content || element.content || 'Текст с **жирным**, *курсивом*, ***жирным курсивом***\n\nВторой абзац с [ссылкой](https://example.com)')}</p>
            </div>
          </div>
        `;

      case 'code-block':
        const codeLines = (element.data?.code || element.code || 'function hello() {\n  console.log("Hello, World!");\n}').split('\n');
        const showLineNumbers = (element.data?.showLineNumbers !== undefined ? element.data.showLineNumbers : element.showLineNumbers) !== false;
        
        return `
          <div id="${elementId}" class="content-element code-block" style="
            margin: 1.5rem 0;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          ">
            ${(element.data?.showTitle !== undefined ? element.data.showTitle : element.showTitle) !== false ? `
              <div style="
                background: #333333;
                color: white;
                padding: 0.75rem 1rem;
                font-size: 0.9rem;
                font-weight: 500;
                display: flex;
                align-items: center;
                gap: 0.5rem;
              ">
                <span>📄</span>
                ${element.data?.title || element.title || 'Блок кода'} (${element.data?.language || element.language || 'javascript'})
              </div>
            ` : ''}
            <div style="
              background: #2d2d2d;
              color: #f8f8f2;
              padding: 1rem;
              font-family: 'Courier New', Monaco, monospace;
              font-size: 0.9rem;
              line-height: 1.5;
              overflow-x: auto;
              position: relative;
            ">
              ${showLineNumbers ? `
                <div style="
                  position: absolute;
                  left: 0;
                  top: 1rem;
                  bottom: 1rem;
                  width: 2.5rem;
                  background: #1a1a1a;
                  color: #666;
                  padding: 0 0.5rem;
                  font-size: 0.8rem;
                  text-align: right;
                  line-height: 1.5;
                  border-right: 1px solid #444;
                ">
                  ${codeLines.map((_, i) => `<div>${i + 1}</div>`).join('')}
                </div>
              ` : ''}
              <pre style="
                margin: 0;
                padding: 0;
                ${showLineNumbers ? 'padding-left: 3rem;' : ''}
                color: #f8f8f2;
                background: transparent;
              "><code>${codeLines.join('\n')}</code></pre>
            </div>
          </div>
        `;

      case 'callout':

        const calloutTypes = {
          info: { bg: '#e3f2fd', border: '#1976d2', icon: 'ℹ️', label: 'Информация' },
          warning: { bg: '#fff3e0', border: '#f57c00', icon: '⚠️', label: 'Предупреждение' },
          error: { bg: '#ffebee', border: '#d32f2f', icon: '❌', label: 'Ошибка' },
          success: { bg: '#e8f5e8', border: '#388e3c', icon: '✅', label: 'Успех' },
          note: { bg: '#f3e5f5', border: '#7b1fa2', icon: '📝', label: 'Заметка' },
          tip: { bg: '#e8f8f5', border: '#00796b', icon: '💡', label: 'Совет' },
          question: { bg: '#e3f2fd', border: '#1976d2', icon: '❓', label: 'Вопрос' },
          important: { bg: '#fff3e0', border: '#f57c00', icon: '⭐', label: 'Важно' },
          security: { bg: '#e8f5e8', border: '#388e3c', icon: '🔒', label: 'Безопасность' }
        };
        // Определяем тип выноски (учитываем пользовательский тип)
        let calloutType;
        if ((element.data?.type === 'custom' || element.type === 'custom' || 
             element.data?.calloutType === 'custom' || element.calloutType === 'custom' || 
             element.data?.isCustomType || element.isCustomType) && 
            (element.data?.customTypeName || element.customTypeName)) {
          // Пользовательский тип
          calloutType = {
            bg: element.data?.backgroundColor || element.backgroundColor || '#f5f5f5',
            border: element.data?.borderColor || element.borderColor || '#999999', 
            icon: 'ℹ️',
            label: element.data?.customTypeName || element.customTypeName || 'Пользовательский'
          };
        } else {
          // Стандартный тип
          calloutType = calloutTypes[element.data?.type || element.type || element.data?.calloutType || element.calloutType] || calloutTypes.info;
        }
        
                // Применяем colorSettings если они есть
        const calloutColorSettings = element.colorSettings || element.data?.colorSettings || {};
        const calloutTitleColor = calloutColorSettings.textFields?.title || 
                                 (element.data?.textColor || element.textColor || (element.titleColor || calloutType.border));
        const calloutContentColor = calloutColorSettings.textFields?.content || 
                                   (element.data?.textColor || element.textColor || (element.contentColor || '#333333'));
        const calloutBorderColor = calloutColorSettings.textFields?.border || 
                                   (element.data?.borderColor || element.borderColor || calloutType.border);
        const calloutIconColor = calloutColorSettings.textFields?.icon || calloutBorderColor;
        const calloutTypeColor = calloutColorSettings.textFields?.type || calloutBorderColor;
        
        // Стили контейнера с фоном
        let calloutContainerStyles = `margin: 1.5rem 0; padding: ${element.padding || 16}px ${element.padding || 24}px; border-radius: ${element.borderRadius || 8}px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); position: relative;`;
        
        if (calloutColorSettings.sectionBackground?.enabled) {
          const { sectionBackground } = calloutColorSettings;
          if (sectionBackground.useGradient) {
            calloutContainerStyles += ` background: linear-gradient(${sectionBackground.gradientDirection}, ${sectionBackground.gradientColor1}, ${sectionBackground.gradientColor2});`;
          } else {
            calloutContainerStyles += ` background-color: ${sectionBackground.solidColor};`;
          }
          calloutContainerStyles += ` opacity: ${sectionBackground.opacity || 1};`;
        } else {
          const calloutBgColor = element.data?.backgroundColor || element.backgroundColor || calloutType.bg;
          calloutContainerStyles += ` background: ${calloutBgColor};`;
        }
        
        calloutContainerStyles += ` border: 1px solid ${calloutBorderColor}; border-left: 4px solid ${calloutBorderColor};`;
        
        // Применяем дополнительные настройки
        if (calloutColorSettings) {
          if (calloutColorSettings.borderColor) {
            calloutContainerStyles += ` border: ${calloutColorSettings.borderWidth || 1}px solid ${calloutColorSettings.borderColor};`;
          }
          if (calloutColorSettings.borderRadius !== undefined) {
            calloutContainerStyles += ` border-radius: ${calloutColorSettings.borderRadius}px;`;
          }
          if (calloutColorSettings.padding !== undefined) {
            calloutContainerStyles += ` padding: ${calloutColorSettings.padding}px;`;
          }
          if (calloutColorSettings.boxShadow) {
            calloutContainerStyles += ` box-shadow: 0 2px 8px rgba(0,0,0,0.1);`;
          }
        }
        
        return `
          <div id="${elementId}" class="content-element callout callout-${element.type || element.calloutType || 'info'}" style="${calloutContainerStyles}">
            <div class="callout-header" style="display: flex; align-items: flex-start; gap: 0.75rem;">
              ${(element.data?.showIcon !== undefined ? element.data.showIcon : element.showIcon) !== false ? `
                <span class="callout-icon" style="
                  font-size: ${element.iconSize || 20}px;
                  margin-top: 0.1rem;
                  flex-shrink: 0;
                  color: ${calloutIconColor};
                ">
                  ${calloutType.icon}
                </span>
              ` : ''}
              <div class="callout-content" style="flex: 1;">
                <h4 class="callout-title" style="
                  margin: 0 0 0.5rem 0;
                  color: ${calloutTitleColor};
                  font-size: ${element.titleFontSize ? element.titleFontSize + 'px' : '1.1rem'};
                  font-weight: ${element.titleFontWeight || 600};
                  font-family: ${element.fontFamily || 'inherit'};
                ">${element.data?.title || element.title || 'Важная информация'}</h4>
                <p class="callout-text" style="
                  margin: 0;
                  color: ${calloutContentColor};
                  line-height: 1.5;
                  font-size: ${element.fontSize ? element.fontSize + 'px' : '0.95rem'};
                  font-family: ${element.fontFamily || 'inherit'};
                ">${element.data?.content || element.content || 'Это важная информация, которую пользователи должны заметить.'}</p>
                ${(element.footnote || element.data?.footnote) ? `
                  <p class="callout-footnote" style="
                    margin: 0.5rem 0 0 0;
                    color: ${calloutColorSettings.textFields?.footnote || '#888888'};
                    font-size: 0.75rem;
                    font-style: italic;
                    opacity: 0.8;
                    line-height: 1.4;
                  ">${element.footnote || element.data?.footnote}</p>
                ` : ''}
              </div>
            </div>
            
            <!-- Индикатор типа выноски -->
            <div style="
              position: absolute;
              bottom: 8px;
              right: 8px;
            ">
              <span style="
                display: inline-block;
                padding: 2px 6px;
                font-size: 10px;
                background-color: rgba(255,255,255,0.8);
                border: 1px solid ${calloutTypeColor};
                border-radius: 12px;
                color: ${calloutTypeColor};
                font-weight: 500;
              ">${calloutType.label}</span>
            </div>
          </div>
        `;

      case 'blockquote':
        const borderPosition = element.data?.borderPosition || element.borderPosition || 'left';
        const borderClass = `border-${borderPosition}`;
        
        // Применяем colorSettings если они есть
        const blockquoteColorSettings = element.colorSettings || element.data?.colorSettings || {};
        const blockquoteTitleColor = blockquoteColorSettings.textFields?.title || (element.data?.titleColor || element.titleColor || element.data?.quoteColor || element.quoteColor || '#555555');
        const blockquoteContentColor = blockquoteColorSettings.textFields?.content || (element.data?.quoteColor || element.quoteColor || '#555555');
        const blockquoteAuthorColor = blockquoteColorSettings.textFields?.author || (element.data?.authorColor || element.authorColor || '#888888');
        const blockquoteBorderColor = blockquoteColorSettings.textFields?.border || (element.data?.borderColor || element.borderColor || '#dee2e6');
        
        // Определяем стиль границы в зависимости от позиции
        let borderStyle = '';
        const borderWidth = element.data?.borderWidth || element.borderWidth || 4;
        
        switch (borderPosition) {
          case 'left':
            borderStyle = `border-left: ${borderWidth}px solid ${blockquoteBorderColor};`;
            break;
          case 'right':
            borderStyle = `border-right: ${borderWidth}px solid ${blockquoteBorderColor};`;
            break;
          case 'top':
            borderStyle = `border-top: ${borderWidth}px solid ${blockquoteBorderColor};`;
            break;
          case 'bottom':
            borderStyle = `border-bottom: ${borderWidth}px solid ${blockquoteBorderColor};`;
            break;
          case 'around':
            borderStyle = `border: ${borderWidth}px solid ${blockquoteBorderColor};`;
            break;
        }
        
        // Стили контейнера с фоном
        let blockquoteContainerStyles = `margin: 1.5rem 0; padding: ${element.padding || 20}px; border-radius: ${element.borderRadius || 8}px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); text-align: ${element.textAlign || 'left'}; font-family: ${element.fontFamily || 'Georgia'};`;
        
        if (blockquoteColorSettings.sectionBackground?.enabled) {
          const { sectionBackground } = blockquoteColorSettings;
          if (sectionBackground.useGradient) {
            blockquoteContainerStyles += ` background: linear-gradient(${sectionBackground.gradientDirection}, ${sectionBackground.gradientColor1}, ${sectionBackground.gradientColor2});`;
          } else {
            blockquoteContainerStyles += ` background-color: ${sectionBackground.solidColor};`;
          }
          blockquoteContainerStyles += ` opacity: ${sectionBackground.opacity || 1};`;
        } else {
        // Определяем фон (градиент или обычный)
          const useGradient = element.data?.useGradient !== undefined ? element.data.useGradient : element.useGradient;
          const backgroundStyle = useGradient ? 
            `background: linear-gradient(${element.data?.gradientDirection || element.gradientDirection || 'to right'}, ${element.data?.gradientColor1 || element.gradientColor1 || '#f8f9fa'}, ${element.data?.gradientColor2 || element.gradientColor2 || '#ffffff'});` : 
            `background: ${element.data?.backgroundColor || element.backgroundColor || '#f8f9fa'};`;
          blockquoteContainerStyles += ` ${backgroundStyle}`;
        }
        
        blockquoteContainerStyles += ` ${borderStyle}`;
        
        // Применяем дополнительные настройки
        if (blockquoteColorSettings) {
          if (blockquoteColorSettings.borderColor) {
            blockquoteContainerStyles += ` border: ${blockquoteColorSettings.borderWidth || 1}px solid ${blockquoteColorSettings.borderColor};`;
          }
          if (blockquoteColorSettings.borderRadius !== undefined) {
            blockquoteContainerStyles += ` border-radius: ${blockquoteColorSettings.borderRadius}px;`;
          }
          if (blockquoteColorSettings.padding !== undefined) {
            blockquoteContainerStyles += ` padding: ${blockquoteColorSettings.padding}px;`;
          }
          if (blockquoteColorSettings.boxShadow) {
            blockquoteContainerStyles += ` box-shadow: 0 2px 8px rgba(0,0,0,0.1);`;
          }
        }
        
        return `
          <div id="${elementId}" class="content-element blockquote ${borderClass}" style="${blockquoteContainerStyles}">
            <blockquote style="margin: 0; position: relative;">
              ${(element.data?.showTitle !== undefined ? element.data.showTitle : element.showTitle) && (element.data?.title || element.title) ? `
                <div class="quote-title" style="
                  color: ${blockquoteTitleColor};
                  font-weight: 600;
                  margin-bottom: 0.5rem;
                  font-size: ${element.data?.titleFontSize || element.titleFontSize || '1.1rem'};
                ">${element.data?.title || element.title}</div>
              ` : ''}
              <p class="quote-text" style="
                color: ${blockquoteContentColor};
                font-size: ${element.data?.quoteFontSize || element.quoteFontSize || 18}px;
                line-height: 1.6;
                margin: 0 0 1rem 0;
                font-style: ${(element.data?.italic !== undefined ? element.data.italic : element.italic) !== false ? 'italic' : 'normal'};
                font-weight: ${element.data?.fontWeight || element.fontWeight || 'normal'};
              ">"${element.data?.quote || element.quote || 'Это цитата для демонстрации'}"</p>
              ${(element.data?.showAuthor !== undefined ? element.data.showAuthor : element.showAuthor) !== false && (element.data?.author || element.author) ? `
                <footer class="quote-author" style="
                  color: ${blockquoteAuthorColor};
                  font-size: ${element.data?.authorFontSize || element.authorFontSize || 14}px;
                  text-align: right;
                  opacity: 0.8;
                ">
                  — ${element.data?.author || element.author}${(element.data?.showSource !== undefined ? element.data.showSource : element.showSource) !== false && (element.data?.source || element.source) ? ', ' + (element.data?.source || element.source) : ''}
                </footer>
              ` : ''}
            </blockquote>
          </div>
        `;

      case 'list':
        const listType = element.data?.listType || element.listType || 'bulleted';
        const listTag = listType === 'numbered' ? 'ol' : 'ul';
        const items = element.data?.items || element.items || element.initialItems || ['Первый элемент', 'Второй элемент', 'Третий элемент'];
        
        // Применяем colorSettings если они есть
        const listColorSettings = element.colorSettings || element.data?.colorSettings || {};
        const listItemColor = listColorSettings.textFields?.item || (element.data?.itemColor || element.itemColor || '#333333');
        const listMarkerColor = listColorSettings.textFields?.marker || (element.data?.accentColor || element.accentColor || '#1976d2');
        
        // Определяем классы для стилизации
        const spacingClass = `spacing-${element.data?.spacing || element.spacing || 'normal'}`;
        let typeClass = '';
        
        if (listType === 'bulleted') {
          typeClass = `bullet-${element.data?.bulletStyle || element.bulletStyle || 'circle'}`;
        } else if (listType === 'numbered') {
          typeClass = `number-${element.data?.numberStyle || element.numberStyle || 'decimal'}`;
        }
        
        // Определяем отступы для разных типов spacing
        const spacingMap = {
          compact: '0.25rem',
          normal: '0.5rem',
          relaxed: '1rem',
          loose: '1.5rem'
        };
        const itemSpacing = spacingMap[element.data?.spacing || element.spacing] || '0.5rem';
        
        // Стили контейнера с фоном
        let listContainerStyles = `margin: 1.5rem 0; padding: 0;`;
        
        if (listColorSettings.sectionBackground?.enabled) {
          const { sectionBackground } = listColorSettings;
          if (sectionBackground.useGradient) {
            listContainerStyles += ` background: linear-gradient(${sectionBackground.gradientDirection}, ${sectionBackground.gradientColor1}, ${sectionBackground.gradientColor2});`;
          } else {
            listContainerStyles += ` background-color: ${sectionBackground.solidColor};`;
          }
          listContainerStyles += ` opacity: ${sectionBackground.opacity || 1};`;
        }
        
        // Применяем дополнительные настройки
        if (listColorSettings) {
          if (listColorSettings.borderColor) {
            listContainerStyles += ` border: ${listColorSettings.borderWidth || 1}px solid ${listColorSettings.borderColor};`;
          }
          if (listColorSettings.borderRadius !== undefined) {
            listContainerStyles += ` border-radius: ${listColorSettings.borderRadius}px;`;
          }
          if (listColorSettings.padding !== undefined) {
            listContainerStyles += ` padding: ${listColorSettings.padding}px;`;
          }
          if (listColorSettings.boxShadow) {
            listContainerStyles += ` box-shadow: 0 2px 8px rgba(0,0,0,0.1);`;
          }
        }
        
        // Функции для получения маркеров (аналогично ListComponent)
        const getBulletIcon = (style) => {
          const bulletConfig = {
            'circle': '●',
            'square': '■', 
            'arrow': '→',
            'dash': '–',
            'dot': '•'
          };
          return bulletConfig[style] || '●';
        };

        const getNumberPrefix = (index, style) => {
          switch (style) {
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
        
        return `
          <div id="${elementId}" class="content-element list ${spacingClass} ${typeClass}" style="${listContainerStyles}">
            ${(element.data?.title || element.title) ? `
              <h3 style="
                margin: 0 0 1rem 0;
                color: ${listColorSettings.textFields?.title || (element.data?.titleColor || element.titleColor || '#333333')};
                font-size: ${element.data?.titleFontSize || element.titleFontSize || '1.25rem'};
                font-weight: ${element.data?.titleFontWeight || element.titleFontWeight || 'bold'};
              ">${element.data?.title || element.title}</h3>
            ` : ''}
            <div style="
              color: ${listItemColor};
              line-height: 1.6;
              font-family: ${element.data?.fontFamily || element.fontFamily || 'inherit'};
              font-size: ${element.data?.fontSize || element.fontSize || 'inherit'};
            ">
              ${items.map((item, index) => `
                <div style="
                  display: flex;
                  align-items: flex-start;
                margin-bottom: ${itemSpacing};
                ">
                  <span style="
                    color: ${listMarkerColor};
                    margin-right: 8px;
                    font-weight: bold;
                    min-width: 24px;
                    font-size: ${listType === 'numbered' ? 'inherit' : '18px'};
                    line-height: 1.6;
                  ">
                    ${listType === 'numbered' ? 
                      getNumberPrefix(index, element.data?.numberStyle || element.numberStyle || 'decimal') : 
                      getBulletIcon(element.data?.bulletStyle || element.bulletStyle || 'circle')}
                  </span>
                  <span style="
                    color: ${listItemColor};
                    line-height: 1.6;
                    flex: 1;
                  ">${item}</span>
                </div>
              `).join('')}
            </div>
          </div>
        `;

      // Карточки
      case 'basic-card':
        // Получаем цвета из colorSettings
        const basicCardColorSettings = element.data?.colorSettings || element.colorSettings || {};
        const basicCardTitleColor = basicCardColorSettings.textFields?.cardTitle || basicCardColorSettings.textFields?.title || element.titleColor || '#1976d2';
        const basicCardContentColor = basicCardColorSettings.textFields?.cardText || basicCardColorSettings.textFields?.text || element.contentColor || '#666666';
        const basicCardBackgroundColor = basicCardColorSettings.textFields?.background || element.backgroundColor || '#ffffff';
        const basicCardBorderColor = basicCardColorSettings.textFields?.border || '#e0e0e0';
        
        // Стили контейнера из colorSettings
        let basicCardContainerStyles = `
            margin: 1.5rem 0;
            padding: 1.5rem;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        `;
        
        // Добавляем стили фона если включены
        if (basicCardColorSettings.sectionBackground?.enabled) {
          if (basicCardColorSettings.sectionBackground.useGradient) {
            basicCardContainerStyles += `
              background: linear-gradient(${basicCardColorSettings.sectionBackground.gradientDirection}, ${basicCardColorSettings.sectionBackground.gradientColor1}, ${basicCardColorSettings.sectionBackground.gradientColor2});
              opacity: ${basicCardColorSettings.sectionBackground.opacity || 1};
            `;
          } else {
            basicCardContainerStyles += `
              background-color: ${basicCardColorSettings.sectionBackground.solidColor};
              opacity: ${basicCardColorSettings.sectionBackground.opacity || 1};
            `;
          }
        } else {
          basicCardContainerStyles += `background: ${basicCardBackgroundColor};`;
        }
        
        // Добавляем стили границы и отступов
        if (basicCardColorSettings.borderColor) {
          basicCardContainerStyles += `
            border: ${basicCardColorSettings.borderWidth || 1}px solid ${basicCardColorSettings.borderColor};
            border-radius: ${basicCardColorSettings.borderRadius || 12}px;
          `;
        } else {
          basicCardContainerStyles += `border: 1px solid ${basicCardBorderColor};`;
        }
        
        if (basicCardColorSettings.padding) {
          basicCardContainerStyles += `padding: ${basicCardColorSettings.padding}px;`;
        }
        
        if (basicCardColorSettings.boxShadow) {
          basicCardContainerStyles += `box-shadow: 0 2px 8px rgba(0,0,0,0.1);`;
        }
        
        return `
          <div id="${elementId}" class="content-element basic-card" style="${basicCardContainerStyles} cursor: pointer;" onclick="openModal${elementId.replace(/-/g, '_')}()">
            <h3 style="
              color: ${basicCardTitleColor};
              margin: 0 0 1rem 0;
              font-size: 1.25rem;
              font-weight: bold;
              text-align: center;
            ">${element.title || 'Заголовок карточки'}</h3>
            <p style="
              color: ${basicCardContentColor};
              line-height: 1.5;
              margin: 0;
              text-align: center;
            ">${element.content || 'Содержание карточки'}</p>
          </div>
          
          <!-- 🔥 МОДАЛЬНОЕ ОКНО для базовой карточки -->
          <div id="modal-${elementId.replace(/-/g, '_')}" style="
            display: none;
            position: fixed;
            z-index: 1000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.5);
            backdrop-filter: blur(5px);
          ">
            <div style="
              position: relative;
              background-color: transparent;
              margin: 5% auto;
              padding: 0;
              width: 90%;
              max-width: 1200px;
              max-height: 90vh;
              overflow: auto;
              border-radius: 16px;
              box-shadow: none;
            ">
              <!-- Контент модального окна -->
              <div id="modal-content-${elementId.replace(/-/g, '_')}" style="
                background: ${basicCardColorSettings.sectionBackground?.enabled
                  ? (basicCardColorSettings.sectionBackground.useGradient
                      ? `linear-gradient(${basicCardColorSettings.sectionBackground.gradientDirection || 'to right'}, ${basicCardColorSettings.sectionBackground.gradientColor1 || '#ffffff'}, ${basicCardColorSettings.sectionBackground.gradientColor2 || '#f5f5f5'})`
                      : basicCardColorSettings.sectionBackground.solidColor || '#ffffff')
                  : basicCardBackgroundColor};
                border: ${basicCardColorSettings.borderColor ? `${basicCardColorSettings.borderWidth || 1}px solid ${basicCardColorSettings.borderColor}` : `1px solid ${basicCardBorderColor}`};
                border-radius: ${basicCardColorSettings.borderRadius || 12}px;
                padding: ${basicCardColorSettings.padding || 24}px;
                box-shadow: ${basicCardColorSettings.boxShadow ? '0 8px 32px rgba(0,0,0,0.15)' : '0 4px 12px rgba(0,0,0,0.1)'};
                opacity: ${basicCardColorSettings.sectionBackground?.opacity || 1};
              ">
                <h2 style="
                  color: ${basicCardTitleColor};
                  font-size: 28px;
                  margin-bottom: 16px;
                  font-weight: bold;
                  line-height: 1.3;
                  text-align: center;
                ">${element.title || 'Заголовок карточки'}</h2>
                <div style="
                  color: ${basicCardContentColor};
                  font-size: 16px;
                  line-height: 1.6;
                  text-align: center;
                ">${element.content || 'Содержание карточки'}</div>
              </div>
            </div>
          </div>
          
          <!-- 🔥 JAVASCRIPT для модального окна базовой карточки -->
          <script>
            // Функция открытия модального окна
            function openModal${elementId.replace(/-/g, '_')}() {
              console.log('🔥 [BasicCard Modal] openModal${elementId.replace(/-/g, '_')} вызвана');
              
              const modal = document.getElementById('modal-${elementId.replace(/-/g, '_')}');
              const modalContent = document.getElementById('modal-content-${elementId.replace(/-/g, '_')}');
              
              console.log('🔥 [BasicCard Modal] Найденные элементы:', { modal, modalContent });
              
              if (modal && modalContent) {
                console.log('🔥 [BasicCard Modal] Элементы найдены, показываем модальное окно...');
                
                modal.style.display = 'block';
                
                // Анимация появления
                modalContent.style.opacity = '0';
                modalContent.style.transform = 'scale(0.9)';
                modalContent.style.transition = 'all 0.3s ease';
                
                setTimeout(() => {
                  modalContent.style.opacity = '1';
                  modalContent.style.transform = 'scale(1)';
                  console.log('🔥 [BasicCard Modal] Модальное окно успешно открыто!');
                }, 10);
              } else {
                console.error('🔥 [BasicCard Modal] ОШИБКА: Элементы модального окна не найдены!');
                console.error('🔥 [BasicCard Modal] modal:', modal);
                console.error('🔥 [BasicCard Modal] modalContent:', modalContent);
                console.error('🔥 [BasicCard Modal] elementId:', '${elementId}');
              }
            }
            
            // Функция закрытия модального окна
            function closeModal${elementId.replace(/-/g, '_')}() {
              const modal = document.getElementById('modal-${elementId.replace(/-/g, '_')}');
              const modalContent = document.getElementById('modal-content-${elementId.replace(/-/g, '_')}');
              
              if (modal && modalContent) {
                // Анимация исчезновения
                modalContent.style.opacity = '0';
                modalContent.style.transform = 'scale(0.9)';
                
                setTimeout(() => {
                  modal.style.display = 'none';
                }, 300);
              }
            }
            
            // Закрытие по клику вне модального окна
            document.getElementById('modal-${elementId.replace(/-/g, '_')}').addEventListener('click', function(e) {
              if (e.target === this) {
                closeModal${elementId.replace(/-/g, '_')}();
              }
            });
            
            // Закрытие по Escape
            document.addEventListener('keydown', function(e) {
              if (e.key === 'Escape') {
                closeModal${elementId.replace(/-/g, '_')}();
              }
            });
            
            // 🔥 ИСПРАВЛЕНИЕ: Ждем загрузки DOM перед добавлением обработчиков
            if (document.readyState === 'loading') {
              document.addEventListener('DOMContentLoaded', function() {
                const modal = document.getElementById('modal-${elementId.replace(/-/g, '_')}');
                if (modal) {
                  modal.addEventListener('click', function(e) {
                    if (e.target === this) {
                      closeModal${elementId.replace(/-/g, '_')}();
                    }
                  });
                }
              });
            } else {
              // DOM уже загружен
              const modal = document.getElementById('modal-${elementId.replace(/-/g, '_')}');
              if (modal) {
                modal.addEventListener('click', function(e) {
                  if (e.target === this) {
                    closeModal${elementId.replace(/-/g, '_')}();
                  }
                });
              }
            }
          </script>
        `;

      case 'image-card':
        // Получаем цвета из colorSettings
        const imageCardColorSettings = element.data?.colorSettings || element.colorSettings || {};
        const imageCardTitleColor = imageCardColorSettings.textFields?.title || element.titleColor || '#1976d2';
        const imageCardContentColor = imageCardColorSettings.textFields?.text || element.contentColor || '#666666';
        const imageCardBackgroundColor = imageCardColorSettings.textFields?.background || 'white';
        const imageCardBorderColor = imageCardColorSettings.textFields?.border || '#e0e0e0';
        
        // Стили контейнера из colorSettings
        let imageCardContainerStyles = `
            margin: 1.5rem 0;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            overflow: hidden;
        `;
        
        // Добавляем стили фона если включены
        if (imageCardColorSettings.sectionBackground?.enabled) {
          if (imageCardColorSettings.sectionBackground.useGradient) {
            imageCardContainerStyles += `
              background: linear-gradient(${imageCardColorSettings.sectionBackground.gradientDirection}, ${imageCardColorSettings.sectionBackground.gradientColor1}, ${imageCardColorSettings.sectionBackground.gradientColor2});
              opacity: ${imageCardColorSettings.sectionBackground.opacity || 1};
            `;
          } else {
            imageCardContainerStyles += `
              background-color: ${imageCardColorSettings.sectionBackground.solidColor};
              opacity: ${imageCardColorSettings.sectionBackground.opacity || 1};
            `;
          }
        } else {
          imageCardContainerStyles += `background: ${imageCardBackgroundColor};`;
        }
        
        // Добавляем стили границы и отступов
        if (imageCardColorSettings.borderColor) {
          imageCardContainerStyles += `
            border: ${imageCardColorSettings.borderWidth || 1}px solid ${imageCardColorSettings.borderColor};
            border-radius: ${imageCardColorSettings.borderRadius || 12}px;
          `;
        } else {
          imageCardContainerStyles += `border: 1px solid ${imageCardBorderColor};`;
        }
        
        if (imageCardColorSettings.padding) {
          imageCardContainerStyles += `padding: ${imageCardColorSettings.padding}px;`;
        }
        
        if (imageCardColorSettings.boxShadow) {
          imageCardContainerStyles += `box-shadow: 0 2px 8px rgba(0,0,0,0.1);`;
        }
        
        // Стили для изображения
        const imageStyles = `
          width: 100%;
          height: 200px;
          object-fit: cover;
          filter: ${imageCardColorSettings.imageFilter || 'none'};
          opacity: ${imageCardColorSettings.imageOpacity || 1};
        `;
        
        // 🔥 ВЫНЕСЛИ НАРУЖУ: Определяем правильный путь к изображению для экспорта
        // Проверяем, что это не заглушка
        const isPlaceholder = element.imageUrl && (
          element.imageUrl.includes('placeholder') || 
          element.imageUrl.includes('via.placeholder') || 
          element.imageUrl.includes('text=Изображение')
        );
        const shouldShowImage = element.imageUrl && element.imageUrl.trim() && !isPlaceholder;
        
        console.log(`🖼️ EditorPanel image check: imageUrl="${element.imageUrl}", isPlaceholder=${isPlaceholder}, shouldShow=${shouldShowImage}`);
        
        // Определяем правильный путь к изображению для экспорта
        let finalImageSrc = 'assets/images/placeholder.svg';
        
        // Проверяем глобальный маппинг экспортированных изображений
        console.log(`🖼️ EditorPanel checking mapping for element.id: ${element.id}, sectionId: ${currentSectionId}`);
        console.log(`🖼️ EditorPanel window.cardImageFileMap exists:`, !!window.cardImageFileMap);
        console.log(`🖼️ EditorPanel window.cardImageFileMap size:`, window.cardImageFileMap ? window.cardImageFileMap.size : 0);
        
        if (window.cardImageFileMap && element.id && currentSectionId) {
          // ПРИОРИТЕТ 1: Пытаемся найти по uniqueKey формата "cardId__SECTION__sectionId"
          const uniqueKey = `${element.id}__SECTION__${currentSectionId}`;
          const exportedFileName = window.cardImageFileMap.get(uniqueKey);
          if (exportedFileName) {
            finalImageSrc = `assets/images/${exportedFileName}`;
            console.log(`🖼️ EditorPanel using exported file from uniqueKey: ${finalImageSrc} (uniqueKey: ${uniqueKey})`);
          } else {
            // ПРИОРИТЕТ 2: Пытаемся найти по ID элемента (для обратной совместимости)
            const fallbackFileName = window.cardImageFileMap.get(element.id);
            if (fallbackFileName) {
              finalImageSrc = `assets/images/${fallbackFileName}`;
              console.log(`🖼️ EditorPanel using exported file from elementId: ${finalImageSrc} (elementId: ${element.id})`);
            } else {
              console.log(`🖼️ EditorPanel no mapping found for uniqueKey: ${uniqueKey} or elementId: ${element.id}`);
              console.log(`🖼️ EditorPanel available mapping keys:`, Array.from(window.cardImageFileMap.keys()));
              
              // ПРИОРИТЕТ 3: Попробуем найти по pattern matching
              for (const [key, fileName] of window.cardImageFileMap.entries()) {
                if (key.includes(element.id) && key.includes(currentSectionId)) {
                  finalImageSrc = `assets/images/${fileName}`;
                  console.log(`🖼️ EditorPanel found by pattern matching: ${finalImageSrc} (key: ${key})`);
                  break;
                }
              }
            }
          }
        } else if (window.cardImageFileMap && element.id) {
          // Fallback если нет currentSectionId
          const exportedFileName = window.cardImageFileMap.get(element.id);
          if (exportedFileName) {
            finalImageSrc = `assets/images/${exportedFileName}`;
            console.log(`🖼️ EditorPanel using exported file (no sectionId): ${finalImageSrc} (elementId: ${element.id})`);
          }
        }
        
        // Fallback логика если не нашли в маппинге
        if (finalImageSrc === 'assets/images/placeholder.svg') {
          if (element.fileName && element.fileName.startsWith('card_')) {
            // Используем fileName если он есть и это карточка
            finalImageSrc = `assets/images/${element.fileName}`;
            console.log(`🖼️ EditorPanel using fileName: ${finalImageSrc}`);
          } else if (element.imageUrl && !isPlaceholder) {
            // Если нет fileName но есть imageUrl и это не placeholder
            if (element.imageUrl.startsWith('blob:')) {
              // Для blob URL пытаемся найти соответствующий экспортированный файл
              console.log(`🖼️ EditorPanel found blob URL, using placeholder for now: ${element.imageUrl}`);
              // В будущем здесь можно добавить логику поиска по метаданным
            } else {
              // Внешний URL - используем как есть
              finalImageSrc = element.imageUrl;
              console.log(`🖼️ EditorPanel using external URL: ${finalImageSrc}`);
            }
          }
        }
        
        console.log(`🖼️ EditorPanel FINAL IMAGE SRC: ${finalImageSrc}`);

        return `
          <div id="${elementId}" class="content-element image-card" style="${imageCardContainerStyles} cursor: pointer;" onclick="openModal${elementId.replace(/-/g, '_')}()">
            ${(() => {
              
              // Всегда показываем контейнер изображения для правильной структуры
              return `
                <div class="service-image" style="
                  width: 100%;
                  height: 200px;
                  overflow: hidden;
                  border-radius: ${imageCardColorSettings.borderRadius || 12}px;
                  margin-bottom: 1rem;
                ">
                  <img src="${finalImageSrc}" alt="${element.imageAlt || ''}" style="${imageStyles}">
                </div>
              `;
            })()}
            <div style="padding: ${imageCardColorSettings.padding || 24}px;">
              <h3 style="
                color: ${imageCardTitleColor};
                margin: 0 0 1rem 0;
                font-size: 1.25rem;
                font-weight: bold;
                text-align: center;
              ">${element.title || 'Заголовок карточки'}</h3>
              <p style="
                color: ${imageCardContentColor};
                line-height: 1.5;
                margin: 0;
                text-align: center;
              ">${element.content || 'Описание изображения'}</p>
            </div>
          </div>
          
          <!-- 🔥 МОДАЛЬНОЕ ОКНО для карточки с изображением -->
          <div id="modal-${elementId.replace(/-/g, '_')}" style="
            display: none;
            position: fixed;
            z-index: 1000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.5);
            backdrop-filter: blur(5px);
            justify-content: center;
            align-items: center;
          ">
            <div style="
              position: relative;
              background-color: transparent;
              margin: 5% auto;
              padding: 0;
              width: auto;
              max-width: 90vw;
              max-height: 90vh;
              overflow: auto;
              border-radius: 16px;
              box-shadow: none;
              display: inline-block;
            ">
              <!-- Контент модального окна -->
              <div id="modal-content-${elementId.replace(/-/g, '_')}" style="
                background: ${imageCardColorSettings.sectionBackground?.enabled
                  ? (imageCardColorSettings.sectionBackground.useGradient
                      ? `linear-gradient(${imageCardColorSettings.sectionBackground.gradientDirection || 'to right'}, ${imageCardColorSettings.sectionBackground.gradientColor1 || '#ffffff'}, ${imageCardColorSettings.sectionBackground.gradientColor2 || '#f5f5f5'})`
                      : imageCardColorSettings.sectionBackground.solidColor || '#ffffff')
                  : imageCardBackgroundColor};
                border: ${imageCardColorSettings.borderColor ? `${imageCardColorSettings.borderWidth || 1}px solid ${imageCardColorSettings.borderColor}` : `1px solid ${imageCardBorderColor}`};
                border-radius: ${imageCardColorSettings.borderRadius || 12}px;
                padding: ${imageCardColorSettings.padding || 24}px;
                box-shadow: ${imageCardColorSettings.boxShadow ? '0 8px 32px rgba(0,0,0,0.15)' : '0 4px 12px rgba(0,0,0,0.1)'};
                opacity: ${imageCardColorSettings.sectionBackground?.opacity || 1};
                width: auto;
                max-width: 90vw;
                max-height: 90vh;
                overflow: auto;
              ">
                ${finalImageSrc && finalImageSrc !== 'assets/images/placeholder.svg' ? `
                  <div id="modal-image-container-${elementId.replace(/-/g, '_')}" style="
                    width: 100%;
                    margin-bottom: 24px;
                    border-radius: ${imageCardColorSettings.borderRadius || 12}px;
                    overflow: hidden;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                  ">
                    <img id="modal-image-${elementId.replace(/-/g, '_')}" src="${finalImageSrc}" alt="${element.imageAlt || ''}" style="
                      max-width: calc(90vw - 48px);
                      max-height: calc(80vh - 150px);
                      width: auto;
                      height: auto;
                      object-fit: contain;
                      cursor: zoom-in;
                      transition: transform 0.3s ease;
                      border-radius: ${imageCardColorSettings.borderRadius || 12}px;
                      display: block;
                    " onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'">
                  </div>
                ` : ''}
                <h2 style="
                  color: ${imageCardTitleColor};
                  font-size: 28px;
                  margin-bottom: 16px;
                  font-weight: bold;
                  line-height: 1.3;
                  text-align: center;
                ">${element.title || 'Заголовок карточки'}</h2>
                <div style="
                  color: ${imageCardContentColor};
                  font-size: 16px;
                  line-height: 1.6;
                  text-align: center;
                ">${element.content || 'Описание изображения'}</div>
              </div>
            </div>
          </div>
          
          <!-- 🔥 JAVASCRIPT для модального окна карточки с изображением -->
          <script>
            // Функция открытия модального окна
            function openModal${elementId.replace(/-/g, '_')}() {
              console.log('🔥 [ImageCard Modal] openModal${elementId.replace(/-/g, '_')} вызвана');
              
              const modal = document.getElementById('modal-${elementId.replace(/-/g, '_')}');
              const modalContent = document.getElementById('modal-content-${elementId.replace(/-/g, '_')}');
              
              console.log('🔥 [ImageCard Modal] Найденные элементы:', { modal, modalContent });
              
              if (modal && modalContent) {
                console.log('🔥 [ImageCard Modal] Элементы найдены, показываем модальное окно...');
                
                modal.style.display = 'flex';
                
                // Анимация появления
                modalContent.style.opacity = '0';
                modalContent.style.transform = 'scale(0.9)';
                modalContent.style.transition = 'all 0.3s ease';
                
                setTimeout(() => {
                  modalContent.style.opacity = '1';
                  modalContent.style.transform = 'scale(1)';
                  console.log('🔥 [ImageCard Modal] Модальное окно успешно открыто!');
                }, 10);
              } else {
                console.error('🔥 [ImageCard Modal] ОШИБКА: Элементы модального окна не найдены!');
                console.error('🔥 [ImageCard Modal] modal:', modal);
                console.error('🔥 [ImageCard Modal] modalContent:', modalContent);
                console.error('🔥 [ImageCard Modal] elementId:', '${elementId}');
              }
            }
            
            // Функция закрытия модального окна
            function closeModal${elementId.replace(/-/g, '_')}() {
              const modal = document.getElementById('modal-${elementId.replace(/-/g, '_')}');
              const modalContent = document.getElementById('modal-content-${elementId.replace(/-/g, '_')}');
              
              if (modal && modalContent) {
                // Анимация исчезновения
                modalContent.style.opacity = '0';
                modalContent.style.transform = 'scale(0.9)';
                
                setTimeout(() => {
                  modal.style.display = 'none';
                }, 300);
              }
            }
            
            // Закрытие по клику вне модального окна
            document.getElementById('modal-${elementId.replace(/-/g, '_')}').addEventListener('click', function(e) {
              if (e.target === this) {
                closeModal${elementId.replace(/-/g, '_')}();
              }
            });
            
            // Закрытие по Escape
            document.addEventListener('keydown', function(e) {
              if (e.key === 'Escape') {
                closeModal${elementId.replace(/-/g, '_')}();
              }
            });
            
            // 🔥 ИСПРАВЛЕНИЕ: Ждем загрузки DOM перед добавлением обработчиков
            if (document.readyState === 'loading') {
              document.addEventListener('DOMContentLoaded', function() {
                const modal = document.getElementById('modal-${elementId.replace(/-/g, '_')}');
                if (modal) {
                  modal.addEventListener('click', function(e) {
                    if (e.target === this) {
                      closeModal${elementId.replace(/-/g, '_')}();
                    }
                  });
                }
              });
            } else {
              // DOM уже загружен
              const modal = document.getElementById('modal-${elementId.replace(/-/g, '_')}');
              if (modal) {
                modal.addEventListener('click', function(e) {
                  if (e.target === this) {
                    closeModal${elementId.replace(/-/g, '_')}();
                  }
                });
              }
            }
          </script>
        `;

      // Интерактивные элементы
      case 'video-player':
        const videoId = element.videoUrl ? element.videoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|vimeo\.com\/)([^&\n?#]+)/) : null;
        const embedUrl = videoId ? 
          (element.videoUrl.includes('youtube') ? `https://www.youtube.com/embed/${videoId[1]}` : 
           element.videoUrl.includes('vimeo') ? `https://player.vimeo.com/video/${videoId[1]}` : element.videoUrl) : '';
        
        return `
          <div id="${elementId}" class="content-element video-player" style="
            margin: 2rem 0;
            text-align: center;
          ">
            <h3 style="
              color: #333333;
              margin-bottom: 1rem;
              font-size: 1.3rem;
            ">${element.title || 'Видео'}</h3>
            <div style="
              position: relative;
              padding-bottom: 56.25%;
              height: 0;
              overflow: hidden;
              width: 100%;
              max-width: ${element.width || 560}px;
              margin: 0 auto;
              background: #000;
              border-radius: 8px;
            ">
              ${embedUrl ? `
                <iframe src="${embedUrl}" style="
                  position: absolute;
                  top: 0;
                  left: 0;
                  width: 100%;
                  height: 100%;
                  border: 0;
                  border-radius: 8px;
                " allowfullscreen></iframe>
              ` : `
                <div style="
                  position: absolute;
                  top: 0;
                  left: 0;
                  width: 100%;
                  height: 100%;
                  background: linear-gradient(45deg, #333, #666);
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  color: white;
                  font-size: 1.2rem;
                  border-radius: 8px;
                ">
                  📹 Добавьте URL видео
                </div>
              `}
            </div>
          </div>
        `;

      case 'qr-code':
        // 🔥 ИСПРАВЛЕНИЕ: Используем ТОЛЬКО colorSettings (как в blockquote)
        const qrColorSettings = element.colorSettings || element.data?.colorSettings || {};
        const qrTitleColor = qrColorSettings.textFields?.title || '#333333';
        const qrBackgroundColor = qrColorSettings.textFields?.background || '#ffffff';
        const qrForegroundColor = qrColorSettings.textFields?.foreground || '#000000';
        
        return `
          <div id="${elementId}" class="content-element qr-code" style="
            margin: 2rem 0;
            text-align: center;
            background: ${qrColorSettings.sectionBackground?.enabled
              ? (qrColorSettings.sectionBackground.useGradient
                  ? `linear-gradient(${qrColorSettings.sectionBackground.gradientDirection || 'to right'}, ${qrColorSettings.sectionBackground.gradientColor1 || '#ffffff'}, ${qrColorSettings.sectionBackground.gradientColor2 || '#f8f9fa'})`
                  : qrColorSettings.sectionBackground.solidColor || '#ffffff')
              : qrBackgroundColor};
            border: ${qrColorSettings.borderColor ? `${qrColorSettings.borderWidth || 1}px solid ${qrColorSettings.borderColor}` : 'none'};
            border-radius: ${qrColorSettings.borderRadius || 12}px;
            padding: ${qrColorSettings.padding || 24}px;
            box-shadow: ${qrColorSettings.boxShadow ? '0 4px 12px rgba(0,0,0,0.1)' : '0 2px 8px rgba(0,0,0,0.1)'};
            opacity: ${qrColorSettings.sectionBackground?.opacity || 1};
          ">
            <h3 style="
              color: ${qrTitleColor};
              margin-bottom: 1rem;
              font-size: 1.3rem;
              text-align: center;
            ">${element.title || 'Сканируйте QR код'}</h3>
            <div style="
              display: inline-block;
              padding: 1rem;
              background: ${qrBackgroundColor};
              border-radius: 12px;
              box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            ">
              <div style="
                width: ${element.size || 200}px;
                height: ${element.size || 200}px;
                border: 2px solid ${qrForegroundColor};
                border-radius: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 0.8rem;
                color: ${qrForegroundColor};
                background: white;
                position: relative;
                overflow: hidden;
              ">
                <div style="
                  position: absolute;
                  top: 10px;
                  left: 10px;
                  right: 10px;
                  bottom: 10px;
                  background: repeating-linear-gradient(
                    90deg,
                    ${qrForegroundColor} 0px,
                    ${qrForegroundColor} 2px,
                    transparent 2px,
                    transparent 4px
                  );
                  opacity: 0.3;
                "></div>
                <span style="
                  position: relative;
                  z-index: 1;
                  background: white;
                  padding: 5px;
                  border-radius: 4px;
                  font-size: 10px;
                  text-align: center;
                  max-width: 80%;
                  word-break: break-all;
                ">
                  ${element.qrText || 'https://example.com'}
                </span>
              </div>
            </div>
          </div>
        `;
      case 'rating':
        console.log('⭐ [RATING EXPORT - EditorPanel] element:', element);
        
        // 🔥 ИСПРАВЛЕНИЕ: Используем ТОЛЬКО colorSettings (как в blockquote)
        const ratingColorSettings = element.colorSettings || element.data?.colorSettings || {};
        console.log('⭐ [RATING EXPORT - EditorPanel] ratingColorSettings:', ratingColorSettings);
        
        // Получаем цвета с приоритетом на ColorSettings
        const ratingTitleColor = ratingColorSettings.textFields?.title || '#ffd700';
        const ratingTextColor = ratingColorSettings.textFields?.text || '#ffffff';
        const ratingStarColor = ratingColorSettings.textFields?.star || '#ffc107';
        const ratingEmptyStarColor = ratingColorSettings.textFields?.emptyStar || '#e0e0e0';
        
        // Получаем данные рейтинга с поддержкой разных форматов
        const maxRating = element.maxRating || element.data?.maxRating || 5;
        const currentRating = element.rating || element.data?.rating || 5;
        const ratingTitle = element.title || element.data?.title || 'Рейтинг';
        const ratingLabel = element.label || element.data?.label || 'Оцените наш сервис:';
        
        console.log('⭐ [RATING EXPORT - EditorPanel] Rating data:', { maxRating, currentRating, ratingTitle, ratingLabel });
        console.log('⭐ [RATING EXPORT - EditorPanel] Interactive setting:', element.interactive);
        console.log('⭐ [RATING EXPORT - EditorPanel] Original elementId:', elementId);
        console.log('⭐ [RATING EXPORT - EditorPanel] Decimal rating support:', { 
          floor: Math.floor(currentRating), 
          ceil: Math.ceil(currentRating), 
          decimal: currentRating % 1,
          hasPartial: currentRating % 1 > 0
        });
        
        // Генерируем звезды рейтинга с возможностью выбора
        const isInteractive = element.interactive !== false;
        
        // 🔥 ИСПРАВЛЕНИЕ: Создаем безопасное имя для функций
        const safeElementId = elementId.replace(/[^a-zA-Z0-9_]/g, '_');
        console.log('⭐ [RATING EXPORT - EditorPanel] Safe elementId:', safeElementId);
        
        // 🔥 ИСПРАВЛЕНИЕ: Поддержка дробных рейтингов (например, 4.3)
        const ratingStars = Array(maxRating).fill(0).map((_, i) => {
          const starIndex = i + 1;
          const starRating = starIndex;
          
          // Определяем состояние звезды для дробных рейтингов
          let starState = 'empty';
          let starColor = ratingEmptyStarColor;
          
          if (starRating <= Math.floor(currentRating)) {
            // Полностью заполненная звезда
            starState = 'filled';
            starColor = ratingStarColor;
          } else if (starRating === Math.ceil(currentRating) && currentRating % 1 > 0) {
            // Частично заполненная звезда (например, 4.3 -> 5-я звезда частично заполнена)
            starState = 'partial';
            starColor = ratingStarColor;
          }
          
          return `<span 
            class="rating-star ${starState}" 
            data-rating="${starIndex}"
            data-state="${starState}"
            style="
              color: ${starColor}; 
              font-size: 3rem; 
              margin: 0 8px; 
              cursor: ${isInteractive ? 'pointer' : 'default'};
              transition: all 0.3s ease;
              display: inline-block;
              user-select: none;
              position: relative;
            "
            onmouseover="${isInteractive ? `window.hoverRating_${safeElementId}(${starIndex}, ${maxRating}, '${ratingStarColor}');` : ''}"
            onmouseout="${isInteractive ? `window.resetHoverRating_${safeElementId}(${currentRating}, '${ratingStarColor}', '${ratingEmptyStarColor}');` : ''}"
            onclick="${isInteractive ? `window.updateRating_${safeElementId}(${starIndex}, ${maxRating})` : ''}"
          >★</span>`;
        }).join('');
        
        // Применяем стили фона из ColorSettings
        const backgroundColor = ratingColorSettings.sectionBackground?.enabled
          ? (ratingColorSettings.sectionBackground.useGradient
              ? `linear-gradient(${ratingColorSettings.sectionBackground.gradientDirection || 'to right'}, ${ratingColorSettings.sectionBackground.gradientColor1 || 'rgba(0,0,0,0.85)'}, ${ratingColorSettings.sectionBackground.gradientColor2 || 'rgba(0,0,0,0.75)'})`
              : ratingColorSettings.sectionBackground.solidColor || 'rgba(0,0,0,0.85)')
          : 'rgba(0,0,0,0.85)';
        
        return `
          <div id="${elementId}" class="content-element rating" style="
            width: 100%;
            max-width: 100%;
            margin: 2rem 0;
            text-align: center;
            padding: ${ratingColorSettings.padding || 32}px;
            background: ${backgroundColor};
            border: ${ratingColorSettings.borderColor ? `${ratingColorSettings.borderWidth || 2}px solid ${ratingColorSettings.borderColor}` : `2px solid ${ratingStarColor}`};
            border-radius: ${ratingColorSettings.borderRadius || 16}px;
            box-shadow: ${ratingColorSettings.boxShadow ? '0 8px 32px rgba(0,0,0,0.3)' : '0 4px 16px rgba(0,0,0,0.2)'};
            opacity: ${ratingColorSettings.sectionBackground?.opacity || 1};
            transition: all 0.3s ease;
          ">
            <style>
              .rating-star {
                filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
                text-shadow: 0 2px 4px rgba(0,0,0,0.5);
                transition: all 0.3s ease;
              }
              .rating-star:hover {
                filter: drop-shadow(0 4px 8px rgba(0,0,0,0.4));
                text-shadow: 0 4px 8px rgba(0,0,0,0.6);
                z-index: 10;
              }
              #rating-display-${elementId} {
                transition: all 0.3s ease;
              }
              .rating-star[data-rating] {
                position: relative;
              }
              
              /* 🔥 Стили для частично заполненных звезд */
              .rating-star.partial {
                position: relative;
                overflow: hidden;
              }
              
              .rating-star.partial::before {
                content: '★';
                position: absolute;
                top: 0;
                left: 0;
                color: ${ratingEmptyStarColor};
                z-index: 1;
              }
              
              .rating-star.partial::after {
                content: '★';
                position: absolute;
                top: 0;
                left: 0;
                color: ${ratingStarColor};
                z-index: 2;
                clip-path: polygon(0 0, var(--partial-width, 30%) 0, var(--partial-width, 30%) 100%, 0 100%);
              }
            </style>
            ${(element.showTitle !== false && ratingTitle) ? `
              <h3 style="
                color: ${ratingTitleColor};
                margin-bottom: 1rem;
                font-size: 1.8rem;
                font-weight: bold;
                text-align: center;
                margin: 0 0 1rem 0;
                line-height: 1.4;
              ">${ratingTitle}</h3>
            ` : ''}
            
            ${(element.showLabel !== false && ratingLabel) ? `
              <p style="
                color: ${ratingTextColor};
                margin-bottom: 1.5rem;
                font-size: 1.1rem;
                text-align: center;
                margin: 0 0 1.5rem 0;
                line-height: 1.5;
                opacity: 0.9;
              ">${ratingLabel}</p>
            ` : ''}
            
            <div style="
              margin-bottom: 1.5rem;
              display: flex;
              justify-content: center;
              align-items: center;
              flex-wrap: wrap;
              gap: 12px;
              padding: 20px;
              background: rgba(255,255,255,0.05);
              border-radius: 16px;
              backdrop-filter: blur(10px);
            ">
              ${ratingStars}
            </div>
            
            <div style="
              color: ${ratingTextColor};
              font-size: 1.1rem;
              font-weight: 500;
              background: rgba(255,255,255,0.1);
              padding: 8px 16px;
              border-radius: 20px;
              display: inline-block;
              backdrop-filter: blur(10px);
            ">
              <span id="rating-display-${elementId}">${currentRating}</span> из ${maxRating}
            </div>
          </div>
          
          <!-- 🔥 JAVASCRIPT для интерактивного рейтинга -->
          <script>
            // Глобальные функции для рейтинга (должны быть доступны везде)
            window.hoverRating_${safeElementId} = function(hoverRating, maxRating, starColor) {
              const stars = document.querySelectorAll('.rating-star');
              console.log('⭐ [Rating Export] Hover rating:', hoverRating, 'maxRating:', maxRating);
              
              stars.forEach((star, index) => {
                const starRating = index + 1;
                const starElement = star;
                
                if (starRating <= hoverRating) {
                  starElement.style.color = starColor;
                  starElement.style.transform = 'scale(1.1)';
                  
                  // Убираем частичное заполнение при hover
                  starElement.classList.remove('partial');
                  starElement.classList.add('filled');
                } else {
                  starElement.style.color = '${ratingEmptyStarColor}';
                  starElement.style.transform = 'scale(1)';
                  
                  // Убираем все классы состояния при hover
                  starElement.classList.remove('filled', 'partial');
                  starElement.classList.add('empty');
                }
              });
            };
            
            window.resetHoverRating_${safeElementId} = function(currentRating, starColor, emptyStarColor) {
              const stars = document.querySelectorAll('.rating-star');
              
              stars.forEach((star, index) => {
                const starRating = index + 1;
                const starElement = star;
                
                // Убираем hover эффекты
                starElement.style.transform = 'scale(1)';
                
                // Восстанавливаем правильное состояние звезды
                if (starRating <= Math.floor(window.currentRating_${safeElementId})) {
                  // Полностью заполненная звезда
                  starElement.style.color = starColor;
                  starElement.classList.remove('partial');
                  starElement.classList.add('filled');
                  starElement.setAttribute('data-state', 'filled');
                } else if (starRating === Math.ceil(window.currentRating_${safeElementId}) && window.currentRating_${safeElementId} % 1 > 0) {
                  // Частично заполненная звезда
                  starElement.style.color = starColor;
                  starElement.classList.remove('filled', 'empty');
                  starElement.classList.add('partial');
                  starElement.setAttribute('data-state', 'partial');
                  
                  // Восстанавливаем clip-path
                  const partialPercentage = (window.currentRating_${safeElementId} % 1) * 100;
                  starElement.style.setProperty('--partial-width', partialPercentage + '%');
                } else {
                  // Пустая звезда
                  starElement.style.color = emptyStarColor;
                  starElement.classList.remove('filled', 'partial');
                  starElement.classList.add('empty');
                  starElement.setAttribute('data-state', 'empty');
                }
              });
            };
            
            window.updateRating_${safeElementId} = function(newRating, maxRating) {
              console.log('⭐ [Rating Export] updateRating called with:', newRating, 'maxRating:', maxRating);
              console.log('⭐ [Rating Export] Current rating before update:', window.currentRating_${safeElementId});
              
              const ratingDisplay = document.getElementById('rating-display-${elementId}');
              const stars = document.querySelectorAll('.rating-star');
              
              // Если кликнули на ту же звезду - снимаем выбор (рейтинг = 0)
              if (newRating === window.currentRating_${safeElementId}) {
                newRating = 0;
                console.log('⭐ [Rating Export] Same star clicked, resetting to 0');
              }
              
              // Обновляем глобальную переменную
              window.currentRating_${safeElementId} = newRating;
              console.log('⭐ [Rating Export] Updated currentRating_${safeElementId} to:', window.currentRating_${safeElementId});
              
              // Обновляем отображение рейтинга
              ratingDisplay.textContent = newRating;
              
              // 🔥 ИСПРАВЛЕНИЕ: Обновляем звезды с поддержкой дробных рейтингов
              stars.forEach((star, index) => {
                const starRating = index + 1;
                const starElement = star;
                
                // Убираем старые классы
                starElement.classList.remove('filled', 'partial', 'empty');
                
                if (starRating <= Math.floor(newRating)) {
                  // Полностью заполненная звезда
                  starElement.classList.add('filled');
                  starElement.style.color = '${ratingStarColor}';
                  starElement.setAttribute('data-state', 'filled');
                } else if (starRating === Math.ceil(newRating) && newRating % 1 > 0) {
                  // Частично заполненная звезда
                  starElement.classList.add('partial');
                  starElement.style.color = '${ratingStarColor}';
                  starElement.setAttribute('data-state', 'partial');
                  
                  // Обновляем clip-path для частичного заполнения
                  const partialPercentage = (newRating % 1) * 100;
                  starElement.style.setProperty('--partial-width', partialPercentage + '%');
                } else {
                  // Пустая звезда
                  starElement.classList.add('empty');
                  starElement.style.color = '${ratingEmptyStarColor}';
                  starElement.setAttribute('data-state', 'empty');
                }
              });
              
              // Анимация обновления
              ratingDisplay.style.transform = 'scale(1.2)';
              ratingDisplay.style.transition = 'transform 0.3s ease';
              setTimeout(() => {
                ratingDisplay.style.transform = 'scale(1)';
              }, 300);
              
              console.log('⭐ [Rating Export] Rating updated to:', newRating, 'Previous:', ${currentRating});
            };
            
            // Глобальная переменная для хранения текущего рейтинга
            window.currentRating_${safeElementId} = ${currentRating};
            
            // Инициализация при загрузке страницы
            document.addEventListener('DOMContentLoaded', function() {
              console.log('⭐ [Rating Export] Rating component initialized with rating:', ${currentRating}, 'interactive:', ${isInteractive});
              console.log('⭐ [Rating Export] Element ID:', '${elementId}', 'Safe ID:', '${safeElementId}');
              
              // Если рейтинг не интерактивный, убираем hover эффекты
              if (!${isInteractive}) {
                const stars = document.querySelectorAll('.rating-star');
                stars.forEach(star => {
                  star.style.cursor = 'default';
                  star.removeAttribute('onmouseover');
                  star.removeAttribute('onmouseout');
                  star.removeAttribute('onclick');
                });
                console.log('⭐ [Rating Export] Interactive disabled, removed event handlers');
              } else {
                console.log('⭐ [Rating Export] Interactive enabled, event handlers active');
              }
            });
          </script>
        `;
      case 'progress-bars':
        // 🔥 ИСПРАВЛЕНИЕ: Используем ТОЛЬКО colorSettings (как в blockquote)
        const progressColorSettings = element.colorSettings || element.data?.colorSettings || {};
        const progressTitleColor = progressColorSettings.textFields?.title || '#333333';
        const progressTextColor = progressColorSettings.textFields?.text || '#666666';
        const progressBackgroundColor = progressColorSettings.textFields?.background || '#e0e0e0';
        const progressBarColor = progressColorSettings.textFields?.progress || '#1976d2';
        
        const isCircular = element.variant === 'circular';
        const progressValue = element.value || 50;
        const radius = 50;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference - (progressValue / 100) * circumference;
        
        return `
          <div id="${elementId}" class="content-element progress-bars" style="
            margin: 2rem 0;
            text-align: center;
            padding: ${progressColorSettings.padding || 24}px;
            background: ${progressColorSettings.sectionBackground?.enabled
              ? (progressColorSettings.sectionBackground.useGradient
                  ? `linear-gradient(${progressColorSettings.sectionBackground.gradientDirection || 'to right'}, ${progressColorSettings.sectionBackground.gradientColor1 || '#ffffff'}, ${progressColorSettings.sectionBackground.gradientColor2 || '#f8f9fa'})`
                  : progressColorSettings.sectionBackground.solidColor || '#ffffff')
              : '#ffffff'};
            border: ${progressColorSettings.borderColor ? `${progressColorSettings.borderWidth || 1}px solid ${progressColorSettings.borderColor}` : 'none'};
            border-radius: ${progressColorSettings.borderRadius || 12}px;
            box-shadow: ${progressColorSettings.boxShadow ? '0 4px 12px rgba(0,0,0,0.1)' : '0 2px 8px rgba(0,0,0,0.1)'};
            opacity: ${progressColorSettings.sectionBackground?.opacity || 1};
          ">
            <h3 style="
              color: ${progressTitleColor};
              margin-bottom: 1rem;
              font-size: 1.3rem;
              text-align: center;
            ">${element.title || 'Прогресс'}</h3>
            <div style="
              max-width: 300px;
              margin: 0 auto;
            ">
              ${isCircular ? `
                <div style="
                  position: relative;
                  width: 120px;
                  height: 120px;
                  margin: 0 auto;
                ">
                  <svg width="120" height="120" style="
                    transform: rotate(-90deg);
                  ">
                    <circle cx="60" cy="60" r="50" fill="none" stroke="${progressBackgroundColor}" stroke-width="8"/>
                    <circle cx="60" cy="60" r="50" fill="none" stroke="${progressBarColor}" stroke-width="8" 
                            stroke-dasharray="${circumference}" stroke-dashoffset="${offset}" 
                            style="transition: stroke-dashoffset 0.5s ease;"/>
                  </svg>
                  <div style="
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    font-size: 1.2rem;
                    font-weight: bold;
                    color: ${progressBarColor};
                  ">
                    ${progressValue}%
                  </div>
                </div>
              ` : `
                <div style="
                  width: 100%;
                  height: 12px;
                  background: ${progressBackgroundColor};
                  border-radius: 6px;
                  overflow: hidden;
                  margin-bottom: 0.5rem;
                ">
                  <div style="
                    width: ${progressValue}%;
                    height: 100%;
                    background: ${progressBarColor};
                    border-radius: 6px;
                    transition: width 0.5s ease;
                  "></div>
                </div>
                <div style="
                  color: ${progressTextColor};
                  font-size: 0.9rem;
                  font-weight: 500;
                ">
                  ${progressValue}%
                </div>
              `}
            </div>
                     </div>
         `;

      // Дополнительные интерактивные элементы
      case 'accordion':
        console.log('🎵 [ACCORDION EXPORT - EditorPanel] element:', element);
        
        // 🔥 ИСПРАВЛЕНИЕ: Используем ТОЛЬКО colorSettings (как в blockquote)
        const accordionColorSettings = element.colorSettings || element.data?.colorSettings || {};
        console.log('🎵 [ACCORDION EXPORT - EditorPanel] accordionColorSettings:', accordionColorSettings);
        
        const accordionTitleColor = accordionColorSettings.textFields?.title || '#ffd700';
        const accordionContentColor = accordionColorSettings.textFields?.text || '#ffffff';
        const accordionBackgroundColor = accordionColorSettings.textFields?.background || 'rgba(0,0,0,0.85)';
        const accordionBorderColor = accordionColorSettings.textFields?.border || '#c41e3a';
        const accordionHoverColor = accordionColorSettings.textFields?.hover || 'rgba(196,30,58,0.15)';
        
        // Получаем данные аккордеона с поддержкой разных форматов
        let accordionItems = element.accordionItems || element.items || element.initialPanels || [];
        
        // Если данные в content, парсим их (как в multiPageSiteExporter.js)
        if (accordionItems.length === 0 && element.content) {
          console.log('🎵 [ACCORDION EXPORT - EditorPanel] Parsing content:', element.content);
          // Парсим контент для извлечения вопросов и ответов
          const contentLines = element.content.split('\n').filter(line => line.trim());
          const tempItems = [];
          let currentTitle = '';
          let currentContent = '';
          
          contentLines.forEach((line, index) => {
            if (line.includes('?') && !line.includes('*')) {
              // Это вопрос
              if (currentTitle && currentContent) {
                tempItems.push({ id: tempItems.length + 1, title: currentTitle.trim(), content: currentContent.trim() });
              }
              currentTitle = line.trim();
              currentContent = '';
            } else if (line.trim() && !line.includes('*')) {
              // Это ответ
              currentContent += (currentContent ? ' ' : '') + line.trim();
            }
          });
          
          // Добавляем последний элемент
          if (currentTitle && currentContent) {
            tempItems.push({ id: tempItems.length + 1, title: currentTitle.trim(), content: currentContent.trim() });
          }
          
          accordionItems = tempItems.length > 0 ? tempItems : [
            { 
              title: 'Секция 1', 
              content: 'Содержимое первой секции' 
            },
            { 
              title: 'Секция 2', 
              content: 'Содержимое второй секции' 
            }
          ];
        }
        
        console.log('🎵 [ACCORDION EXPORT - EditorPanel] Final accordionItems:', accordionItems);
        
        return `
          <div id="${elementId}" class="content-element accordion" style="
            width: 100%;
            max-width: 100%;
            margin: 2rem 0;
            padding: 0;
          ">
            ${(element.showTitle !== false && element.title) ? `
              <div style="
                text-align: center;
                padding: 0 0 2rem 0;
                margin-bottom: 2rem;
              ">
                <h3 style="
                  color: ${accordionTitleColor};
                  font-size: 24px;
                  font-weight: bold;
                  margin: 0;
                  line-height: 1.4;
                ">${element.title}</h3>
              </div>
            ` : ''}
            
            <div class="accordion-container" style="
              display: flex; 
              flex-direction: column; 
              gap: 2px;
              width: 100%;
            ">
              ${accordionItems.map((item, index) => `
                <div class="accordion-item" style="
                  width: 100%;
                  background: ${accordionBackgroundColor};
                  border: 1px solid ${accordionBorderColor};
                  border-radius: 8px;
                  overflow: hidden;
                  transition: all 0.3s ease;
                  margin: 0;
                ">
                  <div class="accordion-header" onclick="toggleAccordion${elementId.replace(/-/g, '_')}(${index})" style="
                    padding: 16px 24px;
                    background: ${accordionBackgroundColor};
                    color: ${accordionTitleColor};
                    font-weight: bold;
                    cursor: pointer;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    transition: all 0.3s ease;
                    width: 100%;
                    box-sizing: border-box;
                    font-size: 16px;
                    min-height: 56px;
                  " onmouseover="this.style.backgroundColor='${accordionHoverColor}'" onmouseout="this.style.backgroundColor='${accordionBackgroundColor}'">
                    <span style="font-weight: bold;">${item.title}</span>
                    <span class="accordion-toggle" style="
                      font-size: 18px;
                      color: ${accordionTitleColor};
                      transform: rotate(0deg);
                      transition: transform 0.3s ease;
                      margin-left: 16px;
                    ">▼</span>
                  </div>
                  <div class="accordion-content" id="accordion-content-${elementId.replace(/-/g, '_')}-${index}" style="
                    padding: 0 24px;
                    background: ${accordionBackgroundColor};
                    max-height: 0;
                    overflow: hidden;
                    transition: max-height 0.3s ease, padding 0.3s ease;
                    color: ${accordionContentColor};
                    border-top: 1px solid ${accordionBorderColor};
                    box-sizing: border-box;
                  ">
                    <div style="padding: 16px 0; line-height: 1.6; white-space: pre-wrap; font-size: 14px;">
                      ${item.content}
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
          
          <!-- 🔥 JAVASCRIPT для аккордеона -->
          <script>
            function toggleAccordion${elementId.replace(/-/g, '_')}(index) {
              const content = document.getElementById('accordion-content-${elementId.replace(/-/g, '_')}-' + index);
              const toggle = content.previousElementSibling.querySelector('.accordion-toggle');
              
              if (content.style.maxHeight === '0px' || content.style.maxHeight === '') {
                content.style.maxHeight = content.scrollHeight + 'px';
                content.style.padding = '16px 24px';
                toggle.style.transform = 'rotate(180deg)';
              } else {
                content.style.maxHeight = '0px';
                content.style.padding = '0 24px';
                toggle.style.transform = 'rotate(0deg)';
              }
            }
          </script>
        `;



      case 'confetti':
        return `
          <div id="${elementId}" class="content-element confetti" style="
            margin: 2rem 0;
            text-align: center;
            padding: 2rem;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 12px;
            color: white;
            position: relative;
            overflow: hidden;
          ">
            <h3 style="
              color: white;
              margin-bottom: 1rem;
              font-size: 1.5rem;
            ">${element.title || 'Празднование!'}</h3>
            <button onclick="launchConfetti()" style="
              background: ${element.buttonColor || '#4caf50'};
              color: ${element.textColor || '#ffffff'};
              border: none;
              padding: 1rem 2rem;
              font-size: 1.1rem;
              border-radius: 25px;
              cursor: pointer;
              font-weight: bold;
              transition: all 0.3s ease;
              box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
              ${element.buttonText || 'Запустить конфетти'} 🎉
            </button>
            <canvas id="confetti-canvas" style="
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              pointer-events: none;
            "></canvas>
          </div>
        `;



      case 'animated-box':
        return `
          <div id="${elementId}" class="content-element animated-box" style="
            margin: 2rem 0;
            text-align: center;
            padding: 2rem;
            background: ${element.backgroundColor || '#f5f5f5'};
            color: ${element.textColor || '#333333'};
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            animation: ${element.animationType || 'fadeIn'} ${element.duration || 1000}ms ease-in-out ${element.loop ? 'infinite' : ''};
            max-width: 500px;
            margin-left: auto;
            margin-right: auto;
          ">
            <h3 style="
              margin-bottom: 1rem;
              font-size: 1.3rem;
              color: inherit;
            ">${element.title || 'Анимированный блок'}</h3>
            <p style="
              margin: 0;
              line-height: 1.6;
              color: inherit;
            ">${element.content || 'Этот блок имеет красивую анимацию'}</p>
          </div>
        `;

      case 'faq-section':
        const faqItems = element.items || [
          { question: 'Часто задаваемый вопрос 1?', answer: 'Ответ на первый вопрос.' },
          { question: 'Часто задаваемый вопрос 2?', answer: 'Ответ на второй вопрос.' }
        ];
        
        // Получаем цвета из colorSettings
        const faqColorSettings = element.data?.colorSettings || element.colorSettings || {};
        const faqTitleColor = faqColorSettings.textFields?.title || '#333333';
        const faqQuestionColor = faqColorSettings.textFields?.question || '#1976d2';
        const faqAnswerColor = faqColorSettings.textFields?.answer || '#666666';
        const faqAccordionBgColor = faqColorSettings.textFields?.accordionBg || '#fafafa';
        const faqAccordionHoverColor = faqColorSettings.textFields?.accordionHover || '#f0f0f0';
        const faqIconColor = faqColorSettings.textFields?.icon || '#1976d2';
        
        // Стили контейнера из colorSettings
        let faqContainerStyles = `
            margin: 2rem 0;
            max-width: 800px;
            margin-left: auto;
            margin-right: auto;
        `;
        
        // Добавляем стили фона если включены
        if (faqColorSettings.sectionBackground?.enabled) {
          if (faqColorSettings.sectionBackground.useGradient) {
            faqContainerStyles += `
              background: linear-gradient(${faqColorSettings.sectionBackground.gradientDirection}, ${faqColorSettings.sectionBackground.gradientColor1}, ${faqColorSettings.sectionBackground.gradientColor2});
              opacity: ${faqColorSettings.sectionBackground.opacity || 1};
            `;
          } else {
            faqContainerStyles += `
              background-color: ${faqColorSettings.sectionBackground.solidColor};
              opacity: ${faqColorSettings.sectionBackground.opacity || 1};
            `;
          }
        }
        
        // Добавляем стили границы и отступов
        if (faqColorSettings.borderColor) {
          faqContainerStyles += `
            border: ${faqColorSettings.borderWidth || 1}px solid ${faqColorSettings.borderColor};
            border-radius: ${faqColorSettings.borderRadius || 8}px;
          `;
        }
        
        if (faqColorSettings.padding) {
          faqContainerStyles += `padding: ${faqColorSettings.padding}px;`;
        }
        
        if (faqColorSettings.boxShadow) {
          faqContainerStyles += `box-shadow: 0 2px 8px rgba(0,0,0,0.1);`;
        }
        
        return `
          <div id="${elementId}" class="content-element faq-section" style="${faqContainerStyles}">
            ${element.title ? `
              <h3 style="
                text-align: center;
                color: ${faqTitleColor};
                margin-bottom: 2rem;
                font-size: 1.8rem;
                font-weight: bold;
              ">${element.title}</h3>
            ` : ''}
            ${faqItems.map((item, index) => `
              <div style="
                margin-bottom: 1rem;
                border: 1px solid #e0e0e0;
                border-radius: 8px;
                overflow: hidden;
                background-color: ${faqAccordionBgColor};
                transition: background-color 0.3s ease;
              " data-hover-bg="${faqAccordionHoverColor}" onmouseover="this.style.backgroundColor='${faqAccordionHoverColor}'" onmouseout="this.style.backgroundColor='${faqAccordionBgColor}'">
                <div style="
                  padding: 1rem;
                  cursor: pointer;
                  font-weight: 600;
                  color: ${faqQuestionColor};
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                " onclick="toggleFAQ(${index})">
                  ${item.question}
                  <span style="color: ${faqIconColor}; font-size: 1.2rem;">▼</span>
                </div>
                <div id="faq-answer-${index}" style="
                  padding: 1rem;
                  background: ${faqAccordionBgColor};
                  display: none;
                  color: ${faqAnswerColor};
                  line-height: 1.6;
                  border-top: 1px solid #e0e0e0;
                  transition: background-color 0.3s ease;
                ">
                  ${item.answer}
                </div>
              </div>
            `).join('')}
          </div>
        `;

      case 'timeline-component':
        // Получаем данные из element.data если есть, иначе из element
        const timelineEvents = element.data?.events || element.events || element.data?.items || element.items || [
          { date: '2024', title: 'Запуск проекта', description: 'Начало разработки', status: 'completed' },
          { date: '2024', title: 'Тестирование', description: 'Проверка функций', status: 'in-progress' },
          { date: '2024', title: 'Релиз', description: 'Публикация', status: 'pending' }
        ];

        // 🔥 ИСПРАВЛЕНИЕ: Используем ТОЛЬКО colorSettings (как в blockquote)
        const timelineColorSettings = element.colorSettings || element.data?.colorSettings || {};
        const timelineTitleColor = timelineColorSettings.textFields?.title || '#000000';
        const timelineDateColor = timelineColorSettings.textFields?.date || '#666666';
        const timelineTextColor = timelineColorSettings.textFields?.text || '#333333';
        const timelineLineColor = timelineColorSettings.textFields?.line || '#e0e0e0';
        const timelineCompletedColor = timelineColorSettings.textFields?.completed || '#4caf50';
        const timelineInProgressColor = timelineColorSettings.textFields?.inProgress || '#ff9800';
        const timelinePendingColor = timelineColorSettings.textFields?.pending || '#2196f3';

        // Функция для получения цвета статуса
        const getStatusColor = (status) => {
          switch (status) {
            case 'completed': return timelineCompletedColor;
            case 'in-progress': return timelineInProgressColor;
            case 'pending': return timelinePendingColor;
            default: return timelinePendingColor;
          }
        };

        // Функция для получения иконки статуса
        const getStatusIcon = (status) => {
          switch (status) {
            case 'completed': return '✓';
            case 'in-progress': return '⟳';
            case 'pending': return '○';
            default: return '○';
          }
        };

        // Стили контейнера из colorSettings
        let timelineContainerStyles = `
            margin: 2rem 0;
        `;

        // Применяем настройки фона из sectionBackground
        if (timelineColorSettings.sectionBackground?.enabled) {
          const { sectionBackground } = timelineColorSettings;
          if (sectionBackground.useGradient) {
            timelineContainerStyles += ` background: linear-gradient(${sectionBackground.gradientDirection}, ${sectionBackground.gradientColor1}, ${sectionBackground.gradientColor2});`;
          } else {
            timelineContainerStyles += ` background-color: ${sectionBackground.solidColor};`;
          }
          timelineContainerStyles += ` opacity: ${sectionBackground.opacity || 1};`;
        }

        // Применяем настройки границы
        if (timelineColorSettings.borderColor) {
          timelineContainerStyles += ` border: ${timelineColorSettings.borderWidth || 1}px solid ${timelineColorSettings.borderColor};`;
        }

        // Применяем радиус углов
        if (timelineColorSettings.borderRadius !== undefined) {
          timelineContainerStyles += ` border-radius: ${timelineColorSettings.borderRadius}px;`;
        } else {
          timelineContainerStyles += ` border-radius: 8px;`;
        }

        // Применяем внутренние отступы
        if (timelineColorSettings.padding !== undefined) {
          timelineContainerStyles += ` padding: ${timelineColorSettings.padding}px;`;
        } else {
          timelineContainerStyles += ` padding: 16px;`;
        }

        // Применяем тень
        if (timelineColorSettings.boxShadow) {
          timelineContainerStyles += ` box-shadow: 0 2px 8px rgba(0,0,0,0.1);`;
        }

        return `
          <div id="${elementId}" class="content-element timeline-component" style="${timelineContainerStyles}">
            <h4 style="
              margin-bottom: 24px;
                text-align: center;
              color: ${timelineTitleColor};
              font-size: 2rem;
            ">${element.data?.title || element.title || 'Временная шкала'}</h4>
            <div style="position: relative;">
              ${timelineEvents.map((event, index) => `
            <div style="
                  display: flex;
                  margin-bottom: 24px;
            ">
              <div style="
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    margin-right: 16px;
                ">
                  <div style="
                      width: 32px;
                      height: 32px;
                    border-radius: 50%;
                      background-color: ${getStatusColor(event.status)};
                      color: white;
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      font-weight: bold;
                      font-size: 16px;
                    ">${getStatusIcon(event.status)}</div>
                    ${index < timelineEvents.length - 1 ? `
                      <div style="
                        width: 2px;
                        height: 40px;
                        background-color: ${timelineLineColor};
                        margin-top: 8px;
                  "></div>
                    ` : ''}
                  </div>
                  <div style="flex: 1;">
                  <div style="
                      display: flex;
                      align-items: center;
                      margin-bottom: 8px;
                    ">
                      <h6 style="
                        margin: 0;
                        margin-right: 8px;
                        color: ${timelineTextColor};
                        font-size: 1.25rem;
                      ">${event.title}</h6>
                      <span style="
                        background-color: ${getStatusColor(event.status)};
                        color: white;
                        padding: 4px 8px;
                        border-radius: 12px;
                        font-size: 12px;
                        font-weight: 500;
                      ">${event.status}</span>
                    </div>
                    <p style="
                      margin: 0 0 8px 0;
                      color: ${timelineDateColor};
                      font-size: 14px;
                    ">${event.date}</p>
                    <p style="
                      margin: 0;
                      color: ${timelineTextColor};
                      line-height: 1.5;
                    ">${event.description}</p>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        `;

      case 'image-gallery':
        const galleryImages = element.images || [
          { src: 'https://via.placeholder.com/300x200', alt: 'Изображение 1' },
          { src: 'https://via.placeholder.com/300x200', alt: 'Изображение 2' },
          { src: 'https://via.placeholder.com/300x200', alt: 'Изображение 3' }
        ];
        
        // Получаем цвета из colorSettings
        const galleryColorSettings = element.data?.colorSettings || element.colorSettings || {};
        const galleryTitleColor = galleryColorSettings.textFields?.title || '#333333';
        const galleryDescriptionColor = galleryColorSettings.textFields?.description || '#666666';
        const galleryBackgroundColor = galleryColorSettings.textFields?.background || '#ffffff';
        const galleryBorderColor = galleryColorSettings.textFields?.border || '#e0e0e0';
        
        // Стили контейнера из colorSettings
        let galleryContainerStyles = `
            margin: 2rem 0;
            max-width: 900px;
            margin-left: auto;
            margin-right: auto;
        `;
        
        // Добавляем стили фона если включены
        if (galleryColorSettings.sectionBackground?.enabled) {
          if (galleryColorSettings.sectionBackground.useGradient) {
            galleryContainerStyles += `
              background: linear-gradient(${galleryColorSettings.sectionBackground.gradientDirection}, ${galleryColorSettings.sectionBackground.gradientColor1}, ${galleryColorSettings.sectionBackground.gradientColor2});
              opacity: ${galleryColorSettings.sectionBackground.opacity || 1};
            `;
          } else {
            galleryContainerStyles += `
              background-color: ${galleryColorSettings.sectionBackground.solidColor};
              opacity: ${galleryColorSettings.sectionBackground.opacity || 1};
            `;
          }
        }
        
        // Добавляем стили границы и отступов
        if (galleryColorSettings.borderColor) {
          galleryContainerStyles += `
            border: ${galleryColorSettings.borderWidth || 1}px solid ${galleryColorSettings.borderColor};
            border-radius: ${galleryColorSettings.borderRadius || 8}px;
          `;
        }
        
        if (galleryColorSettings.padding) {
          galleryContainerStyles += `padding: ${galleryColorSettings.padding}px;`;
        }
        
        if (galleryColorSettings.boxShadow) {
          galleryContainerStyles += `box-shadow: 0 2px 8px rgba(0,0,0,0.1);`;
        }
        
        return `
          <div id="${elementId}" class="content-element image-gallery" style="${galleryContainerStyles}">
            ${element.title ? `
              <h3 style="
                text-align: center;
                color: ${galleryTitleColor};
                margin-bottom: 2rem;
                font-size: 1.8rem;
                font-weight: bold;
              ">${element.title}</h3>
            ` : ''}
            ${element.description ? `
              <p style="
                text-align: center;
                color: ${galleryDescriptionColor};
                margin-bottom: 2rem;
                font-size: 1rem;
                line-height: 1.6;
              ">${element.description}</p>
            ` : ''}
            <div style="
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
              gap: 1rem;
            ">
              ${galleryImages.map((img, index) => `
                <div style="
                  border-radius: 8px;
                  overflow: hidden;
                  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                  transition: transform 0.3s ease;
                  background-color: ${galleryBackgroundColor};
                  border: 1px solid ${galleryBorderColor};
                " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                  <img src="${img.src}" alt="${img.alt}" style="
                    width: 100%;
                    height: 200px;
                    object-fit: cover;
                  ">
                </div>
              `).join('')}
            </div>
          </div>
        `;

      case 'multiple-cards':
        // Данные элемента загружены
        
        const cards = element.cards || [
          { title: 'Карточка 1', content: 'Содержимое первой карточки' },
          { title: 'Карточка 2', content: 'Содержимое второй карточки' },
          { title: 'Карточка 3', content: 'Содержимое третьей карточки' }
        ];
        
        // 🔥 ИСПРАВЛЕНИЕ: Применяем ColorSettings для множественных карточек
        const sectionColorSettings = element.colorSettings || element.sectionColorSettings || element.data?.colorSettings || element.data?.sectionColorSettings || {};
        const sectionStyles = element.sectionStyles || element.data?.sectionStyles || {};
        
        console.log('🎴🎴🎴 [EDITOR PANEL] multiple-cards colorSettings:', sectionColorSettings);
        
        // Определяем фон секции из ColorSettings или sectionStyles
        let sectionBackground = 'transparent';
        if (sectionColorSettings.sectionBackground?.enabled) {
          if (sectionColorSettings.sectionBackground.useGradient) {
            const gradientDir = sectionColorSettings.sectionBackground.gradientDirection || 'to right';
            const color1 = sectionColorSettings.sectionBackground.gradientColor1 || '#1976d2';
            const color2 = sectionColorSettings.sectionBackground.gradientColor2 || '#42a5f5';
            sectionBackground = `linear-gradient(${gradientDir}, ${color1}, ${color2})`;
          } else {
            sectionBackground = sectionColorSettings.sectionBackground.solidColor || '#ffffff';
          }
        } else if (sectionStyles.backgroundType === 'gradient') {
          sectionBackground = `linear-gradient(${sectionStyles.gradientDirection || 'to right'}, ${sectionStyles.gradientStartColor || '#1976d2'}, ${sectionStyles.gradientEndColor || '#42a5f5'})`;
        } else if (sectionStyles.backgroundColor) {
          sectionBackground = sectionStyles.backgroundColor;
        }
        
        // Цвета текста из ColorSettings или sectionStyles
        const titleColor = sectionColorSettings.textFields?.title || sectionStyles.titleColor || element.titleColor || '#ffff00';
        const sectionDescriptionColor = sectionColorSettings.textFields?.text || sectionColorSettings.textFields?.description || sectionStyles.descriptionColor || element.descriptionColor || '#ff4444';
        
        console.log('🎴🎴🎴 [EDITOR PANEL] multiple-cards colors:', { titleColor, sectionDescriptionColor });
        
        // Дополнительные стили секции из ColorSettings
        const sectionPadding = sectionColorSettings.padding ? `${sectionColorSettings.padding}px` : (sectionStyles.padding || '2rem');
        const sectionBorderRadius = sectionColorSettings.borderRadius ? `${sectionColorSettings.borderRadius}px` : (sectionStyles.borderRadius || '0px');
        const sectionBorderColor = sectionColorSettings.borderColor || '#e0e0e0';
        const sectionBorderWidth = sectionColorSettings.borderWidth || 0;
        const sectionBoxShadow = sectionColorSettings.boxShadow ? '0 2px 8px rgba(0,0,0,0.1)' : 'none';
        const sectionOpacity = sectionColorSettings.sectionBackground?.opacity || 1;
        
        return `
          <div id="${elementId}" class="content-element multiple-cards" data-color-settings='${JSON.stringify(sectionColorSettings)}' style="
            margin: 2rem 0;
            padding: ${sectionPadding};
            background: ${sectionBackground};
            border-radius: ${sectionBorderRadius};
            border: ${sectionBorderWidth}px solid ${sectionBorderColor};
            box-shadow: ${sectionBoxShadow};
            opacity: ${sectionOpacity};
            max-width: 1200px;
            margin-left: auto;
            margin-right: auto;
          ">
            ${element.title ? `
              <h3 style="
                text-align: center;
                color: ${titleColor};
                font-size: ${element.titleFontSize || 28}px;
                margin-bottom: 1rem;
                font-weight: bold;
              ">${element.title}</h3>
            ` : ''}
            ${element.description ? `
              <p style="
                text-align: center;
                color: ${sectionDescriptionColor};
                font-size: 16px;
                margin-bottom: 2rem;
                line-height: 1.6;
              ">${element.description}</p>
            ` : ''}
            <div style="
              display: flex;
              flex-wrap: wrap;
              gap: 1.5rem;
              justify-content: center;
              align-items: flex-start;
              width: 100%;
            ">
              ${cards.map((card, index) => {
                // 🔥 ИСПРАВЛЕНИЕ: Применяем настройки карточек из colorSettings
                let cardBackground = '#ffffff';
                if (sectionColorSettings?.cardBackground?.enabled) {
                  if (sectionColorSettings.cardBackground.useGradient) {
                    const gradientDir = sectionColorSettings.cardBackground.gradientDirection || 'to right';
                    const color1 = sectionColorSettings.cardBackground.gradientColor1 || '#ffffff';
                    const color2 = sectionColorSettings.cardBackground.gradientColor2 || '#f0f0f0';
                    cardBackground = `linear-gradient(${gradientDir}, ${color1}, ${color2})`;
                  } else {
                    cardBackground = sectionColorSettings.cardBackground.solidColor || '#ffffff';
                  }
                }
                
                const cardTitleColor = sectionColorSettings?.textFields?.cardTitle || '#333333';
                const cardContentColor = sectionColorSettings?.textFields?.cardText || '#666666';
                const cardBorderColor = sectionColorSettings?.textFields?.border || '#e0e0e0';
                const cardBorderRadius = sectionColorSettings?.borderRadius || 8;
                const cardBorderWidth = sectionColorSettings?.borderWidth || 1;
                const cardPadding = sectionColorSettings?.padding || 24;
                const cardBoxShadow = sectionColorSettings?.boxShadow ? '0 2px 8px rgba(0,0,0,0.1)' : '0 2px 8px rgba(0,0,0,0.1)';
                const cardOpacity = sectionColorSettings?.cardBackground?.opacity || 1;
                
                return `
                <div style="
                    background: ${cardBackground};
                    border: ${cardBorderWidth}px solid ${cardBorderColor};
                    border-radius: ${cardBorderRadius}px;
                    padding: ${cardPadding}px;
                    box-shadow: ${cardBoxShadow};
                    opacity: ${cardOpacity};
                    text-align: ${element.textAlign || 'left'};
                    transition: all 0.3s ease;
                    width: calc(33.333% - 16px);
                    min-width: 250px;
                    max-width: 320px;
                    height: auto;
                    min-height: 320px;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    cursor: pointer;
                  " onclick="openMultipleCardModal${elementId.replace(/-/g, '_')}(${index})" data-card-index="${index}" 
                     onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 8px 25px rgba(0,0,0,0.15)'" 
                     onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='${cardBoxShadow}'">
                    <div class="service-image" style="
                        width: 100%;
                        height: 140px;
                        margin-bottom: 1rem;
                        border-radius: ${cardBorderRadius - 4}px;
                        overflow: hidden;
                        flex-shrink: 0;
                      ">
                      <img src="${(() => {
                        // Определяем правильный путь к изображению для карточки
                        let cardImageSrc = 'assets/images/placeholder.svg';
                        
                        // Проверяем глобальный маппинг экспортированных изображений
                        if (window.cardImageFileMap && card.id) {
                          const exportedFileName = window.cardImageFileMap.get(card.id);
                          if (exportedFileName) {
                            cardImageSrc = 'assets/images/' + exportedFileName;
                            console.log('🖼️ Multiple-cards using exported file: ' + cardImageSrc + ' (cardId: ' + card.id + ')');
                          } else {
                            console.log('🖼️ Multiple-cards no mapping found for card ID: ' + card.id);
                          }
                        }
                        
                        // Fallback логика
                        if (cardImageSrc === 'assets/images/placeholder.svg') {
                          if (card.fileName && card.fileName.startsWith('card_')) {
                            cardImageSrc = 'assets/images/' + card.fileName;
                            console.log('🖼️ Multiple-cards using fileName: ' + cardImageSrc);
                          } else if (card.imageUrl && card.imageUrl.trim() && !card.imageUrl.includes('placeholder')) {
                            cardImageSrc = card.imageUrl;
                            console.log('🖼️ Multiple-cards using imageUrl: ' + cardImageSrc);
                          }
                        }
                        
                        console.log('🖼️ Multiple-cards FINAL SRC: ' + cardImageSrc);
                        return cardImageSrc;
                      })()}" alt="${card.imageAlt || card.title || 'Изображение'}" style="
                          width: 100%;
                          height: 100%;
                          object-fit: cover;
                  transition: transform 0.3s ease;
                        " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                      </div>
                    ${card.title ? `
                  <h4 style="
                        color: ${cardTitleColor};
                        font-size: 20px;
                        margin-bottom: 1rem;
                        font-weight: bold;
                        line-height: 1.3;
                        word-wrap: break-word;
                        overflow-wrap: break-word;
                        hyphens: auto;
                        display: -webkit-box;
                        -webkit-line-clamp: 2;
                        -webkit-box-orient: vertical;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        max-height: 2.6em;
                        text-align: center;
                  ">${card.title}</h4>
                    ` : ''}
                    ${card.content ? `
                      <div style="
                        position: relative;
                        flex: 1;
                        margin-bottom: 16px;
                      ">
                  <p style="
                          color: ${cardContentColor};
                          font-size: 16px;
                    line-height: 1.6;
                          display: -webkit-box;
                          -webkit-line-clamp: 6;
                          -webkit-box-orient: vertical;
                          overflow: hidden;
                          text-overflow: ellipsis;
                          padding-bottom: 8px;
                          word-break: break-word;
                  ">${card.content}</p>
                      <!-- 🔥 МНОГОТОЧИЕ для показа что есть продолжение -->
                      <div style="
                        position: absolute;
                        bottom: 0;
                        right: 0;
                        width: 40px;
                        height: 20px;
                        background: linear-gradient(transparent, ${cardBackground});
                        pointer-events: none;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 18px;
                        color: ${cardContentColor};
                        font-weight: bold;
                                              ">...</div>
                </div>
                    ` : ''}
                    <!-- 🔥 УБРАЛИ КНОПКУ: Карточка теперь кликабельна для открытия модального окна -->
            </div>
                `;
              }).join('')}
          </div>
            
            <!-- 🔥 МОДАЛЬНОЕ ОКНО теперь использует глобальные функции openCardModal/closeCardModal -->
          </div>
          
          <!-- 🔥 МОДАЛЬНОЕ ОКНО теперь использует глобальные функции openCardModal/closeCardModal -->
        `;

      case 'data-table':
        console.log('=== DataTable DEBUG START ===');
        console.log('[EditorPanel] DataTable element:', element);
        console.log('[EditorPanel] DataTable elementData:', elementData);
        console.log('[EditorPanel] DataTable isMultiPage:', isMultiPage);
        console.log('[EditorPanel] DataTable element keys:', Object.keys(element));
        console.log('[EditorPanel] DataTable elementData keys:', Object.keys(elementData));
        console.log('=== DataTable DEBUG END ===');
        
        // 🔥 ИСПРАВЛЕНИЕ: Получаем заголовки и данные таблицы
        let tableHeaders = [];
        let tableData = [];
        
        // Приоритет 1: columns из elementData (новый формат)
        if (elementData.columns && Array.isArray(elementData.columns)) {
          tableHeaders = elementData.columns.map(col => col.label);
          console.log('[EditorPanel] DataTable - Using columns from elementData:', tableHeaders);
        }
        // Приоритет 2: headers из elementData (AI парсер формат)
        else if (elementData.headers && Array.isArray(elementData.headers)) {
          tableHeaders = elementData.headers.map(header => header.label);
          console.log('[EditorPanel] DataTable - Using headers from elementData:', tableHeaders);
        }
        // Приоритет 3: initialColumns из elementData
        else if (elementData.initialColumns && Array.isArray(elementData.initialColumns)) {
          tableHeaders = elementData.initialColumns.map(col => col.label);
          console.log('[EditorPanel] DataTable - Using initialColumns from elementData:', tableHeaders);
        }
        // Приоритет 4: columns из element
        else if (element.columns && Array.isArray(element.columns)) {
          tableHeaders = element.columns.map(col => col.label);
          console.log('[EditorPanel] DataTable - Using columns from element:', tableHeaders);
        }
        // Fallback: дефолтные заголовки
        else {
          tableHeaders = ['Название', 'Значение', 'Описание'];
          console.log('[EditorPanel] DataTable - Using default headers:', tableHeaders);
        }
        
        // Получаем данные строк
        if (elementData.rows && Array.isArray(elementData.rows)) {
          // Если rows уже в правильном формате (массив массивов)
          if (elementData.rows.length > 0 && Array.isArray(elementData.rows[0])) {
            tableData = elementData.rows;
          } else {
            // Если rows в формате объектов, преобразуем в массив массивов
            tableData = elementData.rows.map(row => {
              if (typeof row === 'object' && row !== null) {
                return tableHeaders.map(header => {
                  // Ищем значение по заголовку
                  const key = Object.keys(row).find(k => 
                    row[k] !== undefined && row[k] !== null
                  );
                  return key ? row[key] : '';
                });
              }
              return [row];
            });
          }
        } else if (elementData.data && Array.isArray(elementData.data)) {
          tableData = elementData.data;
        } else if (element.rows && Array.isArray(element.rows)) {
          // Преобразуем element.rows в правильный формат
          if (element.rows.length > 0 && typeof element.rows[0] === 'object') {
            tableData = element.rows.map(row => {
              return tableHeaders.map(header => {
                const key = Object.keys(row).find(k => 
                  row[k] !== undefined && row[k] !== null
                );
                return key ? row[key] : '';
              });
            });
          } else {
            tableData = element.rows;
          }
        } else if (elementData.initialRows && Array.isArray(elementData.initialRows)) {
          // Преобразуем initialRows в правильный формат
          tableData = elementData.initialRows.map(row => {
            if (typeof row === 'object' && row !== null) {
              return tableHeaders.map(header => {
                const key = Object.keys(row).find(k => 
                  row[k] !== undefined && row[k] !== null
                );
                return key ? row[key] : '';
              });
            }
            return [row];
          });
        }
        
        // Добавляем заголовки в начало данных, если их там нет
        if (tableData.length === 0 || !tableHeaders.every((header, index) => tableData[0][index] === header)) {
          tableData = [tableHeaders, ...tableData];
        }
        
        console.log('[EditorPanel] DataTable - Final headers:', tableHeaders);
        console.log('[EditorPanel] DataTable - Final data:', tableData);
        
        // Получаем настройки таблицы - проверяем и elementData, и element
        const tableSettings = elementData.tableSettings || element.tableSettings || {};
        console.log('[EditorPanel] DataTable - Raw tableSettings:', tableSettings);
        console.log('[EditorPanel] DataTable - elementData.tableSettings:', elementData.tableSettings);
        console.log('[EditorPanel] DataTable - element.tableSettings:', element.tableSettings);
        
        const isStriped = tableSettings.striped !== undefined ? tableSettings.striped : false;
        console.log('[EditorPanel] DataTable - Striped logic: tableSettings.striped =', tableSettings.striped, ', result isStriped =', isStriped);
        const isBordered = tableSettings.bordered !== undefined ? tableSettings.bordered : true;
        const isHover = tableSettings.hover !== undefined ? tableSettings.hover : true;
        const isDense = tableSettings.dense !== undefined ? tableSettings.dense : false;
        const isSortable = tableSettings.sortable !== undefined ? tableSettings.sortable : true;
        const sortConfig = tableSettings.sortConfig || { key: null, direction: 'asc' };

        // Получаем цвета - теперь используем colorSettings и в превью, и в скачанном сайте
        const tableColorSettings = elementData.colorSettings || element.colorSettings || {};
        console.log('[EditorPanel] DataTable - Color settings source:');
        console.log('  elementData.colorSettings:', elementData.colorSettings);
        console.log('  element.colorSettings:', element.colorSettings);
        console.log('  final tableColorSettings:', tableColorSettings);
        console.log('  textFields:', tableColorSettings.textFields);
        // Цвета таблицы - применяются и в превью, и в скачанном сайте
        const tableBackgroundColor = tableColorSettings.textFields?.background || 'white';
        const tableTitleColor = tableColorSettings.textFields?.title || tableColorSettings.textFields?.headerText || '#333333';
        const tableHeaderColor = tableColorSettings.textFields?.headerText || '#ffffff';
        const tableCellColor = tableColorSettings.textFields?.text || '#333333';
        const tableHeaderBg = tableColorSettings.textFields?.headerBg || '#1976d2';
        const tableBorderColor = tableColorSettings.textFields?.border || '#c41e3a';
        const tableHoverColor = tableColorSettings.textFields?.hover || 'rgba(196,30,58,0.15)';
        
        // Цвета для строк таблицы - теперь применяются и в превью, и в скачанном сайте
        // Основной цвет строк - используется когда полосатые строки отключены или для четных строк
        const tableRowBg = tableColorSettings.textFields?.rowBg || 'rgba(173, 216, 230, 0.3)'; // Светло-голубой для отладки
        // Альтернативный цвет - используется только для нечетных строк когда полосатые строки включены
        const tableAlternateRowBg = tableColorSettings.textFields?.alternateRowBg || 'rgba(255, 182, 193, 0.3)'; // Светло-розовый для отладки
        const tableRowBorderColor = tableColorSettings.textFields?.rowBorder || 'rgba(0,0,0,0.08)';
        
        console.log('[EditorPanel] DataTable - Table settings:', {
          isStriped,
          isBordered,
          isHover,
          isDense,
          isSortable,
          isMultiPage,
          tableRowBg,
          tableAlternateRowBg,
          tableRowBorderColor
        });
        console.log('[EditorPanel] DataTable - Color settings applied:', {
          'colorSettings available': !!tableColorSettings.textFields,
          'rowBg from settings': tableColorSettings.textFields?.rowBg,
          'alternateRowBg from settings': tableColorSettings.textFields?.alternateRowBg,
          'final tableRowBg': tableRowBg,
          'final tableAlternateRowBg': tableAlternateRowBg
        });
        
        // Стили контейнера из colorSettings
        let tableContainerStyles = `
            margin: 2rem 0;
            max-width: 1000px;
            margin-left: auto;
            margin-right: auto;
        `;

        // Применяем настройки фона из sectionBackground - только в многостраничном режиме
        if (isMultiPage && tableColorSettings.sectionBackground?.enabled) {
          const { sectionBackground } = tableColorSettings;
          if (sectionBackground.useGradient) {
            tableContainerStyles += ` background: linear-gradient(${sectionBackground.gradientDirection}, ${sectionBackground.gradientColor1}, ${sectionBackground.gradientColor2});`;
          } else {
            tableContainerStyles += ` background-color: ${sectionBackground.solidColor};`;
          }
          tableContainerStyles += ` opacity: ${sectionBackground.opacity || 1};`;
        }

        // Применяем настройки границы - только в многостраничном режиме
        if (isMultiPage && tableColorSettings.borderColor) {
          tableContainerStyles += ` border: ${tableColorSettings.borderWidth || 1}px solid ${tableColorSettings.borderColor};`;
        }

        // Применяем радиус углов - только в многостраничном режиме
        if (isMultiPage && tableColorSettings.borderRadius !== undefined) {
          tableContainerStyles += ` border-radius: ${tableColorSettings.borderRadius}px;`;
        }

        // Применяем внутренние отступы - только в многостраничном режиме
        if (isMultiPage && tableColorSettings.padding !== undefined) {
          tableContainerStyles += ` padding: ${tableColorSettings.padding}px;`;
        }

        // Применяем тень - только в многостраничном режиме
        if (isMultiPage && tableColorSettings.boxShadow) {
          tableContainerStyles += ` box-shadow: 0 2px 8px rgba(0,0,0,0.1);`;
        }

        return `
          <div id="${elementId}" class="content-element data-table" style="${tableContainerStyles}">
                      ${(elementData.title || element.title || elementData.headers?.[0]?.label) ? `
              <h3 style="
                text-align: center;
                color: ${tableTitleColor};
                margin-bottom: 2rem;
                font-size: 1.5rem;
                font-weight: bold;
                font-family: 'Montserrat', sans-serif;
              background-color: ${tableColorSettings.textFields?.titleBg || 'transparent'};
              padding: 1rem;
              border-radius: 8px;
              border: ${tableColorSettings.textFields?.titleBorder ? `2px solid ${tableColorSettings.textFields.titleBorder}` : 'none'};
            ">${elementData.title || element.title || elementData.headers?.[0]?.label}</h3>
            ` : ''}
            <div style="
              overflow-x: auto;
              border-radius: 8px;
              box-shadow: 0 4px 20px rgba(0,0,0,0.15);
              background: ${tableBackgroundColor};
              border: 1px solid rgba(0,0,0,0.12);
              max-width: 100%;
            ">
              <table id="${elementId}" style="
                width: 100%;
                min-width: 600px;
                border-collapse: collapse;
                background: ${tableBackgroundColor};
                font-family: 'Montserrat', sans-serif;
                table-layout: fixed;
              ">
                ${tableData.map((row, rowIndex) => {
                  // Определяем фон строки
                  let rowBackground;
                  if (rowIndex === 0) {
                    // Заголовок - всегда используем headerBg
                    rowBackground = tableHeaderBg;
                  } else if (!isStriped) {
                    // Полосатые строки отключены - все строки одинакового цвета
                    rowBackground = tableRowBg;
                  } else {
                    // Полосатые строки включены - чередуем цвета
                    rowBackground = rowIndex % 2 === 1 ? tableAlternateRowBg : tableRowBg;
                  }
                  
                  console.log(`[EditorPanel] DataTable - Row ${rowIndex}: isStriped=${isStriped}, rowIndex%2=${rowIndex % 2}, background=${rowBackground}`);
                  
                  return `
                  <tr style="
                    ${rowIndex === 0 ? `
                      background: ${tableHeaderBg};
                      background-image: linear-gradient(135deg, ${tableHeaderBg} 0%, ${tableHeaderBg}DD 100%);
                    ` : `
                      background: ${rowBackground};
                    `}
                    border-bottom: ${isBordered ? (rowIndex === 0 ? '2px solid rgba(0,0,0,0.2)' : `1px solid ${tableRowBorderColor}`) : 'none'};
                    transition: background-color 0.2s ease;
                  " ${rowIndex > 0 && isHover ? `onmouseover="this.style.backgroundColor='${tableHoverColor}'" onmouseout="this.style.backgroundColor='${rowBackground}'"` : ''}>
                    ${row.map((cell, cellIndex) => `
                      <${rowIndex === 0 ? 'th' : 'td'} style="
                        padding: ${rowIndex === 0 ? (isDense ? '12px 16px' : '16px 20px') : (isDense ? '8px 16px' : '14px 20px')};
                        text-align: ${rowIndex === 0 ? 'center' : 'left'};
                        color: ${rowIndex === 0 ? tableHeaderColor : tableCellColor};
                        font-weight: ${rowIndex === 0 ? 'bold' : 'normal'};
                        font-size: ${rowIndex === 0 ? (isDense ? '13px' : '14px') : (isDense ? '12px' : '13px')};
                        ${rowIndex === 0 ? 'text-transform: uppercase; letter-spacing: 0.5px;' : ''}
                        ${cellIndex === 0 && rowIndex > 0 ? 'font-weight: 500;' : ''}
                        border-right: ${isBordered && cellIndex < row.length - 1 ? '1px solid rgba(0,0,0,0.08)' : 'none'};
                        ${rowIndex === 0 && isSortable ? 'cursor: pointer; user-select: none;' : ''}
                        word-wrap: break-word;
                        overflow-wrap: break-word;
                        max-width: 0;
                        white-space: normal;
                      " ${rowIndex === 0 && isSortable ? `onclick="sortTable('${elementId}', ${cellIndex})"` : ''}>${cell}${rowIndex === 0 && isSortable && cellIndex === 0 ? ' ↕' : ''}</${rowIndex === 0 ? 'th' : 'td'}>
                    `).join('')}
                  </tr>
                `;
                }).join('')}
              </table>
            </div>
            
            <!-- Дополнительная информация удалена из экспорта -->
            
            <style>
              @media (max-width: 768px) {
                #${elementId} {
                  min-width: 400px !important;
                }
                #${elementId} th,
                #${elementId} td {
                  padding: 8px 12px !important;
                  font-size: 12px !important;
                }
              }
              @media (max-width: 480px) {
                #${elementId} {
                  min-width: 300px !important;
                }
                #${elementId} th,
                #${elementId} td {
                  padding: 6px 8px !important;
                  font-size: 11px !important;
                }
              }
            </style>
            
            ${isSortable ? `
            <script>
              // Функция сортировки таблицы
              function sortTable(tableId, columnIndex) {
                const table = document.getElementById(tableId);
                const tbody = table.querySelector('tbody') || table;
                const rows = Array.from(tbody.querySelectorAll('tr')).slice(1); // Пропускаем заголовок
                const headerRow = tbody.querySelector('tr');
                
                // Определяем направление сортировки (по умолчанию desc - обратный порядок)
                const currentDirection = table.getAttribute('data-sort-direction') || 'desc';
                const newDirection = currentDirection === 'asc' ? 'desc' : 'asc';
                
                // Сортируем строки
                rows.sort((a, b) => {
                  const aValue = a.cells[columnIndex]?.textContent || '';
                  const bValue = b.cells[columnIndex]?.textContent || '';
                  
                  // Пытаемся преобразовать в числа для числовой сортировки
                  const aNum = parseFloat(aValue);
                  const bNum = parseFloat(bValue);
                  
                  if (!isNaN(aNum) && !isNaN(bNum)) {
                    return newDirection === 'asc' ? aNum - bNum : bNum - aNum;
                  }
                  
                  // Строковая сортировка
                  return newDirection === 'asc' 
                    ? aValue.localeCompare(bValue, 'ru') 
                    : bValue.localeCompare(aValue, 'ru');
                });
                
                // Обновляем таблицу
                rows.forEach(row => tbody.appendChild(row));
                table.setAttribute('data-sort-direction', newDirection);
                
                // Обновляем заголовки - стрелка переходит к активному столбцу
                const headers = headerRow.querySelectorAll('th');
                headers.forEach((header, index) => {
                  const baseText = header.textContent.replace(/ [↑↓↕]/g, ''); // Убираем все стрелки
                  if (index === columnIndex) {
                    // Активный столбец показывает направление сортировки
                    header.innerHTML = baseText + (newDirection === 'asc' ? ' ↑' : ' ↓');
                  } else {
                    // Остальные столбцы без стрелок
                    header.innerHTML = baseText;
                  }
                });
              }
              
              // Автоматическая сортировка при загрузке страницы
              document.addEventListener('DOMContentLoaded', function() {
                const table = document.getElementById('${elementId}');
                if (table) {
                  // Автоматически сортируем по первому столбцу при загрузке
                  setTimeout(() => sortTable('${elementId}', 0), 100);
                }
              });
            </script>
            ` : ''}
          </div>
        `;
      case 'bar-chart':

        


        const barData = (element.data && element.data.data && Array.isArray(element.data.data.data)) ? element.data.data.data :
                       (element.data && Array.isArray(element.data.data)) ? element.data.data :
                       Array.isArray(elementData.data) ? elementData.data :
                       Array.isArray(element.data) ? element.data : [
          { label: 'Январь', value: 65, color: '#1976d2' },
          { label: 'Февраль', value: 45, color: '#2196f3' },
          { label: 'Март', value: 80, color: '#03a9f4' },
          { label: 'Апрель', value: 55, color: '#00bcd4' }
        ];
        

        
        const maxBarValue = Math.max(...barData.map(d => d.value));
        const minBarValue = Math.min(...barData.map(d => d.value));
        const barRange = maxBarValue - minBarValue;
        
        // Приоритет: element.colorSettings > element.data.colorSettings > element.data.data.colorSettings > fallback
        const deepColorSettings = (element.data && element.data.data && element.data.data.colorSettings) || {};
        const dataColorSettings = (element.data && element.data.colorSettings) || {};
        const elementColorSettings = element.colorSettings || {};
        const colorSettings = { ...elementColorSettings, ...dataColorSettings, ...deepColorSettings };
        
        // Получаем цвета из новой системы colorSettings
        const chartBackgroundColor = colorSettings.sectionBackground?.enabled 
          ? (colorSettings.sectionBackground.useGradient 
              ? `linear-gradient(${colorSettings.sectionBackground.gradientDirection}, ${colorSettings.sectionBackground.gradientColor1}, ${colorSettings.sectionBackground.gradientColor2})`
              : colorSettings.sectionBackground.solidColor)
          : '#ffffff';
        const chartTitleColor = colorSettings.textFields?.title || '#1976d2';
        const descriptionColor = colorSettings.textFields?.legendText || colorSettings.textFields?.legend || '#666666';
        const showValues = (element.data && element.data.data && element.data.data.showValues !== undefined) ? element.data.data.showValues :
                          (element.data && element.data.showValues !== undefined) ? element.data.showValues : 
                          (elementData.showValues !== undefined ? elementData.showValues : 
                          (element.showValues !== undefined ? element.showValues : true));
        const showGrid = (element.data && element.data.data && element.data.data.showGrid !== undefined) ? element.data.data.showGrid :
                        (element.data && element.data.showGrid !== undefined) ? element.data.showGrid : 
                        (elementData.showGrid !== undefined ? elementData.showGrid : 
                        (element.showGrid !== undefined ? element.showGrid : true));
        const showLegend = (element.data && element.data.data && element.data.data.showLegend !== undefined) ? element.data.data.showLegend :
                          (element.data && element.data.showLegend !== undefined) ? element.data.showLegend : 
                          (elementData.showLegend !== undefined ? elementData.showLegend : 
                          (element.showLegend !== undefined ? element.showLegend : false));
        const showStatistics = (element.data && element.data.data && element.data.data.showStatistics !== undefined) ? element.data.data.showStatistics :
                             (element.data && element.data.showStatistics !== undefined) ? element.data.showStatistics : 
                             (elementData.showStatistics !== undefined ? elementData.showStatistics : 
                             (element.showStatistics !== undefined ? element.showStatistics : false));
        


        return `
          <style>
            @keyframes barChartAnimation-${elementId} {
              from { height: 0; opacity: 0; }
              to { height: var(--bar-height); opacity: 1; }
            }
            .bar-chart-bar-${elementId} {
              animation: barChartAnimation-${elementId} 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
              animation-delay: calc(var(--bar-index) * 0.1s);
            }
          </style>
          <div id="${elementId}" class="content-element chart-component" style="
            margin: 2rem 0;
            padding: ${colorSettings.padding || 24}px;
            background: ${chartBackgroundColor};
            border-radius: ${colorSettings.borderRadius || 16}px;
            box-shadow: ${colorSettings.boxShadow ? '0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)' : 'none'};
            max-width: 1200px;
            margin-left: auto;
            margin-right: auto;
            position: relative;
            ${colorSettings.borderWidth && colorSettings.borderWidth > 0 ? `border: ${colorSettings.borderWidth}px solid ${colorSettings.borderColor || 'transparent'};` : 'border: none;'}
          ">
            <h3 style="
              margin-bottom: ${(element.data && element.data.data && element.data.data.description) || (element.data && element.data.description) || elementData.description || element.description ? '16px' : '24px'};
              color: ${chartTitleColor || '#1976d2'};
              font-size: 1.25rem;
              font-weight: bold;
              text-align: center;
              font-family: 'Roboto', 'Helvetica', 'Arial', sans-serif;
              line-height: 1.6;
              letter-spacing: 0.0075em;
            ">${(element.data && element.data.data && element.data.data.title) || (element.data && element.data.title) || elementData.title || element.title || 'Диаграмма'}</h3>
            
            ${(element.data && element.data.data && element.data.data.description) || (element.data && element.data.description) || elementData.description || element.description ? `
              <p style="
                color: ${descriptionColor || '#666666'};
                font-size: 1rem;
                line-height: 1.5;
                margin-bottom: 24px;
                text-align: center;
                font-family: 'Roboto', 'Helvetica', 'Arial', sans-serif;
              ">${(element.data && element.data.data && element.data.data.description) || (element.data && element.data.description) || elementData.description || element.description}</p>
            ` : ''}
            
            <div style="
              position: relative;
              height: 400px;
              padding: 20px;
              display: flex;
              align-items: flex-end;
              justify-content: center;
              gap: 12px;
              background: ${colorSettings.sectionBackground?.enabled && colorSettings.sectionBackground.useGradient 
                ? `linear-gradient(${colorSettings.sectionBackground.gradientDirection}, ${colorSettings.sectionBackground.gradientColor1}, ${colorSettings.sectionBackground.gradientColor2})`
                : colorSettings.sectionBackground?.enabled 
                  ? colorSettings.sectionBackground.solidColor 
                  : 'rgba(0,0,0,0.02)'};
              opacity: ${colorSettings.sectionBackground?.enabled ? (colorSettings.sectionBackground.opacity || 1) : 1};
              border-radius: 8px;
              border: 1px solid rgba(0,0,0,0.1);
              overflow: hidden;
              width: 100%;
              max-width: 100%;
            ">
              ${showGrid ? `
                <!-- Сетка -->
                <div style="
                  position: absolute;
                  left: 0;
                  right: 0;
                  top: 0;
                  bottom: 60px;
                  pointer-events: none;
                  z-index: 0;
                ">
                  <!-- Горизонтальные линии сетки -->
                  <div style="position: absolute; left: 0; right: 0; bottom: 25%; height: 1px; background: ${colorSettings.textFields?.grid || 'rgba(0,0,0,0.1)'}; opacity: 0.3;"></div>
                  <div style="position: absolute; left: 0; right: 0; bottom: 50%; height: 1px; background: ${colorSettings.textFields?.grid || 'rgba(0,0,0,0.1)'}; opacity: 0.3;"></div>
                  <div style="position: absolute; left: 0; right: 0; bottom: 75%; height: 1px; background: ${colorSettings.textFields?.grid || 'rgba(0.1)'}; opacity: 0.3;"></div>
                </div>
              ` : ''}
              
              ${barData.map((item, index) => {
                const maxValue = Math.max(...barData.map(d => d.value));
                const minValue = Math.min(...barData.map(d => d.value));
                const range = maxValue - minValue;
                
                let barHeight;
                if (range === 0) {
                  barHeight = 200; // Если все одинаковые
                } else {
                  // Для малых диапазонов делаем больше разницы
                  const relativeValue = (item.value - minValue) / range;
                  barHeight = 50 + (relativeValue * 300); // От 50px до 350px
                }
                
                // Автоматическая ширина в зависимости от количества столбцов
                const availableWidth = 700;
                const gapSize = Math.max(8, Math.min(12, 700 / barData.length - 30));
                const totalGap = gapSize * (barData.length - 1);
                const widthPerColumn = (availableWidth - totalGap - 30) / barData.length;
                const autoWidth = Math.max(20, Math.min(70, widthPerColumn));

                return `
                  <div style="
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 8px;
                    position: relative;
                    height: 100%;
                    justify-content: flex-end;
                  ">
                    <!-- Столбец -->
                    <div class="bar-chart-bar-${elementId}" style="
                      background: linear-gradient(180deg, ${item.color || '#1976d2'} 0%, ${item.color ? item.color + 'DD' : '#1976d2DD'} 100%);
                      border-radius: 0;
                      width: ${autoWidth}px;
                      height: ${barHeight}px;
                      min-height: 40px;
                      cursor: pointer;
                      transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
                      box-shadow: 0 2px 8px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.1);
                      border: 1px solid rgba(0,0,0,0.2);
                      border-bottom: 2px solid rgba(0,0,0,0.3);
                      position: relative;
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      --bar-height: ${barHeight}px;
                      --bar-index: ${index};
                    " onmouseover="this.style.opacity='0.9'; this.style.transform='translateY(-3px)'; this.style.boxShadow='0 6px 16px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.2)'; this.style.filter='brightness(1.1)';" onmouseout="this.style.opacity='1'; this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 8px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.1)'; this.style.filter='brightness(1)';">
                      <!-- Значение на столбце -->
                      ${showValues ? `
                        <div style="
                          color: #ffffff;
                          font-size: 14px;
                          font-weight: bold;
                          text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
                          z-index: 10;
                        ">${item.value}</div>
                      ` : ''}
                    </div>
                    
                    <!-- Подпись -->
                    <div style="
                      color: ${item.color || '#1976d2'};
                      font-size: 12px;
                      font-weight: 500;
                      text-align: center;
                      word-wrap: break-word;
                      max-width: ${autoWidth + 20}px;
                      line-height: 1.2;
                      height: 36px;
                      display: flex;
                      align-items: center;
                      justify-content: center;
                    ">${item.name || item.label || 'Данные'}</div>
                  </div>
                `;
              }).join('')}
            </div>
            
            ${showLegend ? `
              <!-- Легенда с значениями -->
              <div style="
                margin-top: 16px;
                display: flex;
                justify-content: center;
                flex-wrap: wrap;
                gap: 8px;
              ">
                ${barData.map((item, index) => `
                  <div style="
                    background-color: ${item.color || '#1976d2'};
                    color: white;
                    font-size: 11px;
                    font-weight: bold;
                    padding: 4px 8px;
                    border-radius: 12px;
                    white-space: nowrap;
                  ">${item.label || item.name}: ${item.value}</div>
                `).join('')}
              </div>
            ` : ''}
            
            ${showStatistics ? `
              <!-- Статистика -->
              <div style="
                margin-top: 16px;
                padding-top: 16px;
                border-top: 1px solid ${colorSettings.textFields?.grid || 'rgba(0,0,0,0.1)'};
                text-align: center;
              ">
                <div style="
                  color: ${colorSettings.textFields?.legend || '#1976d2'};
                  font-size: 11px;
                  font-family: 'Roboto', 'Helvetica', 'Arial', sans-serif;
                ">
                  Элементов: ${barData.length} | 
                  Максимум: ${maxBarValue} | 
                  Среднее: ${barData.length > 0 ? (barData.reduce((sum, item) => sum + item.value, 0) / barData.length).toFixed(1) : 0} |
                  Сумма: ${barData.reduce((sum, item) => sum + item.value, 0)}
                </div>
              </div>
            ` : ''}
          </div>
        `;
      case 'advanced-line-chart':
        console.log('🚀🚀🚀 ADVANCED-LINE-CHART EXPORT FUNCTION CALLED! 🚀🚀🚀');
        console.log('=== ADVANCED-LINE-CHART DEBUG ===');
        console.log('element:', element);
        console.log('elementData:', elementData);
        console.log('element.customStyles:', element.customStyles);
        console.log('elementData.customStyles:', elementData.customStyles);
        
        // Извлекаем данные с приоритетом: element.data.data > element.data > elementData.data > default
        const chartLineData = (element.data?.data && Array.isArray(element.data.data)) ? element.data.data :
                             (Array.isArray(element.data)) ? element.data :
                             (Array.isArray(elementData.data)) ? elementData.data : [
          { name: 'Янв', value: 65 },
          { name: 'Фев', value: 59 },
          { name: 'Мар', value: 80 },
          { name: 'Апр', value: 81 },
          { name: 'Май', value: 56 },
          { name: 'Июн', value: 55 }
        ];
        
        // Извлекаем colorSettings с приоритетом
        const chartLineColorSettings = element.colorSettings || elementData.colorSettings || {};
        const chartLineStyles = element.customStyles || elementData.customStyles || {};
        
        // Получаем цвета из новой системы colorSettings с fallback на старые
        const chartLineBackgroundColor = chartLineColorSettings.sectionBackground?.enabled 
          ? (chartLineColorSettings.sectionBackground.useGradient 
              ? `linear-gradient(${chartLineColorSettings.sectionBackground.gradientDirection}, ${chartLineColorSettings.sectionBackground.gradientColor1}, ${chartLineColorSettings.sectionBackground.gradientColor2})`
              : chartLineColorSettings.sectionBackground.solidColor)
          : (chartLineStyles.backgroundColor || 'rgba(0, 0, 0, 0.8)');
        const chartLineTextColor = chartLineColorSettings.textFields?.axis || chartLineStyles.textColor || '#ffffff';
        const chartLineTitleColor = chartLineColorSettings.textFields?.title || chartLineStyles.titleColor || '#ffffff';
        // Извлекаем настройки линий с приоритетом
        const chartStrokeColor = element.data?.lineColors?.[0] || element.lineColors?.[0] || elementData.strokeColor || elementData.lineColors?.[0] || '#8884d8';
        const chartFillColor = elementData.fillColor || 'rgba(136, 132, 216, 0.3)';
        const chartGridColor = chartLineColorSettings.textFields?.grid || element.data?.gridColor || element.gridColor || elementData.gridColor || 'rgba(255,255,255,0.1)';
        
        const maxChartLineValue = Math.max(...chartLineData.map(d => d.value));
        const minChartLineValue = Math.min(...chartLineData.map(d => d.value));
        const chartLineRange = maxChartLineValue - minChartLineValue;
        
        return `
          <div id="${elementId}" class="content-element chart-component" style="
            margin: 2rem 0;
            padding: ${chartLineStyles.padding || 24}px;
            background: ${chartLineBackgroundColor};
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            max-width: ${element.data?.maxWidth || element.maxWidth || elementData.maxWidth || '100%'};
            width: ${element.data?.chartWidth || element.chartWidth || elementData.chartWidth || '100%'};
            margin-left: auto;
            margin-right: auto;
            position: relative;
            ${chartLineStyles.borderWidth ? `border: ${chartLineStyles.borderWidth}px solid ${chartLineStyles.borderColor || 'transparent'};` : ''}
          ">
            <h3 style="
              margin-bottom: ${element.data?.description || element.description || elementData.description ? '1rem' : '2rem'};
              color: ${chartLineTitleColor};
              font-size: 1.25rem;
              font-weight: bold;
              text-align: center;
              font-family: 'Montserrat', sans-serif;
            ">${element.data?.title || element.title || elementData.title || 'Линейный график'}</h3>
            
            ${element.data?.description || element.description || elementData.description ? `
              <p style="
                margin-bottom: 2rem;
                color: ${chartLineColorSettings.textFields?.legend || chartLineStyles.legendColor || '#333333'};
                font-size: 0.9rem;
                line-height: 1.5;
                text-align: center;
                max-width: 800px;
                margin-left: auto;
                margin-right: auto;
                font-family: 'Montserrat', sans-serif;
              ">${element.data?.description || element.description || elementData.description}</p>
            ` : ''}
            
            <div style="
              position: relative;
              height: 450px;
              padding: 20px;
              background: rgba(255,255,255,0.05);
              border-radius: 8px;
              border: 1px solid rgba(255,255,255,0.1);
            ">
              <style>
                /* Стили для точек графика */
                .chart-point-1, .chart-point-2 {
                  cursor: pointer;
                  transition: all 0.2s ease;
                }
                /* Hover эффекты для точек графика */
                .chart-point-1:hover, .chart-point-2:hover {
                  stroke: rgba(255,255,255,0.3) !important;
                  stroke-width: 8 !important;
                }
                /* Улучшение линий сетки */
                line[stroke-dasharray="3,3"] {
                  pointer-events: none;
                }
                /* Hover эффекты для круговых точек */
                circle[class*="chart-point"]:hover {
                  filter: drop-shadow(0 0 4px rgba(255,255,255,0.5));
                }
                /* Стили для невидимых областей - убираем hover эффект */
                rect[class*="chart-point"] {
                  cursor: pointer;
                }
                
                /* Стили для кастомных tooltip'ов */
                .chart-tooltip-${elementId} {
                  animation: tooltipFadeIn 0.2s ease-out;
                }
                
                @keyframes tooltipFadeIn {
                  from {
                    opacity: 0;
                    transform: translateY(5px);
                  }
                  to {
                    opacity: 1;
                    transform: translateY(0);
                  }
                }
                

              </style>
              <svg width="100%" height="100%" viewBox="0 0 800 400" style="overflow: visible;">
                <!-- Сетка -->
                <defs>
                  <pattern id="grid-${elementId}" width="80" height="70" patternUnits="userSpaceOnUse">
                                         <path d="M 80 0 L 0 0 0 70" fill="none" stroke="${chartGridColor}" stroke-width="1" opacity="0.3"/>
                   </pattern>
                 </defs>
                 <rect width="100%" height="100%" fill="url(#grid-${elementId})" />
                 
                 <!-- Область под линией -->
                 <defs>
                   <linearGradient id="areaGradient-${elementId}" x1="0%" y1="0%" x2="0%" y2="100%">
                     <stop offset="0%" style="stop-color:${chartLineColorSettings.lineColors?.line1 || element.data?.lineColors?.[0] || element.lineColors?.[0] || elementData.lineColors?.[0] || '#8884d8'};stop-opacity:0.3" />
                     <stop offset="100%" style="stop-color:${chartLineColorSettings.lineColors?.line1 || element.data?.lineColors?.[0] || element.lineColors?.[0] || elementData.lineColors?.[0] || '#8884d8'};stop-opacity:0.1" />
                   </linearGradient>
                 </defs>
                 
                 ${(() => {
                   // Получаем цвета линий
                   const lineColors = [
                     chartLineColorSettings.lineColors?.line1 || element.data?.lineColors?.[0] || element.lineColors?.[0] || elementData.lineColors?.[0] || '#8884d8',
                     chartLineColorSettings.lineColors?.line2 || element.data?.lineColors?.[1] || element.lineColors?.[1] || elementData.lineColors?.[1] || '#82ca9d'
                   ];
                   const lineNames = element.data?.lineNames || element.lineNames || elementData.lineNames || ['Линия 1', 'Линия 2'];
                   
                   // Переменные будут доступны в JavaScript коде через глобальные объекты
                   
                   // Переменные будут доступны в JavaScript коде через data-атрибуты
                   
                   // Вычисляем общий диапазон для всех значений (начиная от 0)
                   const allValues = [];
                   chartLineData.forEach(item => {
                     if (typeof item.value === 'number') allValues.push(item.value);
                     if (typeof item.value2 === 'number') allValues.push(item.value2);
                   });
                   const globalMin = 0; // Всегда начинаем от 0
                   const globalMax = Math.max(...allValues);
                   const globalRange = globalMax - globalMin;
                   
                   // Создаем точки для первой линии
                   const points1 = chartLineData.map((item, index) => {
                     const x = 80 + (index * (640 / (chartLineData.length - 1)));
                     const normalizedValue = globalRange === 0 ? 0.5 : (item.value - globalMin) / globalRange;
                     const y = 280 - (normalizedValue * 240);
                     return { x, y, value: item.value, name: item.name };
                   });
                   
                   // Создаем точки для второй линии (если есть value2)
                   const hasSecondLine = chartLineData.some(item => typeof item.value2 === 'number');
                   const points2 = hasSecondLine ? chartLineData.map((item, index) => {
                     const x = 80 + (index * (640 / (chartLineData.length - 1)));
                     const normalizedValue = globalRange === 0 ? 0.5 : ((item.value2 || 0) - globalMin) / globalRange;
                     const y = 280 - (normalizedValue * 240);
                     return { x, y, value: item.value2 || 0, name: item.name };
                   }) : [];
                   
                   // Создаем пути для линий
                   const pathData1 = points1.map((point, index) => 
                     index === 0 ? `M ${point.x} ${point.y}` : `L ${point.x} ${point.y}`
                   ).join(' ');
                   
                   const pathData2 = hasSecondLine ? points2.map((point, index) => 
                     index === 0 ? `M ${point.x} ${point.y}` : `L ${point.x} ${point.y}`
                   ).join(' ') : '';
                   
                   // Создаем область заливки для первой линии
                   const areaPath = `M 80 280 L ${points1.map(p => `${p.x} ${p.y}`).join(' L ')} L ${points1[points1.length - 1].x} 280 Z`;
                   
                   // Генерируем шкалу Y
                   const yAxisSteps = 5;
                   const yAxisLabels = [];
                   for (let i = 0; i <= yAxisSteps; i++) {
                     const value = globalMin + (globalRange * i / yAxisSteps);
                     const y = 280 - (i * 240 / yAxisSteps);
                     yAxisLabels.push({ y, value: Math.round(value) });
                   }
                   
                   return `
                     <!-- Ось Y -->
                     <line x1="50" y1="40" x2="50" y2="280" stroke="${chartLineTextColor}" stroke-width="1" opacity="0.5"/>
                     
                     <!-- Шкала Y -->
                     ${yAxisLabels.map(label => `
                       <line x1="45" y1="${label.y}" x2="55" y2="${label.y}" stroke="${chartLineTextColor}" stroke-width="1" opacity="0.5"/>
                       <text x="40" y="${label.y + 4}" text-anchor="end" fill="${chartLineTextColor}" font-size="10" font-family="Montserrat">
                         ${label.value}
                       </text>
                     `).join('')}
                     
                     <!-- Горизонтальные линии сетки -->
                     ${yAxisLabels.map(label => `
                       <line x1="100" y1="${label.y}" x2="720" y2="${label.y}" stroke="${chartLineTextColor}" stroke-width="1" opacity="0.1" stroke-dasharray="3,3"/>
                     `).join('')}
                     
                     <!-- Ось X -->
                     <line x1="50" y1="280" x2="750" y2="280" stroke="${chartLineTextColor}" stroke-width="1" opacity="0.5"/>
                     
                     <!-- Вертикальные линии сетки для месяцев -->
                     ${points1.map(point => `
                       <line x1="${point.x}" y1="40" x2="${point.x}" y2="280" stroke="${chartLineTextColor}" stroke-width="1" opacity="0.1" stroke-dasharray="3,3"/>
                     `).join('')}
                     
                     <!-- Область заливки для первой линии -->
                     <path d="${areaPath}" fill="url(#areaGradient-${elementId})" />
                     
                     <!-- Первая линия -->
                     <path d="${pathData1}" fill="none" stroke="${chartLineColorSettings.lineColors?.line1 || element.data?.lineColors?.[0] || element.lineColors?.[0] || elementData.lineColors?.[0] || '#8884d8'}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
                     
                     <!-- Точки первой линии -->
                     ${points1.map((point, index) => {
                       const secondLinePoint = points2[index];
                       const secondLineValue = secondLinePoint ? secondLinePoint.value : null;
                                                const tooltipText = secondLineValue 
                           ? `${point.name}\n${element.data?.lineNames?.[0] || element.lineNames?.[0] || elementData.lineNames?.[0] || 'Линия 1'}: ${point.value}\n${element.data?.lineNames?.[1] || element.lineNames?.[1] || elementData.lineNames?.[1] || 'Линия 2'}: ${secondLineValue}`
                           : `${point.name}\n${element.data?.lineNames?.[0] || element.lineNames?.[0] || elementData.lineNames?.[0] || 'Линия 1'}: ${point.value}`;
                       
                       return `
                         <circle cx="${point.x}" cy="${point.y}" r="4" fill="${chartLineColorSettings.lineColors?.line1 || element.data?.lineColors?.[0] || element.lineColors?.[0] || elementData.lineColors?.[0] || '#8884d8'}" stroke="white" stroke-width="2" />
                         <circle cx="${point.x}" cy="${point.y}" r="8" fill="transparent" stroke="transparent" stroke-width="6" class="chart-point-1" data-index="${index}">
                         </circle>
                         <!-- Невидимая область для лучшего взаимодействия с tooltip -->
                         <rect x="${point.x - 15}" y="${point.y - 15}" width="30" height="30" fill="transparent" class="chart-point-1" data-index="${index}">
                         </rect>
                       `;
                     }).join('')}
                     
                     ${hasSecondLine ? `
                       <!-- Вторая линия -->
                       <path d="${pathData2}" fill="none" stroke="${chartLineColorSettings.lineColors?.line2 || element.data?.lineColors?.[1] || element.lineColors?.[1] || elementData.lineNames?.[1] || '#82ca9d'}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
                       
                       <!-- Точки второй линии -->
                       ${points2.map((point, index) => {
                         const firstLinePoint = points1[index];
                         const firstLineValue = firstLinePoint ? firstLinePoint.value : null;
                         const tooltipText = firstLineValue 
                           ? `${point.name}\n${element.data?.lineNames?.[0] || element.lineNames?.[0] || elementData.lineNames?.[0] || 'Линия 1'}: ${firstLineValue}\n${element.data?.lineNames?.[1] || element.lineNames?.[1] || elementData.lineNames?.[1] || 'Линия 2'}: ${point.value}`
                           : `${point.name}\n${element.data?.lineNames?.[1] || element.lineNames?.[1] || elementData.lineNames?.[1] || 'Линия 2'}: ${point.value}`;
                         
                         return `
                           <circle cx="${point.x}" cy="${point.y}" r="4" fill="${chartLineColorSettings.lineColors?.line2 || element.data?.lineColors?.[1] || element.lineColors?.[1] || elementData.lineColors?.[1] || '#82ca9d'}" stroke="white" stroke-width="2" />
                           <circle cx="${point.x}" cy="${point.y}" r="8" fill="transparent" stroke="transparent" stroke-width="6" class="chart-point-2" data-index="${index}">
                           </circle>
                           <!-- Невидимая область для лучшего взаимодействия с tooltip -->
                           <rect x="${point.x - 15}" y="${point.y - 15}" width="30" height="30" fill="transparent" class="chart-point-2" data-index="${index}">
                           </rect>
                         `;
                       }).join('')}
                     ` : ''}
                     
                     <!-- Подписи оси X -->
                     ${points1.map((point, index) => `
                       <text x="${point.x}" y="300" text-anchor="middle" fill="${chartLineTextColor}" font-size="12" font-family="Montserrat">
                         ${point.name}
                       </text>
                     `).join('')}
                     
                     <!-- Легенда внизу (вертикально) -->
                     <g transform="translate(80, 320)">
                       <!-- Первая линия -->
                       <rect x="0" y="0" width="15" height="3" fill="${chartLineColorSettings.lineColors?.line1 || element.data?.lineColors?.[0] || element.lineColors?.[0] || elementData.lineColors?.[0] || '#8884d8'}"/>
                       <text x="20" y="8" fill="${chartLineColorSettings.lineColors?.line1 || element.data?.lineColors?.[0] || element.lineColors?.[0] || elementData.lineColors?.[0] || '#8884d8'}" font-size="12" font-family="Montserrat">${element.data?.lineNames?.[0] || element.lineNames?.[0] || elementData.lineNames?.[0] || 'Линия 1'}</text>
                       ${hasSecondLine ? `
                         <!-- Вторая линия (под первой) -->
                         <rect x="0" y="20" width="15" height="3" fill="${chartLineColorSettings.lineColors?.line2 || element.data?.lineColors?.[1] || element.lineColors?.[1] || elementData.lineColors?.[1] || '#82ca9d'}"/>
                         <text x="20" y="28" fill="${chartLineColorSettings.lineColors?.line2 || element.data?.lineColors?.[1] || element.lineColors?.[1] || elementData.lineColors?.[1] || '#82ca9d'}" font-size="12" font-family="Montserrat">${element.data?.lineNames?.[1] || element.lineNames?.[1] || elementData.lineNames?.[1] || 'Линия 2'}</text>
                       ` : ''}
                     </g>
                  `;
                })()}
              </svg>
              

              
              <!-- JavaScript для умных всплывающих подсказок -->
              <script>
                (function() {
                  const chartContainer = document.getElementById('${elementId}') || document.querySelector('.chart-component');
                  const svg = chartContainer ? chartContainer.querySelector('svg') : null;
                  
                  // Проверяем, что необходимые элементы найдены
                  if (!chartContainer || !svg) {
                    console.error('❌ Chart container or SVG not found');
                    return;
                  }
                  let tooltip = null;
                  
                  // Определяем данные для tooltip'ов напрямую
                  const chartData = ${JSON.stringify(chartLineData)};
                  const lineNames = ${JSON.stringify(element.data?.lineNames || element.lineNames || elementData.lineNames || ['Линия 1', 'Линия 2'])};
                  const lineColors = ${JSON.stringify([
                    chartLineColorSettings.lineColors?.line1 || element.data?.lineColors?.[0] || element.lineColors?.[0] || elementData.lineColors?.[0] || '#8884d8',
                    chartLineColorSettings.lineColors?.line2 || element.data?.lineColors?.[1] || element.lineColors?.[1] || elementData.lineColors?.[1] || '#82ca9d'
                  ])};
                  
                  // Функция для создания tooltip
                  function createTooltip() {
                    if (tooltip) return;
                    
                    tooltip = document.createElement('div');
                    tooltip.style.cssText = \`
                      position: fixed;
                      background: rgba(0, 0, 0, 0.95);
                      color: white;
                      padding: 12px 16px;
                      border-radius: 8px;
                      font-family: 'Montserrat', sans-serif;
                      font-size: 13px;
                      line-height: 1.5;
                      pointer-events: none;
                      z-index: 10000;
                      box-shadow: 0 8px 32px rgba(0,0,0,0.4);
                      border: 1px solid rgba(255,255,255,0.2);
                      min-width: 160px;
                      backdrop-filter: blur(10px);
                      -webkit-backdrop-filter: blur(10px);
                      white-space: pre-line;
                    \`;
                    tooltip.className = 'chart-tooltip-${elementId}';
                    document.body.appendChild(tooltip);
                  }
                  
                  // Функция для определения ближайшей точки
                  function findNearestPoint(mouseX, mouseY) {
                    const chartRect = svg.getBoundingClientRect();
                    const relativeX = mouseX - chartRect.left;
                    const relativeY = mouseY - chartRect.top;
                    
                    // Получаем все точки графика с правильными индексами
                    const points1 = Array.from(svg.querySelectorAll('.chart-point-1')).map((point, index) => {
                      const cx = parseFloat(point.getAttribute('cx') || '0');
                      const cy = parseFloat(point.getAttribute('cy') || '0');
                      // Используем data-index атрибут, если он есть, иначе используем порядковый индекс
                      const dataIndex = point.getAttribute('data-index');
                      const pointIndex = dataIndex !== null ? parseInt(dataIndex) : index;
                      return { x: cx, y: cy, index: pointIndex, line: 1 };
                    });
                    
                    const points2 = Array.from(svg.querySelectorAll('.chart-point-2')).map((point, index) => {
                      const cx = parseFloat(point.getAttribute('cx') || '0');
                      const cy = parseFloat(point.getAttribute('cy') || '0');
                      // Используем data-index атрибут, если он есть, иначе используем порядковый индекс
                      const dataIndex = point.getAttribute('data-index');
                      const pointIndex = dataIndex !== null ? parseInt(dataIndex) : index;
                      return { x: cx, y: cy, index: pointIndex, line: 2 };
                    });
                    
                    const allPoints = [...points1, ...points2];
                    
                    // Находим ближайшую точку с учетом радиуса взаимодействия
                    let nearestPoint = null;
                    let minDistance = Infinity;
                    const interactionRadius = 30; // Увеличиваем радиус для лучшего взаимодействия
                    
                    allPoints.forEach(point => {
                      const distance = Math.sqrt(
                        Math.pow(relativeX - point.x, 2) + 
                        Math.pow(relativeY - point.y, 2)
                      );
                      
                      // Если точка в радиусе взаимодействия и ближе предыдущей
                      if (distance <= interactionRadius && distance < minDistance) {
                        minDistance = distance;
                        nearestPoint = point;
                      }
                    });
                    
                    // Если не нашли точку в радиусе, ищем ближайшую в пределах большего радиуса
                    if (!nearestPoint) {
                      const extendedRadius = 50; // Увеличиваем расширенный радиус
                      allPoints.forEach(point => {
                        const distance = Math.sqrt(
                          Math.pow(relativeX - point.x, 2) + 
                          Math.pow(relativeY - point.y, 2)
                        );
                        
                        if (distance <= extendedRadius && distance < minDistance) {
                          minDistance = distance;
                          nearestPoint = point;
                        }
                      });
                    }
                    
                    // Отладочная информация
                    if (nearestPoint) {
                      console.log('🎯 Nearest point found:', {
                        index: nearestPoint.index,
                        line: nearestPoint.line,
                        distance: minDistance,
                        pointX: nearestPoint.x,
                        pointY: nearestPoint.y,
                        mouseRelativeX: relativeX,
                        mouseRelativeY: relativeY
                      });
                      
                      // Дополнительная отладка для понимания проблемы с индексами
                      console.log('🔍 Points1 indices:', points1.map(p => p.index));
                      console.log('🔍 Points2 indices:', points2.map(p => p.index));
                      console.log('🔍 All points indices:', allPoints.map(p => p.index));
                    }
                    
                    return nearestPoint;
                  }
                  
                  // Функция для показа tooltip
                  function showTooltip(mouseX, mouseY) {
                    console.log('🔍 showTooltip called with:', { mouseX, mouseY });
                    console.log('🔍 chartData:', chartData);
                    console.log('🔍 lineNames:', lineNames);
                    console.log('🔍 lineColors:', lineColors);
                    
                    const nearestPoint = findNearestPoint(mouseX, mouseY);
                    if (!nearestPoint) {
                      console.log('❌ No nearest point found');
                      return;
                    }
                    
                    console.log('🎯 Nearest point:', nearestPoint);
                    
                    createTooltip();
                    
                    // Получаем данные для tooltip
                    const pointData = chartData[nearestPoint.index];
                    
                    // Проверяем, что индекс находится в допустимых пределах
                    if (nearestPoint.index < 0 || nearestPoint.index >= chartData.length) {
                      console.error('❌ Invalid index:', nearestPoint.index, 'chartData length:', chartData.length);
                      hideTooltip();
                      return;
                    }
                    
                    // Проверяем, что данные существуют
                    if (!pointData) {
                      console.error('❌ Point data not found for index:', nearestPoint.index, 'chartData:', chartData);
                      hideTooltip();
                      return;
                    }
                    
                    // Проверяем, что chartData и lineNames существуют
                    if (!chartData || !Array.isArray(chartData)) {
                      console.error('❌ chartData is not an array:', chartData);
                      hideTooltip();
                      return;
                    }
                    
                    if (!lineNames || !Array.isArray(lineNames)) {
                      console.error('❌ lineNames is not an array:', lineNames);
                      hideTooltip();
                      return;
                    }
                    
                    if (!lineColors || !Array.isArray(lineColors)) {
                      console.error('❌ lineColors is not an array:', lineColors);
                      hideTooltip();
                      return;
                    }
                    
                    // Формируем содержимое tooltip с улучшенным форматированием
                    let tooltipContent = \`<strong>\${pointData.name || 'Точка ' + (nearestPoint.index + 1)}</strong>\`;
                    
                    // НОВЫЙ ПОРЯДОК: Зеленая строка ПЕРВАЯ, фиолетовая ВТОРАЯ
                    console.log('🔍 [TOOLTIP DEBUG] value2:', pointData.value2, 'value:', pointData.value);
                    console.log('🔍 [TOOLTIP DEBUG] lineColors:', lineColors);
                    console.log('🔍 [TOOLTIP DEBUG] lineNames:', lineNames);
                    
                    // 1. ЗЕЛЕНАЯ строка ПЕРВАЯ (Капитализация рынка - value2)
                    if (pointData.value2 !== undefined) {
                      tooltipContent += \`\n<span style="color: \${lineColors[1]}">●</span> <span style="color: \${lineColors[1]}">\${lineNames[1]}: <strong>\${pointData.value2}</strong></span>\`;
                      console.log('🔍 [TOOLTIP DEBUG] Добавлена ЗЕЛЕНАЯ строка:', lineNames[1], pointData.value2);
                    }
                    
                    // 2. ФИОЛЕТОВАЯ строка ВТОРАЯ (Объем инвестиций - value)
                    if (pointData.value !== undefined) {
                      tooltipContent += \`\n<span style="color: \${lineColors[0]}">●</span> <span style="color: \${lineColors[0]}">\${lineNames[0]}: <strong>\${pointData.value}</strong></span>\`;
                      console.log('🔍 [TOOLTIP DEBUG] Добавлена ФИОЛЕТОВАЯ строка:', lineNames[0], pointData.value);
                    }
                    
                    // Добавляем процентное соотношение (если есть вторая линия)
                    if (pointData.value2 !== undefined && pointData.value > 0) {
                      const percentage = ((pointData.value2 / pointData.value) * 100).toFixed(1);
                      tooltipContent += \`\n<span style="opacity: 0.8; font-size: 11px; color: #cccccc;">⚖ \${percentage}%</span>\`;
                    }
                    
                    tooltip.innerHTML = tooltipContent;
                    
                    // Улучшенное позиционирование tooltip с учетом границ экрана и элемента
                    const chartRect = chartContainer ? chartContainer.getBoundingClientRect() : svg.getBoundingClientRect();
                    const tooltipRect = tooltip.getBoundingClientRect();
                    
                    // Умное позиционирование в зависимости от положения курсора
                    let left, top;
                    
                    // Определяем, где лучше показать tooltip
                    const spaceOnRight = window.innerWidth - mouseX;
                    const spaceOnLeft = mouseX;
                    const tooltipWidth = tooltipRect.width + 30; // 15px отступ с каждой стороны
                    
                    // Если справа достаточно места, показываем справа
                    if (spaceOnRight >= tooltipWidth) {
                      left = mouseX + 15;
                    } 
                    // Если справа мало места, но слева много - показываем слева
                    else if (spaceOnLeft >= tooltipWidth) {
                      left = mouseX - tooltipRect.width - 15;
                    }
                    // Если нигде не хватает места, показываем по центру курсора
                    else {
                      left = mouseX - (tooltipRect.width / 2);
                    }
                    
                    // Вертикальное позиционирование
                    top = mouseY - tooltipRect.height / 2;
                    
                    // Проверяем границы экрана
                    if (left < 0) left = 10;
                    if (left + tooltipRect.width > window.innerWidth) {
                      left = window.innerWidth - tooltipRect.width - 10;
                    }
                    if (top < 0) top = 10;
                    if (top + tooltipRect.height > window.innerHeight) {
                      top = window.innerHeight - tooltipRect.height - 10;
                    }
                    
                    // Дополнительная проверка - tooltip не должен выходить за пределы элемента графика
                    if (chartRect) {
                      // Если tooltip выходит за левую границу элемента
                      if (left < chartRect.left) {
                        left = chartRect.left + 10;
                      }
                      
                      // Если tooltip выходит за правую границу элемента
                      if (left + tooltipRect.width > chartRect.right) {
                        left = chartRect.right - tooltipRect.width - 10;
                      }
                      
                      // Если tooltip выходит за верхнюю границу элемента
                      if (top < chartRect.top) {
                        top = chartRect.top + 10;
                      }
                      
                      // Если tooltip выходит за нижнюю границу элемента
                      if (top + tooltipRect.height > chartRect.bottom) {
                        top = chartRect.bottom - tooltipRect.height - 10;
                      }
                    }
                    
                    // Применяем позицию
                    tooltip.style.left = left + 'px';
                    tooltip.style.top = top + 'px';
                    
                    // Отладочная информация (можно убрать в продакшене)
                    console.log('🔍 Tooltip positioning:', {
                      mouseX, mouseY,
                      tooltipWidth: tooltipRect.width,
                      tooltipHeight: tooltipRect.height,
                      spaceOnRight,
                      spaceOnLeft,
                      finalLeft: left,
                      finalTop: top,
                      chartRect: chartRect ? {
                        left: chartRect.left,
                        right: chartRect.right,
                        top: chartRect.top,
                        bottom: chartRect.bottom
                      } : null,
                      chartContainer: chartContainer ? chartContainer.id : 'not found',
                      svg: svg ? 'found' : 'not found'
                    });
                  }
                  
                  // Функция для скрытия tooltip
                  function hideTooltip() {
                    if (tooltip) {
                      tooltip.remove();
                      tooltip = null;
                      isTooltipVisible = false;
                    }
                  }
                  
                  // Обработчики событий для SVG с улучшенным throttling для производительности
                  let tooltipTimeout = null;
                  let lastMouseX = null;
                  let lastMouseY = null;
                  let isTooltipVisible = false;
                  
                  svg.addEventListener('mousemove', function(e) {
                    // Throttling для улучшения производительности
                    if (tooltipTimeout) return;
                    
                    tooltipTimeout = setTimeout(() => {
                      // Показываем tooltip только если он еще не видим или курсор значительно переместился
                      if (!isTooltipVisible || 
                          lastMouseX === null || 
                          lastMouseY === null ||
                          Math.abs(e.clientX - lastMouseX) > 5 || 
                          Math.abs(e.clientY - lastMouseY) > 5) {
                        showTooltip(e.clientX, e.clientY);
                        isTooltipVisible = true;
                      }
                      
                      // Обновляем последние координаты ПОСЛЕ показа tooltip
                      lastMouseX = e.clientX;
                      lastMouseY = e.clientY;
                      
                      tooltipTimeout = null;
                    }, 20); // Увеличиваем интервал для лучшей производительности
                  });
                  
                  svg.addEventListener('mouseleave', function() {
                    if (tooltipTimeout) {
                      clearTimeout(tooltipTimeout);
                      tooltipTimeout = null;
                    }
                    hideTooltip();
                    isTooltipVisible = false;
                  });
                  
                  // Обработчики для точек графика и невидимых областей
                  const chartPoints = svg.querySelectorAll('.chart-point-1, .chart-point-2');
                  const invisibleRects = svg.querySelectorAll('rect[class*="chart-point"]');
                  
                  // Объединяем все элементы для обработки событий
                  const allInteractiveElements = [...chartPoints, ...invisibleRects];
                  
                  allInteractiveElements.forEach(element => {
                    element.addEventListener('mouseenter', function(e) {
                      if (tooltipTimeout) {
                        clearTimeout(tooltipTimeout);
                        tooltipTimeout = null;
                      }
                      showTooltip(e.clientX, e.clientY);
                      isTooltipVisible = true;
                    });
                    
                    element.addEventListener('mouseleave', function() {
                      hideTooltip();
                    });
                  });
                  
                  // Добавляем обработчик для клика по точкам (опционально)
                  chartPoints.forEach(point => {
                    point.addEventListener('click', function(e) {
                      // Можно добавить дополнительную функциональность при клике
                      const clickedPoint = findNearestPoint(e.clientX, e.clientY);
                      if (clickedPoint) {
                        console.log('Clicked on chart point:', clickedPoint);
                      }
                    });
                  });
                })();
              </script>
            </div>
          </div>
        `;
      case 'advanced-pie-chart':

        
        // Извлекаем данные по модели bar-chart
        let pieData;
        if (Array.isArray(element.data)) {
          pieData = element.data;
        } else if (Array.isArray(elementData.data)) {
          pieData = elementData.data;
        } else if (element.data && Array.isArray(element.data.data)) {
          pieData = element.data.data;
        } else {
          pieData = [
          { name: 'Продукт A', value: 35, fill: '#8884d8' },
          { name: 'Продукт B', value: 28, fill: '#82ca9d' },
          { name: 'Продукт C', value: 22, fill: '#ffc658' },
          { name: 'Продукт D', value: 15, fill: '#ff7c7c' }
        ];
        }
        

        
        // Извлекаем стили - AdvancedPieChart использует colorSettings с fallback на старые настройки
        const pieColorSettings = element.colorSettings || elementData.colorSettings || {};
        const pieStyles = element.customStyles || elementData.customStyles || {};
        
        // Получаем цвета из новой системы colorSettings с fallback на старые
        const pieBackgroundColor = pieColorSettings.sectionBackground?.enabled 
          ? (pieColorSettings.sectionBackground.useGradient 
              ? `linear-gradient(${pieColorSettings.sectionBackground.gradientDirection}, ${pieColorSettings.sectionBackground.gradientColor1}, ${pieColorSettings.sectionBackground.gradientColor2})`
              : pieColorSettings.sectionBackground.solidColor)
          : (pieStyles.backgroundColor || element.backgroundColor || elementData.backgroundColor || '#ffffff');
        const pieTextColor = pieColorSettings.textFields?.legend || pieStyles.textColor || element.legendColor || elementData.legendColor || '#333333';
        const pieTitleColor = pieColorSettings.textFields?.title || pieStyles.titleColor || element.titleColor || elementData.titleColor || '#1976d2';
        const pieDescriptionColor = pieColorSettings.textFields?.description || '#cccccc';
        const pieBorderColor = pieColorSettings.borderColor || pieStyles.borderColor || 'transparent';
        const pieBorderWidth = pieColorSettings.borderWidth || pieStyles.borderWidth || 0;
        const piePadding = pieColorSettings.padding || pieStyles.padding || element.padding || elementData.padding || 24;
        const pieBorderRadius = pieColorSettings.borderRadius || pieStyles.borderRadius || element.borderRadius || elementData.borderRadius || 8;
        
        // Извлекаем цвета для сегментов
        const pieColors = element.pieColors || elementData.pieColors || ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088fe', '#00c49f', '#ffbb28', '#ff8042'];
        
        // Добавляем цвета к данным, создавая новые объекты
        pieData = pieData.map((item, index) => ({
          ...item,
          fill: item.fill || item.color || pieColors[index % pieColors.length]
        }));
        

        
        const total = pieData.reduce((sum, item) => sum + item.value, 0);
        let currentAngle = 0;
        
        return `
          <div id="${elementId}" class="content-element chart-component" style="
            margin: 2rem 0;
            padding: ${piePadding}px;
            background: ${pieBackgroundColor};
            border-radius: ${pieBorderRadius}px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            max-width: 1200px;
            margin-left: auto;
            margin-right: auto;
            position: relative;
            ${pieBorderWidth > 0 ? `border: ${pieBorderWidth}px solid ${pieBorderColor};` : ''}
          ">
            <h3 style="
              margin-bottom: 2rem;
              margin-left: 2rem;
              margin-right: 2rem;
              color: ${pieTitleColor};
              font-size: 1.25rem;
              font-weight: bold;
              text-align: center;
              font-family: 'Montserrat', sans-serif;
            ">${element.title || elementData.title || 'Круговая диаграмма'}</h3>
            
            <div style="
              display: flex;
              flex-direction: column;
              align-items: center;
              gap: 24px;
            ">
              <!-- Диаграмма по центру -->
              <div style="display: flex; justify-content: center;">
                <svg width="300" height="300" viewBox="0 0 300 300" style="overflow: visible;">
                  <defs>
                    ${pieData.map((item, index) => `
                      <filter id="shadow-${elementId}-${index}" x="-50%" y="-50%" width="200%" height="200%">
                        <feDropShadow dx="2" dy="2" stdDeviation="3" flood-color="rgba(0,0,0,0.3)"/>
                      </filter>
                    `).join('')}
                  </defs>
                  
                  ${pieData.map((item, index) => {
                    const percentage = (item.value / total) * 100;
                    const angle = (item.value / total) * 360;
                    const startAngle = currentAngle;
                    const endAngle = currentAngle + angle;
                    
                    // Конвертируем углы в радианы
                    const startRad = (startAngle - 90) * Math.PI / 180;
                    const endRad = (endAngle - 90) * Math.PI / 180;
                    
                    // Вычисляем координаты
                    const radius = 120;
                    const centerX = 150;
                    const centerY = 150;
                    
                    const x1 = centerX + radius * Math.cos(startRad);
                    const y1 = centerY + radius * Math.sin(startRad);
                    const x2 = centerX + radius * Math.cos(endRad);
                    const y2 = centerY + radius * Math.sin(endRad);
                    
                    const largeArcFlag = angle > 180 ? 1 : 0;
                    
                    const pathData = [
                      `M ${centerX} ${centerY}`,
                      `L ${x1} ${y1}`,
                      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                      'Z'
                    ].join(' ');
                    
                    // Координаты для текста
                    const textAngle = (startAngle + endAngle) / 2;
                    const textRad = (textAngle - 90) * Math.PI / 180;
                    const textRadius = radius * 0.7;
                    const textX = centerX + textRadius * Math.cos(textRad);
                    const textY = centerY + textRadius * Math.sin(textRad);
                    
                    currentAngle = endAngle;
                    
                    return `
                      <path 
                        d="${pathData}" 
                        fill="${item.fill || item.color || '#8884d8'}" 
                        stroke="white" 
                        stroke-width="2"
                        filter="url(#shadow-${elementId}-${index})"
                        style="cursor: pointer; transition: all 0.3s ease;"
                        class="pie-segment"
                        data-index="${index}"
                        data-name="${item.name}"
                        data-value="${item.value}"
                        data-percentage="${Math.round(percentage)}"
                        data-color="${item.fill || item.color || '#8884d8'}"

                      />
                      ${percentage > 5 ? `
                        <text 
                          x="${textX}" 
                          y="${textY}" 
                          text-anchor="middle" 
                          dominant-baseline="middle"
                          fill="white" 
                          font-size="12" 
                          font-weight="bold"
                          font-family="Montserrat"
                          style="pointer-events: none; transition: all 0.3s ease;"
                          class="pie-segment-text"
                          data-index="${index}"
                        >
                          ${Math.round(percentage)}%
                        </text>
                      ` : ''}
                    `;
                  }).join('')}
                </svg>
              </div>
              
              <!-- JavaScript для умных всплывающих подсказок -->
              <script>
                (function() {
                  const chartContainer = document.getElementById('${elementId}') || document.querySelector('.chart-component');
                  const svg = chartContainer ? chartContainer.querySelector('svg') : null;
                  
                  // Проверяем, что необходимые элементы найдены
                  if (!chartContainer || !svg) {
                    console.error('❌ Chart container or SVG not found');
                    return;
                  }
                  
                  let tooltip = null;
                  
                  // Определяем данные для tooltip'ов напрямую
                  const pieData = ${JSON.stringify(pieData)};
                  const pieColors = ${JSON.stringify(pieColors)};
                  
                  // Функция для создания tooltip
                  function createTooltip() {
                    if (tooltip) return;
                    
                    tooltip = document.createElement('div');
                    tooltip.style.cssText = \`
                      position: fixed;
                      background: rgba(0, 0, 0, 0.95);
                      color: white;
                      padding: 12px 16px;
                      border-radius: 8px;
                      font-family: 'Montserrat', sans-serif;
                      font-size: 13px;
                      line-height: 1.5;
                      pointer-events: none;
                      z-index: 10000;
                      box-shadow: 0 8px 32px rgba(0,0,0,0.4);
                      border: 1px solid rgba(255,255,255,0.2);
                      min-width: 160px;
                      backdrop-filter: blur(10px);
                      -webkit-backdrop-filter: blur(10px);
                      white-space: pre-line;
                    \`;
                    tooltip.className = 'pie-chart-tooltip-${elementId}';
                    document.body.appendChild(tooltip);
                  }
                  
                  // Функция для показа tooltip
                  function showTooltip(mouseX, mouseY) {
                    const chartRect = svg.getBoundingClientRect();
                    const relativeX = mouseX - chartRect.left;
                    const relativeY = mouseY - chartRect.top;
                    
                    // Находим ближайший сегмент
                    const centerX = 150;
                    const centerY = 150;
                    const radius = 120;
                    
                    // Вычисляем расстояние от центра
                    const distanceFromCenter = Math.sqrt(
                      Math.pow(relativeX - centerX, 2) + 
                      Math.pow(relativeY - centerY, 2)
                    );
                    
                    // Если мышь находится в пределах диаграммы
                    if (distanceFromCenter <= radius) {
                      // Вычисляем угол от центра
                      const angle = Math.atan2(relativeY - centerY, relativeX - centerX) * 180 / Math.PI;
                      // Нормализуем угол (0-360 градусов)
                      const normalizedAngle = (angle + 90 + 360) % 360;
                      
                      // Находим соответствующий сегмент
                      let currentAngle = 0;
                      let segmentIndex = -1;
                      
                      for (let i = 0; i < pieData.length; i++) {
                        const percentage = (pieData[i].value / pieData.reduce((sum, item) => sum + item.value, 0)) * 100;
                        const segmentAngle = (percentage / 100) * 360;
                        
                        if (normalizedAngle >= currentAngle && normalizedAngle <= currentAngle + segmentAngle) {
                          segmentIndex = i;
                          break;
                        }
                        currentAngle += segmentAngle;
                      }
                      
                      if (segmentIndex !== -1) {
                        const segment = pieData[segmentIndex];
                        const total = pieData.reduce((sum, item) => sum + item.value, 0);
                        const percentage = ((segment.value / total) * 100).toFixed(1);
                        
                        createTooltip();
                        
                        // Формируем содержимое tooltip
                        const tooltipContent = \`
                          <strong>\${segment.name}</strong>
                          <span style="color: \${segment.fill || pieColors[segmentIndex % pieColors.length]}">●</span> <span style="color: \${segment.fill || pieColors[segmentIndex % pieColors.length]}">\${segment.value}</span>
                        \`;
                        
                        tooltip.innerHTML = tooltipContent;
                        
                        // Позиционируем tooltip
                        const tooltipRect = tooltip.getBoundingClientRect();
                        let tooltipX = mouseX + 15;
                        let tooltipY = mouseY - tooltipRect.height - 10;
                        
                        // Проверяем границы экрана
                        if (tooltipX + tooltipRect.width > window.innerWidth) {
                          tooltipX = mouseX - tooltipRect.width - 15;
                        }
                        if (tooltipY < 0) {
                          tooltipY = mouseY + 20;
                        }
                        
                        tooltip.style.left = tooltipX + 'px';
                        tooltip.style.top = tooltipY + 'px';
                        tooltip.style.display = 'block';
                      }
                    }
                  }
                  
                  // Функция для скрытия tooltip
                  function hideTooltip() {
                    if (tooltip) {
                      tooltip.style.display = 'none';
                    }
                  }
                  
                  // Добавляем обработчики событий
                  svg.addEventListener('mousemove', (e) => {
                    showTooltip(e.clientX, e.clientY);
                  });
                  
                  svg.addEventListener('mouseleave', () => {
                    hideTooltip();
                  });
                  
                  // Анимация сегментов и текста при наведении
                  const segments = svg.querySelectorAll('.pie-segment');
                  const textElements = svg.querySelectorAll('.pie-segment-text');
                  
                  segments.forEach((segment, index) => {
                    const textElement = textElements[index];
                    const centerX = 150;
                    const centerY = 150;
                    
                    segment.addEventListener('mouseenter', () => {
                      // Анимируем сегмент
                      segment.style.transform = 'scale(1.05)';
                      segment.style.transformOrigin = centerX + 'px ' + centerY + 'px';
                      
                      // Анимируем текст вместе с сегментом
                      if (textElement) {
                        textElement.style.transform = 'scale(1.05)';
                        textElement.style.transformOrigin = centerX + 'px ' + centerY + 'px';
                      }
                    });
                    
                    segment.addEventListener('mouseleave', () => {
                      // Возвращаем сегмент в исходное состояние
                      segment.style.transform = 'scale(1)';
                      
                      // Возвращаем текст в исходное состояние
                      if (textElement) {
                        textElement.style.transform = 'scale(1)';
                      }
                    });
                  });
                  
                  // Очистка при уничтожении элемента
                  window.addEventListener('beforeunload', () => {
                    if (tooltip && tooltip.parentNode) {
                      tooltip.parentNode.removeChild(tooltip);
                    }
                  });
                })();
              </script>
              
              <!-- Легенда снизу в несколько строк -->
              <div style="
                display: flex;
                flex-wrap: wrap;
                justify-content: center;
                gap: 20px;
                max-width: 600px;
              ">
                ${pieData.map((item, index) => {
                  return `
                    <div style="
                      display: flex;
                      align-items: center;
                      gap: 8px;
                    ">
                      <div style="
                        width: 12px;
                        height: 12px;
                        background: ${item.fill || item.color || '#8884d8'};
                        border-radius: 2px;
                        flex-shrink: 0;
                      "></div>
                      <span style="
                        color: ${item.fill || item.color || '#8884d8'};
                        font-size: 12px;
                        font-weight: 500;
                        font-family: 'Montserrat', sans-serif;
                        white-space: nowrap;
                      ">${item.name}</span>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
          </div>
        `;

      case 'advanced-area-chart':
        console.log('🔍 [DEBUG] advanced-area-chart - START');
        console.log('🔍 [DEBUG] element:', element);
        console.log('🔍 [DEBUG] elementData:', elementData);
        console.log('🔍 [DEBUG] elementId:', elementId);
        
        // Извлекаем данные и стили
        // Сначала проверяем element.data (из парсера), потом element.content (из AI), потом elementData
        let rawAreaData = element.data || elementData.data;
        console.log('🔧 [DEBUG] Initial rawAreaData check:');
        console.log('🔧 [DEBUG] element.data:', element.data);
        console.log('🔧 [DEBUG] elementData.data:', elementData.data);
        console.log('🔧 [DEBUG] element.data type:', typeof element.data);
        console.log('🔧 [DEBUG] element.data isArray:', Array.isArray(element.data));
        
        // Если данных нет, но есть content, попробуем распарсить его
        if (!rawAreaData && (element.content || elementData.content)) {
          console.log('🔧 [DEBUG] Parsing content as rawAreaData');
          const content = element.content || elementData.content || '';
          console.log('🔧 [DEBUG] Content to parse:', content);
          
          // Парсим контент в формате: "Янв - 780, 360 * Фев - 810, 385 * ..."
          const dataItems = content.split('*').map(item => item.trim()).filter(item => item);
          console.log('🔧 [DEBUG] Parsed dataItems:', dataItems);
          
          rawAreaData = dataItems.map((item, idx) => {
            const dashIndex = item.lastIndexOf('-');
            if (dashIndex !== -1) {
              const name = item.substring(0, dashIndex).trim();
              const valuesStr = item.substring(dashIndex + 1).trim();
              const values = valuesStr.split(',').map(v => parseFloat(v.trim().replace(/[^\d.]/g, '')) || 0);
              
              return {
                name: name || `Период ${idx + 1}`,
                value: values[0] || 0,
                value2: values[1] || 0
              };
            }
            return { name: `Период ${idx + 1}`, value: 0, value2: 0 };
          });
          
          console.log('🔧 [DEBUG] Parsed rawAreaData from content:', rawAreaData);
        }
        
        // Если element.data - объект (не массив), конвертируем в массив
        if (rawAreaData && typeof rawAreaData === 'object' && !Array.isArray(rawAreaData)) {
          console.log('🔧 [DEBUG] Converting object to array');
          console.log('🔧 [DEBUG] rawAreaData keys:', Object.keys(rawAreaData));
          
          // Конвертируем объект в массив
          const dataArray = [];
          Object.keys(rawAreaData).forEach(key => {
            if (rawAreaData[key] && typeof rawAreaData[key] === 'object') {
              dataArray.push(rawAreaData[key]);
            }
          });
          
          if (dataArray.length > 0) {
            rawAreaData = dataArray;
            console.log('🔧 [DEBUG] Converted to array:', rawAreaData);
          }
        }
        
        // Fallback данные только если совсем ничего нет
        if (!rawAreaData || !Array.isArray(rawAreaData) || rawAreaData.length === 0) {
          console.log('🔧 [DEBUG] Using fallback data');
          rawAreaData = [
            { name: 'Янв', value: 65, value2: 45 },
            { name: 'Фев', value: 59, value2: 55 },
            { name: 'Мар', value: 80, value2: 70 },
            { name: 'Апр', value: 81, value2: 60 },
            { name: 'Май', value: 56, value2: 65 },
            { name: 'Июн', value: 55, value2: 50 }
          ];
        }
        console.log('🔍 [DEBUG] rawAreaData:', rawAreaData);
        console.log('🔍 [DEBUG] rawAreaData type:', typeof rawAreaData);
        console.log('🔍 [DEBUG] rawAreaData isArray:', Array.isArray(rawAreaData));
        
        // Извлекаем labels из данных или используем переданные
        const areaChartLabels = Array.isArray(rawAreaData) && rawAreaData[0]?.name 
          ? rawAreaData.map(item => item.name) 
          : (element.labels || elementData.labels || ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн']);
        console.log('🔍 [DEBUG] areaChartLabels:', areaChartLabels);
          
        // Извлекаем значения для первой линии
        const areaChartData1 = Array.isArray(rawAreaData) 
          ? rawAreaData.map(item => typeof item === 'object' ? item.value || 0 : item)
          : (Array.isArray(rawAreaData) ? rawAreaData : [65, 59, 80, 81, 56, 55]);
        console.log('🔍 [DEBUG] areaChartData1:', areaChartData1);
          
        // Извлекаем значения для второй линии (если есть)
        const areaChartData2 = Array.isArray(rawAreaData) && rawAreaData[0]?.value2 !== undefined
          ? rawAreaData.map(item => item.value2 || 0)
          : (Array.isArray(rawAreaData) ? rawAreaData.map(item => typeof item === 'object' ? item.value2 || 0 : 0) : [45, 55, 70, 60, 65, 50]);
        console.log('🔍 [DEBUG] areaChartData2:', areaChartData2);
        
        const areaChartTitle = element.title || elementData.title || 'Сравнительный анализ рыночной капитализации Bitcoin и Ethereum в контексте инвестиционной активности в ОАЭ за последние месяцы';
        
        // Получаем настройки цветов из colorSettings с fallback на старые
        const areaChartColorSettings = element.colorSettings || elementData.colorSettings || {};
        const areaChartTitleColor = areaChartColorSettings.textFields?.title || element.titleColor || elementData.titleColor || '#333333';
        const areaChartBorderColor = areaChartColorSettings.borderColor || element.borderColor || elementData.borderColor || 'rgb(75, 192, 192)';
        const areaChartBackgroundColor = areaChartColorSettings.sectionBackground?.enabled 
          ? (areaChartColorSettings.sectionBackground.useGradient 
              ? `linear-gradient(${areaChartColorSettings.sectionBackground.gradientDirection}, ${areaChartColorSettings.sectionBackground.gradientColor1}, ${areaChartColorSettings.sectionBackground.gradientColor2})`
              : areaChartColorSettings.sectionBackground.solidColor)
          : (element.backgroundColor || elementData.backgroundColor || 'rgba(75, 192, 192, 0.2)');
        const areaChartBorderRadius = areaChartColorSettings.borderRadius || element.borderRadius || elementData.borderRadius || 12;
        const areaChartPadding = areaChartColorSettings.padding || element.padding || elementData.padding || 32;
        const areaChartBoxShadow = areaChartColorSettings.boxShadow ? '0 4px 20px rgba(0,0,0,0.15)' : '0 4px 12px rgba(0,0,0,0.1)';
        const areaChartBorderWidth = areaChartColorSettings.borderWidth || element.borderWidth || elementData.borderWidth || 0;
        const areaChartBorderStyle = areaChartBorderWidth ? `${areaChartBorderWidth}px solid ${areaChartBorderColor}` : 'none';
        
        const areaChartDatasetLabel = element.datasetLabel || elementData.datasetLabel || 'Область 1';
        
        // Извлекаем дополнительные цвета из colorSettings
        const areaChartGridColor = areaChartColorSettings.gridSettings?.color || areaChartColorSettings.textFields?.grid || element.gridColor || elementData.gridColor || '#e0e0e0';
        const areaChartAxisColor = areaChartColorSettings.textFields?.axisLabel || areaChartColorSettings.textFields?.axis || element.axisColor || elementData.axisColor || '#666666';
        const areaChartLegendColor = areaChartColorSettings.textFields?.legendText || areaChartColorSettings.textFields?.legend || element.legendColor || elementData.legendColor || '#333333';
        
        // Извлекаем стиль сетки
        const areaChartGridStyle = areaChartColorSettings.gridSettings?.style || 'dashed';
        const areaChartGridWidth = areaChartColorSettings.gridSettings?.width || 1;
        const areaChartAreaColor1 = areaChartColorSettings.areaColors?.area1 || element.areaColors?.[0] || elementData.areaColors?.[0] || '#8884d8';
        const areaChartAreaColor2 = areaChartColorSettings.areaColors?.area2 || element.areaColors?.[1] || elementData.areaColors?.[1] || '#82ca9d';
        
        console.log('🔍 [DEBUG] areaChartTitle:', areaChartTitle);
        console.log('🔍 [DEBUG] areaChartTitleColor:', areaChartTitleColor);
        console.log('🔍 [DEBUG] areaChartColorSettings:', areaChartColorSettings);
        console.log('🔍 [DEBUG] areaChartBackgroundColor:', areaChartBackgroundColor);
        console.log('🔍 [DEBUG] areaChartBorderRadius:', areaChartBorderRadius);
        console.log('🔍 [DEBUG] areaChartPadding:', areaChartPadding);
        console.log('🔍 [DEBUG] areaChartBoxShadow:', areaChartBoxShadow);
        console.log('🔍 [DEBUG] areaChartBorderWidth:', areaChartBorderWidth);
        console.log('🔍 [DEBUG] areaChartBorderStyle:', areaChartBorderStyle);
        console.log('🔍 [DEBUG] areaChartGridColor:', areaChartGridColor);
        console.log('🔍 [DEBUG] areaChartAxisColor:', areaChartAxisColor);
        console.log('🔍 [DEBUG] areaChartLegendColor:', areaChartLegendColor);
        console.log('🔍 [DEBUG] areaChartAreaColor1:', areaChartAreaColor1);
        console.log('🔍 [DEBUG] areaChartAreaColor2:', areaChartAreaColor2);
        console.log('🔍 [DEBUG] Final data for SVG generation:');
        console.log('🔍 [DEBUG] - Labels:', areaChartLabels);
        console.log('🔍 [DEBUG] - Data1:', areaChartData1);
        console.log('🔍 [DEBUG] - Data2:', areaChartData2);
        
        console.log('🚀 [HTML GENERATION] About to generate HTML with:');
        console.log('🚀 [HTML GENERATION] elementId:', elementId);
        console.log('🚀 [HTML GENERATION] JSON.stringify(areaChartLabels):', JSON.stringify(areaChartLabels));
        console.log('🚀 [HTML GENERATION] JSON.stringify(areaChartData1):', JSON.stringify(areaChartData1));
        console.log('🚀 [HTML GENERATION] JSON.stringify(areaChartData2):', JSON.stringify(areaChartData2));
        

        
        return `
          <style>
            @keyframes fadeIn {
              from {
                opacity: 0;
                transform: translateY(20px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
            
            .chart-component {
              animation: fadeIn 0.8s ease-in-out;
              opacity: 0;
              animation-fill-mode: forwards;
            }
            
            .chart-component svg {
              animation: fadeIn 1.2s ease-in-out 0.3s;
              opacity: 0;
              animation-fill-mode: forwards;
            }
            
            .chart-component h3 {
              animation: fadeIn 0.6s ease-in-out 0.1s;
              opacity: 0;
              animation-fill-mode: forwards;
            }
            
            .chart-component .legend {
              animation: fadeIn 0.8s ease-in-out 0.5s;
              opacity: 0;
              animation-fill-mode: forwards;
            }
          </style>
          <div id="${elementId}" class="content-element chart-component" style="
            margin: 2rem 0;
            text-align: center;
            padding: ${areaChartPadding}px;
            background: ${areaChartBackgroundColor};
            border-radius: ${areaChartBorderRadius}px;
            box-shadow: ${areaChartBoxShadow};
            max-width: 1200px;
            margin-left: auto;
            margin-right: auto;
            ${areaChartBorderStyle !== 'none' ? `border: ${areaChartBorderStyle};` : ''}
          ">
            <h3 style="
              margin-bottom: 2rem;
              margin-left: 2rem;
              margin-right: 2rem;
              color: ${areaChartTitleColor};
              font-size: 1.25rem;
              font-weight: bold;
              text-align: center;
              font-family: 'Montserrat', sans-serif;
            ">${areaChartTitle}</h3>
            <!-- Красивая статичная SVG диаграмма с областями -->
            <div style="position: relative; width: 100%; height: 400px; display: flex; justify-content: center; align-items: center;">
              <svg width="100%" height="100%" viewBox="0 0 800 400" style="border: 1px solid ${areaChartBorderColor}; border-radius: 8px; background: ${areaChartBackgroundColor}; max-width: 100%;">
                <!-- Горизонтальные линии сетки -->
                ${(() => {
                  const maxValue = Math.max(...areaChartData1, ...(areaChartData2 || []));
                  const step = Math.ceil(maxValue / 5);
                  const values = [];
                  for (let i = 1; i <= 4; i++) { // Создаем 4 горизонтальные линии (не включая базовую)
                    values.push(i * step);
                  }
                  return values.map(value => {
                    const y = 300 - (value / maxValue) * 250;
                    const dashArray = areaChartGridStyle === 'dotted' ? '2,2' : areaChartGridStyle === 'dashed' ? '5,5' : 'none';
                    return `<line x1="100" y1="${y}" x2="700" y2="${y}" stroke="${areaChartGridColor}" stroke-width="${areaChartGridWidth}" stroke-dasharray="${dashArray}" opacity="0.3"/>`;
                  }).join('');
                })()}
                
                <!-- Вертикальные линии сетки -->
                ${areaChartLabels.map((label, index) => {
                  const x = 100 + (index * 600) / (areaChartLabels.length - 1);
                  const dashArray = areaChartGridStyle === 'dotted' ? '2,2' : areaChartGridStyle === 'dashed' ? '5,5' : 'none';
                  return `<line x1="${x}" y1="50" x2="${x}" y2="300" stroke="${areaChartGridColor}" stroke-width="${areaChartGridWidth}" stroke-dasharray="${dashArray}"/>`;
                }).join('')}
                
                <!-- Оси -->
                <line x1="100" y1="300" x2="700" y2="300" stroke="${areaChartAxisColor}" stroke-width="${areaChartGridWidth + 1}"/>
                <line x1="100" y1="50" x2="100" y2="300" stroke="${areaChartAxisColor}" stroke-width="${areaChartGridWidth + 1}"/>
                
                <!-- Подписи по оси X -->
                ${areaChartLabels.map((label, index) => {
                  const x = 100 + (index * 600) / (areaChartLabels.length - 1);
                  return `<text x="${x}" y="320" text-anchor="middle" fill="${areaChartAxisColor}" font-size="12">${label}</text>`;
                }).join('')}
                
                <!-- Подписи по оси Y -->
                ${(() => {
                  const maxValue = Math.max(...areaChartData1, ...(areaChartData2 || []));
                  const step = Math.ceil(maxValue / 5);
                  const values = [];
                  for (let i = 0; i <= 5; i++) {
                    values.push(i * step);
                  }
                  return values.map(value => {
                    const y = 300 - (value / maxValue) * 250;
                    return `<text x="85" y="${y + 4}" text-anchor="end" fill="${areaChartAxisColor}" font-size="10">${value}</text>`;
                  }).join('');
                })()}
                
                                <!-- Области диаграммы -->
                ${(() => {
                  const maxValue = Math.max(...areaChartData1, ...(areaChartData2 || []));
                  
                  // Создаем точки для первой области
                  const points1 = areaChartData1.map((value, index) => {
                    const x = 100 + (index * 600) / (areaChartData1.length - 1);
                    const y = 300 - (value / maxValue) * 250;
                    return { x, y, value };
                  });
                  
                  // Создаем точки для второй области
                  const points2 = areaChartData2 ? areaChartData2.map((value, index) => {
                    const x = 100 + (index * 600) / (areaChartData2.length - 1);
                    const y = 300 - (value / maxValue) * 250;
                    console.log('🔧 [DEBUG] Point2', index, '- value:', value, 'maxValue:', maxValue, 'y:', y);
                    return { x, y, value };
                  }) : [];
                  
                  console.log('🔧 [DEBUG] points1 y-coordinates:', points1.map(p => p.y));
                  console.log('🔧 [DEBUG] points2 y-coordinates:', points2.map(p => p.y));
                  
                  // Проверяем, является ли диаграмма стековой
                  const isStacked = element.stacked || elementData.stacked;
                  console.log('🔧 [DEBUG] isStacked:', isStacked);
                  
                  let path1, path2 = '';
                  
                  if (isStacked && points2.length > 0) {
                    // СТЕКОВАЯ ДИАГРАММА: как в Recharts
                    // Первая область: от базовой линии до своих точек
                    path1 = `M 100,300 L ${points1.map(p => `${p.x},${p.y}`).join(' L ')} L ${points1[points1.length-1].x},300 Z`;
                    
                    // Вторая область: от точек первой области до точек второй области
                    // Начинаем с первой точки первой области, идем по второй области, возвращаемся по первой
                    path2 = `M ${points1[0].x},${points1[0].y} L ${points2.map(p => `${p.x},${p.y}`).join(' L ')} L ${points1.slice().reverse().map(p => `${p.x},${p.y}`).join(' L ')} Z`;
                  } else {
                    // ОБЫЧНАЯ ДИАГРАММА: обе области от базовой линии
                    path1 = `M 100,300 L ${points1.map(p => `${p.x},${p.y}`).join(' L ')} L ${points1[points1.length-1].x},300 Z`;
                    if (points2.length > 0) {
                      path2 = `M 100,300 L ${points2.map(p => `${p.x},${p.y}`).join(' L ')} L ${points2[points2.length-1].x},300 Z`;
                    }
                  }
                  
                  console.log('🔧 [DEBUG] Generated path1:', path1);
                  console.log('🔧 [DEBUG] Generated path2:', path2);
                  
                  // Функция для затемнения цвета
                  const darkenColor = (color, amount = 0.4) => {
                    if (!color || !color.startsWith('#')) return color;
                    const hex = color.replace('#', '');
                    const r = Math.max(0, Math.floor(parseInt(hex.substr(0, 2), 16) * (1 - amount)));
                    const g = Math.max(0, Math.floor(parseInt(hex.substr(2, 2), 16) * (1 - amount)));
                    const b = Math.max(0, Math.floor(parseInt(hex.substr(4, 2), 16) * (1 - amount)));
                    return '#' + r.toString(16).padStart(2, '0') + g.toString(16).padStart(2, '0') + b.toString(16).padStart(2, '0');
                  };
                  
                  const darkerColor1 = darkenColor(areaChartAreaColor1);
                  const darkerColor2 = darkenColor(areaChartAreaColor2);
                  
                  console.log('🎨 [DEBUG] Original colors:', areaChartAreaColor1, areaChartAreaColor2);
                  console.log('🎨 [DEBUG] Darkened colors:', darkerColor1, darkerColor2);
                  
                  return `
                    <!-- DEBUG: color1=${areaChartAreaColor1} -> ${darkerColor1} -->
                    <!-- DEBUG: color2=${areaChartAreaColor2} -> ${darkerColor2} -->
                    
                    <script>
                      console.log('🎨 [HTML DEBUG] Original colors:', '${areaChartAreaColor1}', '${areaChartAreaColor2}');
                      console.log('🎨 [HTML DEBUG] Darkened colors:', '${darkerColor1}', '${darkerColor2}');
                    </script>
                    
                    <!-- Сначала рисуем первую область (будет внизу) -->
                    <path d="${path1}" fill="${areaChartAreaColor1}" stroke="${darkerColor1}" stroke-width="2" style="cursor: pointer; opacity: 0.7;">
                    </path>
                    
                    <!-- Потом рисуем вторую область (будет сверху и доступна для кликов) -->
                    ${path2 ? `<path d="${path2}" fill="${areaChartAreaColor2}" stroke="${darkerColor2}" stroke-width="2" style="cursor: pointer; pointer-events: all; opacity: 0.7;">
                    </path>` : ''}
                    
                    <!-- Перерисовываем контуры поверх областей для лучшей видимости -->
                    <path d="${points1.map(p => `${p.x},${p.y}`).join(' L ')}" fill="none" stroke="${darkerColor1}" stroke-width="2" style="pointer-events: none;">
                    </path>
                    ${points2.length > 0 ? `<path d="${points2.map(p => `${p.x},${p.y}`).join(' L ')}" fill="none" stroke="${darkerColor2}" stroke-width="2" style="pointer-events: none;">
                    </path>` : ''}
                    
                    <!-- Точки первой линии -->
                    ${points1.map((point, index) => `
                      <circle cx="${point.x}" cy="${point.y}" r="4" fill="${areaChartAreaColor1}" stroke="white" stroke-width="2">
                      </circle>
                    `).join('')}
                    
                    <!-- Точки второй линии -->
                    ${points2.map((point, index) => `
                      <circle cx="${point.x}" cy="${point.y}" r="4" fill="${areaChartAreaColor2}" stroke="white" stroke-width="2">
                      </circle>
                    `).join('')}
                  `;
                })()}
              </svg>
              
              <!-- Легенда -->
              <div class="legend" style="
                position: absolute;
                bottom: 20px;
                left: 0;
                right: 0;
                margin: 0 auto;
                width: fit-content;
                background: transparent;
                padding: 12px 20px;
                border-radius: 6px;
                font-size: 14px;
                box-shadow: ${areaChartColorSettings.boxShadow ? '0 4px 20px rgba(0,0,0,0.15)' : '0 2px 4px rgba(0,0,0,0.1)'};
                display: flex;
                gap: 20px;
                justify-content: center;
                align-items: center;
                min-width: 200px;
              ">
                <!-- Меняем порядок: сначала вторая область (зеленая), потом первая (фиолетовая) -->
                <div style="display: flex; align-items: center;">
                  <div style="width: 16px; height: 16px; background: ${areaChartAreaColor2}; margin-right: 8px; border-radius: 3px;"></div>
                  <span style="font-weight: 500; color: ${areaChartAreaColor2} !important;">${(element.areaNames && element.areaNames[1]) || (elementData.areaNames && elementData.areaNames[1]) || 'Капитализация рынка'}</span>
                </div>
                <div style="display: flex; align-items: center;">
                  <div style="width: 16px; height: 16px; background: ${areaChartAreaColor1}; margin-right: 8px; border-radius: 3px;"></div>
                  <span style="font-weight: 500; color: ${areaChartAreaColor1} !important;">${(element.areaNames && element.areaNames[0]) || (elementData.areaNames && elementData.areaNames[0]) || 'Объем инвестиций'}</span>
                </div>
              </div>
            </div>
            
            <!-- Интерактивные подсказки -->
            <script type="text/javascript">
              console.log('🚀🚀🚀 [HTML DEBUG] Script block started!');
                              console.log('🚀 [HTML DEBUG] elementId: ${elementId}');
                console.log('🚀 [HTML DEBUG] areaChartLabels: ${JSON.stringify(areaChartLabels)}');
                console.log('🚀 [HTML DEBUG] areaChartData1: ${JSON.stringify(areaChartData1)}');
                console.log('🚀 [HTML DEBUG] areaChartData2: ${JSON.stringify(areaChartData2)}');
                console.log('🚀 [HTML DEBUG] areaNames: ${JSON.stringify(element.areaNames || elementData.areaNames || ['Bitcoin', 'Ethereum'])}');
              
              (function() {
                console.log('🔍🔍🔍 [SVG SCRIPT] STARTED for elementId: ${elementId}');
                console.log('🔍 [SVG] Labels:', ${JSON.stringify(areaChartLabels)});
                console.log('🔍 [SVG] Data1 (${(element.areaNames && element.areaNames[0]) || (elementData.areaNames && elementData.areaNames[0]) || 'Bitcoin'}):', ${JSON.stringify(areaChartData1)});
                console.log('🔍 [SVG] Data2 (${(element.areaNames && element.areaNames[1]) || (elementData.areaNames && elementData.areaNames[1]) || 'Ethereum'}):', ${JSON.stringify(areaChartData2)});
                console.log('🔍 [SVG] Document ready state:', document.readyState);
                
                // Функция инициализации tooltips
                function initTooltips() {
                  console.log('🔍 [SVG] Initializing tooltips...');
                  
                  const element = document.getElementById('${elementId}');
                  console.log('🔍 [SVG] Element exists:', !!element);
                  
                  if (!element) {
                    console.error('🚨🚨🚨 [SVG ERROR] Element not found with ID:', '${elementId}');
                    return;
                  }
                  
                  console.log('✅ [SVG] Element found successfully!');
                  console.log('🎯 [SVG] Starting tooltip setup...');
                  
                  // Данные для tooltip'ов
                  const areaNames = ${JSON.stringify([
                    (element.areaNames && element.areaNames[0]) || (elementData.areaNames && elementData.areaNames[0]) || 'Bitcoin',
                    (element.areaNames && element.areaNames[1]) || (elementData.areaNames && elementData.areaNames[1]) || 'Ethereum'
                  ])};
                  const data1 = ${JSON.stringify(areaChartData1)};
                  const data2 = ${JSON.stringify(areaChartData2)};
                  const labels = ${JSON.stringify(areaChartLabels)};
                  
                  // Создаем невидимые области для hover на каждой точке X-оси
                  const svg = element.querySelector('svg');
                  const svgRect = svg.getBoundingClientRect();
                  
                  // Создаем hover области для каждой точки данных
                  labels.forEach((label, index) => {
                    const x = 100 + (index * 600) / (labels.length - 1);
                    
                    // Создаем невидимый прямоугольник для hover
                    const hoverRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                    hoverRect.setAttribute('x', x - 25);
                    hoverRect.setAttribute('y', 50);
                    hoverRect.setAttribute('width', 50);
                    hoverRect.setAttribute('height', 250);
                    hoverRect.setAttribute('fill', 'transparent');
                    hoverRect.setAttribute('stroke', 'none');
                    hoverRect.style.cursor = 'pointer';
                    
                    let tooltip = null;
                    
                    hoverRect.addEventListener('mouseenter', function(e) {
                      // Создаем красивый tooltip с обоими значениями
                      tooltip = document.createElement('div');
                      tooltip.innerHTML = \`
                        <div style="font-weight: bold; margin-bottom: 4px; color: #333; font-size: 13px;">\${label}</div>
                        <div style="display: flex; align-items: center; margin-bottom: 2px;">
                          <div style="width: 12px; height: 12px; background: ${areaChartAreaColor2}; border-radius: 2px; margin-right: 6px;"></div>
                          <span style="color: ${areaChartAreaColor2}; font-size: 12px;">\${areaNames[1]}: <strong style="color: #333;">\${data2[index]}</strong></span>
                        </div>
                        <div style="display: flex; align-items: center;">
                          <div style="width: 12px; height: 12px; background: ${areaChartAreaColor1}; border-radius: 2px; margin-right: 6px;"></div>
                          <span style="color: ${areaChartAreaColor1}; font-size: 12px;">\${areaNames[0]}: <strong style="color: #333;">\${data1[index]}</strong></span>
                        </div>
                      \`;
                      
                      tooltip.style.cssText = \`
                        position: fixed;
                        background: white;
                        border: 1px solid #ddd;
                        border-radius: 6px;
                        padding: 10px;
                        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                        pointer-events: none;
                        z-index: 10000;
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                        min-width: 120px;
                      \`;
                      
                      tooltip.className = 'chart-tooltip-${elementId}';
                      document.body.appendChild(tooltip);
                      
                      // Позиционируем tooltip
                      const updatePosition = (event) => {
                        const tooltipRect = tooltip.getBoundingClientRect();
                        let left = event.clientX + 15;
                        let top = event.clientY - tooltipRect.height / 2;
                        
                        // Проверяем, не выходит ли tooltip за границы экрана
                        if (left + tooltipRect.width > window.innerWidth) {
                          left = event.clientX - tooltipRect.width - 15;
                        }
                        if (top < 0) top = 10;
                        if (top + tooltipRect.height > window.innerHeight) {
                          top = window.innerHeight - tooltipRect.height - 10;
                        }
                        
                        tooltip.style.left = left + 'px';
                        tooltip.style.top = top + 'px';
                      };
                      
                      updatePosition(e);
                    });
                    
                    hoverRect.addEventListener('mousemove', function(e) {
                      if (tooltip) {
                        const tooltipRect = tooltip.getBoundingClientRect();
                        let left = e.clientX + 15;
                        let top = e.clientY - tooltipRect.height / 2;
                        
                        if (left + tooltipRect.width > window.innerWidth) {
                          left = e.clientX - tooltipRect.width - 15;
                        }
                        if (top < 0) top = 10;
                        if (top + tooltipRect.height > window.innerHeight) {
                          top = window.innerHeight - tooltipRect.height - 10;
                        }
                        
                        tooltip.style.left = left + 'px';
                        tooltip.style.top = top + 'px';
                      }
                    });
                    
                    hoverRect.addEventListener('mouseleave', function() {
                      if (tooltip) {
                        tooltip.remove();
                        tooltip = null;
                      }
                    });
                    
                    svg.appendChild(hoverRect);
                  });
                }
                
                // Инициализируем после загрузки DOM
                if (document.readyState === 'loading') {
                  document.addEventListener('DOMContentLoaded', initTooltips);
                } else {
                  initTooltips();
                }
              })();
            </script>
            </div>
          </div>
        `;

      case 'chartjs-bar':

        
        // Извлекаем данные по модели других диаграмм
        let chartjsBarData;
        if (Array.isArray(element.data)) {
          chartjsBarData = element.data;
        } else if (Array.isArray(elementData.data)) {
          chartjsBarData = elementData.data;
        } else if (element.data && Array.isArray(element.data.data)) {
          chartjsBarData = element.data.data;
        } else {
          chartjsBarData = [300, 450, 200, 600];
        }
        
        // Преобразуем объекты в числа
        chartjsBarData = chartjsBarData.map(item => typeof item === 'object' ? item.value || 0 : item);
        
        const chartjsBarLabels = element.labels || elementData.labels || ['Продукт A', 'Продукт B', 'Продукт C', 'Продукт D'];
        const chartjsBarColors = ['#ff6384', '#36a2eb', '#ffce56', '#4bc0c0'];
        

        
        let maxChartjsBarValue = chartjsBarData[0] || 0;
        for (let i = 1; i < chartjsBarData.length; i++) {
          if (chartjsBarData[i] > maxChartjsBarValue) maxChartjsBarValue = chartjsBarData[i];
        }
        
        let barsHtml = '';
        for (let i = 0; i < chartjsBarData.length; i++) {
          const value = chartjsBarData[i];
          const label = chartjsBarLabels[i] || `Продукт ${i + 1}`;
          const color = chartjsBarColors[i % chartjsBarColors.length];
          const height = Math.max(20, (value / maxChartjsBarValue) * 150);
          
          barsHtml += `
            <div style="text-align: center;">
              <div style="
                width: 40px;
                height: ${height}px;
                background: ${color};
                margin-bottom: 8px;
                border-radius: 4px 4px 0 0;
                display: flex;
                align-items: flex-start;
                justify-content: center;
                padding-top: 4px;
                color: white;
                font-size: 10px;
                font-weight: bold;
              ">${value}</div>
              <div style="font-size: 12px; color: #666;">${label}</div>
            </div>
          `;
        }
        
        return `
          <div id="${elementId}" class="content-element chart-component" style="
            margin: 2rem 0;
            padding: 24px;
            background: #ffffff;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            max-width: 800px;
            margin-left: auto;
            margin-right: auto;
            text-align: center;
          ">
            <h3 style="
              margin-bottom: 2rem;
              color: ${elementData.titleColor || '#1976d2'};
              font-size: 1.25rem;
              font-weight: bold;
            ">${element.title || elementData.title || 'Chart.js столбцы'}</h3>
            <div style="
              display: flex;
              gap: 1rem;
              justify-content: center;
              align-items: end;
              height: 200px;
              padding: 1rem;
              border: 1px solid rgba(0,0,0,0.1);
              border-radius: 4px;
            ">
              ${barsHtml}
            </div>
          </div>
        `;
      case 'chartjs-doughnut':

        
        // Извлекаем данные по модели других диаграмм
        let doughnutData;
        if (Array.isArray(element.data)) {
          doughnutData = element.data;
        } else if (Array.isArray(elementData.data)) {
          doughnutData = elementData.data;
        } else if (element.data && Array.isArray(element.data.data)) {
          doughnutData = element.data.data;
        } else {
          doughnutData = [12, 19, 3, 5];
        }
        
        // Преобразуем объекты в числа
        doughnutData = doughnutData.map(item => typeof item === 'object' ? item.value || 0 : item);
        
        const doughnutLabels = element.labels || elementData.labels || ['Красный', 'Синий', 'Желтый', 'Зеленый'];
        const doughnutColors = ['#ff6384', '#36a2eb', '#ffce56', '#4bc0c0'];
        

        
        let doughnutTotal = 0;
        for (let i = 0; i < doughnutData.length; i++) {
          doughnutTotal += doughnutData[i];
        }
        
        let cumulativeAngle = 0;
        let pathsHtml = '';
        
        for (let i = 0; i < doughnutData.length; i++) {
          const percentage = (doughnutData[i] / doughnutTotal) * 100;
          const angle = (percentage / 100) * 360;
          const startAngle = cumulativeAngle;
          const endAngle = cumulativeAngle + angle;
          
          const startAngleRad = (startAngle - 90) * Math.PI / 180;
          const endAngleRad = (endAngle - 90) * Math.PI / 180;
          
          const x1 = 100 + 80 * Math.cos(startAngleRad);
          const y1 = 100 + 80 * Math.sin(startAngleRad);
          const x2 = 100 + 80 * Math.cos(endAngleRad);
          const y2 = 100 + 80 * Math.sin(endAngleRad);
          
          const largeArcFlag = angle > 180 ? 1 : 0;
          
          pathsHtml += `
            <path d="M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArcFlag} 1 ${x2} ${y2} Z" 
                  fill="${doughnutColors[i % doughnutColors.length]}" 
                  stroke="white" 
                  stroke-width="2"/>
          `;
          
          cumulativeAngle += angle;
        }
        
        let legendHtml = '';
        for (let i = 0; i < doughnutLabels.length; i++) {
          const label = doughnutLabels[i];
          const color = doughnutColors[i % doughnutColors.length];
          legendHtml += `
            <div style="display: flex; align-items: center; gap: 4px;">
              <div style="width: 12px; height: 12px; background: ${color}; border-radius: 2px;"></div>
              <span style="font-size: 12px; color: #666;">${label}</span>
            </div>
          `;
        }
        
        return `
          <div id="${elementId}" class="content-element chart-component" style="
            margin: 2rem 0;
            padding: 24px;
            background: #ffffff;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            max-width: 800px;
            margin-left: auto;
            margin-right: auto;
            text-align: center;
          ">
            <h3 style="
              margin-bottom: 2rem;
              color: ${elementData.titleColor || '#1976d2'};
              font-size: 1.25rem;
              font-weight: bold;
            ">${element.title || elementData.title || 'Пончиковая диаграмма'}</h3>
            <div style="display: flex; flex-direction: column; align-items: center;">
              <svg width="200" height="200" viewBox="0 0 200 200" style="margin-bottom: 1rem;">
                <circle cx="100" cy="100" r="80" fill="none" stroke="#e0e0e0" stroke-width="2"/>
                ${pathsHtml}
                <circle cx="100" cy="100" r="40" fill="white"/>
              </svg>
              <div style="
                display: flex;
                justify-content: center;
                gap: 1rem;
                margin-top: 1rem;
                flex-wrap: wrap;
              ">
                ${legendHtml}
              </div>
            </div>
          </div>
        `;

      case 'apex-line':
        return `
          <div id="${elementId}" class="content-element chart-component" style="
            margin: 2rem 0;
            text-align: center;
            padding: 2rem;
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            max-width: 800px;
            margin-left: auto;
            margin-right: auto;
          ">
            <h3 style="
              margin-bottom: 1rem;
              color: ${elementData.titleColor || '#333333'};
              font-size: 1.5rem;
            ">${elementData.title || 'ApexCharts линии'}</h3>
            <div id="chart-${elementId}" style="width: 100%; height: 300px;"></div>
            <script>
              (function() {
                if (window.ApexCharts) {
                  const options = {
                    chart: {
                      type: 'line',
                      height: 300
                    },
                    series: [{
                      name: '${elementData.seriesName || 'Данные'}',
                      data: ${JSON.stringify(elementData.data || [30, 40, 35, 50, 49, 60, 70, 91, 125])}
                    }],
                    xaxis: {
                      categories: ${JSON.stringify(elementData.categories || ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен'])}
                    },
                    colors: ['${elementData.color || '#1976d2'}'],
                    stroke: {
                      curve: 'smooth'
                    }
                  };
                  new ApexCharts(document.getElementById('chart-${elementId}'), options).render();
                }
              })();
            </script>
          </div>
        `;

      case 'advanced-contact-form':
        return `
          <div id="${elementId}" class="content-element advanced-contact-form" style="
            margin: 2rem 0;
            max-width: 600px;
            margin-left: auto;
            margin-right: auto;
            padding: 2rem;
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          ">
            ${element.title ? `
              <h3 style="
                text-align: center;
                color: ${element.titleColor || '#333333'};
                margin-bottom: 2rem;
                font-size: 1.8rem;
              ">${element.title}</h3>
            ` : ''}
            <form style="display: flex; flex-direction: column; gap: 1rem;">
              <input type="text" placeholder="Имя" style="
                padding: 1rem;
                border: 1px solid #e0e0e0;
                border-radius: 8px;
                font-size: 1rem;
              ">
              <input type="email" placeholder="Email" style="
                padding: 1rem;
                border: 1px solid #e0e0e0;
                border-radius: 8px;
                font-size: 1rem;
              ">
              <textarea placeholder="Сообщение" rows="4" style="
                padding: 1rem;
                border: 1px solid #e0e0e0;
                border-radius: 8px;
                font-size: 1rem;
                resize: vertical;
              "></textarea>
              <button type="submit" style="
                padding: 1rem 2rem;
                background: ${element.buttonColor || '#1976d2'};
                color: white;
                border: none;
                border-radius: 8px;
                font-size: 1rem;
                font-weight: bold;
                cursor: pointer;
                transition: background 0.3s ease;
              " onmouseover="this.style.background='#1565c0'" onmouseout="this.style.background='${element.buttonColor || '#1976d2'}'">
                ${element.buttonText || 'Отправить'}
              </button>
            </form>
          </div>
        `;

      case 'cta-section':
        // Извлекаем colorSettings с fallback на старые настройки
        const ctaColorSettings = element.colorSettings || element.data?.colorSettings || {};
        const ctaCustomStyles = element.customStyles || element.data?.customStyles || {};
        
        // Получаем цвета из новой системы colorSettings с fallback на старые
        const ctaBackgroundColor = ctaColorSettings.sectionBackground?.enabled 
          ? (ctaColorSettings.sectionBackground.useGradient 
              ? `linear-gradient(${ctaColorSettings.sectionBackground.gradientDirection}, ${ctaColorSettings.sectionBackground.gradientColor1}, ${ctaColorSettings.sectionBackground.gradientColor2})`
              : ctaColorSettings.sectionBackground.solidColor)
          : (ctaCustomStyles.backgroundColor || element.backgroundColor || element.data?.backgroundColor || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)');
        
        const ctaTitleColor = ctaColorSettings.textFields?.title || ctaCustomStyles.titleColor || element.titleColor || element.data?.titleColor || '#ffffff';
        const ctaDescriptionColor = ctaColorSettings.textFields?.description || ctaCustomStyles.descriptionColor || element.descriptionColor || element.data?.descriptionColor || '#ffffff';
        const ctaButtonColor = ctaColorSettings.textFields?.button || ctaCustomStyles.buttonColor || element.buttonColor || element.data?.buttonColor || '#ffffff';
        const ctaButtonTextColor = ctaColorSettings.textFields?.buttonText || ctaCustomStyles.buttonTextColor || element.buttonTextColor || element.data?.buttonTextColor || '#333333';
        const ctaBorderColor = ctaColorSettings.borderColor || ctaCustomStyles.borderColor || 'transparent';
        const ctaBorderWidth = ctaColorSettings.borderWidth || ctaCustomStyles.borderWidth || 0;
        const ctaPadding = ctaColorSettings.padding || ctaCustomStyles.padding || element.padding || element.data?.padding || 48;
        const ctaBorderRadius = ctaColorSettings.borderRadius || ctaCustomStyles.borderRadius || element.borderRadius || element.data?.borderRadius || 12;
        const ctaBoxShadow = ctaColorSettings.boxShadow ? '0 8px 32px rgba(0,0,0,0.2)' : '0 4px 15px rgba(0,0,0,0.2)';
        
        return `
          <div id="${elementId}" class="content-element cta-section" style="
            margin: 2rem 0;
            text-align: center;
            padding: ${ctaPadding}px 2rem;
            background: ${ctaBackgroundColor};
            border-radius: ${ctaBorderRadius}px;
            color: ${ctaTitleColor};
            max-width: 1200px;
            margin-left: auto;
            margin-right: auto;
            ${ctaBorderWidth > 0 ? `border: ${ctaBorderWidth}px solid ${ctaBorderColor};` : ''}
            box-shadow: ${ctaBoxShadow};
          ">
            <h2 style="
              margin-bottom: 1rem;
              font-size: 2rem;
              color: ${ctaTitleColor};
              font-family: 'Montserrat', sans-serif;
              font-weight: bold;
            ">${element.title || element.data?.title || 'Призыв к действию'}</h2>
            <p style="
              margin-bottom: 2rem;
              font-size: 1.1rem;
              line-height: 1.6;
              color: ${ctaDescriptionColor};
              opacity: 0.9;
              font-family: 'Montserrat', sans-serif;
            ">${element.description || element.data?.description || 'Описание призыва к действию'}</p>
            <button style="
              padding: 1rem 2rem;
              background: ${ctaButtonColor};
              color: ${ctaButtonTextColor};
              border: none;
              border-radius: ${ctaColorSettings.textFields?.buttonBorderRadius || element.buttonBorderRadius || element.data?.buttonBorderRadius || 8}px;
              font-size: 1.1rem;
              font-weight: bold;
              cursor: pointer;
              transition: all 0.3s ease;
              box-shadow: 0 4px 15px rgba(0,0,0,0.2);
              font-family: 'Montserrat', sans-serif;
            " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
              ${element.buttonText || element.data?.buttonText || 'Начать сейчас'}
            </button>
          </div>
        `;

      default:
        return `
          <div id="${elementId}" class="content-element unknown-type" style="
            margin: 1rem 0;
            padding: 1rem;
            background: #f5f5f5;
            border-radius: 8px;
            text-align: center;
            color: #666;
          ">
            <p>Элемент типа "${element.type}" пока не поддерживается в предпросмотре</p>
          </div>
        `;
    }
  };

  const generateHTML = (data) => {
    console.log('🚀 generateHTML called with data:', data);
    console.log('🚀 liveChatData:', data.liveChatData);
    console.log('🚀 liveChatData.enabled:', data.liveChatData?.enabled);
    console.log('🚀 liveChatData.apiKey:', data.liveChatData?.apiKey ? 'Present' : 'Missing');
    
    // Применяем значения по умолчанию для contactData
    const contactData = {
      showBackground: true,
      backgroundType: 'solid',
      backgroundColor: '#f8f9fa',
      gradientColor1: '#ffffff',
      gradientColor2: '#f5f5f5',
      gradientDirection: 'to bottom',
      titleColor: '#1565c0',
      descriptionColor: '#424242',
      buttonColor: '#1976d2',
      ...data.contactData
    };
    
    console.log('🎨 CONTACT BACKGROUND DEBUG:');
    console.log('📊 Original contactData:', data.contactData);
    console.log('🔧 Final contactData:', contactData);
    console.log('👁️ showBackground:', contactData.showBackground);
    console.log('🎭 backgroundType:', contactData.backgroundType);
    console.log('🌈 backgroundColor:', contactData.backgroundColor);
    console.log('🎨 gradientColor1:', contactData.gradientColor1);
    console.log('🎨 gradientColor2:', contactData.gradientColor2);
    console.log('📐 gradientDirection:', contactData.gradientDirection);
    
    return `<!DOCTYPE html>
<html lang="${data.headerData.language || 'en'}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.headerData.title || data.headerData.siteName}</title>
  <link rel="icon" type="image/png" href="assets/images/Favicon.png">
  <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
  <link rel="stylesheet" href="assets/css/styles.css">
  <meta name="description" content="${data.headerData.description || 'Our site offers the best solutions'}">
  ${data.headerData.domain ? `<link rel="canonical" href="https://${data.headerData.domain}" />` : ''}
  <style>
    /* Live Chat Styles */
    ${data.liveChatData?.enabled ? generateLiveChatCSS() : ''}
  </style>
</head>
<body>
  ${data.headerData.siteBackgroundType === 'image' ? `
  <div class="background-image" style="
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: url('assets/images/fon.jpg');
    background-size: cover;
    background-position: center;
    filter: ${data.headerData.siteBackgroundBlur ? `blur(${data.headerData.siteBackgroundBlur}px)` : 'none'};
    z-index: -2;
  "></div>
  ${data.headerData.siteBackgroundDarkness ? `
  <div class="site-overlay" style="
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, ${data.headerData.siteBackgroundDarkness / 100});
    z-index: -1;
  "></div>
  ` : ''}
  ` : data.headerData.siteBackgroundType === 'gradient' ? `
  <div class="background-image" style="
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(${data.headerData.siteGradientDirection || 'to right'}, 
      ${data.headerData.siteGradientColor1 || '#ffffff'}, 
      ${data.headerData.siteGradientColor2 || '#f5f5f5'});
    z-index: -2;
  "></div>
  ` : data.headerData.siteBackgroundType === 'solid' ? `
  <div class="background-image" style="
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: ${data.headerData.siteBackgroundColor || '#ffffff'};
    z-index: -2;
  "></div>
  ` : ''}
  <header>
    <nav style="background-color: ${data.headerData.backgroundColor || '#ffffff'}; --menu-bg-color: ${data.headerData.backgroundColor || '#fff'}; --menu-link-color: ${data.headerData.linksColor || '#1976d2'};">
      <div class="nav-container">
        <div class="site-branding" style="display: flex; flex-direction: column; margin-right: 2rem;">
          <div class="logo" style="color: ${data.headerData.titleColor || '#000000'}">${data.headerData.siteName || 'My Site'}</div>
          <div class="domain" style="color: ${data.headerData.titleColor || '#000000'}; opacity: 0.8; font-size: 0.9rem; display: none;">${data.headerData.domain || ''}</div>
        </div>
        <button class="menu-toggle" aria-label="Menu">
          <span></span>
          <span></span>
          <span></span>
        </button>
        <ul class="nav-menu">
          ${data.headerData.menuItems.map(item => `
            <li>
              <a href="#${item.id}" style="
                color: ${data.headerData.linksColor || '#000000'};
                font-size: ${data.headerData.styles?.menuItemFontSize || '16px'};
                font-weight: ${data.headerData.styles?.menuItemFontWeight || '500'};
                transition: ${data.headerData.styles?.menuItemTransition || '0.3s'};
              ">${item.text}</a>
            </li>
          `).join('')}
          <li>
            <a href="#contact" style="
              color: ${data.headerData.linksColor || '#000000'};
              font-size: ${data.headerData.styles?.menuItemFontSize || '16px'};
              font-weight: ${data.headerData.styles?.menuItemFontWeight || '500'};
              transition: ${data.headerData.styles?.menuItemTransition || '0.3s'};
            ">${contactData.title || 'Contact Us'}</a>
          </li>
        </ul>
      </div>
    </nav>
  </header>
  <main>
    <section id="hero" class="hero" style="
      ${data.heroData.backgroundType === 'solid' ? `background-color: ${data.heroData.backgroundColor || '#ffffff'};` : ''}
      ${data.heroData.backgroundType === 'gradient' ? `background: linear-gradient(${data.heroData.gradientDirection || 'to right'}, ${data.heroData.gradientColor1 || '#ffffff'}, ${data.heroData.gradientColor2 || '#f5f5f5'});` : ''}
    ">
      ${data.heroData.backgroundType === 'image' ? `
        <div class="hero-bg-animation" style="background-image: url('${data.heroData.backgroundImage.replace('/images/hero/', 'assets/images/')}');"></div>
      ` : ''}
      ${data.heroData.enableOverlay ? `
        <div class="hero-overlay" style="
          background: linear-gradient(rgba(0,0,0,${data.heroData.overlayOpacity / 100 || 0.5}), rgba(0,0,0,${data.heroData.overlayOpacity / 100 || 0.5}));
          backdrop-filter: ${data.heroData.enableBlur ? `blur(${data.heroData.blurAmount || 0.1}px)` : 'none'};
        "></div>
      ` : ''}
      <div class="hero-content">
        <div class="hero-text-wrapper" style="
          background: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(0.1px);
          padding: 2rem 3rem;
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          max-width: 800px;
          margin: 0 auto;
        ">
          <h1 style="
            color: ${data.heroData.titleColor || '#ffffff'};
            text-shadow: 
              2px 2px 4px rgba(0, 0, 0, 0.9),
              -1px -1px 2px rgba(255, 255, 255, 0.8),
              1px 1px 2px rgba(255, 255, 255, 0.6),
              0 0 20px rgba(0, 0, 0, 0.5),
              0 0 40px rgba(255, 255, 255, 0.3);
            -webkit-text-stroke: 1px rgba(255, 255, 255, 0.3);
            filter: drop-shadow(0 0 8px rgba(0, 0, 0, 0.8));
            margin-bottom: 1.5rem;
          ">${data.heroData.title || ''}</h1>
          <p style="
            color: ${data.heroData.subtitleColor || '#ffffff'};
            text-shadow: 
              1px 1px 3px rgba(0, 0, 0, 0.9),
              -1px -1px 1px rgba(255, 255, 255, 0.7),
              0 0 15px rgba(0, 0, 0, 0.5),
              0 0 25px rgba(255, 255, 255, 0.2);
            -webkit-text-stroke: 0.5px rgba(255, 255, 255, 0.2);
            filter: drop-shadow(0 0 6px rgba(0, 0, 0, 0.7));
            margin-bottom: 2rem;
          ">${data.heroData.subtitle || ''}</p>
          
          <div style="display: flex; gap: 1rem; justify-content: center; align-items: center;">
            ${data.heroData.buttonText ? `
              <button style="
                background-color: ${data.heroData.buttonColor || '#1976d2'};  
                color: ${data.heroData.buttonTextColor || '#ffffff'};
                padding: 0.75rem 1.5rem;
                border: none;
                border-radius: 6px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.3s ease;
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
              ">${data.heroData.buttonText}</button>
            ` : ''}
            <a href="#contact" style="
              color: ${data.heroData.buttonTextColor || '#ffffff'};
              text-decoration: none;
              padding: 0.75rem 1.5rem;
              border: 2px solid ${data.heroData.buttonTextColor || '#ffffff'};
              border-radius: 6px;
              transition: all 0.3s ease;
              font-weight: 500;
              background: rgba(255, 255, 255, 0.1);
              backdrop-filter: blur(0.1px);
            ">${contactData.title || 'Contact Us'}</a>
          </div>
        </div>
      </div>
    </section>

    ${(Array.isArray(data.sectionsData) ? data.sectionsData : Object.values(data.sectionsData)).map(section => {
      // Get border colors from section cards for gradient
      const getBorderColors = () => {
        if (section.cards && section.cards.length > 0) {
          const firstCard = section.cards[0];
          const lastCard = section.cards[section.cards.length - 1];
          
          // Use card border color
          const startColor = firstCard.borderColor || '#1976d2';
          const endColor = lastCard.borderColor || '#64b5f6';

          return {
            start: startColor,
            end: endColor
          };
        }
        
        // If no cards, use default colors
        return {
          start: '#1976d2',
          end: '#64b5f6'
        };
      };

      const borderColors = getBorderColors();

      // Legacy block: if there are cards, render as before
      const cardsCount = (section.cards || []).length;
      let cardsClass = '';
      if (cardsCount === 2) cardsClass = 'cards-2';
      if (cardsCount === 3) cardsClass = 'cards-3';
      if (section.cardType === 'none') {
        // Check for images
        const hasImages = Array.isArray(section.images) && section.images.length > 0;
        const hasSingleImage = section.imagePath && !hasImages;
        
        // Get colors from section
        const bgColor = section.backgroundColor || '#ffffff';
        const titleColor = section.titleColor || '#1a237e';
        const descriptionColor = section.descriptionColor || '#455a64';
        const contentColor = section.contentColor || '#455a64';
        
                  // Prepare HTML for image gallery if there are multiple images
          let imagesHtml = '';
          if (hasImages) {
            if (section.images.length === 1) {
              // Single image from array
              const imgPath = typeof section.images[0] === 'string' 
                ? section.images[0].replace('/images/sections/', 'assets/images/')
                : (section.images[0].path || section.images[0].url || '').replace('/images/sections/', 'assets/images/');
              
              imagesHtml = `
                <div class="image-container" style="
                  float: right;
                  margin: 0 0 1rem 1.5rem;
                  width: 40%;
                  max-width: 300px;
                  height: 300px;
                  position: relative;
                  border-radius: 12px;
                  overflow: hidden;
                  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                  transition: transform 0.3s ease;
                " onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'">
                  <img 
                    src="${imgPath}" 
                    alt="${section.title || 'Section image'}"
                    style="
                      width: 100%;
                      height: 100%;
                      object-fit: cover;
                      border-radius: 12px;
                      display: block;
                    "
                  >
                </div>
              `;
            } else {
              // Multiple images - create slider
              imagesHtml = `
                <div class="section-gallery" data-section-id="${section.id}" style="
                  float: right;
                  margin: 0 0 1rem 1.5rem;
                  width: 40%;
                  max-width: 300px;
                  height: 300px;
                  position: relative;
                  border-radius: 12px;
                  overflow: hidden;
                  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                  transition: transform 0.3s ease;
                " onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'">
                  ${section.images.map((img, index) => {
                    const imgPath = typeof img === 'string' 
                      ? img.replace('/images/sections/', 'assets/images/')
                      : (img.path || img.url || '').replace('/images/sections/', 'assets/images/');
                    
                    return `
                      <img 
                        src="${imgPath}" 
                        alt="${section.title || 'Section image'} ${index + 1}"
                        class="gallery-img"
                        data-index="${index}"
                        style="
                          position: absolute;
                          top: 0;
                          left: 0;
                          width: 100%;
                          height: 100%;
                          object-fit: cover;
                          display: ${index === 0 ? 'block' : 'none'};
                          transition: opacity 0.5s ease;
                        "
                      >
                    `;
                  }).join('')}
                  
                  <!-- Gallery Navigation -->
                  <div style="
                    position: absolute;
                    bottom: 10px;
                    left: 0;
                    right: 0;
                    text-align: center;
                    z-index: 2;
                  ">
                    ${section.images.map((_, index) => `
                      <span 
                        class="gallery-dot"
                        data-index="${index}"
                        style="
                          display: inline-block;
                          width: 8px;
                          height: 8px;
                          border-radius: 50%;
                          background-color: ${index === 0 ? '#ffffff' : 'rgba(255,255,255,0.5)'};
                          margin: 0 3px;
                          cursor: pointer;
                        "
                      ></span>
                    `).join('')}
                  </div>
                </div>
              `;
            }
          } else if (hasSingleImage) {
            // Single image from imagePath field
            imagesHtml = `
              <div class="image-container" style="
                float: right;
                margin: 0 0 1rem 1.5rem;
                width: 40%;
                max-width: 300px;
                height: 300px;
                position: relative;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                transition: transform 0.3s ease;
              " onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'">
                <img 
                  src="${section.imagePath.replace('/images/sections/', 'assets/images/')}" 
                  alt="${section.title || 'Section image'}"
                  style="
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    border-radius: 12px;
                    display: block;
                  "
                >
              </div>
            `;
        }
        
                 // Generate HTML for cards - each card with left colored border and effects
         const cardsHtml = (section.cards || []).map((card, index) => {
           const cardTitleColor = card.titleColor || titleColor;
           const cardContentColor = card.contentColor || contentColor;
           const cardBorderColor = card.borderColor || '#1976d2';
           
           return `
              <div class="service-block" style="
                padding: 1rem;
                margin-bottom: 1rem;
                border-left: 3px solid ${cardBorderColor};
                background: ${section.showBackground !== false ? 'rgba(255,255,255,0.05)' : 'transparent'};
                transition: all 0.3s ease;
                opacity: 0;
                --index: ${index};
                cursor: pointer;
                position: relative;
              " 
              onmouseover="this.style.transform='translateX(10px)'; this.style.boxShadow='0 2px 8px rgba(0,0,0,0.1)'"
              onmouseout="this.style.transform='translateX(0)'; this.style.boxShadow='none'"
              >
                <h3 style="
                  color: ${cardTitleColor};
                  font-size: 1.3rem;
                  font-weight: 600;
                  margin-bottom: 0.5rem;
                  font-family: 'Montserrat', sans-serif;
                  text-align: left;
                ">${card.title || ''}</h3>
                <p style="
                  color: ${cardContentColor};
                  font-size: 1rem;
                  line-height: 1.6;
                  margin: 0;
                  font-family: 'Roboto', sans-serif;
                  text-align: left;
                ">${card.content || card.text || ''}</p>
              </div>
           `;
        }).join('');
        
                  // Create structure as close as possible to preview
          return `
            <style>
              @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
              }
              
              @keyframes slideInLeft {
                from { opacity: 0; transform: translateX(-30px); }
                to { opacity: 1; transform: translateX(0); }
              }
              
              @keyframes slideUp {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
              }
              
              #${section.id} .service-block {
                animation: slideInLeft 0.5s ease-out forwards;
                animation-delay: calc(var(--index, 0) * 0.1s);
              }
              
              #${section.id} h2 {
                animation: slideUp 0.7s ease-out forwards;
              }
              
              #${section.id} > p {
                animation: slideUp 0.7s ease-out 0.2s forwards;
                opacity: 0;
                animation-fill-mode: forwards;
              }
              
              /* Media query for mobile devices */
              @media (max-width: 768px) {
                #${section.id} .image-container {
                  float: none !important;
                  margin: 0 auto 2rem auto !important;
                  width: 100% !important;
                  max-width: 100% !important;
                  height: 250px !important;
                }
                
                #${section.id} .section-gallery {
                  float: none !important;
                  margin: 0 auto 2rem auto !important;
                  width: 100% !important;
                  max-width: 100% !important;
                  height: 250px !important;
                }
              }
            </style>
            
            <section id="${section.id}" class="section section-nocards" style="
              padding: 4rem 0;
              position: relative;
              background: ${section.showBackground !== false ? bgColor : 'transparent'};
              border-radius: 20px;
              margin: 2rem auto;
              max-width: 1000px;
              box-shadow: ${section.showBackground !== false ? '0 4px 12px rgba(0,0,0,0.05)' : 'none'};
              overflow: hidden;
              animation: fadeIn 0.5s ease-in-out;
            ">
              <!-- Top color bar -->
              <div style="
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 3px;
                background: linear-gradient(90deg, #1976d2, #42a5f5);
                display: ${section.showBackground !== false ? 'block' : 'none'};
              "></div>
            
            <div class="container">
              <div class="section-content" style="
                position: relative;
                max-width: 1000px;
                margin: 0 auto;
                padding: 0 2rem;
              ">
                ${section.title ? `
                  <h2 style="
                    color: ${calloutTitleColor};
                    font-size: 2rem;
                    font-weight: 700;
                    margin-bottom: 1.5rem;
                    text-align: center;
                    position: relative;
                  ">${section.title}</h2>
                ` : ''}
                
                ${section.description ? `
                  <p style="
                    color: ${descriptionColor};
                    font-size: 1.1rem;
                    line-height: 1.6;
                    margin-bottom: 2rem;
                    text-align: center;
                    max-width: 800px;
                    margin-left: auto;
                    margin-right: auto;
                  ">${section.description}</p>
                ` : ''}
                
                <!-- Container with text and image -->
                <div class="with-image" style="
                  position: relative;
                  display: flow-root;
                ">
                  <!-- Floating image -->
                  ${imagesHtml}
                  
                  <!-- Cards -->
                  <div style="
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                  ">
                    ${cardsHtml}
                  </div>
                </div>
              </div>
            </div>
          </section>
        `;
      }
      return `
        <section id="${section.id}" class="section" 
          data-show-background="${section.showBackground !== false}"
          style="
            --border-start-color: ${borderColors.start};
            --border-end-color: ${borderColors.end};
            --section-background-color: ${section.backgroundColor || 'transparent'};
            position: relative;
            overflow: hidden;
            border-radius: 20px;
            color: ${section.contentColor || '#455a64'};
          "
        >
          <div class="section-container" style="position: relative; z-index: 2;">
            <div class="section-header">
              <h2 style="
                color: ${section.titleColor || '#1a237e'}; 
                text-align: center; 
                margin-bottom: 1rem;
                font-size: 2rem;
                font-weight: 600;
              ">${section.title || ''}</h2>
              ${section.description ? `
                <p style="
                  color: ${section.descriptionColor || '#455a64'}; 
                  text-align: center; 
                  margin-bottom: 1rem;
                  font-size: 1.1rem;
                  line-height: 1.6;
                ">${section.description}</p>
              ` : ''}
              ${(() => {
                // Проверяем наличие изображений
                const hasImages = Array.isArray(section.images) && section.images.length > 0;
                const hasSingleImage = section.imagePath && !hasImages;
                
                if (hasImages) {
                  if (section.images.length === 1) {
                    // Одно изображение из массива
                    const imgPath = typeof section.images[0] === 'string' 
                      ? section.images[0].replace('/images/sections/', 'assets/images/')
                      : (section.images[0].path || section.images[0].url || '').replace('/images/sections/', 'assets/images/');
                    
                    return `
                      <div class="section-image" style="
                        width: 100%;
                        margin: 2rem auto;
                        text-align: center;
                        max-width: 800px;
                        height: 500px;
                      ">
                        <img src="${imgPath}" alt="${section.title || 'Section image'}" style="
                          width: 100%;
                          height: 100%;
                          object-fit: cover;
                          border-radius: 12px;
                          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                          transition: transform 0.3s ease;
                        ">
                      </div>
                    `;
                  } else {
                    // Несколько изображений - делаем слайдер
                    return `
                      <div class="section-gallery" data-section-id="${section.id}" style="
                        width: 100%;
                        margin: 2rem auto;
                        text-align: center;
                        max-width: 800px;
                        height: 500px;
                        position: relative;
                        border-radius: 12px;
                        overflow: hidden;
                        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                      ">
                        ${section.images.map((img, index) => {
                          const imgPath = typeof img === 'string' 
                            ? img.replace('/images/sections/', 'assets/images/')
                            : (img.path || img.url || '').replace('/images/sections/', 'assets/images/');
                          
                          return `
                            <img 
                              src="${imgPath}" 
                              alt="${section.title || 'Section image'} ${index + 1}"
                              class="gallery-img"
                              data-index="${index}"
                              style="
                                position: absolute;
                                top: 0;
                                left: 0;
                                width: 100%;
                                height: 100%;
                                object-fit: cover;
                                display: ${index === 0 ? 'block' : 'none'};
                                transition: opacity 0.5s ease;
                              "
                            >
                          `;
                        }).join('')}
                        
                                        <!-- Gallery Navigation -->
                <div style="
                          position: absolute;
                          bottom: 10px;
                          left: 0;
                          right: 0;
                          text-align: center;
                          z-index: 2;
                        ">
                          ${section.images.map((_, index) => `
                            <span 
                              class="gallery-dot"
                              data-index="${index}"
                              style="
                                display: inline-block;
                                width: 10px;
                                height: 10px;
                                border-radius: 50%;
                                background-color: ${index === 0 ? '#ffffff' : 'rgba(255,255,255,0.5)'};
                                margin: 0 5px;
                                cursor: pointer;
                              "
                            ></span>
                          `).join('')}
                        </div>
                      </div>
                    `;
                  }
                } else if (hasSingleImage) {
                  // Одно изображение из поля imagePath
                  return `
                    <div class="section-image" style="
                      width: 100%;
                      margin: 2rem auto;
                      text-align: center;
                      max-width: 800px;
                      height: 500px;
                    ">
                      <img src="${section.imagePath.replace('/images/sections/', 'assets/images/')}" alt="${section.title || 'Section image'}" style="
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                        border-radius: 12px;
                        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                        transition: transform 0.3s ease;
                      ">
                    </div>
                  `;
                }
                
                return '';
              })()}
            </div>
            <div class="cards-container${cardsClass ? ' ' + cardsClass : ''}">
              ${(section.cards || []).map(card => `
                <div class="card ${section.cardType}" data-card-id="${card.id}" data-card-type="${section.cardType}" data-bg-type="${card.backgroundType}"
                  style="${card.backgroundType === 'solid' ? `background-color: ${card.backgroundColor || '#ffffff'};` : ''}
                  ${card.backgroundType === 'gradient' ? `background: linear-gradient(${card.gradientDirection || 'to right'}, ${card.gradientColor1 || '#ffffff'}, ${card.gradientColor2 || '#f5f5f5'});` : ''}
                  border: 3px solid ${card.borderColor || '#e0e0e0'};
                  border-radius: ${card.style?.borderRadius || '12px'};
                  ${card.style?.shadow ? `box-shadow: ${card.style.shadow};` : ''}
                  position: relative;
                  z-index: 2;
                  display: flex;
                  flex-direction: column;
                  height: 100%;
                  padding: 1.5rem;
                  transition: all 0.3s ease-in-out;">
                  <h3 style="
                    color: ${card.titleColor || section.titleColor || '#1a237e'}; 
                    margin-bottom: 0.7rem;
                    font-size: 1.5rem;
                    font-weight: 600;
                    transition: color 0.3s ease-in-out;
                  ">${card.title || ''}</h3>
                  <p style="
                    color: ${card.contentColor || section.contentColor || '#455a64'}; 
                    font-size: 1rem;
                    line-height: 1.6;
                    transition: color 0.3s ease-in-out;
                  ">${card.content || ''}</p>
                </div>
              `).join('')}
            </div>
            
            <!-- Content Elements -->
            ${section.contentElements && section.contentElements.length > 0 ? `
              <div class="content-elements" style="
                margin-top: 2rem;
                padding: 1rem 0;
              ">
                ${section.contentElements.map(element => generateContentElementHTML(element)).join('')}
              </div>
            ` : ''}
          </div>
        </section>
      `;
    }).join('')}
    <section id="contact" class="section"
      style="
        padding: 4rem 0;
        position: relative;
        z-index: 2;
        border-radius: 20px;
        overflow: hidden;
        ${contactData.showBackground !== false && contactData.backgroundType === 'gradient' ? 
          `background: linear-gradient(${contactData.gradientDirection || 'to bottom'}, ${contactData.gradientColor1 || '#ffffff'}, ${contactData.gradientColor2 || '#f5f5f5'});` :
          contactData.showBackground !== false && contactData.backgroundColor ? 
          `background-color: ${contactData.backgroundColor};` : ''}
      ">
      <div class="container">
        <div class="section-header" style="text-align: center; margin-bottom: 3rem;">
          <h2 style="
            color: ${contactData.titleColor || '#000000'};
            font-size: 2.5rem;
            margin-bottom: 1rem;
            position: relative;
            display: inline-block;
          ">
            ${contactData.title || 'Contact Us'}
            <span style="
              content: '';
              position: absolute;
              bottom: -10px;
              left: 50%;
              transform: translateX(-50%);
              width: 50px;
              height: 3px;
              background-color: ${contactData.titleColor || '#000000'};
            "></span>
          </h2>
          <p style="
            color: ${contactData.descriptionColor || '#666666'};
            font-size: 1.1rem;
            max-width: 800px;
            margin: 0 auto;
            line-height: 1.6;
          ">
            ${contactData.description || 'Please leave your contact details and we will get back to you as soon as possible'}
          </p>
        </div>
        <div class="contact-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; max-width: 1140px; margin: 0 auto; padding: 0 20px;">
          <div class="contact-form" style="
            border: 1px solid ${contactData.formBorderColor || '#1976d2'};
            padding: 2.5rem;
            border-radius: 8px;
            background-color: ${contactData.formBackgroundColor || '#ffffff'};
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          ">
            <form 
              id="contactForm" 
              onsubmit="submitForm(event)"
            >
              <input type="hidden" name="_captcha" value="false" />
              <input type="hidden" name="_template" value="table" />
              <input type="hidden" name="_subject" value="New message from website" />
              <input type="hidden" name="_language" id="formLanguage" value="en" />
              <div class="form-group" style="margin-bottom: 1.5rem;">
                <label for="name" style="color: ${contactData.labelColor || '#333'}; display: block; margin-bottom: 0.5rem; font-weight: 500;">Full Name</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  class="form-control" 
                  placeholder="Enter your full name" 
                  style="
                    border: 1px solid ${contactData.inputBorderColor || '#ddd'};
                    background-color: ${contactData.inputBackgroundColor || '#ffffff'};
                    color: ${contactData.inputTextColor || '#333'};
                    padding: 0.85rem 1rem;
                    width: 100%;
                    border-radius: 6px;
                    font-size: 1rem;
                    box-sizing: border-box;
                    margin-bottom: 0;
                  " 
                  required
                >
              </div>
              <div class="form-group" style="margin-bottom: 1.5rem;">
                <label for="phone" style="color: ${contactData.labelColor || '#333'}; display: block; margin-bottom: 0.5rem; font-weight: 500;">Phone Number</label>
                <input 
                  type="tel" 
                  id="phone" 
                  name="phone" 
                  class="form-control" 
                  placeholder="Enter your phone number with country code" 
                  style="
                    border: 1px solid ${contactData.inputBorderColor || '#ddd'};
                    background-color: ${contactData.inputBackgroundColor || '#ffffff'};
                    color: ${contactData.inputTextColor || '#333'};
                    padding: 0.85rem 1rem;
                    width: 100%;
                    border-radius: 6px;
                    font-size: 1rem;
                    box-sizing: border-box;
                    margin-bottom: 0;
                  " 
                  pattern="\\+?[0-9\\s-()]{7,}"
                  required
                >
              </div>
              <div class="form-group" style="margin-bottom: 2rem;">
                <label for="email" style="color: ${contactData.labelColor || '#333'}; display: block; margin-bottom: 0.5rem; font-weight: 500;">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  class="form-control" 
                  placeholder="Enter your email address" 
                  style="
                    border: 1px solid ${contactData.inputBorderColor || '#ddd'};
                    background-color: ${contactData.inputBackgroundColor || '#ffffff'};
                    color: ${contactData.inputTextColor || '#333'};
                    padding: 0.85rem 1rem;
                    width: 100%;
                    border-radius: 6px;
                    font-size: 1rem;
                    box-sizing: border-box;
                    margin-bottom: 0;
                  " 
                  required
                >
              </div>
              <button 
                type="submit" 
                class="submit-btn" 
                style="
                  background-color: ${contactData.buttonColor || '#1976d2'};
                  color: ${contactData.buttonTextColor || '#ffffff'};
                  border: none;
                  padding: 0.9rem 1.5rem;
                  border-radius: 6px;
                  cursor: pointer;
                  transition: all 0.3s ease;
                  font-weight: 500;
                  width: 100%;
                  font-size: 1rem;
                  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                "
              >
                Send Message
              </button>
            </form>
            <script>
              document.addEventListener('DOMContentLoaded', function() {
                const form = document.getElementById('contactForm');
                const inputs = form.querySelectorAll('input[type="text"], input[type="tel"], input[type="email"]');
                
                // Language logic removed
                
                // Load saved data
                try {
                  const savedData = localStorage.getItem('contactFormData');
                  if (savedData) {
                    const data = JSON.parse(savedData);
                    if (data) {
                      inputs.forEach(input => {
                        if (data[input.name]) {
                          input.value = data[input.name];
                        }
                      });
                    }
                  }
                } catch (error) {
                  console.error('Error loading saved data:', error);
                }

                // Save data on input
                inputs.forEach(input => {
                  input.addEventListener('input', function() {
                    try {
                      const formData = {};
                      inputs.forEach(inp => {
                        formData[inp.name] = inp.value;
                      });
                      localStorage.setItem('contactFormData', JSON.stringify(formData));
                    } catch (error) {
                      console.error('Error saving data:', error);
                    }
                  });
                });
              });
              
              // Form submission function with forced redirect
              async function submitForm(event) {
                event.preventDefault();
                
                const form = event.target;
                const formData = new FormData(form);
                
                try {
                  // Clear localStorage
                  localStorage.removeItem('contactFormData');
                  
                  // Send form data to Formspree
                  const response = await fetch('https://formspree.io/f/mvgwpqrr', {
                    method: 'POST',
                    body: formData,
                    headers: {
                      'Accept': 'application/json'
                    }
                  }).finally(() => {
                    // Always redirect to merci.html with parameters
                    const thankYouMessage = encodeURIComponent('${contactData?.thankYouMessage || 'Спасибо за обращение! Мы свяжемся с вами в ближайшее время.'}');
                    const closeButtonText = encodeURIComponent('${contactData?.closeButtonText || 'Закрыть'}');
                    window.location.href = \`merci.html?message=\${thankYouMessage}&closeButtonText=\${closeButtonText}\`;
                  });
                } catch (error) {
                  console.error('Error sending form:', error);
                  // Even on error, redirect to merci.html with parameters
                  const thankYouMessage = encodeURIComponent('${contactData?.thankYouMessage || 'Спасибо за обращение! Мы свяжемся с вами в ближайшее время.'}');
                  const closeButtonText = encodeURIComponent('${contactData?.closeButtonText || 'Закрыть'}');
                  window.location.href = \`merci.html?message=\${thankYouMessage}&closeButtonText=\${closeButtonText}\`;
                }
                
                return false;
              }
            </script>
          </div>
          <div class="contact-info" style="
            border: 1px solid ${contactData.infoBorderColor || '#1976d2'};
            border-radius: 8px;
            background-color: ${contactData.infoBackgroundColor || '#ffffff'};
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            overflow: hidden;
          ">
            <div class="company-info" style="
              padding: 2rem;
              border-bottom: 1px solid ${contactData.infoBorderColor || '#1976d2'};
            ">
              <h3 style="
                color: ${contactData.infoTitleColor || '#333'};
                font-size: 1.5rem;
                margin-bottom: 1.5rem;
                text-align: center;
              ">${contactData.companyName || 'Our Company'}</h3>
              <div class="contact-details">
                ${contactData.address ? `
                  <p style="color: ${contactData.infoTextColor || '#333'}; margin-bottom: 1rem;">
                    <i class="fas fa-map-marker-alt" style="color: ${contactData.iconColor || '#1976d2'}; margin-right: 0.5rem;"></i>
                    ${contactData.address}
                  </p>
                ` : ''}
                ${contactData.phone ? `
                  <p style="color: ${contactData.infoTextColor || '#333'}; margin-bottom: 1rem;">
                    <i class="fas fa-phone" style="color: ${contactData.iconColor || '#1976d2'}; margin-right: 0.5rem;"></i>
                    ${contactData.phone}
                  </p>
                ` : ''}
                ${contactData.email ? `
                  <p style="color: ${contactData.infoTextColor || '#333'}; margin-bottom: 1rem;">
                    <i class="fas fa-envelope" style="color: ${contactData.iconColor || '#1976d2'}; margin-right: 0.5rem;"></i>
                    ${contactData.email}
                  </p>
                  <div class="contact-domain" style="color: ${contactData.infoTextColor || '#333'}; opacity: 0.8; font-size: 0.9rem; margin-top: 4px; margin-left: 1.5rem; display: none;"></div>
                ` : ''}
              </div>
            </div>
            ${contactData.showMap && contactData.mapUrl ? `
              <div class="contact-map" style="height: 300px;">
                <iframe
                  src="${contactData.mapUrl}"
                  width="100%"
                  height="100%"
                  style="border:0;"
                  allowfullscreen=""
                  loading="lazy"
                  referrerpolicy="no-referrer-when-downgrade">
                </iframe>
              </div>
            ` : contactData.address ? `
              <div class="contact-map" style="height: 300px;">
                <iframe
                  src="https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(contactData.address + (contactData.city ? `, ${contactData.city}` : ''))}&language=ru"
                  width="100%"
                  height="100%"
                  style="border:0;"
                  allowfullscreen=""
                  loading="lazy"
                  referrerpolicy="no-referrer-when-downgrade">
                </iframe>
              </div>
            ` : ''}
          </div>
        </div>
      </div>
    </section>
  </main>

  <footer style="
    background-color: ${data.footerData.backgroundColor || '#1a1a1a'};
    color: ${data.footerData.textColor || '#fff'};
    padding: 3rem 0;
    position: relative;
    z-index: 1;
  ">
    <div style="
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
    ">
      <div style="
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 2rem;
      ">
        <div style="
          background-color: rgba(255, 255, 255, 0.05);
          padding: 1.5rem;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        ">
          <h3 style="
            color: ${data.footerData.textColor || '#fff'};
            margin-bottom: 1rem;
            font-size: 1.2rem;
          ">${data.contactData.companyName || 'Company Name'}</h3>
          <p style="
            color: ${data.footerData.textColor || '#fff'};
            margin-bottom: 0.5rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
          ">
            <i class="fas fa-map-marker-alt" style="color: ${data.footerData.iconColor || '#fff'}"></i>
            ${data.contactData.address || 'Address'}
          </p>
          <p style="
            color: ${data.footerData.textColor || '#fff'};
            margin-bottom: 0.5rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
          ">
            <i class="fas fa-phone" style="color: ${data.footerData.iconColor || '#fff'}"></i>
            ${data.contactData.phone || 'Phone'}
          </p>
          <p style="
            color: ${data.footerData.textColor || '#fff'};
            display: flex;
            align-items: center;
            gap: 0.5rem;
          ">
            <i class="fas fa-envelope" style="color: ${data.footerData.iconColor || '#fff'}"></i>
            ${data.contactData.email || 'Email'}
          </p>
          <div class="footer-domain" style="color: ${data.footerData.textColor || '#fff'}; opacity: 0.8; font-size: 0.9rem; margin-top: 4px; margin-left: 1.5rem; display: none;"></div>
        </div>

        <div style="
          background-color: rgba(255, 255, 255, 0.05);
          padding: 1.5rem;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        ">
          <h3 style="
            color: ${data.footerData.textColor || '#fff'};
            margin-bottom: 1rem;
            font-size: 1.2rem;
          ">Menu</h3>
          <div style="
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 0.5rem;
          ">
            ${data.headerData.menuItems.map(item => `
              <a href="#${item.id}" style="
                color: ${data.footerData.textColor || '#fff'};
                text-decoration: none;
                transition: color 0.3s;
                padding: 0.25rem 0;
              ">${item.text}</a>
            `).join('')}
            <a href="#contact" style="
              color: ${data.footerData.textColor || '#fff'};
              text-decoration: none;
              transition: color 0.3s;
              padding: 0.25rem 0;
            ">${data.contactData.title || 'Contact Us'}</a>
          </div>
        </div>

        <div style="
          background-color: rgba(255, 255, 255, 0.05);
          padding: 1.5rem;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        ">
          <h3 style="
            color: ${data.footerData.textColor || '#fff'};
            margin-bottom: 1rem;
            font-size: 1.2rem;
          ">Legal Information</h3>
          <ul style="
            list-style: none;
            padding: 0;
            margin: 0;
          ">
            <li style="margin-bottom: 0.5rem;">
              <a href="privacy-policy.html" style="
                color: ${data.footerData.textColor || '#fff'};
                text-decoration: none;
                transition: color 0.3s;
              ">${data.legalDocuments?.privacyPolicy?.title || 'Privacy Policy'}</a>
            </li>
            <li style="margin-bottom: 0.5rem;">
              <a href="terms-of-service.html" style="
                color: ${data.footerData.textColor || '#fff'};
                text-decoration: none;
                transition: color 0.3s;
              ">${data.legalDocuments?.termsOfService?.title || 'Terms of Service'}</a>
            </li>
            <li>
              <a href="cookie-policy.html" style="
                color: ${data.footerData.textColor || '#fff'};
                text-decoration: none;
                transition: color 0.3s;
              ">${data.legalDocuments?.cookiePolicy?.title || 'Cookie Policy'}</a>
            </li>
          </ul>
        </div>
      </div>

      <div style="
        text-align: center;
        margin-top: 2rem;
        padding-top: 1rem;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
      ">
        <p style="
          color: ${data.footerData.textColor || '#fff'};
          font-size: 0.9rem;
        ">
          © ${new Date().getFullYear()} ${data.contactData.companyName || 'Company Name'}. All rights reserved.
        </p>
      </div>
    </div>
  </footer>

  <script src="assets/js/script.js"></script>

  <!-- Cookie consent notification -->
  <div id="cookieConsent" style="
    position: fixed;
    left: 20px;
    bottom: 20px;
    background: rgba(30, 30, 30, 0.97);
    color: #fff;
    border-radius: 12px;
    box-shadow: 0 4px 16px rgba(0,0,0,0.18);
    padding: 1.2rem 1.5rem;
    z-index: 9999;
    display: none;
    min-width: 280px;
    max-width: 350px;
    font-size: 1rem;
    animation: fadeInUp 0.7s cubic-bezier(.23,1.01,.32,1) both;
  ">
    <div style="display: flex; align-items: flex-start; gap: 1rem;">
      <div style="flex:1;">
        <strong>We use cookies</strong><br>
        This website uses cookies to ensure you get the best experience on our website. <a href="cookie-policy.html" style="color:#90caf9;text-decoration:underline;">Learn more</a>.
      </div>
      <button id="cookieAcceptBtn" style="margin-left: 8px; background: #1976d2; color: #fff; border: none; border-radius: 6px; padding: 0.5rem 1.1rem; font-weight: 500; cursor: pointer; transition: background 0.2s;">Accept</button>
    </div>
  </div>

  <style>
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(40px); }
      to { opacity: 1; transform: translateY(0); }
    }
    #cookieConsent a:hover { color: #fff; text-decoration: underline; }
    #cookieAcceptBtn:hover { background: #1565c0; }
  </style>

  <script>
    document.addEventListener('DOMContentLoaded', function() {
      var consent = localStorage.getItem('cookieConsent');
      var consentBox = document.getElementById('cookieConsent');
      var acceptBtn = document.getElementById('cookieAcceptBtn');
      if (!consent && consentBox) {
        consentBox.style.display = 'block';
      }
      if (acceptBtn) {
        acceptBtn.onclick = function() {
          localStorage.setItem('cookieConsent', 'accepted');
          if (consentBox) consentBox.style.display = 'none';
        };
      }
    });
  </script>

  ${data.liveChatData?.enabled ? generateLiveChatHTML(data.headerData.siteName || 'Наш сайт', data.headerData.language || 'ru', data.liveChatData) : ''}

  <script>
    ${data.liveChatData?.enabled ? generateLiveChatJS(data.headerData.siteName || 'Наш сайт', data.headerData.language || 'ru', data.liveChatData) : ''}
  </script>

  </body>
</html>`;
  };

  const generateCSS = (customHeaderData = null) => {
    // Используем переданные данные или данные из компонента
    const activeHeaderData = customHeaderData || headerData;
    
    return `
      /* Base styles */
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        font-family: 'Roboto', sans-serif;
      }

      /* Header styles for multi-page export */
      .site-header { 
        background: var(--header-bg-color, #fff); 
        padding: 0.25rem 0.5rem; 
        border-bottom: 1px solid #eee; 
        position: sticky;
        top: 0;
        z-index: 1000;
      }

      .header-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: nowrap;
        max-width: 1200px;
        margin: 0 auto;
        gap: 0.5rem;
      }

      .site-branding {
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-right: 0.5rem;
        flex-shrink: 0;
      }

      .site-title {
        margin: 0;
        font-size: 1.5rem;
        font-weight: 700;
      }

      .site-nav {
        display: flex;
        align-items: center;
        flex-shrink: 0;
      }

      .site-title a {
        color: var(--header-title-color, #333);
        text-decoration: none;
        transition: color 0.3s ease;
      }

      .site-title a:hover {
        color: var(--header-title-color, #333);
        opacity: 0.8;
      }

      .site-domain {
        font-size: 0.9rem;
        color: var(--header-title-color, #666);
        opacity: 0.8;
        margin-top: 4px;
      }

      .site-nav {
        position: relative;
      }

      .menu-toggle {
        display: none;
        flex-direction: column;
        background: none;
        border: none;
        cursor: pointer;
        padding: 0.5rem;
        color: #1976d2;
      }

      .menu-toggle span {
        width: 25px;
        height: 3px;
        background: var(--header-link-color, #1976d2) !important;
        margin: 3px 0;
        transition: 0.3s;
      }

      .nav-menu {
        display: flex;
        list-style: none;
        margin: 0;
        padding: 0;
        gap: 0.5rem;
        align-items: center;
      }

      .nav-menu li {
        margin: 0;
        list-style: none;
      }

      .nav-menu li a {
        all: unset;
        cursor: pointer;
      }

      .nav-menu a,
      .nav-link {
        color: var(--header-link-color, #333) !important;
        text-decoration: none !important;
        font-weight: 500;
        transition: all 0.3s ease;
        padding: 0.125rem 0.25rem;
        border-radius: 4px;
        background: transparent !important;
        display: inline-block;
        border: none !important;
        box-shadow: none !important;
        font-size: 0.85rem;
        line-height: 1.5;
        white-space: nowrap;
      }

      .nav-menu a:hover,
      .nav-link:hover {
        color: var(--header-link-color, #1976d2) !important;
        background: rgba(0, 0, 0, 0.05) !important;
        opacity: 1;
        transform: none !important;
      }

      /* ПРОСТЫЕ СТИЛИ ДЛЯ АКТИВНОЙ ССЫЛКИ */
      .nav-link.active {
        background: #1976d2 !important;
        color: #ffffff !important;
        font-weight: bold !important;
        border-radius: 20px !important;
        padding: 0.5rem 1rem !important;
        box-shadow: 0 2px 8px rgba(25, 118, 210, 0.3) !important;
        transition: all 0.3s ease !important;
      }

      /* Mobile responsiveness */
      @media (max-width: 768px) {
        .site-header {
          padding: 0.25rem;
        }
        
        .menu-toggle {
          display: flex !important;
          color: var(--header-link-color, #1976d2) !important;
          background: transparent !important;
          border: none !important;
          cursor: pointer !important;
          padding: 0.5rem !important;
        }
        
        .menu-toggle span {
          background: var(--header-link-color, #1976d2) !important;
          color: var(--header-link-color, #1976d2) !important;
          width: 25px !important;
          height: 3px !important;
          margin: 3px 0 !important;
          display: block !important;
        }
        
        .nav-menu {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: var(--header-bg-color, #fff);
          flex-direction: column;
          padding: 0.25rem;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          display: none;
          gap: 0.25rem;
        }
        
        .nav-menu.active {
          display: flex;
        }
        
        .header-content {
          flex-wrap: nowrap;
        }
        
        .site-branding {
          margin-right: 0.25rem;
          margin-left: 0.5rem;
        }
      }

      /* Styles for sections without cards */
      .section-nocards {
        background: linear-gradient(135deg, #f6f9fc 0%, #ffffff 100%);
        border-radius: 40px;
        padding: 5rem 3rem;
        margin: 4rem auto;
        max-width: 1400px;
        box-shadow: 0 30px 60px rgba(0,0,0,0.15);
        position: relative;
        overflow: hidden;
      }

      .section-nocards::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 8px;
        background: linear-gradient(90deg, #FF6B6B, #4ECDC4);
      }

      .section-nocards h2 {
        font-size: 3rem;
        font-weight: 900;
        text-align: center;
        margin-bottom: 3rem;
        background: linear-gradient(45deg, #2C3E50, #3498DB);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        text-transform: uppercase;
        letter-spacing: 3px;
        font-family: "Montserrat", sans-serif;
        text-shadow: 3px 3px 6px rgba(0,0,0,0.2);
      }

      .section-nocards p {
        font-size: 1.8rem;
        text-align: center;
        margin-bottom: 5rem;
        color: #34495E;
        font-family: "Playfair Display", serif;
        font-style: italic;
        line-height: 1.8;
        max-width: 800px;
        margin: 0 auto 5rem;
        padding: 0 1.5rem;
      }

      /* Styles for blocks in sections without cards */
      .section-nocards .service-block {
        background: rgba(255, 255, 255, 0.95);
        border-radius: 30px;
        padding: 4rem;
        box-shadow: 0 15px 45px rgba(0,0,0,0.08);
        border: 2px solid rgba(0,0,0,0.08);
        transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        transform: translateY(0);
        margin-bottom: 4rem;
      }

      .section-nocards .service-block:hover {
        transform: translateY(-20px);
        box-shadow: 0 30px 60px rgba(0,0,0,0.15);
        border-color: #4ECDC4;
        border-width: 3px;
      }

      .section-nocards .service-block h3 {
        font-size: 2.8rem;
        font-weight: 800;
        margin-bottom: 2.5rem;
        color: #2C3E50;
        font-family: "Montserrat", sans-serif;
        border-bottom: 4px solid #4ECDC4;
        padding-bottom: 1.5rem;
      }

      .section-nocards .service-block p {
        font-size: 1.5rem;
        line-height: 2;
        color: #34495E;
        font-family: "Playfair Display", serif;
        white-space: pre-wrap;
        text-align: left;
        margin: 0;
      }

      /* Styles for sections without cards with images */
      .section-nocards.with-image {
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        gap: 4rem;
      }

      .section-nocards.with-image .content {
        flex: 1;
      }

      .section-nocards.with-image .image-container {
        flex: 0 0 40%;
        position: relative;
        border-radius: 20px;
        overflow: hidden;
        box-shadow: 0 20px 40px rgba(0,0,0,0.15);
        transition: all 0.4s ease;
      }

      .section-nocards.with-image .image-container:hover {
        transform: translateY(-10px);
        box-shadow: 0 30px 60px rgba(0,0,0,0.2);
      }

      .section-nocards.with-image .image-container img {
        width: 100%;
        height: auto;
        display: block;
        transition: transform 0.4s ease;
      }

      .section-nocards.with-image .image-container:hover img {
        transform: scale(1.05);
      }

      /* Animations */
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .section-nocards .service-block {
        animation: fadeInUp 0.7s ease-out forwards;
      }

      /* Responsiveness */
      @media (max-width: 768px) {
        .section-nocards {
          padding: 3rem 1.5rem;
          margin: 2rem auto;
          border-radius: 20px;
        }

        .section-nocards h2 {
          font-size: 2rem;
          margin-bottom: 2rem;
        }

        .section-nocards p {
          font-size: 1.2rem;
          margin-bottom: 3rem;
        }

        .section-nocards .service-block {
          padding: 2rem;
          margin-bottom: 2rem;
        }

        .section-nocards .service-block h3 {
          font-size: 1.8rem;
          margin-bottom: 1.5rem;
        }

        .section-nocards .service-block p {
          font-size: 1.1rem;
          line-height: 1.6;
        }

        .section-nocards.with-image {
          flex-direction: column;
        }

        .section-nocards.with-image .image-container {
          flex: 0 0 100%;
          margin-bottom: 2rem;
        }
      }

      /* Other styles */
      header {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 1000;
      }

      nav {
        padding: 1rem;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      }

      .nav-container {
        max-width: 1200px;
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 1rem;
      }

      .logo {
        font-size: 1.5rem;
        font-weight: 700;
        text-decoration: none;
        white-space: nowrap;
        margin-right: 2rem;
      }

      .domain {
        display: block;
        margin-top: 0.25rem;
        font-size: 0.9rem;
        font-weight: normal;
        opacity: 0.8;
        white-space: nowrap;
      }

      .nav-menu {
        display: flex;
        list-style: none;
        margin: 0;
        padding: 0;
        flex-wrap: nowrap;
      }

      .nav-menu li {
        margin-left: 2rem;
        white-space: nowrap;
      }

      .nav-menu a {
        text-decoration: none;
        position: relative;
        white-space: nowrap;
      }

      .nav-menu a::after {
        content: '';
        position: absolute;
        bottom: -5px;
        left: 0;
        width: 0;
        height: 2px;
        background-color: currentColor;
        transition: width 0.3s ease;
      }

      .nav-menu a:hover::after {
        width: 100%;
      }


      .menu-toggle span {
        display: block;
        width: 25px;
        height: 3px;
        background: var(--header-link-color, #333);
        margin: 5px 0;
        transition: all 0.3s ease;
      }

      @media (max-width: 768px) {

        .nav-menu {
          display: none !important;
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: var(--menu-bg-color, #fff);
          padding: 1rem 0;
          flex-direction: column;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
          z-index: 1001;
          border-bottom-left-radius: 12px;
          border-bottom-right-radius: 12px;
        }

        .nav-menu.active {
          display: flex !important;
        }

        .nav-menu li {
          margin: 0.5rem 0;
          width: 100%;
          text-align: center;
        }

        .nav-menu a {
          display: block;
          padding: 0.75rem 1rem;
          font-size: 1.1rem;
          font-weight: 500;
          color: var(--menu-link-color, #1976d2) !important;
          background: transparent;
          transition: color 0.3s;
        }

        .nav-menu a::after {
          display: none;
        }
        
        .nav-link.active {
          background: #1976d2 !important;
          color: #ffffff !important;
          font-weight: bold !important;
          border-radius: 20px !important;
          padding: 0.5rem 1rem !important;
          box-shadow: 0 2px 8px rgba(25, 118, 210, 0.3) !important;
          transition: all 0.3s ease !important;
        }

        .logo {
          font-size: 1.1rem;
          margin-right: 1rem;
          white-space: nowrap;
        }
      }

      @media (max-width: 480px) {
        .nav-container {
          padding: 0 0.5rem;
        }

        .logo {
          font-size: 1rem;
        }

        .nav-menu a {
          font-size: 0.9rem;
        }
      }

      body {
        line-height: 1.6;
        color: #333;
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        overflow-x: hidden;
        margin: 0;
        padding: 0;
        width: 100%;
      }

      /* ФИНАЛЬНЫЕ СТИЛИ ДЛЯ АКТИВНОЙ ССЫЛКИ */
      .nav-link.active {
        background: #1976d2 !important;
        color: #ffffff !important;
        font-weight: bold !important;
        border-radius: 20px !important;
        padding: 0.5rem 1rem !important;
        box-shadow: 0 2px 8px rgba(25, 118, 210, 0.3) !important;
        transition: all 0.3s ease !important;
      }
      
      /* Styles for image gallery */
      .section-gallery {
        position: relative;
        overflow: hidden;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      }
      
      .gallery-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: opacity 0.5s ease;
      }
      
      .gallery-dot {
        cursor: pointer;
        transition: background-color 0.3s ease;
      }
      
      /* Styles for images inside sections with text wrapping */
      section p + .section-gallery,
      section h2 + .section-gallery {
        margin-top: 1rem;
        margin-bottom: 1rem;
      }

      /* Styles for section borders */
      section {
        position: relative;
        padding: 6rem 0;
        margin: 2rem 0;
        overflow: hidden;
      }

      section:first-child {
        margin-top: 0;
      }

      section:last-child {
        margin-bottom: 0;
      }


      .site-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
      }

      main {
        flex: 1;
        padding-top: 60px;
        width: 100%;
        overflow-x: hidden;
      }

      .hero {
        height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        padding: 0 2rem;
        position: relative;
        overflow: hidden;
      }

      .hero {
        position: relative;
        overflow: hidden;
      }

      .hero-bg-animation {
        position: absolute;
        top: -5%;
        left: -5%;
        width: 110%;
        height: 110%;
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        z-index: -1;
        animation: heroBackgroundZoom 15s ease-in-out infinite;
      }

      @keyframes heroBackgroundZoom {
        0% { 
          transform: scale(1);
        }
        50% { 
          transform: scale(1.05);
        }
        100% { 
          transform: scale(1);
        }
      }

      @keyframes zoomIn {
        0% {
          transform: scale(1);
        }
        100% {
          transform: scale(1.1);
        }
      }

      .hero-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 1;
        animation: fadeIn 1s ease-in-out;
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }

      .hero-content {
        max-width: 800px;
        z-index: 2;
        position: relative;
        animation: slideUp 1s ease-out;
      }

      @keyframes slideUp {
        from {
          transform: translateY(50px);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }

      .hero h1 {
        font-size: 2.5rem;
        margin-bottom: 0.5rem;
        line-height: 1.1;
        text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        animation: none !important;
      }

      .hero p {
        font-size: 1.2rem;
        margin-bottom: 1rem;
        line-height: 1.3;
        max-width: 600px;
        margin-left: auto;
        margin-right: auto;
        text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
        animation: none !important;
      }

      .hero button {
        padding: 1rem 2rem;
        font-size: 1.1rem;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        animation: none !important;
      }

      .hero button:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0,0,0,0.3);
      }

      .section {
        padding: 6rem 1rem;
        width: 100%;
        box-sizing: border-box;
        position: relative;
        overflow: hidden;
        background-color: var(--section-background-color, transparent);
        z-index: 1;
      }

      .section[data-show-background="false"] {
        background-color: transparent !important;
        background-image: none !important;
      }

      .section[data-show-background="false"] .section-background-blur,
      .section[data-show-background="false"] .section-overlay {
        display: none !important;
      }

      .section-background-blur {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-size: cover;
        background-position: center;
        z-index: 0;
        animation: zoomIn 20s ease-in-out infinite alternate;
      }

      .section-container {
        position: relative;
        z-index: 2;
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 1rem;
      }

      .section-header {
        text-align: center;
        margin-bottom: 3rem;
      }
      .section-header h2 {
        font-size: 2.5rem;
        margin-bottom: 1rem;
        position: relative;
      }

      .section-header h2::after {
        content: '';
        position: absolute;
        bottom: -10px;
        left: 50%;
        transform: translateX(-50%);
        width: 50px;
        height: 3px;
        background-color: #1976d2;
        transition: width 0.3s ease-in-out;
      }

      .section-header h2:hover::after {
        width: 100px;
      }

      .section-header p {
        font-size: 1.2rem;
        max-width: 800px;
        margin: 0 auto;
        line-height: 1.6;
      }

      .about-section {
        display: flex;
        align-items: flex-start;
        gap: 2rem;
        padding: 2rem;
        position: relative;
        border-radius: 16px;
        background: linear-gradient(145deg, #ffffff, #f5f5f5);
        box-shadow: 0 4px 20px rgba(0,0,0,0.1);
      }


      .about-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        padding-left: 1rem;
        text-align: left;
        position: relative;
      }

      .about-content::before {
        content: "";
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        width: 4px;
        background: linear-gradient(to bottom, #1976d2, #42a5f5);
        border-radius: 2px;
      }

      .about-content h2 {
        font-size: 2.5rem;
        font-weight: 700;
        margin-bottom: 1rem;
        text-align: left;
        position: relative;
      }

      .about-content h2::after {
        content: "";
        position: absolute;
        bottom: -8px;
        left: 0;
        width: 60px;
        height: 4px;
        background: linear-gradient(to right, #1976d2, #42a5f5);
        border-radius: 2px;
      }

      .about-content p {
        font-size: 1.1rem;
        line-height: 1.6;
        text-align: left;
      }

      .section-image {
        width: 100%;
        margin: 2rem auto;
        text-align: center;
        max-width: 800px;
      }

      .section-image img {
        width: 100%;
        height: auto;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        transition: transform 0.3s ease;
      }

      .section-image img:hover {
        transform: scale(1.02);
      }

      @media (max-width: 768px) {
        .about-section {
          flex-direction: column;
        }
        
        .about-content {
          padding-left: 0;
          padding-top: 1rem;
        }
      }

      .section h2 {
        font-size: 2.5rem;
        margin-bottom: 1rem;
        text-align: center;
        position: relative;
      }

      .section h2::after {
        content: '';
        position: absolute;
        bottom: -10px;
        left: 50%;
        transform: translateX(-50%);
        width: 50px;
        height: 3px;
        background-color: #1976d2;
        transition: width 0.3s ease-in-out;
      }
      .section h2:hover::after {
        width: 100px;
      }
      .section p {
        font-size: 1.1rem;
        margin-bottom: 3rem;
        text-align: center;
        max-width: 800px;
        margin-left: auto;
        margin-right: auto;
      }

      /* Container for cards */
      .cards-container {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 2rem;
        padding: 1rem;
        position: relative;
        z-index: 2;
        pointer-events: auto;
      }

      @media (max-width: 1024px) {
        .cards-container {
          grid-template-columns: repeat(2, 1fr);
        }
      }

      @media (max-width: 768px) {
        .cards-container {
          grid-template-columns: 1fr;
        }
      }

      /* Basic card styles with animations */
      .card {
        transition: all 0.3s ease-in-out;
        padding: 1.5rem;
        display: flex;
        flex-direction: column;
        background-color: #ffffff;
        width: 100%;
        max-width: 280px;
        border-radius: 12px;
        overflow: hidden;
        height: 100%;
        margin: 1rem;
        position: relative;
        z-index: 2;
      }

      /* Service image styles for image cards */
      .service-image {
        width: 100%;
        overflow: hidden;
        position: relative;
        background: #f8f9fa;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 8px;
      }

      .service-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.3s ease;
      }

      .service-image:hover img {
        transform: scale(1.05);
      }

      /* Card headings and text */
      .card-title {
        color: #1a237e;
        margin-bottom: 0.7rem;
        font-size: 1.5rem;
        font-weight: 600;
        transition: all 0.3s ease-in-out;
      }

      .card-text {
        color: #455a64;
        font-size: 1rem;
        line-height: 1.6;
        transition: all 0.3s ease-in-out;
      }

      /* Simple Card */
      .card.simple {
        background-color: transparent;
        border: 3px solid #e0e0e0;
      }

      .card.simple:hover {
        transform: scale(1.2);
        z-index: 3;
      }

      /* Elevated Card */
      .card.elevated {
        background-color: #ffffff;
        border: 3px solid #e0e0e0;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      }

      .card.elevated:hover {
        transform: rotate(3deg) scale(1.05);
        box-shadow: 0 8px 16px rgba(0,0,0,0.2);
        z-index: 3;
      }

      .card.elevated:hover .card-title {
        color: #1976d2;
        transform: translateX(4px);
      }

      /* Outlined Card */
      .card.outlined {
        background: linear-gradient(to right, #e8f5e9, #c8e6c9);
        border: 3px solid #e0e0e0;
      }

      .card.outlined:hover {
        transform: skew(-5deg) translateY(-5px);
        border-color: #1976d2;
        z-index: 3;
      }

      .card.outlined:hover .card-title {
        color: #1976d2;
      }

      /* Accent Card */
      .card.accent {
        background-color: #ffffff;
        border: 3px solid #e0e0e0;
        position: relative;
      }

      .card.accent::before {
        content: "";
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        width: 4px;
        background: linear-gradient(to bottom, #1976d2, #42a5f5);
        transition: width 0.3s ease-in-out;
        z-index: 1;
      }

      .card.accent:hover {
        transform: translateX(10px) translateY(-5px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 3;
      }

      .card.accent:hover::before {
        width: 6px;
      }

      .card.accent:hover .card-title {
        color: #1976d2;
      }

      /* Gradient Card */
      .card.gradient {
        background: linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%);
        border: 3px solid #e0e0e0;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        transition: all 0.3s ease-in-out;
        position: relative;
        z-index: 2;
      }

      .card.gradient:hover {
        transform: scale(1.2);
        box-shadow: 0 8px 16px rgba(0,0,0,0.2);
        z-index: 3;
      }

      .card.gradient:hover h3 {
        color: #1976d2;
      }

      .card.gradient:hover p {
        color: #455a64;
      }

      /* Container for sections */
      .section-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 2rem;
      }

      /* Section heading */
      .section-header {
        text-align: center;
        margin-bottom: 4rem;
      }

      .section-header h2 {
        font-size: 2.5rem;
        margin-bottom: 1rem;
        position: relative;
        display: inline-block;
      }

      .section-header p {
        font-size: 1.2rem;
        max-width: 800px;
        margin: 0 auto;
        line-height: 1.6;
      }

      @media (max-width: 768px) {
        .contact-grid {
          grid-template-columns: 1fr !important;
          gap: 1.5rem !important;
        }
      }

      .section-image img:hover {
        transform: scale(1.02);
      }

      .image-upload-control {
        margin-top: 1rem;
        display: flex;
        justify-content: flex-start;
      }



      @keyframes fadeInSection {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .upload-button {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 1rem;
        background-color: #1976d2;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.3s ease;
      }

      .upload-button:hover {
        background-color: #1565c0;
      }

      .upload-button i {
        font-size: 1.2rem;
      }

      @media (max-width: 768px) {
        .nav-container {
          padding: 0 0.5rem;
        }

        .logo {
          font-size: 1rem;
        }

        .nav-menu a {
          font-size: 0.9rem;
        }
      }

      .cards-container.cards-2 {
        max-width: 1200px;
        margin-left: auto;
        margin-right: auto;
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 2rem;
      }
      .cards-container.cards-3 {
        max-width: 1200px;
        margin-left: auto;
        margin-right: auto;
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 2rem;
      }
      
      @media (max-width: 1024px) {
        .cards-container.cards-2,
        .cards-container.cards-3 {
          grid-template-columns: 1fr;
        }
      }
      
      .cards-container.cards-2 .card,
      .cards-container.cards-3 .card {
        max-width: 100%;
        width: 100%;
      }

      .card, .section-image img, .about-image img {
        opacity: 0;
        transform: translateY(40px);
        transition: opacity 0.8s cubic-bezier(0.4,0,0.2,1), transform 0.8s cubic-bezier(0.4,0,0.2,1);
      }
      .card.animate-on-scroll, .section-image img.animate-on-scroll, .about-image img.animate-on-scroll {
        opacity: 1;
        transform: translateY(0);
      }


      @media (max-width: 1024px) {
        .no-card-section {
          flex-direction: column;
          align-items: center;
        }
        
        .no-card-section .about-image {
          min-width: 100%;
          max-width: 500px;
          margin: 0 auto 2rem auto;
          order: -1;
        }
        
        .no-card-section .about-content {
          width: 100%;
          text-align: center;
        }
        
        .no-card-section .about-content h2,
        .no-card-section .about-content p,
        .no-card-section .about-content div {
          text-align: center !important;
        }
        
        .no-card-section .about-content div br {
          display: none;
        }
        
        .no-card-section .about-content div strong {
          display: block;
          margin-top: 1rem;
          margin-bottom: 0.5rem;
        }
      }

      /* Styles for text in sections */
      .section h2 {
        font-size: 2.5rem;
        font-weight: 700;
        line-height: 1.2;
        letter-spacing: -0.01562em;
        text-transform: none;
        margin-bottom: 1.5rem;
        text-align: center;
        color: inherit;
        word-wrap: break-word;
      }

      .section p {
        font-size: 1.25rem;
        font-weight: 400;
        line-height: 1.5;
        letter-spacing: 0.00938em;
        text-align: center;
        margin-bottom: 2rem;
        color: inherit;
        max-width: 100%;
        word-wrap: break-word;
      }

      @media (max-width: 600px) {
        .section h2 {
          font-size: 2rem;
        }
        .section p {
          font-size: 1rem;
        }
      }

      @media (max-width: 960px) {
        .section h2 {
          font-size: 2.25rem;
        }
        .section p {
          font-size: 1.1rem;
        }
      }

      /* Multi-page specific styles */
      
      /* Site Header for multi-page */
      .site-header {
        background: ${activeHeaderData.backgroundColor};
        color: ${activeHeaderData.titleColor};
        padding: 1rem 0;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        position: sticky;
        top: 0;
        z-index: 1000;
      }

      .site-header .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 1rem;
      }

      .site-header .header-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .site-header .site-title {
        margin: 0;
        font-size: 1.8rem;
        font-weight: 700;
      }

      .site-header .site-title a {
        color: inherit;
        text-decoration: none;
      }

      .site-nav ul {
        display: flex;
        list-style: none;
        margin: 0;
        padding: 0;
        gap: 2rem;
      }

      .site-nav a {
        color: ${activeHeaderData.linksColor};
        text-decoration: none;
        font-weight: 500;
        padding: 0.5rem 1rem;
        border-radius: 8px;
        transition: all 0.3s ease;
      }

      .site-nav a:hover,
      .site-nav a.active {
        background: rgba(255,255,255,0.1);
        transform: translateY(-2px);
      }


      .menu-toggle span {
        width: 100%;
        height: 3px;
        background: var(--header-link-color, #333);
        border-radius: 2px;
        transition: all 0.3s ease;
        transform-origin: center;
      }

      .menu-toggle.active span:nth-child(1) {
        transform: translateY(9px) rotate(45deg);
      }

      .menu-toggle.active span:nth-child(2) {
        opacity: 0;
      }

      .menu-toggle.active span:nth-child(3) {
        transform: translateY(-9px) rotate(-45deg);
      }

      /* Site Footer for multi-page */
      .site-footer {
        background: #2c3e50;
        color: white;
        margin-top: 4rem;
        padding: 3rem 0 1rem;
      }

      .footer-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 1rem;
      }

      .footer-content {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 2rem;
        margin-bottom: 2rem;
      }

      .footer-info h3 {
        color: #ecf0f1;
        margin-bottom: 1rem;
        font-size: 1.5rem;
        font-weight: 600;
      }

      .footer-info p {
        color: #bdc3c7;
        line-height: 1.6;
        margin-bottom: 0.5rem;
      }

      .footer-links h4,
      .footer-contact h4 {
        color: #ecf0f1;
        margin-bottom: 1rem;
        font-size: 1.2rem;
        font-weight: 600;
      }

      .footer-links ul {
        list-style: none;
        padding: 0;
      }

      .footer-links li {
        margin-bottom: 0.5rem;
      }

      .footer-links a {
        color: #bdc3c7;
        text-decoration: none;
        transition: color 0.3s ease;
      }

      .footer-links a:hover {
        color: #3498db;
      }

      .footer-contact p {
        color: #bdc3c7;
        margin-bottom: 0.5rem;
        line-height: 1.6;
      }

      .footer-bottom {
        border-top: 1px solid #34495e;
        padding-top: 1rem;
        text-align: center;
      }

      .footer-bottom p {
        color: #95a5a6;
        margin: 0;
        font-size: 0.9rem;
      }

      @media (max-width: 768px) {
        .footer-content {
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }
        
        .footer-info,
        .footer-links,
        .footer-contact {
          text-align: center;
        }
      }

      /* Hero Section for index page */
      .hero-section {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 4rem 0;
        text-align: center;
      }

      .hero-section .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 1rem;
      }

      .hero-title {
        font-size: 3rem;
        font-weight: 700;
        margin-bottom: 1rem;
      }

      .hero-subtitle {
        font-size: 1.5rem;
        font-weight: 300;
        margin-bottom: 1rem;
        opacity: 0.9;
      }

      .hero-description {
        font-size: 1.2rem;
        margin-bottom: 2rem;
        opacity: 0.8;
      }

      .hero-button {
        display: inline-block;
        background: #ff6b6b;
        color: white;
        padding: 1rem 2rem;
        text-decoration: none;
        border-radius: 50px;
        font-weight: 600;
        transition: all 0.3s ease;
      }

      .hero-button:hover {
        background: #ff5252;
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(255, 107, 107, 0.4);
      }

      /* Sections Preview Grid */
      .sections-preview {
        padding: 4rem 0;
      }

      .sections-preview .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 1rem;
      }

      .sections-preview h2 {
        text-align: center;
        font-size: 2.5rem;
        margin-bottom: 3rem;
        color: #2c3e50;
      }

      .preview-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 2rem;
      }

      .preview-card {
        background: white;
        border-radius: 15px;
        padding: 2rem;
        box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        transition: all 0.3s ease;
        border: 1px solid #e9ecef;
      }

      .preview-card:hover {
        transform: translateY(-10px);
        box-shadow: 0 20px 40px rgba(0,0,0,0.15);
      }

      .preview-card h3 {
        color: #2c3e50;
        font-size: 1.5rem;
        margin-bottom: 1rem;
      }

      .preview-card p {
        color: #6c757d;
        line-height: 1.6;
        margin-bottom: 1.5rem;
      }

      .preview-link {
        display: inline-block;
        background: #007bff;
        color: white;
        padding: 0.75rem 1.5rem;
        text-decoration: none;
        border-radius: 8px;
        font-weight: 500;
        transition: all 0.3s ease;
      }

      .preview-link:hover {
        background: #0056b3;
        transform: translateY(-2px);
      }

      /* Стили для выделенного раздела */
      .featured-section {
        position: relative;
        overflow: hidden;
      }

      .featured-content {
        position: relative;
        z-index: 2;
      }

      .featured-image {
        border-radius: 15px;
        overflow: hidden;
        box-shadow: 0 15px 35px rgba(0,0,0,0.1);
      }

      .featured-image img {
        width: 100%;
        height: auto;
        display: block;
        transition: transform 0.3s ease;
      }

      .featured-image:hover img {
        transform: scale(1.05);
      }

      .featured-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(25, 118, 210, 0.3);
      }

      /* Стили для разных режимов отображения разделов */
      .sections-preview.mode-cards .preview-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 2rem;
      }



      /* Стили для превью контактов */
      .contact-preview {
        position: relative;
        overflow: hidden;
      }

      .contact-preview-content {
        position: relative;
        z-index: 2;
      }

      .contact-preview-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(255,255,255,0.2);
      }

      /* Адаптивность для новых режимов */
      @media (max-width: 768px) {
        .featured-content {
          grid-template-columns: 1fr !important;
          gap: 2rem;
        }

        .sections-preview.mode-cards .preview-grid {
          grid-template-columns: 1fr;
        }


        .contact-preview-info {
          flex-direction: column;
          gap: 1rem;
        }
      }

      /* Section Content Pages */
      .section-content {
        padding: 2rem 0;
      }

      .section-content .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 1rem;
      }

      .section-title {
        font-size: 2.5rem;
        color: #2c3e50;
        margin-bottom: 1rem;
        text-align: center;
      }

      .section-description {
        font-size: 1.2rem;
        color: #6c757d;
        text-align: center;
        margin-bottom: 3rem;
        line-height: 1.6;
      }

      .cards-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 2rem;
      }

      .cards-grid .card {
        background: white;
        border-radius: 15px;
        padding: 2rem;
        box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        transition: all 0.3s ease;
        border: 1px solid #e9ecef;
      }

      .cards-grid .card:hover {
        transform: translateY(-5px);
        box-shadow: 0 15px 35px rgba(0,0,0,0.15);
      }

      .card-title {
        color: #2c3e50;
        font-size: 1.3rem;
        margin-bottom: 1rem;
      }

      .card-content {
        color: #6c757d;
        line-height: 1.6;
      }

      /* Contact Section */
      .contact-section {
        padding: 2rem 0;
      }

      .contact-section .container {
        max-width: 800px;
        margin: 0 auto;
        padding: 0 1rem;
      }

      .contact-section h1 {
        font-size: 2.5rem;
        color: #2c3e50;
        text-align: center;
        margin-bottom: 2rem;
      }

      .contact-section p {
        font-size: 1.2rem;
        color: #6c757d;
        text-align: center;
        margin-bottom: 2rem;
        line-height: 1.6;
      }

      .contact-info {
        background: inherit; /* Наследует фон от родительского контейнера */
        border-radius: 15px;
        padding: 2rem;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.08);
        border: 1px solid rgba(255,255,255,0.1);
      }

      .contact-info p {
        margin-bottom: 1rem;
        text-align: left;
        font-size: 1.1rem;
      }

      .contact-info strong {
        color: #2c3e50;
      }

      /* Legal Content */
      .legal-content {
        padding: 2rem 0;
      }

      .legal-content .container {
        max-width: 900px;
        margin: 0 auto;
        padding: 0 1rem;
      }

      .legal-content h1 {
        font-size: 2.5rem;
        color: #2c3e50;
        text-align: center;
        margin-bottom: 2rem;
      }

      .legal-content .content {
        background: white;
        border-radius: 15px;
        padding: 2rem;
        box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        border: 1px solid #e9ecef;
        line-height: 1.6;
        color: #495057;
      }
      /* Responsive design for multi-page */
      @media (max-width: 768px) {
        .site-header .header-content {
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
        }


        .site-nav ul {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100vh;
          background: ${activeHeaderData.backgroundColor};
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 12px;
          transform: translateX(-100%);
          transition: transform 0.3s ease;
          z-index: 1000;
          box-shadow: 2px 0 10px rgba(0,0,0,0.1);
        }

        .nav-menu.active {
          transform: translateX(0);
        }

        .site-nav a {
          font-size: 1.2rem;
          padding: 1rem 2rem;
          border-radius: 10px;
          width: 200px;
          text-align: center;
        }

        .hero-title {
          font-size: 2rem;
        }

        .hero-subtitle {
          font-size: 1.2rem;
        }

        .sections-preview h2 {
          font-size: 2rem;
        }

        .preview-grid {
          grid-template-columns: 1fr;
        }

        .section-title {
          font-size: 2rem;
        }

        .cards-grid {
          grid-template-columns: 1fr;
        }
      }

      /* Enhanced section styles from EnhancedSectionEditor */
      ${headerData.menuItems ? headerData.menuItems.map(item => {
        const section = sectionsData[item.id];
        if (!section || !section.enhancedStyles) return '';
        
        const styles = section.enhancedStyles;
        let css = '';
        
        // Section specific styles
        css += `
          #${item.id} {
            ${styles.padding ? `padding: ${styles.padding} !important;` : ''}
            ${styles.margin ? `margin: ${styles.margin} !important;` : ''}
            ${styles.borderRadius ? `border-radius: ${styles.borderRadius} !important;` : ''}
            ${styles.background ? generateBackgroundCSS(styles.background) : ''}
          }
        `;
        
        // Title styles
        if (styles.titleStyle) {
          css += `
            #${item.id} h2 {
              ${styles.titleStyle.fontFamily ? `font-family: ${styles.titleStyle.fontFamily} !important;` : ''}
              ${styles.titleStyle.fontSize ? `font-size: ${styles.titleStyle.fontSize} !important;` : ''}
              ${styles.titleStyle.fontWeight ? `font-weight: ${styles.titleStyle.fontWeight} !important;` : ''}
              ${styles.titleStyle.fontStyle ? `font-style: ${styles.titleStyle.fontStyle} !important;` : ''}
              ${styles.titleStyle.textDecoration ? `text-decoration: ${styles.titleStyle.textDecoration} !important;` : ''}
              ${styles.titleStyle.textAlign ? `text-align: ${styles.titleStyle.textAlign} !important;` : ''}
              ${styles.titleStyle.color ? `color: ${styles.titleStyle.color} !important;` : ''}
            }
          `;
        }
        
        // Description styles
        if (styles.descriptionStyle) {
          css += `
            #${item.id} p {
              ${styles.descriptionStyle.fontFamily ? `font-family: ${styles.descriptionStyle.fontFamily} !important;` : ''}
              ${styles.descriptionStyle.fontSize ? `font-size: ${styles.descriptionStyle.fontSize} !important;` : ''}
              ${styles.descriptionStyle.fontWeight ? `font-weight: ${styles.descriptionStyle.fontWeight} !important;` : ''}
              ${styles.descriptionStyle.fontStyle ? `font-style: ${styles.descriptionStyle.fontStyle} !important;` : ''}
              ${styles.descriptionStyle.textDecoration ? `text-decoration: ${styles.descriptionStyle.textDecoration} !important;` : ''}
              ${styles.descriptionStyle.textAlign ? `text-align: ${styles.descriptionStyle.textAlign} !important;` : ''}
              ${styles.descriptionStyle.color ? `color: ${styles.descriptionStyle.color} !important;` : ''}
            }
          `;
        }
        
        // Animation styles
        if (styles.animation && styles.animation.type !== 'none') {
          css += `
            #${item.id} {
              animation: ${styles.animation.type} ${styles.animation.duration || 600}ms ease-out;
              animation-delay: ${styles.animation.delay || 0}ms;
              animation-fill-mode: both;
              ${styles.animation.repeat ? 'animation-iteration-count: infinite;' : ''}
            }
          `;
        }
        
        return css;
      }).join('') : ''}

      /* Animation keyframes */
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      @keyframes slideInLeft {
        from { transform: translateX(-100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      
      @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      
      @keyframes slideInUp {
        from { transform: translateY(100%); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
      
      @keyframes slideInDown {
        from { transform: translateY(-100%); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
      
      @keyframes zoomIn {
        from { transform: scale(0.8); opacity: 0; }
        to { transform: scale(1); opacity: 1; }
      }
      
      @keyframes bounce {
        0%, 20%, 53%, 80%, 100% { transform: translateY(0); }
        40%, 43% { transform: translateY(-20px); }
        70% { transform: translateY(-10px); }
        90% { transform: translateY(-4px); }
      }
      
      @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
      }
      
      /* Chart Components */
      .chart-component {
        animation: fadeInUp 0.6s ease-out;
      }
      
      .chart-component canvas {
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      }
      
      .chart-component div[id^="chart-"] {
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      }
      
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `;
  };

  // Helper function to generate background CSS
  const generateBackgroundCSS = (background) => {
    if (!background) return '';
    
    switch (background.type) {
      case 'solid':
        return `background: ${background.color} !important;`;
      case 'gradient':
        return `background: linear-gradient(${background.direction}, ${background.color1}, ${background.color2}) !important;`;
      case 'image':
        return `background: url('${background.imageUrl}') center/cover !important;`;
      case 'pattern':
        return generatePatternCSS(background.pattern);
      default:
        return '';
    }
  };

  // Helper function to generate pattern CSS
  const generatePatternCSS = (pattern) => {
    switch (pattern) {
      case 'dots':
        return `background: radial-gradient(circle at 25% 25%, #ddd 2px, transparent 0), radial-gradient(circle at 75% 75%, #ddd 2px, transparent 0) !important; background-size: 20px 20px !important;`;
      case 'grid':
        return `background: linear-gradient(to right, #ddd 1px, transparent 1px), linear-gradient(to bottom, #ddd 1px, transparent 1px) !important; background-size: 20px 20px !important;`;
      case 'stripes':
        return `background: repeating-linear-gradient(45deg, #f0f0f0 0px, #f0f0f0 10px, #e0e0e0 10px, #e0e0e0 20px) !important;`;
      case 'waves':
        return `background: linear-gradient(120deg, #f0f0f0 0%, #e0e0e0 100%) !important;`;
      case 'triangles':
        return `background: linear-gradient(60deg, #f0f0f0 25%, transparent 25.5%, transparent 75%, #f0f0f0 75%, #f0f0f0), linear-gradient(-60deg, #f0f0f0 25%, transparent 25.5%, transparent 75%, #f0f0f0 75%, #f0f0f0) !important; background-size: 20px 35px !important;`;
      default:
        return '';
    }
  };
  const generateJS = () => {
    return `
      // Инициализация React библиотек
      document.addEventListener('DOMContentLoaded', function() {
        console.log('React libraries loaded for multi-page site');
        
        // Глобальные переменные для доступа к библиотекам
        if (typeof React !== 'undefined') window.React = React;
        if (typeof ReactDOM !== 'undefined') window.ReactDOM = ReactDOM;
        if (typeof MaterialUI !== 'undefined') window.MaterialUI = MaterialUI;
        if (typeof FramerMotion !== 'undefined') window.FramerMotion = FramerMotion;
        if (typeof ReactCountUp !== 'undefined') window.ReactCountUp = ReactCountUp;
        if (typeof ReactConfetti !== 'undefined') window.ReactConfetti = ReactConfetti;
        if (typeof QRCodeReact !== 'undefined') window.QRCodeReact = QRCodeReact;
        if (typeof ReactPlayer !== 'undefined') window.ReactPlayer = ReactPlayer;
        if (typeof ReactRatingStarsComponent !== 'undefined') window.ReactRatingStarsComponent = ReactRatingStarsComponent;
        if (typeof ReactTextTransition !== 'undefined') window.ReactTextTransition = ReactTextTransition;
        if (typeof ReactShare !== 'undefined') window.ReactShare = ReactShare;
        if (typeof ReactCopyToClipboard !== 'undefined') window.ReactCopyToClipboard = ReactCopyToClipboard;
        if (typeof ReactColor !== 'undefined') window.ReactColor = ReactColor;
        if (typeof ReactDatepicker !== 'undefined') window.ReactDatepicker = ReactDatepicker;
        if (typeof ReactSelect !== 'undefined') window.ReactSelect = ReactSelect;
        if (typeof ReactScroll !== 'undefined') window.ReactScroll = ReactScroll;
        if (typeof ReactRnd !== 'undefined') window.ReactRnd = ReactRnd;
        if (typeof ReactImageCrop !== 'undefined') window.ReactImageCrop = ReactImageCrop;
        if (typeof ReactMarkdown !== 'undefined') window.ReactMarkdown = ReactMarkdown;
        if (typeof ReactPlotly !== 'undefined') window.ReactPlotly = ReactPlotly;
        if (typeof ReactApexcharts !== 'undefined') window.ReactApexcharts = ReactApexcharts;
        if (typeof ReactChartjs2 !== 'undefined') window.ReactChartjs2 = ReactChartjs2;
        if (typeof Recharts !== 'undefined') window.Recharts = Recharts;
        if (typeof ApexCharts !== 'undefined') window.ApexCharts = ApexCharts;
        if (typeof Chart !== 'undefined') window.Chart = Chart;
        if (typeof Plotly !== 'undefined') window.Plotly = Plotly;
        if (typeof Swiper !== 'undefined') window.Swiper = Swiper;
        if (typeof axios !== 'undefined') window.axios = axios;
        if (typeof dayjs !== 'undefined') window.dayjs = dayjs;
        if (typeof marked !== 'undefined') window.marked = marked;
        if (typeof uuid !== 'undefined') window.uuid = uuid;
        if (typeof browserImageCompression !== 'undefined') window.browserImageCompression = browserImageCompression;
        if (typeof FileSaver !== 'undefined') window.FileSaver = FileSaver;
        if (typeof JSZip !== 'undefined') window.JSZip = JSZip;
        if (typeof Formik !== 'undefined') window.Formik = Formik;
        if (typeof yup !== 'undefined') window.yup = yup;
        if (typeof ReactHookForm !== 'undefined') window.ReactHookForm = ReactHookForm;
        if (typeof HookformResolvers !== 'undefined') window.HookformResolvers = HookformResolvers;
        if (typeof Slate !== 'undefined') window.Slate = Slate;
        if (typeof SlateReact !== 'undefined') window.SlateReact = SlateReact;
        if (typeof SlateHistory !== 'undefined') window.SlateHistory = SlateHistory;
        if (typeof TipTapReact !== 'undefined') window.TipTapReact = TipTapReact;
        if (typeof TipTapStarterKit !== 'undefined') window.TipTapStarterKit = TipTapStarterKit;
        if (typeof TipTapExtensionColor !== 'undefined') window.TipTapExtensionColor = TipTapExtensionColor;
        if (typeof TipTapExtensionHighlight !== 'undefined') window.TipTapExtensionHighlight = TipTapExtensionHighlight;
        if (typeof TipTapExtensionImage !== 'undefined') window.TipTapExtensionImage = TipTapExtensionImage;
        if (typeof TipTapExtensionLink !== 'undefined') window.TipTapExtensionLink = TipTapExtensionLink;
        if (typeof TipTapExtensionTable !== 'undefined') window.TipTapExtensionTable = TipTapExtensionTable;
        if (typeof TipTapExtensionTextAlign !== 'undefined') window.TipTapExtensionTextAlign = TipTapExtensionTextAlign;
        if (typeof TipTapExtensionUnderline !== 'undefined') window.TipTapExtensionUnderline = TipTapExtensionUnderline;
        if (typeof DndKitCore !== 'undefined') window.DndKitCore = DndKitCore;
        if (typeof DndKitSortable !== 'undefined') window.DndKitSortable = DndKitSortable;
        if (typeof DndKitUtilities !== 'undefined') window.DndKitUtilities = DndKitUtilities;
        if (typeof Visx !== 'undefined') window.Visx = Visx;
        if (typeof Victory !== 'undefined') window.Victory = Victory;
        if (typeof Zustand !== 'undefined') window.Zustand = Zustand;
        
        console.log('All React libraries initialized successfully');
      });
      
      document.addEventListener('DOMContentLoaded', function() {
        // Mobile menu toggle
        const menuToggle = document.querySelector('.menu-toggle');
        const navMenu = document.querySelector('.nav-menu');
        
        if (menuToggle && navMenu) {
          menuToggle.addEventListener('click', function() {
            menuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
          });

          // Close menu when clicking a link
          const navLinks = navMenu.querySelectorAll('a');
          navLinks.forEach(link => {
            link.addEventListener('click', () => {
              menuToggle.classList.remove('active');
              navMenu.classList.remove('active');
            });
          });

          // Close menu when clicking outside
          document.addEventListener('click', (e) => {
            if (!menuToggle.contains(e.target) && !navMenu.contains(e.target)) {
              menuToggle.classList.remove('active');
              navMenu.classList.remove('active');
            }
          });
        }

        // Smooth scroll to anchors
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
          anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
              target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
              });
            }
          });
        });

        // Form submission handler
        window.handleSubmit = function(event) {
          event.preventDefault();
          const form = document.getElementById('contactForm');
          const formData = new FormData(form);
          
          // Send form data
          fetch('https://formspree.io/f/mvgwpqrr', {
            method: 'POST',
            body: formData,
            headers: {
              'Accept': 'application/json'
            }
          }).finally(() => {
            // Always redirect to merci.html with parameters
            const thankYouMessage = encodeURIComponent('${contactData?.thankYouMessage || 'Спасибо за обращение! Мы свяжемся с вами в ближайшее время.'}');
            const closeButtonText = encodeURIComponent('${contactData?.closeButtonText || 'Закрыть'}');
            window.location.href = \`merci.html?message=\${thankYouMessage}&closeButtonText=\${closeButtonText}\`;
          });
        };

        // Cards and images scroll animation
        const animatedEls = document.querySelectorAll('.card, .section-image img, .about-image img');
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('animate-on-scroll');
              observer.unobserve(entry.target);
            }
          });
        }, { threshold: 0.15 });
        animatedEls.forEach(el => observer.observe(el));
        
        // Initialize automatic image slideshows
        initImageGalleries();
        
        // Initialize new AI elements
        initAIElements();
        
        // Auto-detect and display current domain
        autoDisplayDomain();
        
        // Also call with delay for reliability
        setTimeout(autoDisplayDomain, 100);
      });
      
      // Function to initialize all image galleries on the page
      function initImageGalleries() {
        const galleries = document.querySelectorAll('.section-gallery');
        
        galleries.forEach(gallery => {
          const images = gallery.querySelectorAll('.gallery-img');
          const dots = gallery.querySelectorAll('.gallery-dot');
          let currentIndex = 0;
          let interval = null;
          
          // If there are less than 2 images, do nothing
          if (images.length < 2) return;
          
          // Function to switch slides
          function showSlide(index) {
                          // Hide all images
            images.forEach(img => img.style.display = 'none');
            
                          // Reset active dots
            dots.forEach(dot => dot.style.backgroundColor = 'rgba(255,255,255,0.5)');
            
                          // Show selected image
            if (images[index]) {
              images[index].style.display = 'block';
            }
            
                          // Update active dot
            if (dots[index]) {
              dots[index].style.backgroundColor = '#ffffff';
            }
            
            currentIndex = index;
          }
          
          // Set handlers for navigation dots
          dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
              clearInterval(interval); // Stop auto-scroll on manual switch
              showSlide(index);
                              startAutoScroll(); // Restart auto-scroll
            });
          });
          
          // Function to start auto-scroll
          function startAutoScroll() {
                          // Clear previous interval if it exists
            if (interval) {
              clearInterval(interval);
            }
            
                          // Set new interval
            interval = setInterval(() => {
              const nextIndex = (currentIndex + 1) % images.length;
              showSlide(nextIndex);
            }, 3000); // 3 seconds interval between slides
          }
          
          // Add handlers to stop auto-scroll on hover
          gallery.addEventListener('mouseenter', () => {
            clearInterval(interval);
          });
          
          gallery.addEventListener('mouseleave', () => {
            startAutoScroll();
          });
          
          // Start auto-scroll on load
          startAutoScroll();
          
          // Add swipe on mobile devices
          let touchStartX = 0;
          let touchEndX = 0;
          
          gallery.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
          }, false);
          
          gallery.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
          }, false);
          
          function handleSwipe() {
            if (touchEndX < touchStartX) {
              // Swipe left - next slide
              clearInterval(interval);
              showSlide((currentIndex + 1) % images.length);
              startAutoScroll();
            } else if (touchEndX > touchStartX) {
              // Swipe right - previous slide
              clearInterval(interval);
              showSlide((currentIndex - 1 + images.length) % images.length);
              startAutoScroll();
            }
          }
        });
      }
      
      // Function to automatically detect and display current domain
      function autoDisplayDomain() {
        // Get current domain from browser
        const currentDomain = window.location.hostname;
        console.log('Current domain detected:', currentDomain);
        
        // Skip if localhost or IP address
        if (currentDomain === 'localhost' || 
            currentDomain === '127.0.0.1' || 
            currentDomain.includes('192.168.') ||
            currentDomain.includes('10.0.') ||
            /^\d+\.\d+\.\d+\.\d+$/.test(currentDomain)) {
          console.log('Skipping domain display for localhost/IP');
          return;
        }
        
        console.log('Auto-displaying domain:', currentDomain);
        
        // Find domain display element in header
        const domainElement = document.querySelector('.domain, .site-domain');
        
        if (domainElement) {
          // Update existing domain element
          domainElement.textContent = currentDomain;
          domainElement.style.display = 'block';
          console.log('Updated header domain element');
        } else {
          // Create new domain element if it doesn't exist
          const sitebranding = document.querySelector('.site-branding');
          if (sitebranding) {
            const domainDiv = document.createElement('div');
            domainDiv.className = 'domain';
            domainDiv.textContent = currentDomain;
            domainDiv.style.cssText = 'color: inherit; opacity: 0.8; font-size: 0.9rem; margin-top: 4px;';
            sitebranding.appendChild(domainDiv);
            console.log('Created new header domain element');
          }
        }
        
        // Update contact domain elements
        const allContactDomainElements = document.querySelectorAll('.contact-domain');
        console.log('Found contact domain elements:', allContactDomainElements.length);
        
        allContactDomainElements.forEach((domainElement, index) => {
          const oldText = domainElement.textContent;
          domainElement.textContent = currentDomain;
          domainElement.style.display = 'block'; // Show the element like in header
          console.log('Updated contact domain element', index + 1, 'from:', oldText, 'to:', currentDomain);
        });
        
        // Update footer domain elements
        const allFooterDomainElements = document.querySelectorAll('.footer-domain');
        console.log('Found footer domain elements:', allFooterDomainElements.length);
        
        allFooterDomainElements.forEach((domainElement, index) => {
          const oldText = domainElement.textContent;
          domainElement.textContent = currentDomain;
          domainElement.style.display = 'block'; // Show the element like in header
          console.log('Updated footer domain element', index + 1, 'from:', oldText, 'to:', currentDomain);
        });
        
        // Update any other domain references on the page
        const domainPlaceholders = document.querySelectorAll('[data-auto-domain]');
        domainPlaceholders.forEach(element => {
          element.textContent = currentDomain;
        });
        
        // Update contact email if it contains placeholder domain
        const emailElements = document.querySelectorAll('a[href*="@"], [data-email]');
        emailElements.forEach(element => {
          const href = element.getAttribute('href') || '';
          const text = element.textContent || '';
          
          if (href.includes('@example.com') || text.includes('@example.com')) {
            const newHref = href.replace('@example.com', \`@\${currentDomain}\`);
            const newText = text.replace('@example.com', \`@\${currentDomain}\`);
            
            if (href !== newHref) element.setAttribute('href', newHref);
            if (text !== newText) element.textContent = newText;
          }
        });
        
        // Initialize content elements
        initContentElements();
      }
      
      // Function to initialize content elements
      function initContentElements() {
        // Initialize animated counters
        const counters = document.querySelectorAll('.counter');
        const counterObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const counter = entry.target;
              const start = parseInt(counter.dataset.start) || 0;
              const end = parseInt(counter.dataset.end) || 100;
              const duration = parseInt(counter.dataset.duration) || 2000;
              
              animateCounter(counter, start, end, duration);
              counterObserver.unobserve(counter);
            }
          });
        }, { threshold: 0.5 });
        
        counters.forEach(counter => counterObserver.observe(counter));
        
        // Initialize typewriter text
        const typewriters = document.querySelectorAll('.typewriter');
        typewriters.forEach(initTypewriter);
      }
      
      // Function to animate counters
      function animateCounter(element, start, end, duration) {
        const startTime = performance.now();
        const difference = end - start;
        
        function updateCounter(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          
          // Easing function (ease-out)
          const easeOut = 1 - Math.pow(1 - progress, 3);
          const current = Math.round(start + (difference * easeOut));
          
          element.textContent = current;
          
          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          }
        }
        
        requestAnimationFrame(updateCounter);
      }
      
      // Function to initialize typewriter effect
      function initTypewriter(element) {
        const texts = JSON.parse(element.dataset.texts || '["Default text"]');
        const speed = parseInt(element.dataset.speed) || 150;
        const pauseTime = parseInt(element.dataset.pause) || 2000;
        const repeat = element.dataset.repeat !== 'false';
        
        // Find the text content span
        const textContentSpan = element.querySelector('.typewriter-text-content');
        if (!textContentSpan) {
          console.error('Typewriter text content span not found');
          return;
        }
        
        let textIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        
        function typeText() {
          const fullText = texts[textIndex];
          let displayText = '';
          
          if (isDeleting) {
            displayText = fullText.substring(0, charIndex - 1);
            charIndex--;
          } else {
            displayText = fullText.substring(0, charIndex + 1);
            charIndex++;
          }
          
          // Update only the text content, cursor stays separate
          textContentSpan.textContent = displayText;
          
          let typeSpeed = speed;
          
          if (isDeleting) {
            typeSpeed = speed / 2;
          }
          
          if (!isDeleting && charIndex === fullText.length) {
            // Finished typing, pause before deleting
            typeSpeed = pauseTime;
            isDeleting = true;
          } else if (isDeleting && charIndex === 0) {
            // Finished deleting, move to next text
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            
            // If not repeating and we've gone through all texts, stop
            if (!repeat && textIndex === 0) {
              // Show final text and dim cursor
              textContentSpan.textContent = texts[0];
              const cursor = element.querySelector('.typewriter-cursor');
              if (cursor) cursor.style.opacity = '0.3';
              return;
            }
            
            typeSpeed = speed;
          }
          
          setTimeout(typeText, typeSpeed);
        }
        
        // Start the typewriter effect
        typeText();
      }
      
      // 🔥 ГЛОБАЛЬНЫЕ ФУНКЦИИ для модальных окон карточек
      // Открытие модального окна с полной поддержкой стилей
      window.openCardModal = function(title, content, cardBgColor, cardTitleColor, cardTextColor, colorSettingsJson) {
        console.log('🎴 [CARD MODAL] ФУНКЦИЯ openCardModal ВЫЗВАНА!');
        console.log('🎴 [CARD MODAL] Параметры:', { title, content, cardBgColor, cardTitleColor, cardTextColor, colorSettingsJson });
        
        // Парсинг настроек стилей
        let colorSettings = {};
        try {
          if (colorSettingsJson && colorSettingsJson !== 'undefined') {
            colorSettings = JSON.parse(colorSettingsJson);
          }
        } catch (error) {
          console.warn('Ошибка парсинга colorSettings:', error);
        }
        
        console.log('🎴 [CARD MODAL] colorSettings:', colorSettings);
        
        // Создание модального окна
        const modal = document.createElement('div');
        modal.id = 'global-card-modal';
        modal.style.cssText = \`
          display: none;
          position: fixed;
          z-index: 1000;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0,0,0,0.5);
          backdrop-filter: blur(5px);
        \`;
        
        // Создание контента модального окна
        const modalContent = document.createElement('div');
        
        // 🔥 ИСПРАВЛЕНИЕ: Определяем, является ли фон градиентом
        const isGradient = cardBgColor && (cardBgColor.includes('gradient') || cardBgColor.includes('linear-gradient') || cardBgColor.includes('radial-gradient'));
        
        modalContent.style.cssText = \`
          position: relative;
          \${isGradient ? 'background: ' + cardBgColor + ';' : 'background-color: ' + (cardBgColor || '#ffffff') + ';'}
          margin: 5% auto;
          padding: 0;
          width: 90%;
          max-width: 800px;
          max-height: 90vh;
          overflow: auto;
          border-radius: \${colorSettings.borderRadius || 16}px;
          box-shadow: \${colorSettings.boxShadow ? '0 8px 32px rgba(0,0,0,0.15)' : '0 8px 32px rgba(0,0,0,0.15)'};
          border: \${colorSettings.borderWidth || 0}px solid \${colorSettings.borderColor || 'transparent'};
        \`;
        
        // Создание содержимого
        const contentHTML = \`
          <div style="
            padding: \${colorSettings.padding || 24}px;
            text-align: center;
          ">
            <h2 style="
              color: \${cardTitleColor || '#333333'};
              font-size: \${colorSettings.textFields?.titleFontSize || 28}px;
              margin-bottom: 16px;
              font-weight: bold;
              line-height: 1.3;
            ">\${title || 'Заголовок'}</h2>
            <div style="
              color: \${cardTextColor || '#666666'};
              font-size: \${colorSettings.textFields?.textFontSize || 16}px;
              line-height: 1.6;
              text-align: left;
            ">\${content || 'Содержимое карточки'}</div>
          </div>
        \`;
        
        modalContent.innerHTML = contentHTML;
        modal.appendChild(modalContent);
        document.body.appendChild(modal);
        
        // Показываем модальное окно
        modal.style.display = 'block';
        
        // Анимация появления
        modalContent.style.opacity = '0';
        modalContent.style.transform = 'scale(0.9)';
        modalContent.style.transition = 'all 0.3s ease';
        
        requestAnimationFrame(() => {
          modalContent.style.opacity = '1';
          modalContent.style.transform = 'scale(1)';
          console.log('🎴 [CARD MODAL] Модальное окно успешно открыто!');
        });
        
        // Закрытие по клику вне модального окна
        modal.addEventListener('click', function(e) {
          if (e.target === modal) {
            window.closeCardModal();
          }
        });
        
        // Закрытие по Escape
        const handleEscape = function(e) {
          if (e.key === 'Escape') {
            window.closeCardModal();
            document.removeEventListener('keydown', handleEscape);
          }
        };
        document.addEventListener('keydown', handleEscape);
      };
      
      // Закрытие модального окна с анимацией
      window.closeCardModal = function() {
        console.log('🎴 [CARD MODAL] ФУНКЦИЯ closeCardModal ВЫЗВАНА!');
        
        const modal = document.getElementById('global-card-modal');
        if (modal) {
          const modalContent = modal.querySelector('div');
          if (modalContent) {
            // Анимация исчезновения
            modalContent.style.opacity = '0';
            modalContent.style.transform = 'scale(0.9)';
            
            setTimeout(() => {
              modal.remove();
              console.log('🎴 [CARD MODAL] Модальное окно успешно закрыто!');
            }, 300);
          } else {
            modal.remove();
          }
        }
      };
      
      // Проверка доступности функций
      console.log('🎯 [FUNCTIONS] openCardModal доступна:', typeof window.openCardModal === 'function');
      console.log('🎯 [FUNCTIONS] closeCardModal доступна:', typeof window.closeCardModal === 'function');
      
      // 🔥 WRAPPER ФУНКЦИИ для множественных карточек
      // Создаем wrapper функции для каждого элемента множественных карточек
      window.generateMultipleCardModalWrappers = function() {
        // Находим все элементы множественных карточек
        const multipleCardElements = document.querySelectorAll('.multiple-cards');
        
        multipleCardElements.forEach((element, elementIndex) => {
          const elementId = element.id;
          if (!elementId) return;
          
          const cleanElementId = elementId.replace(/-/g, '_');
          const wrapperFunctionName = \`openMultipleCardModal\${cleanElementId}\`;
          
          // Создаем wrapper функцию для этого элемента
          window[wrapperFunctionName] = function(cardIndex) {
            console.log(\`🎴 [WRAPPER] \${wrapperFunctionName} вызвана с индексом:\`, cardIndex);
            
            // Находим карточку по индексу
            const cards = element.querySelectorAll('[data-card-index]');
            const targetCard = Array.from(cards).find(card => 
              parseInt(card.getAttribute('data-card-index')) === cardIndex
            );
            
            if (!targetCard) {
              console.error('🎴 [WRAPPER] Карточка не найдена для индекса:', cardIndex);
              return;
            }
            
            // Извлекаем данные из карточки
            const cardTitle = targetCard.querySelector('h3')?.textContent || targetCard.querySelector('h4')?.textContent || 'Заголовок карточки';
            const cardContent = targetCard.querySelector('p')?.textContent || 'Содержимое карточки';
            
            // Получаем стили карточки
            const computedStyle = window.getComputedStyle(targetCard);
            
            // 🔥 ИСПРАВЛЕНИЕ: Извлекаем градиентный фон, а не только backgroundColor
            let cardBgColor = computedStyle.background || computedStyle.backgroundImage || computedStyle.backgroundColor || '#ffffff';
            
            // Если фон пустой, пытаемся извлечь из inline стилей
            if (!cardBgColor || cardBgColor === 'rgba(0, 0, 0, 0)' || cardBgColor === 'transparent') {
              const inlineStyle = targetCard.getAttribute('style');
              if (inlineStyle) {
                const backgroundMatch = inlineStyle.match(/background[^:]*:\s*([^;]+)/);
                if (backgroundMatch) {
                  cardBgColor = backgroundMatch[1].trim();
                }
              }
            }
            
            // Если все еще пустой, используем значение по умолчанию
            if (!cardBgColor || cardBgColor === 'rgba(0, 0, 0, 0)' || cardBgColor === 'transparent') {
              cardBgColor = '#ffffff';
            }
            
            // 🔥 ИСПРАВЛЕНИЕ: Извлекаем цвета заголовка и содержимого из конкретных элементов
            const titleElement = targetCard.querySelector('h3');
            const contentElement = targetCard.querySelector('p');
            
            let cardTitleColor = '#333333';
            let cardContentColor = '#666666';
            
            if (titleElement) {
              const titleStyle = window.getComputedStyle(titleElement);
              cardTitleColor = titleStyle.color || '#333333';
            }
            
            if (contentElement) {
              const contentStyle = window.getComputedStyle(contentElement);
              cardContentColor = contentStyle.color || '#666666';
            }
            
            // Если цвета не найдены, пытаемся извлечь из inline стилей
            if (cardTitleColor === '#333333' || cardContentColor === '#666666') {
              const inlineStyle = targetCard.getAttribute('style');
              if (inlineStyle) {
                // Ищем color в inline стилях
                const colorMatch = inlineStyle.match(/color:\s*([^;]+)/);
                if (colorMatch) {
                  const inlineColor = colorMatch[1].trim();
                  if (cardTitleColor === '#333333') cardTitleColor = inlineColor;
                  if (cardContentColor === '#666666') cardContentColor = inlineColor;
                }
              }
            }
            
            // Извлекаем colorSettings из data-атрибута или используем значения по умолчанию
            let colorSettings = {};
            try {
              const colorSettingsData = element.getAttribute('data-color-settings');
              if (colorSettingsData) {
                colorSettings = JSON.parse(colorSettingsData);
              }
            } catch (error) {
              console.warn('Ошибка парсинга colorSettings из data-атрибута:', error);
            }
            
            // Если colorSettings пустые, создаем базовые настройки
            if (Object.keys(colorSettings).length === 0) {
              colorSettings = {
                borderRadius: 16,
                padding: 24,
                borderWidth: 0,
                borderColor: 'transparent',
                boxShadow: true,
                textFields: {
                  titleFontSize: 28,
                  textFontSize: 16
                }
              };
            }
            
            // 🔥 ИСПРАВЛЕНИЕ: Приоритет для цветов из colorSettings
            if (colorSettings.textFields?.cardTitle) {
              cardTitleColor = colorSettings.textFields.cardTitle;
            } else if (colorSettings.textFields?.title) {
              cardTitleColor = colorSettings.textFields.title;
            }
            if (colorSettings.textFields?.cardText) {
              cardContentColor = colorSettings.textFields.cardText;
            } else if (colorSettings.textFields?.text) {
              cardContentColor = colorSettings.textFields.text;
            }
            
            // 🔥 ИСПРАВЛЕНИЕ: Приоритет для фона из colorSettings.cardBackground
            if (colorSettings.cardBackground?.enabled) {
              if (colorSettings.cardBackground.useGradient) {
                const gradientDir = colorSettings.cardBackground.gradientDirection || 'to right';
                const color1 = colorSettings.cardBackground.gradientColor1 || '#ffffff';
                const color2 = colorSettings.cardBackground.gradientColor2 || '#f0f0f0';
                cardBgColor = \`linear-gradient(\${gradientDir}, \${color1}, \${color2})\`;
              } else {
                cardBgColor = colorSettings.cardBackground.solidColor || cardBgColor;
              }
            }
            
            console.log('🎴 [WRAPPER] Извлеченные данные:', {
              cardTitle,
              cardContent,
              cardBgColor,
              cardTitleColor,
              cardContentColor,
              colorSettings
            });
            
            // Вызываем глобальную функцию openCardModal
            if (typeof window.openCardModal === 'function') {
              window.openCardModal(
                cardTitle,
                cardContent,
                cardBgColor,
                cardTitleColor,
                cardContentColor,
                JSON.stringify(colorSettings)
              );
            } else {
              console.error('🎴 [WRAPPER] openCardModal не найдена!');
            }
          };
          
          console.log(\`🎴 [WRAPPER] Создана функция \${wrapperFunctionName}\`);
        });
      };
      
      // Вызываем создание wrapper функций после загрузки DOM
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', window.generateMultipleCardModalWrappers);
      } else {
        window.generateMultipleCardModalWrappers();
      }
    `;
  };

  const generateSitemap = (siteData) => {
    const domain = siteData.headerData.domain || 'example.com';
    const baseUrl = domain.startsWith('http') ? domain : `https://${domain}`;
    const currentDate = new Date().toISOString().replace('Z', '+00:00');
    
    const indexFile = getIndexFileName();
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>${baseUrl}/${indexFile}</loc>
        <lastmod>${currentDate}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>1.0</priority>
    </url>
    <url>
        <loc>${baseUrl}/merci.html</loc>
        <lastmod>${currentDate}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.5</priority>
    </url>
    <url>
        <loc>${baseUrl}/privacy-policy.html</loc>
        <lastmod>${currentDate}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.3</priority>
    </url>
    <url>
        <loc>${baseUrl}/terms-of-service.html</loc>
        <lastmod>${currentDate}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.3</priority>
    </url>
    <url>
        <loc>${baseUrl}/cookie-policy.html</loc>
        <lastmod>${currentDate}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.3</priority>
    </url>
</urlset>`;
  };

  const generateSafeFileName = (siteData) => {
    let fileName = '';
    
    // Приоритет: домен, затем название сайта
    if (siteData.headerData.domain && siteData.headerData.domain.trim()) {
      fileName = siteData.headerData.domain.trim();
      // Убираем протокол если есть
      fileName = fileName.replace(/^https?:\/\//, '');
      // Убираем www. если есть
      fileName = fileName.replace(/^www\./, '');
    } else if (siteData.headerData.siteName && siteData.headerData.siteName.trim()) {
      fileName = siteData.headerData.siteName.trim();
    } else {
      fileName = 'site';
    }
    
    // Заменяем недопустимые символы для имени файла
    fileName = fileName
      .replace(/[<>:"/\\|?*]/g, '') // Убираем недопустимые символы Windows
      .replace(/\s+/g, '-') // Заменяем пробелы на дефисы
      .replace(/[^a-zA-Z0-9а-яА-ЯёЁ\-\.]/g, '') // Оставляем только буквы (включая кириллицу), цифры, дефисы и точки
      .replace(/--+/g, '-') // Убираем множественные дефисы
      .replace(/^-+|-+$/g, ''); // Убираем дефисы в начале и конце
    
    return fileName || 'site';
  };

  const generateSitemapPHP = (siteData) => {
    const domain = siteData.headerData.domain || 'example.com';
    const baseUrl = domain.startsWith('http') ? domain : `https://${domain}`;
    const currentDate = new Date().toISOString().replace('Z', '+00:00');
    
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>${baseUrl}/index.php</loc>
        <lastmod>${currentDate}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>1.0</priority>
    </url>
    <url>
        <loc>${baseUrl}/merci.html</loc>
        <lastmod>${currentDate}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.5</priority>
    </url>
    <url>
        <loc>${baseUrl}/privacy-policy.html</loc>
        <lastmod>${currentDate}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.3</priority>
    </url>
    <url>
        <loc>${baseUrl}/terms-of-service.html</loc>
        <lastmod>${currentDate}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.3</priority>
    </url>
    <url>
        <loc>${baseUrl}/cookie-policy.html</loc>
        <lastmod>${currentDate}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.3</priority>
    </url>
</urlset>`;
  };

  // Функции для многостраничного экспорта
  const getSectionFileNameSafe = (sectionId, sectionData) => {
    console.log('🔍 getSectionFileNameSafe called with:', { sectionId, sectionData });
    console.log('🔍 sectionData.pageName:', sectionData?.pageName);
    console.log('🔍 sectionData.fileName:', sectionData?.fileName);
    console.log('🔍 sectionData.id:', sectionData?.id);
    
    // Приоритет 1: Используем pageName из AI парсера (всегда на английском)
    if (sectionData?.pageName && sectionData.pageName.trim()) {
      console.log('✅ Using pageName:', sectionData.pageName);
      return sectionData.pageName.toString().toLowerCase()
        .replace(/[^a-z0-9-]/g, '-')  // Только латиница, цифры и дефисы
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
    }
    
    // Приоритет 2: Используем пользовательское имя файла, если задано
    if (sectionData?.fileName && sectionData.fileName.trim()) {
      return sectionData.fileName.toString().toLowerCase()
        .replace(/[^a-z0-9а-я]/g, '-')  // Поддерживаем кириллицу
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
    }
    
    // Приоритет 3: Используем ID секции из данных секции (не числовой индекс)
    if (sectionData?.id && sectionData.id.trim()) {
      return sectionData.id.toString().toLowerCase()
        .replace(/[^a-z0-9а-я]/g, '-')  // Поддерживаем кириллицу
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
    }
    
    // Fallback: используем числовой ID только если нет другого варианта
    if (!sectionId) return null;
    
    return sectionId.toString().toLowerCase()
      .replace(/[^a-z0-9а-я]/g, '-')  // Поддерживаем кириллицу
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  };

  const getSectionDisplayNameSafe = (sectionId, sectionData, headerData) => {
    // Ищем соответствующий пункт меню по ID секции
    const menuItem = headerData?.menuItems?.find(item => item.id === sectionData?.id);
    
    // Возвращаем пользовательское название из пункта меню
    const displayName = menuItem?.text || sectionData?.id || sectionId;
    return displayName || 'Раздел';
  };

  const getContactFileNameSafe = (contactData) => {
    console.log('🔍 getContactFileNameSafe called with contactData:', contactData);
    console.log('🔍 contactData.pageName:', contactData?.pageName);
    
    // Приоритет 1: Используем pageName из AI парсера (всегда на английском)
    if (contactData?.pageName && contactData.pageName.trim()) {
      console.log('✅ getContactFileNameSafe using pageName:', contactData.pageName);
      return contactData.pageName.toString().toLowerCase()
        .replace(/[^a-z0-9-]/g, '-')  // Только латиница, цифры и дефисы
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
    }
    
    // Приоритет 2: Используем стандартное название как fallback
    console.log('⚠️ getContactFileNameSafe using fallback: contact');
    return 'contact';
  };

  const generateMultiPageHeader = (siteData, currentPage = '') => {
    const headerData = siteData.headerData || {};
    const siteName = headerData.siteName || 'My Site';
    const sectionsArray = Object.entries(siteData.sectionsData || {});
    
    // Генерируем стили хедера из headerData (как в одностраничном экспорте)
    const headerStyles = [];
    
    if (headerData.backgroundColor) {
      headerStyles.push(`--header-bg-color: ${headerData.backgroundColor}`);
    }
    if (headerData.titleColor) {
      headerStyles.push(`--header-title-color: ${headerData.titleColor}`);
    }
    if (headerData.linksColor) {
      headerStyles.push(`--header-link-color: ${headerData.linksColor}`);
    }
    
    const indexFile = getIndexFileName();
    
    // Генерируем навигационные ссылки из headerData.menuItems (если есть) или из секций
    let navigationLinks = '';
    
    if (headerData.menuItems && headerData.menuItems.length > 0) {
      // Используем menuItems из headerData, но генерируем правильные ссылки
      navigationLinks = headerData.menuItems.map(item => {
        // Находим соответствующую секцию по ID
        const sectionData = sectionsArray.find(([sectionId, data]) => data?.id === item.id)?.[1];
        const fileName = sectionData ? getSectionFileNameSafe(item.id, sectionData) : null;
        const text = item.text || item.title || '';
        
        // Используем правильное имя файла или fallback на якорь
        const url = fileName ? `${fileName}.html` : (item.url || '#');
        
        // Определяем активную ссылку
        let isActive = '';
        if (currentPage === 'index' && url === 'index.html') {
          isActive = 'class="nav-link active"';
        } else if (currentPage === fileName) {
          isActive = 'class="nav-link active"';
        } else {
          isActive = 'class="nav-link"';
        }
        
        // Отладочная информация
        console.log('🔍 Navigation debug:', { currentPage, fileName, url, isActive, text });
        
        return `<li><a href="${url}" ${isActive}>${text.toLowerCase()}</a></li>`;
      }).join('');
    } else {
      // Fallback: используем секции
      navigationLinks = sectionsArray.map(([sectionId, sectionData]) => {
        const fileName = getSectionFileNameSafe(sectionId, sectionData);
        const displayName = getSectionDisplayNameSafe(sectionId, sectionData, headerData);
        
        // Определяем активную ссылку
        let isActive = '';
        if (currentPage === 'index' && fileName === 'index') {
          isActive = 'class="nav-link active"';
        } else if (currentPage === fileName) {
          isActive = 'class="nav-link active"';
        } else {
          isActive = 'class="nav-link"';
        }
        
        // Отладочная информация
        console.log('🔍 Fallback navigation debug:', { currentPage, fileName, isActive, displayName });
        
        return fileName ? `<li><a href="${fileName}.html" ${isActive}>${displayName.toLowerCase()}</a></li>` : '';
      }).join('');
    }
    
    // Добавляем контакты в навигацию
    if (siteData.contactData) {
      const contactFileName = getContactFileNameSafe(siteData.contactData);
      const contactTitle = siteData.contactData?.title || 'Контакты';
      
      // Определяем активную ссылку
      let isActive = '';
      if (currentPage === 'contact' || currentPage === contactFileName) {
        isActive = 'class="nav-link active"';
      } else {
        isActive = 'class="nav-link"';
      }
      
      // Отладочная информация
      console.log('🔍 Contact navigation debug:', { currentPage, contactFileName, isActive, contactTitle });
      
      navigationLinks += `<li><a href="${contactFileName}.html" ${isActive}>${contactTitle.toLowerCase()}</a></li>`;
    }
    
    return `<header class="site-header" style="${headerStyles.join('; ')}">
      <div class="header-content">
        <div class="site-branding">
          <h1 class="site-title">
            <a href="${indexFile}">${siteName}</a>
          </h1>
          <div class="site-domain" style="display: none;">${headerData.domain || ''}</div>
        </div>
        <nav class="site-nav">
          <button class="menu-toggle" aria-label="Открыть меню">
            <span></span>
            <span></span>
            <span></span>
          </button>
          <ul class="nav-menu">
            ${navigationLinks}
          </ul>
        </nav>
      </div>
    </header>`;
  };

  const generateMultiPageFooter = (siteData) => {
    const footerData = siteData.footerData || {};
    const headerData = siteData.headerData || {};
    const currentYear = new Date().getFullYear();
    const siteName = headerData.siteName || 'My Site';
    
    // Определяем стили футера на основе предустановленных стилей
    let footerStyles = [];
    let textColor = '#ffffff'; // По умолчанию белый текст
    
    if (headerData.siteBackgroundType === 'gradient') {
      // Для градиентного фона используем более темный вариант
      const gradientColor1 = headerData.siteGradientColor1 || '#ffffff';
      const gradientColor2 = headerData.siteGradientColor2 || '#f5f5f5';
      
      // Создаем более темный градиент для футера
      footerStyles.push(`background: linear-gradient(${headerData.siteGradientDirection || 'to right'}, 
        ${darkenColor(gradientColor1, 20)}, 
        ${darkenColor(gradientColor2, 20)})`);
      
      // Определяем цвет текста на основе яркости фона
      textColor = getContrastColor(gradientColor1);
    } else if (headerData.siteBackgroundType === 'solid') {
      const bgColor = headerData.siteBackgroundColor || '#ffffff';
      footerStyles.push(`background-color: ${darkenColor(bgColor, 20)}`);
      textColor = getContrastColor(bgColor);
    } else {
      // По умолчанию используем темный фон
      footerStyles.push(`background: linear-gradient(135deg, #2c3e50, #34495e)`);
      textColor = '#ffffff';
    }
    
    return `<footer class="site-footer" style="${footerStyles.join('; ')}">
      <div class="footer-container" style="color: ${textColor};">
        <div class="footer-content">
          <div class="footer-info">
            <h3 style="color: ${textColor};">${siteName}</h3>
            ${siteData.contactData?.address ? `<p style="color: ${textColor};">📍 ${siteData.contactData.address}</p>` : ''}
            ${siteData.contactData?.phone ? `<p style="color: ${textColor};">📞 ${siteData.contactData.phone}</p>` : ''}
            ${siteData.contactData?.email ? `<p style="color: ${textColor};">✉️ ${siteData.contactData.email}</p>` : ''}
          </div>
          ${footerData.showLinks !== false ? `
            <div class="footer-links">
              <h4 style="color: ${textColor};">Menu</h4>
              <ul>
                <li><a href="${getIndexFileName()}" style="color: ${textColor};">${siteName}</a></li>
                ${(headerData.menuItems && headerData.menuItems.length > 0) ? 
                  headerData.menuItems.map(item => {
                    // Находим соответствующую секцию по ID
                    const sectionsArray = Object.entries(siteData.sectionsData || {});
                    const sectionData = sectionsArray.find(([sectionId, data]) => data?.id === item.id)?.[1];
                    const fileName = sectionData ? getSectionFileNameSafe(item.id, sectionData) : null;
                    const url = fileName ? `${fileName}.html` : (item.url || '#');
                    return `<li><a href="${url}" style="color: ${textColor};">${(item.text || item.title || '').toLowerCase()}</a></li>`;
                  }).join('') :
                  Object.entries(siteData.sectionsData || {}).map(([sectionId, sectionData]) => {
                    const fileName = getSectionFileNameSafe(sectionId, sectionData);
                    const displayName = getSectionDisplayNameSafe(sectionId, sectionData, headerData);
                    return fileName ? `<li><a href="${fileName}.html" style="color: ${textColor};">${(displayName || '').toLowerCase()}</a></li>` : '';
                  }).join('')
                }
                ${siteData.contactData ? `<li><a href="${getContactFileNameSafe(siteData.contactData)}.html" style="color: ${textColor};">${(siteData.contactData.title || 'Контакты').toLowerCase()}</a></li>` : ''}
              </ul>
            </div>
          ` : ''}
          <div class="footer-contact">
            <h4 style="color: ${textColor};">Legal Information</h4>
            <ul>
              <li><a href="privacy-policy.html" style="color: ${textColor};">Privacy Policy</a></li>
              <li><a href="terms-of-service.html" style="color: ${textColor};">Terms of Service</a></li>
              <li><a href="cookie-policy.html" style="color: ${textColor};">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
        <div class="footer-bottom">
          <p style="color: ${textColor};">&copy; ${currentYear} ${siteName}. All rights reserved.</p>
        </div>
      </div>
    </footer>`;
  };

  // Вспомогательная функция для затемнения цвета
  const darkenColor = (color, percent) => {
    if (!color || color === '#ffffff') return '#2c3e50';
    
    // Простое затемнение для hex цветов
    if (color.startsWith('#')) {
      const hex = color.replace('#', '');
      const r = parseInt(hex.substr(0, 2), 16);
      const g = parseInt(hex.substr(2, 2), 16);
      const b = parseInt(hex.substr(4, 2), 16);
      
      const newR = Math.max(0, Math.floor(r * (1 - percent / 100)));
      const newG = Math.max(0, Math.floor(g * (1 - percent / 100)));
      const newB = Math.max(0, Math.floor(b * (1 - percent / 100)));
      
      return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
    }
    
    return '#2c3e50';
  };

  // Вспомогательная функция для определения контрастного цвета текста
  const getContrastColor = (hexColor) => {
    if (!hexColor || hexColor === '#ffffff') return '#000000';
    
    if (hexColor.startsWith('#')) {
      const hex = hexColor.replace('#', '');
      const r = parseInt(hex.substr(0, 2), 16);
      const g = parseInt(hex.substr(2, 2), 16);
      const b = parseInt(hex.substr(4, 2), 16);
      
      // Вычисляем яркость
      const brightness = (r * 299 + g * 587 + b * 114) / 1000;
      
      return brightness > 128 ? '#000000' : '#ffffff';
    }
    
    return '#ffffff';
  };

  // Функция для генерации выделенного раздела
  const generateFeaturedSection = (siteData) => {
    const heroData = siteData.heroData || {};
    const homePageSettings = heroData.homePageSettings || {};
    
    console.log('generateFeaturedSection - heroData:', heroData);
    console.log('generateFeaturedSection - homePageSettings:', homePageSettings);
    console.log('generateFeaturedSection - sectionsData:', siteData.sectionsData);
    
    // Проверяем, нужно ли показывать выделенный раздел
    if (!homePageSettings.showFeaturedSection || !homePageSettings.featuredSectionId) {
      console.log('Featured section not enabled or no section selected');
      return '';
    }
    
    const featuredSectionId = homePageSettings.featuredSectionId;
    
    // Преобразуем sectionsData в объект, если это массив
    let sectionsObject = siteData.sectionsData || {};
    if (Array.isArray(siteData.sectionsData)) {
      sectionsObject = siteData.sectionsData.reduce((acc, section) => {
        acc[section.id] = section;
        return acc;
      }, {});
    }
    
    const featuredSectionData = sectionsObject[featuredSectionId];
    
    if (!featuredSectionData) {
      console.warn(`Featured section ${featuredSectionId} not found`);
      return '';
    }
    
    const sectionTitle = featuredSectionData.title || getSectionDisplayNameSafe(featuredSectionId, featuredSectionData, siteData.headerData);
    const sectionDescription = featuredSectionData.description || '';
    
    // Получаем настройки цветов секции
    const sectionColorSettings = featuredSectionData.colorSettings || {};
    const titleColor = sectionColorSettings?.textFields?.title || '#1a237e';
    const descriptionColor = sectionColorSettings?.textFields?.description || '#455a64';
    const contentColor = sectionColorSettings?.textFields?.content || '#455a64';
    
    // Получаем изображения секции
    const hasImages = Array.isArray(featuredSectionData.images) && featuredSectionData.images.length > 0;
    const hasSingleImage = featuredSectionData.imagePath && !hasImages;
    
    let imagesHtml = '';
    if (hasImages) {
      imagesHtml = featuredSectionData.images.map((image, index) => `
        <div class="featured-image">
          <img src="${image.url || image}" alt="${image.alt || sectionTitle}" loading="lazy">
        </div>
      `).join('');
    } else if (hasSingleImage) {
      imagesHtml = `
        <div class="featured-image">
          <img src="${featuredSectionData.imagePath}" alt="${sectionTitle}" loading="lazy">
        </div>
      `;
    }
    
    // Генерируем контент элементов
    const elementsHtml = (featuredSectionData.contentElements || featuredSectionData.elements || featuredSectionData.aiElements || []).map((element, index) => {
      return generateContentElementHTML(element);
    }).join('');
    
    return `
      <section class="featured-section" style="
        padding: 4rem 0;
        background: ${sectionColorSettings?.sectionBackground?.enabled ? 
          (sectionColorSettings.sectionBackground.useGradient ? 
            `linear-gradient(${sectionColorSettings.sectionBackground.gradientDirection}, ${sectionColorSettings.sectionBackground.gradientColor1}, ${sectionColorSettings.sectionBackground.gradientColor2})` :
            sectionColorSettings.sectionBackground.solidColor) : 
          '#f8f9fa'
        };
        margin: 0;
      ">
        <div class="container" style="max-width: 1200px; margin: 0 auto; padding: 0 2rem;">
          <div class="featured-content" style="
            display: grid;
            grid-template-columns: ${imagesHtml ? '1fr 1fr' : '1fr'};
            gap: 3rem;
            align-items: center;
          ">
            <div class="featured-text">
              <h2 style="
                color: ${titleColor};
                font-size: 2.5rem;
                font-weight: 700;
                margin-bottom: 1.5rem;
                font-family: 'Montserrat', sans-serif;
              ">${sectionTitle}</h2>
              
              ${sectionDescription ? `
                <p style="
                  color: ${descriptionColor};
                  font-size: 1.2rem;
                  line-height: 1.6;
                  margin-bottom: 2rem;
                  font-family: 'Montserrat', sans-serif;
                ">${sectionDescription}</p>
              ` : ''}
              
              <div class="featured-elements" style="
                color: ${contentColor};
                font-family: 'Montserrat', sans-serif;
              ">
                ${elementsHtml}
              </div>
              
            </div>
            
            ${imagesHtml ? `
              <div class="featured-images">
                ${imagesHtml}
              </div>
            ` : ''}
          </div>
        </div>
      </section>
    `;
  };

  // Функция для генерации превью разделов
  const generateSectionsPreview = (siteData) => {
    const heroData = siteData.heroData || {};
    const homePageSettings = heroData.homePageSettings || {};
    
    console.log('generateSectionsPreview - heroData:', heroData);
    console.log('generateSectionsPreview - homePageSettings:', homePageSettings);
    console.log('generateSectionsPreview - sectionsData:', siteData.sectionsData);
    
    // Проверяем, нужно ли показывать превью разделов
    if (!homePageSettings.showSectionsPreview) {
      console.log('Sections preview not enabled');
      return '';
    }
    
    const sectionsData = siteData.sectionsData || {};
    const maxSections = homePageSettings.maxSectionsToShow || 6;
    const displayMode = homePageSettings.sectionsDisplayMode || 'cards';
    
    // Преобразуем sectionsData в объект, если это массив
    let sectionsObject = sectionsData;
    if (Array.isArray(sectionsData)) {
      sectionsObject = sectionsData.reduce((acc, section) => {
        acc[section.id] = section;
        return acc;
      }, {});
    }
    
    // Фильтруем разделы (исключаем выделенный раздел)
    const filteredSections = Object.entries(sectionsObject).filter(([sectionId, sectionData]) => {
      return sectionId !== homePageSettings.featuredSectionId;
    }).slice(0, maxSections);
    
    if (filteredSections.length === 0) {
      return '';
    }
    
    const gridClass = 'preview-grid';
    
    const cardClass = 'preview-card';
    
    return `
      <section class="sections-preview mode-${displayMode}" style="padding: 4rem 0; background: #f8f9fa;">
        <div class="container" style="max-width: 1200px; margin: 0 auto; padding: 0 2rem;">
          
          <div class="${gridClass}">
            ${filteredSections.map(([sectionId, sectionData]) => {
              const fileName = getSectionFileNameSafe(sectionId, sectionData);
              const displayName = getSectionDisplayNameSafe(sectionId, sectionData, siteData.headerData);
              
              if (!fileName) return '';
              
              // Получаем изображение для карточки
              const cardImage = sectionData.imagePath || 
                               (Array.isArray(sectionData.images) && sectionData.images.length > 0 ? sectionData.images[0].url || sectionData.images[0] : '') ||
                               '';
              
              // Специальная обработка для разных форматов
              // Стандартный рендеринг для карточек
              return `
                <div class="${cardClass}">
                  ${cardImage ? `
                    <div class="preview-image">
                      <img src="${cardImage}" alt="${displayName}" loading="lazy">
                    </div>
                  ` : ''}
                  <div class="preview-content">
                    <h3>${displayName}</h3>
                    <p>${sectionData.description || 'Узнайте больше в этом разделе'}</p>
                    <a href="${fileName}.html" class="preview-link">...</a>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </section>
    `;
  };

  // Функция для генерации превью контактов (обновленная версия с той же структурой что и в contacts.html)
  const generateContactPreview = (siteData) => {
    const heroData = siteData.heroData || {};
    const homePageSettings = heroData.homePageSettings || {};
    
    // Проверяем, нужно ли показывать превью контактов
    if (!homePageSettings.showContactPreview || !siteData.contactData) {
      return '';
    }
    
    let contactData = siteData.contactData;
    const contactFileName = getContactFileNameSafe(contactData);
    
    // Используем ту же логику обработки данных, что и в generateMultiPageContact
    if (!contactData || !contactData.title) {
      // Проверяем альтернативные места где могут храниться данные контактов
      if (siteData.contact) {
        contactData = siteData.contact;
      } else if (siteData.contactSection) {
        contactData = siteData.contactSection;
      }
      
      if (!contactData || !contactData.title) {
        contactData = {
          title: 'Get In Touch',
          description: 'Contact us for more information'
        };
      }
    }

    // Создаем inline стили для контактной секции на основе contactData (как в contacts.html)
    const sectionStyles = [];
    
    // Улучшенная логика для фонов - проверяем разные варианты хранения данных
    if (contactData.backgroundType === 'gradient') {
      if (contactData.gradientColor1 && contactData.gradientColor2) {
        sectionStyles.push(`background: linear-gradient(${contactData.gradientDirection || 'to bottom'}, ${contactData.gradientColor1}, ${contactData.gradientColor2})`);
      }
    } else if (contactData.backgroundColor) {
      sectionStyles.push(`background-color: ${contactData.backgroundColor}`);
    }
    
    // Проверяем альтернативные названия полей для фонов
    if (!sectionStyles.length) {
      const possibleBgFields = [
        'sectionBackgroundColor', 'bgColor', 'background', 'bg',
        'primaryColor', 'mainColor', 'themeColor'
      ];
      
      for (const field of possibleBgFields) {
        if (contactData[field]) {
          sectionStyles.push(`background-color: ${contactData[field]}`);
          break;
        }
      }
      
      // Проверяем градиенты в альтернативных полях
      const possibleGradientFields = [
        ['gradientStart', 'gradientEnd'],
        ['gradient1', 'gradient2'],
        ['color1', 'color2'],
        ['startColor', 'endColor']
      ];
      
      for (const [field1, field2] of possibleGradientFields) {
        if (contactData[field1] && contactData[field2]) {
          sectionStyles.push(`background: linear-gradient(to bottom, ${contactData[field1]}, ${contactData[field2]})`);
          break;
        }
      }
    }
    
    // Стили для форм и информационных блоков
    const formStyles = [];
    const infoStyles = [];
    
    // Применяем фон формы (по умолчанию белый)
    if (contactData.formBackgroundColor) {
      formStyles.push(`background-color: ${contactData.formBackgroundColor}`);
    } else {
      formStyles.push(`background-color: #ffffff`);
    }
    
    if (contactData.formBorderColor) {
      formStyles.push(`border: 1px solid ${contactData.formBorderColor}`);
    }
    
    // Синхронизируем фон с формой
    if (contactData.infoBackgroundColor) {
      infoStyles.push(`background-color: ${contactData.infoBackgroundColor}`);
    } else if (contactData.formBackgroundColor) {
      // Используем тот же фон, что и у формы
      infoStyles.push(`background-color: ${contactData.formBackgroundColor}`);
    } else {
      // По умолчанию белый фон как у формы
      infoStyles.push(`background-color: #ffffff`);
    }
    
    if (contactData.infoBorderColor) {
      infoStyles.push(`border: 1px solid ${contactData.infoBorderColor}`);
    }
    
    return `
      <section id="contact" class="contact-section" style="${sectionStyles.join('; ')}">
        <div class="contact-container">
          <div class="contact-header">
            <h2 class="contact-title" style="color: ${contactData.titleColor || '#1976d2'}">${contactData.title}</h2>
            ${contactData.description ? `<p class="contact-description" style="color: ${contactData.descriptionColor || '#666666'}">${contactData.description}</p>` : ''}
          </div>
          
          <div class="contact-content">
            ${contactData.showContactForm !== false ? `
              <div class="contact-form-container" style="${formStyles.join('; ')}">
                <h3 style="color: ${contactData.titleColor || '#1976d2'}">Get In Touch</h3>
                  <form class="contact-form" onsubmit="submitContactForm(event)">
                    <input type="hidden" name="_captcha" value="false" />
                    <input type="hidden" name="_template" value="table" />
                    <input type="hidden" name="_subject" value="New message from website" />
                    <input type="hidden" name="_language" value="en" />
                  <div class="form-group">
                    <label style="color: ${contactData.labelColor || '#333333'}">Full Name</label>
                    <input type="text" name="name" required style="background-color: ${contactData.inputBackgroundColor || '#f5f9ff'}; color: ${contactData.inputTextColor || '#1a1a1a'};" placeholder="Enter your full name">
                  </div>
                  <div class="form-group">
                    <label style="color: ${contactData.labelColor || '#333333'}">Phone Number</label>
                    <input type="tel" name="phone" required style="background-color: ${contactData.inputBackgroundColor || '#f5f9ff'}; color: ${contactData.inputTextColor || '#1a1a1a'};" placeholder="Enter your phone number">
                  </div>
                  <div class="form-group">
                    <label style="color: ${contactData.labelColor || '#333333'}">Email</label>
                    <input type="email" name="email" required style="background-color: ${contactData.inputBackgroundColor || '#f5f9ff'}; color: ${contactData.inputTextColor || '#1a1a1a'};" placeholder="Enter your email address">
                  </div>
                  <div class="form-group">
                    <label style="color: ${contactData.labelColor || '#333333'}">Message</label>
                    <textarea name="message" required style="background-color: ${contactData.inputBackgroundColor || '#f5f9ff'}; color: ${contactData.inputTextColor || '#1a1a1a'}; min-height: 100px;" placeholder="Tell us about your inquiry..."></textarea>
                  </div>
                  <button type="submit" style="background-color: ${contactData.buttonColor || '#1976d2'}; color: ${contactData.buttonTextColor || '#ffffff'};">
                    Send Message
                  </button>
                </form>
              </div>
            ` : ''}
            
            ${contactData.showCompanyInfo !== false ? `
              <div class="contact-info-container" style="${infoStyles.join('; ')}">
                <h3 class="info-title" style="color: ${contactData.infoTitleColor || contactData.titleColor || '#1976d2'}">Contact Information</h3>
                <div class="contact-info">
                  <!-- Компания -->
                  ${contactData.companyName || contactData.title ? `
                    <div class="contact-info-item">
                      <span class="contact-icon" style="color: ${contactData.iconColor || '#1976d2'}">🏢</span>
                      <span style="color: ${contactData.labelColor || '#333333'}; font-weight: 500;">${contactData.companyName || contactData.title || 'Company Name'}</span>
                    </div>
                  ` : `
                    <div class="contact-info-item">
                      <span class="contact-icon" style="color: ${contactData.iconColor || '#1976d2'}">🏢</span>
                      <span style="color: ${contactData.labelColor || '#333333'}; font-weight: 500;">КриптоИнвест</span>
                    </div>
                  `}
                  
                  <!-- Адрес -->
                  ${contactData.address ? `
                    <div class="contact-info-item">
                      <span class="contact-icon" style="color: ${contactData.iconColor || '#1976d2'}">📍</span>
                      <span style="color: ${contactData.labelColor || '#333333'}; font-weight: 500;">${contactData.address}</span>
                    </div>
                  ` : `
                    <div class="contact-info-item">
                      <span class="contact-icon" style="color: ${contactData.iconColor || '#1976d2'}">📍</span>
                      <span style="color: ${contactData.labelColor || '#333333'}; font-weight: 500;">Al Maktoum Street, Deira, P.O. Box 12345, Dubai, UAE</span>
                    </div>
                  `}
                  
                  <!-- Телефон -->
                  ${contactData.phone ? `
                    <div class="contact-info-item">
                      <span class="contact-icon" style="color: ${contactData.iconColor || '#1976d2'}">📞</span>
                      <span style="color: ${contactData.labelColor || '#333333'}; font-weight: 500;">${contactData.phone}</span>
                    </div>
                  ` : `
                    <div class="contact-info-item">
                      <span class="contact-icon" style="color: ${contactData.iconColor || '#1976d2'}">📞</span>
                      <span style="color: ${contactData.labelColor || '#333333'}; font-weight: 500;">+971 4 237 7922</span>
                    </div>
                  `}
                  
                  <!-- Email -->
                  ${contactData.email ? `
                    <div class="contact-info-item">
                      <span class="contact-icon" style="color: ${contactData.iconColor || '#1976d2'}">✉️</span>
                      <span style="color: ${contactData.labelColor || '#333333'}; font-weight: 500;">${contactData.email}</span>
                    </div>
                  ` : `
                    <div class="contact-info-item">
                      <span class="contact-icon" style="color: ${contactData.iconColor || '#1976d2'}">✉️</span>
                      <span style="color: ${contactData.labelColor || '#333333'}; font-weight: 500;">team@moy-sayt.com</span>
                    </div>
                  `}
                  
                  <!-- Часы работы -->
                  ${contactData.workingHours ? `
                    <div class="contact-info-item">
                      <span class="contact-icon" style="color: ${contactData.iconColor || '#1976d2'}">🕒</span>
                      <span style="color: ${contactData.labelColor || '#333333'}; font-weight: 500;">${contactData.workingHours}</span>
                    </div>
                  ` : ''}
                </div>
              </div>
            ` : ''}
          </div>
          
          ${contactData.showMap && contactData.mapUrl ? `
            <!-- Используем mapUrl если он есть (как в одностраничном экспорте) -->
            <div class="contact-map-container" style="
              margin-top: 3rem;
              border-radius: 12px;
              overflow: hidden;
              box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            ">
              <div style="position: relative; width: 100%; height: 400px;">
                <iframe
                  src="${contactData.mapUrl}"
                  width="100%"
                  height="100%"
                  style="border: 0;"
                  allowfullscreen=""
                  loading="lazy"
                  referrerpolicy="no-referrer-when-downgrade"
                  title="Map: ${contactData.address || 'Адрес'}">
                </iframe>
                ${contactData.address ? `
                  <div style="
                    position: absolute;
                    bottom: 10px;
                    left: 10px;
                    background: rgba(255, 255, 255, 0.9);
                    padding: 8px 12px;
                    border-radius: 6px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 14px;
                    color: #333;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                  ">
                    <span style="color: #1976d2;">📍</span>
                    <span>${contactData.address}${contactData.city ? `, ${contactData.city}` : ''}</span>
                  </div>
                ` : ''}
              </div>
            </div>
          ` : contactData.address ? `
            <!-- Генерируем Google Maps если есть адрес -->
            <div class="contact-map-container" style="
              margin-top: 3rem;
              border-radius: 12px;
              overflow: hidden;
              box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            ">
              <div style="position: relative; width: 100%; height: 400px;">
                <iframe
                  src="https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(contactData.address + (contactData.city ? `, ${contactData.city}` : ''))}&language=ru"
                  width="100%"
                  height="100%"
                  style="border: 0;"
                  allowfullscreen=""
                  loading="lazy"
                  referrerpolicy="no-referrer-when-downgrade"
                  title="Map: ${contactData.address}">
                </iframe>
                <div style="
                  position: absolute;
                  bottom: 10px;
                  left: 10px;
                  background: rgba(255, 255, 255, 0.9);
                  padding: 8px 12px;
                  border-radius: 6px;
                  display: flex;
                  align-items: center;
                  gap: 8px;
                  font-size: 14px;
                  color: #333;
                  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                ">
                  <span style="color: #1976d2;">📍</span>
                  <span>${contactData.address}${contactData.city ? `, ${contactData.city}` : ''}</span>
                </div>
              </div>
            </div>
          ` : ''}
        </div>
      </section>
    `;
  };

  const generateMultiPageIndex = (siteData) => {
    const headerData = siteData.headerData || {};
    const heroData = siteData.heroData || {};
    const siteName = headerData.siteName || 'My Site';
    const languageCode = typeof headerData.language === 'string' ? headerData.language : 'ru';
    
    return `<!DOCTYPE html>
<html lang="${languageCode}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${siteName}</title>
    <meta name="description" content="${headerData.description || 'Добро пожаловать на наш сайт'}">
    <link rel="icon" type="image/png" href="assets/images/Favicon.png">
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="assets/css/styles.css">
    
    <style>
      /* Contact section styles - точно как в contacts.html */
      .contact-section {
        padding: 4rem 2rem;
        width: 100%;
        margin: 0;
        position: relative;
        z-index: 2;
      }
      
      .contact-container {
        max-width: 1140px;
        margin: 0 auto;
        padding: 0 20px;
      }
      
      .contact-header {
        text-align: center;
        margin-bottom: 3rem;
      }
      
      .contact-title {
        font-size: 2.5rem;
        margin-bottom: 1rem;
        position: relative;
        display: inline-block;
      }
      
      .contact-title::after {
        content: '';
        position: absolute;
        bottom: -10px;
        left: 50%;
        transform: translateX(-50%);
        width: 50px;
        height: 3px;
        background-color: currentColor;
      }
      
      .contact-description {
        font-size: 1.1rem;
        max-width: 800px;
        margin: 0 auto;
        line-height: 1.6;
      }
      
      .contact-content {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 2rem;
        margin-bottom: 3rem;
      }
      
      .contact-form-container {
        padding: 2.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        border: 1px solid #ddd;
      }
      
      .contact-form .form-group {
        margin-bottom: 1.5rem;
      }
      
      .contact-form label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 500;
      }
      
      .contact-form input,
      .contact-form textarea {
        width: 100%;
        padding: 0.85rem 1rem;
        border: 1px solid #ddd;
        border-radius: 6px;
        font-size: 1rem;
        box-sizing: border-box;
        font-family: inherit;
      }
      
      .contact-form textarea {
        resize: vertical;
        min-height: 100px;
      }
      
      .contact-form button {
        width: 100%;
        padding: 0.9rem 1.5rem;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.3s ease;
        font-weight: 500;
        font-size: 1rem;
        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
      }
      
      .contact-form button:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0,0,0,0.15);
      }
      
      .contact-info-container {
        padding: 2rem;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        border: 1px solid #ddd;
      }
      
      .info-title {
        font-size: 1.5rem;
        margin-bottom: 1.5rem;
        text-align: center;
      }
      
      .contact-info-item {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 1rem;
        padding: 8px 0;
      }

      .contact-icon {
        color: #1976d2; /* Default icon color */
        font-size: 1.2rem;
        min-width: 24px;
        text-align: center;
      }
      
      .contact-map,
      .contact-map-container {
        margin-top: 2rem;
        border-radius: 8px;
        overflow: hidden;
      }
      
      .contact-map iframe,
      .contact-map-container iframe {
        width: 100%;
        height: 300px;
        border: 0;
      }
      
      @media (max-width: 768px) {
        .contact-section {
          padding: 2rem 1rem;
        }

        .contact-title {
          font-size: 2rem;
        }

        .contact-description {
          font-size: 1.1rem;
        }

        .contact-content {
          grid-template-columns: 1fr;
        }
        
        .contact-form-container,
        .contact-info-container {
          padding: 1.5rem;
        }
      }
      
      /* Styles for .contact-info (the inner container for text items) */
      .contact-info {
        border-radius: 15px;
        padding: 2rem;
      }
    </style>
    
    <!-- React и основные библиотеки -->
    <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    
    <!-- Material-UI -->
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
    <script src="https://unpkg.com/@mui/material@5.15.10/umd/material-ui.production.min.js"></script>
    <script src="https://unpkg.com/@emotion/react@11.14.0/dist/emotion-react.umd.min.js"></script>
    <script src="https://unpkg.com/@emotion/styled@11.14.1/dist/emotion-styled.umd.min.js"></script>
    
    <!-- Дополнительные библиотеки для элементов -->
    <script src="https://unpkg.com/framer-motion@12.23.0/dist/framer-motion.js"></script>
    <script src="https://unpkg.com/react-countup@6.5.3/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-confetti@6.4.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/qrcode.react@4.2.0/lib/index.umd.js"></script>
    <script src="https://unpkg.com/react-player@3.1.0/dist/ReactPlayer.js"></script>
    <script src="https://unpkg.com/react-rating-stars-component@2.2.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-text-transition@3.1.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-share@5.2.2/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-copy-to-clipboard@5.1.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-color@2.19.3/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-datepicker@8.4.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-select@5.10.1/dist/react-select.umd.js"></script>
    <script src="https://unpkg.com/react-scroll@1.9.3/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-rnd@10.5.2/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-image-crop@11.0.10/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-markdown@9.0.1/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-plotly.js@2.6.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-apexcharts@1.7.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-chartjs-2@5.3.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/recharts@3.0.2/lib/index.umd.js"></script>
    <script src="https://unpkg.com/apexcharts@4.7.0/dist/apexcharts.min.js"></script>
    <script src="https://unpkg.com/chart.js@4.5.0/dist/chart.umd.js"></script>
    <script src="https://unpkg.com/plotly.js@3.0.1/dist/plotly.min.js"></script>
    <script src="https://unpkg.com/swiper@11.2.10/swiper-bundle.min.js"></script>
    <link rel="stylesheet" href="https://unpkg.com/swiper@11.2.10/swiper-bundle.min.css" />
    <script src="https://unpkg.com/axios@1.6.7/dist/axios.min.js"></script>
    <script src="https://unpkg.com/dayjs@1.11.13/dayjs.min.js"></script>
    <script src="https://unpkg.com/marked@15.0.10/marked.min.js"></script>
    <script src="https://unpkg.com/uuid@11.1.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/browser-image-compression@2.0.2/dist/browser-image-compression.umd.js"></script>
    <script src="https://unpkg.com/file-saver@2.0.5/dist/FileSaver.min.js"></script>
    <script src="https://unpkg.com/jszip@3.10.1/dist/jszip.min.js"></script>
    <script src="https://unpkg.com/formik@2.4.6/dist/formik.umd.min.js"></script>
    <script src="https://unpkg.com/yup@1.6.1/dist/yup.umd.min.js"></script>
    <script src="https://unpkg.com/react-hook-form@7.59.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@hookform/resolvers@5.1.1/dist/index.umd.js"></script>
    <script src="https://unpkg.com/slate@0.117.2/dist/index.umd.js"></script>
    <script src="https://unpkg.com/slate-react@0.117.3/dist/index.umd.js"></script>
    <script src="https://unpkg.com/slate-history@0.113.1/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@tiptap/react@2.25.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@tiptap/starter-kit@2.25.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@tiptap/extension-color@2.25.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@tiptap/extension-highlight@2.25.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@tiptap/extension-image@2.25.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@tiptap/extension-link@2.25.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@tiptap/extension-table@2.25.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@tiptap/extension-text-align@2.25.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@tiptap/extension-underline@2.25.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@dnd-kit/core@6.3.1/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@dnd-kit/sortable@10.0.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@dnd-kit/utilities@3.2.2/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@visx/visx@3.12.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/victory@37.3.6/dist/index.umd.js"></script>
    <script src="https://unpkg.com/zustand@5.0.6/umd/index.production.min.js"></script>
</head>
<body>
    ${headerData.siteBackgroundType === 'image' ? `
    <div class="background-image" style="
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-image: url('assets/images/fon.jpg');
      background-size: cover;
      background-position: center;
      filter: ${headerData.siteBackgroundBlur ? `blur(${headerData.siteBackgroundBlur}px)` : 'none'};
      z-index: -2;
    "></div>
    ${headerData.siteBackgroundDarkness ? `
    <div class="site-overlay" style="
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, ${headerData.siteBackgroundDarkness / 100});
      z-index: -1;
    "></div>
    ` : ''}
    ` : headerData.siteBackgroundType === 'gradient' ? `
    <div class="background-image" style="
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(${headerData.siteGradientDirection || 'to right'}, 
        ${headerData.siteGradientColor1 || '#ffffff'}, 
        ${headerData.siteGradientColor2 || '#f5f5f5'});
      z-index: -2;
    "></div>
    ` : headerData.siteBackgroundType === 'solid' ? `
    <div class="background-image" style="
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: ${headerData.siteBackgroundColor || '#ffffff'};
      z-index: -2;
    "></div>
    ` : ''}
    
    ${generateMultiPageHeader(siteData, 'index')}
    
    <main>
        ${generateHeroSection(siteData)}
        
        ${generateFeaturedSection(siteData)}
        
        ${generateSectionsPreview(siteData)}
        
        ${generateContactPreview(siteData)}
    </main>
    
    ${generateMultiPageFooter(siteData)}
    
    <script src="assets/js/script.js"></script>
</body>
</html>`;
  };

  const generateMultiPageSection = (siteData, sectionId, sectionData) => {
    const headerData = siteData.headerData || {};
    const siteName = headerData.siteName || 'My Site';
    const languageCode = typeof headerData.language === 'string' ? headerData.language : 'ru';
    const sectionTitle = sectionData.title || getSectionDisplayNameSafe(sectionId, sectionData, siteData.headerData);
    const fileName = getSectionFileNameSafe(sectionId, sectionData);
    

    
    // Применяем цвета из настроек секции (как в одностраничном режиме)
    const bgColor = sectionData.backgroundColor || '#ffffff';
    const titleColor = sectionData.titleColor || '#1a237e';
    const descriptionColor = sectionData.descriptionColor || '#455a64';
    const contentColor = sectionData.contentColor || '#455a64';
    
    // Получаем colorSettings секции (объявляем в начале функции)
    const sectionColorSettings = sectionData.colorSettings || {};
    
    // 🔥 ИСПРАВЛЕНИЕ: Получаем sectionBackground из элементов, если его нет в секции
    if (!sectionColorSettings.sectionBackground?.enabled) {
      const elementWithSectionBackground = (sectionData.contentElements || sectionData.elements || sectionData.aiElements || [])
        .find(el => el.colorSettings?.sectionBackground?.enabled);
      
      if (elementWithSectionBackground?.colorSettings?.sectionBackground) {
        sectionColorSettings.sectionBackground = elementWithSectionBackground.colorSettings.sectionBackground;
        sectionColorSettings.borderRadius = elementWithSectionBackground.colorSettings.borderRadius;
        sectionColorSettings.padding = elementWithSectionBackground.colorSettings.padding;
        sectionColorSettings.borderColor = elementWithSectionBackground.colorSettings.borderColor;
        sectionColorSettings.borderWidth = elementWithSectionBackground.colorSettings.borderWidth;
        sectionColorSettings.boxShadow = elementWithSectionBackground.colorSettings.boxShadow;
        console.log('🎨 [generateMultiPageSection] Применяем sectionBackground из элемента:', sectionColorSettings.sectionBackground);
      }
    }
    
    // Проверяем наличие изображений
    const hasImages = Array.isArray(sectionData.images) && sectionData.images.length > 0;
    const hasSingleImage = sectionData.imagePath && !hasImages;
    
    // Генерируем HTML для изображений
    let imagesHtml = '';
    if (hasImages) {
      if (sectionData.images.length === 1) {
        // Одно изображение
        const imgPath = typeof sectionData.images[0] === 'string' 
          ? sectionData.images[0].replace('/images/sections/', 'assets/images/')
          : (sectionData.images[0].path || sectionData.images[0].url || '').replace('/images/sections/', 'assets/images/');
        
        // Применяем colorSettings если они есть
        let imageContainerStyles = `
          width: 100%;
          margin: 2rem auto;
          text-align: center;
          max-width: 600px;
          height: 400px;
          border-radius: 15px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0,0,0,0.15);
        `;
        
        // Добавляем стили фона если включены
        if (sectionColorSettings.sectionBackground?.enabled) {
          if (sectionColorSettings.sectionBackground.useGradient) {
            imageContainerStyles += `
              background: linear-gradient(${sectionColorSettings.sectionBackground.gradientDirection}, ${sectionColorSettings.sectionBackground.gradientColor1}, ${sectionColorSettings.sectionBackground.gradientColor2});
              opacity: ${sectionColorSettings.sectionBackground.opacity || 1};
            `;
          } else {
            imageContainerStyles += `
              background-color: ${sectionColorSettings.sectionBackground.solidColor};
              opacity: ${sectionColorSettings.sectionBackground.opacity || 1};
            `;
          }
        }
        
        // Добавляем стили границы и отступов
        if (sectionColorSettings.borderColor) {
          imageContainerStyles += `
            border: ${sectionColorSettings.borderWidth || 1}px solid ${sectionColorSettings.borderColor};
            border-radius: ${sectionColorSettings.borderRadius || 15}px;
          `;
        }
        
        if (sectionColorSettings.padding !== undefined) {
          imageContainerStyles += `padding: ${sectionColorSettings.padding}px;`;
        }
        
        if (sectionColorSettings.boxShadow) {
          imageContainerStyles += `box-shadow: 0 2px 8px rgba(0,0,0,0.1);`;
        }
        
        imagesHtml = `
          <div class="image-container" style="${imageContainerStyles}">
            <img 
              src="${imgPath}" 
              alt="${sectionTitle}"
              style="
                width: 100%;
                height: 100%;
                object-fit: cover;
                border-radius: 15px;
              "
            >
          </div>
        `;
      } else {
        // Множественные изображения - галерея
        // Применяем colorSettings если они есть
        let galleryContainerStyles = `
          width: 100%;
          margin: 2rem auto;
          text-align: center;
          max-width: 600px;
          height: 400px;
          position: relative;
          border-radius: 15px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0,0,0,0.15);
        `;
        
        // Добавляем стили фона если включены
        if (sectionColorSettings.sectionBackground?.enabled) {
          if (sectionColorSettings.sectionBackground.useGradient) {
            galleryContainerStyles += `
              background: linear-gradient(${sectionColorSettings.sectionBackground.gradientDirection}, ${sectionColorSettings.sectionBackground.gradientColor1}, ${sectionColorSettings.sectionBackground.gradientColor2});
              opacity: ${sectionColorSettings.sectionBackground.opacity || 1};
            `;
          } else {
            galleryContainerStyles += `
              background-color: ${sectionColorSettings.sectionBackground.solidColor};
              opacity: ${sectionColorSettings.sectionBackground.opacity || 1};
            `;
          }
        }
        
        // Добавляем стили границы и отступов
        if (sectionColorSettings.borderColor) {
          galleryContainerStyles += `
            border: ${sectionColorSettings.borderWidth || 1}px solid ${sectionColorSettings.borderColor};
            border-radius: ${sectionColorSettings.borderRadius || 15}px;
          `;
        }
        
        if (sectionColorSettings.padding !== undefined) {
          galleryContainerStyles += `padding: ${sectionColorSettings.padding}px;`;
        }
        
        if (sectionColorSettings.boxShadow) {
          galleryContainerStyles += `box-shadow: 0 2px 8px rgba(0,0,0,0.1);`;
        }
        
        imagesHtml = `
          <div class="section-gallery" style="${galleryContainerStyles}">
            ${sectionData.images.map((img, index) => {
              const imgPath = typeof img === 'string' 
                ? img.replace('/images/sections/', 'assets/images/')
                : (img.path || img.url || '').replace('/images/sections/', 'assets/images/');
              
              return `
                <img 
                  src="${imgPath}" 
                  alt="${sectionTitle} ${index + 1}"
                  class="gallery-img"
                  style="
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    display: ${index === 0 ? 'block' : 'none'};
                    transition: opacity 0.5s ease;
                  "
                >
              `;
            }).join('')}
            
            <div style="
              position: absolute;
              bottom: 15px;
              left: 0;
              right: 0;
              text-align: center;
              z-index: 2;
            ">
              ${sectionData.images.map((_, index) => `
                <span 
                  class="gallery-dot"
                  style="
                    display: inline-block;
                    width: 10px;
                    height: 10px;
                    border-radius: 50%;
                    background-color: ${index === 0 ? '#ffffff' : 'rgba(255,255,255,0.5)'};
                    margin: 0 4px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                  "
                ></span>
              `).join('')}
            </div>
          </div>
        `;
      }
          } else if (hasSingleImage) {
        // Одно изображение из imagePath
        // Применяем colorSettings если они есть
        let imageContainerStyles = `
        width: 100%;
        margin: 2rem auto;
        text-align: center;
        max-width: 600px;
        height: 400px;
        border-radius: 15px;
        overflow: hidden;
        box-shadow: 0 10px 30px rgba(0,0,0,0.15);
      `;
      
      // Добавляем стили фона если включены
      if (sectionColorSettings.sectionBackground?.enabled) {
        if (sectionColorSettings.sectionBackground.useGradient) {
          imageContainerStyles += `
            background: linear-gradient(${sectionColorSettings.sectionBackground.gradientDirection}, ${sectionColorSettings.sectionBackground.gradientColor1}, ${sectionColorSettings.sectionBackground.gradientColor2});
            opacity: ${sectionColorSettings.sectionBackground.opacity || 1};
          `;
        } else {
          imageContainerStyles += `
            background-color: ${sectionColorSettings.sectionBackground.solidColor};
            opacity: ${sectionColorSettings.sectionBackground.opacity || 1};
          `;
        }
      }
      
      // Добавляем стили границы и отступов
      if (sectionColorSettings.borderColor) {
        imageContainerStyles += `
          border: ${sectionColorSettings.borderWidth || 1}px solid ${sectionColorSettings.borderColor};
          border-radius: ${sectionColorSettings.borderRadius || 15}px;
        `;
      }
      
      if (sectionColorSettings.padding !== undefined) {
        imageContainerStyles += `padding: ${sectionColorSettings.padding}px;`;
      }
      
      if (sectionColorSettings.boxShadow) {
        imageContainerStyles += `box-shadow: 0 2px 8px rgba(0,0,0,0.1);`;
      }
      
      imagesHtml = `
        <div class="image-container" style="${imageContainerStyles}">
          <img 
            src="${sectionData.imagePath.replace('/images/sections/', 'assets/images/')}" 
            alt="${sectionTitle}"
            style="
              width: 100%;
              height: 100%;
              object-fit: cover;
              border-radius: 15px;
            "
          >
        </div>
      `;
    }
    
    // Генерируем HTML для карточек с индивидуальными стилями
    const cardsHtml = (sectionData.cards || []).map((card, index) => {
      const cardTitleColor = card.titleColor || sectionColorSettings?.textFields?.title || titleColor;
      const cardContentColor = card.contentColor || sectionColorSettings?.textFields?.content || contentColor;
      const cardBorderColor = card.borderColor || sectionColorSettings?.accentColor || '#1976d2';
      
      return `
        <div class="service-block" style="
          background: ${sectionColorSettings?.cardBackground || 'rgba(255, 255, 255, 0.95)'};
          border-radius: ${sectionColorSettings?.cardBorderRadius || 15}px;
          padding: ${sectionColorSettings?.cardPadding || 2}rem;
          margin-bottom: 2rem;
          border-left: 4px solid ${cardBorderColor};
          box-shadow: ${sectionColorSettings?.cardBoxShadow ? '0 2px 8px rgba(0,0,0,0.1)' : '0 10px 30px rgba(0,0,0,0.1)'};
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        ">
          <h3 style="
            color: ${cardTitleColor};
            font-size: 1.5rem;
            font-weight: 600;
            margin-bottom: 1rem;
            font-family: 'Montserrat', sans-serif;
          ">${card.title || ''}</h3>
          <p style="
            color: ${cardContentColor};
            font-size: 1.1rem;
            line-height: 1.6;
            margin: 0;
            font-family: 'Roboto', sans-serif;
          ">${card.content || card.text || ''}</p>
        </div>
      `;
    }).join('');
    
    // Генерируем HTML для новых элементов из AI
    console.log('🔍 generateMultiPageSection - sectionData:', sectionData);
    console.log('🔍 generateMultiPageSection - sectionData.aiElements:', sectionData.aiElements);
    console.log('🔍 generateMultiPageSection - sectionData.elements:', sectionData.elements);
    console.log('🔍 generateMultiPageSection - sectionData.contentElements:', sectionData.contentElements);
    const elementsHtml = (sectionData.contentElements || sectionData.elements || sectionData.aiElements || []).map((element, index) => {
              console.log('🔍 Processing element:', element);
        
        // Дополнительная проверка элемента перед передачей в generateContentElementHTML
        if (element.type === 'bar-chart') {
          console.log('🎯 BAR-CHART ELEMENT BEFORE PROCESSING:');
          console.log('element.customStyles:', element.customStyles);
          console.log('element.data type:', typeof element.data, 'isArray:', Array.isArray(element.data));
          if (element.data && typeof element.data === 'object' && !Array.isArray(element.data)) {
            console.log('element.data keys:', Object.keys(element.data));
            if (element.data.customStyles) {
              console.log('🎨 Found customStyles in element.data:', element.data.customStyles);
            }
            if (element.data.data && element.data.data.customStyles) {
              console.log('🎨 Found customStyles in element.data.data:', element.data.data.customStyles);
            }
          }
        }
        
        if (element.type === 'advanced-area-chart') {
          console.log('📊 ADVANCED-AREA-CHART ELEMENT BEFORE PROCESSING:');
          console.log('element:', element);
          console.log('📊 ELEMENT STRUCTURE:');
          console.log('element.id:', element.id);
          console.log('element.type:', element.type);
          console.log('element.title:', element.title);
          console.log('element.content:', element.content);
          console.log('element.data:', element.data);
          console.log('element.data type:', typeof element.data, 'isArray:', Array.isArray(element.data));
          console.log('element.areaNames:', element.areaNames);
          console.log('element.customStyles:', element.customStyles);
          console.log('element.showTitle:', element.showTitle);
          console.log('📊 ALL ELEMENT KEYS:', Object.keys(element));
          if (element.data && typeof element.data === 'object' && !Array.isArray(element.data)) {
            console.log('element.data keys:', Object.keys(element.data));
            if (element.data.data) {
              console.log('element.data.data:', element.data.data);
            }
          }
        }
        
        // 🔥 ОТЛАДКА: Проверяем multiple-cards элемент
        if (element.type === 'multiple-cards') {
          console.log('🎴 MULTIPLE-CARDS ELEMENT BEFORE PROCESSING:');
          console.log('element:', element);
          console.log('element.cards:', element.cards);
          console.log('element.sectionColorSettings:', element.sectionColorSettings);
          console.log('element.sectionStyles:', element.sectionStyles);
          if (element.cards && element.cards.length > 0) {
            console.log('First card colorSettings:', element.cards[0].colorSettings);
            console.log('First card customStyles:', element.cards[0].customStyles);
          }
        }
      return generateContentElementHTML(element, true, sectionId); // true = многостраничный режим, передаем sectionId
    }).join('');
    
    return `<!DOCTYPE html>
<html lang="${languageCode}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${sectionTitle} - ${siteName}</title>
    <meta name="description" content="${sectionData.description || sectionTitle}">
    <link rel="icon" type="image/png" href="assets/images/Favicon.png">
    <link rel="stylesheet" href="assets/css/styles.css">
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet">
    
    <!-- React и основные библиотеки -->
    <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    
    <!-- Material-UI -->
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
    <script src="https://unpkg.com/@mui/material@5.15.10/umd/material-ui.production.min.js"></script>
    <script src="https://unpkg.com/@emotion/react@11.14.0/dist/emotion-react.umd.min.js"></script>
    <script src="https://unpkg.com/@emotion/styled@11.14.1/dist/emotion-styled.umd.min.js"></script>
    
    <!-- Дополнительные библиотеки для элементов -->
    <script src="https://unpkg.com/framer-motion@12.23.0/dist/framer-motion.js"></script>
    <script src="https://unpkg.com/react-countup@6.5.3/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-confetti@6.4.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/qrcode.react@4.2.0/lib/index.umd.js"></script>
    <script src="https://unpkg.com/react-player@3.1.0/dist/ReactPlayer.js"></script>
    <script src="https://unpkg.com/react-rating-stars-component@2.2.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-text-transition@3.1.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-share@5.2.2/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-copy-to-clipboard@5.1.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-color@2.19.3/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-datepicker@8.4.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-select@5.10.1/dist/react-select.umd.js"></script>
    <script src="https://unpkg.com/react-scroll@1.9.3/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-rnd@10.5.2/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-image-crop@11.0.10/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-markdown@9.0.1/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-plotly.js@2.6.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-apexcharts@1.7.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-chartjs-2@5.3.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/recharts@3.0.2/lib/index.umd.js"></script>
    <script src="https://unpkg.com/apexcharts@4.7.0/dist/apexcharts.min.js"></script>
    <script src="https://unpkg.com/chart.js@4.5.0/dist/chart.umd.js"></script>
    <script src="https://unpkg.com/plotly.js@3.0.1/dist/plotly.min.js"></script>
    <script src="https://unpkg.com/swiper@11.2.10/swiper-bundle.min.js"></script>
    <link rel="stylesheet" href="https://unpkg.com/swiper@11.2.10/swiper-bundle.min.css" />
    <script src="https://unpkg.com/axios@1.6.7/dist/axios.min.js"></script>
    <script src="https://unpkg.com/dayjs@1.11.13/dayjs.min.js"></script>
    <script src="https://unpkg.com/marked@15.0.10/marked.min.js"></script>
    <script src="https://unpkg.com/uuid@11.1.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/browser-image-compression@2.0.2/dist/browser-image-compression.umd.js"></script>
    <script src="https://unpkg.com/file-saver@2.0.5/dist/FileSaver.min.js"></script>
    <script src="https://unpkg.com/jszip@3.10.1/dist/jszip.min.js"></script>
    <script src="https://unpkg.com/formik@2.4.6/dist/formik.umd.min.js"></script>
    <script src="https://unpkg.com/yup@1.6.1/dist/yup.umd.min.js"></script>
    <script src="https://unpkg.com/react-hook-form@7.59.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@hookform/resolvers@5.1.1/dist/index.umd.js"></script>
    <script src="https://unpkg.com/slate@0.117.2/dist/index.umd.js"></script>
    <script src="https://unpkg.com/slate-react@0.117.3/dist/index.umd.js"></script>
    <script src="https://unpkg.com/slate-history@0.113.1/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@tiptap/react@2.25.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@tiptap/starter-kit@2.25.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@tiptap/extension-color@2.25.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@tiptap/extension-highlight@2.25.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@tiptap/extension-image@2.25.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@tiptap/extension-link@2.25.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@tiptap/extension-table@2.25.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@tiptap/extension-text-align@2.25.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@tiptap/extension-underline@2.25.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@dnd-kit/core@6.3.1/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@dnd-kit/sortable@10.0.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@dnd-kit/utilities@3.2.2/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@visx/visx@3.12.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/victory@37.3.6/dist/index.umd.js"></script>
    <script src="https://unpkg.com/zustand@5.0.6/umd/index.production.min.js"></script>
    <style>
      /* Анимации для галереи */
      .gallery-dot:hover {
        background-color: #ffffff !important;
        transform: scale(1.2);
      }
      
      .service-block:hover {
        transform: translateY(-5px);
        box-shadow: 0 15px 40px rgba(0,0,0,0.15);
      }
      
      /* Адаптивность */
      @media (max-width: 768px) {
        .image-container,
        .section-gallery {
          height: 250px !important;
          margin: 1rem auto !important;
        }
        
        .service-block {
          padding: 1.5rem !important;
          margin-bottom: 1.5rem !important;
        }
        
        .service-block h3 {
          font-size: 1.3rem !important;
        }
        
        .service-block p {
          font-size: 1rem !important;
        }
      }
    </style>
</head>
<body>
    ${headerData.siteBackgroundType === 'image' ? `
    <div class="background-image" style="
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-image: url('assets/images/fon.jpg');
      background-size: cover;
      background-position: center;
      filter: ${headerData.siteBackgroundBlur ? `blur(${headerData.siteBackgroundBlur}px)` : 'none'};
      z-index: -2;
    "></div>
    ${headerData.siteBackgroundDarkness ? `
    <div class="site-overlay" style="
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, ${headerData.siteBackgroundDarkness / 100});
      z-index: -1;
    "></div>
    ` : ''}
    ` : headerData.siteBackgroundType === 'gradient' ? `
    <div class="background-image" style="
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(${headerData.siteGradientDirection || 'to right'}, 
        ${headerData.siteGradientColor1 || '#ffffff'}, 
        ${headerData.siteGradientColor2 || '#f5f5f5'});
      z-index: -2;
    "></div>
    ` : headerData.siteBackgroundType === 'solid' ? `
    <div class="background-image" style="
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: ${headerData.siteBackgroundColor || '#ffffff'};
      z-index: -2;
    "></div>
    ` : ''}
    
    ${generateMultiPageHeader(siteData, fileName)}
    
    <main>
        
        <section class="section-content" style="
          padding: 3rem 0;
          background: transparent;
          margin: 0;
        ">
          <div class="container" style="
            max-width: 1000px;
            margin: 0 auto;
            padding: 0 2rem;
          ">
            <h1 style="
              color: ${sectionColorSettings?.textFields?.title || titleColor};
              font-size: 2.5rem;
              font-weight: 700;
              margin-bottom: 1.5rem;
              text-align: center;
              font-family: 'Montserrat', sans-serif;
            ">${sectionTitle}</h1>
            
            ${sectionData.description ? `
              <p style="
                color: ${sectionColorSettings?.textFields?.description || descriptionColor};
                font-size: 1.2rem;
                line-height: 1.6;
                margin-bottom: 3rem;
                text-align: center;
                max-width: 800px;
                margin-left: auto;
                margin-right: auto;
                font-family: 'Roboto', sans-serif;
              ">${sectionData.description}</p>
            ` : ''}
            
            ${imagesHtml}
            
            <div class="cards-container">
              ${cardsHtml}
            </div>
            
            <div class="elements-container">
              ${elementsHtml}
            </div>
          </div>
        </section>
    </main>
    
    ${generateMultiPageFooter(siteData)}
    
    <script src="assets/js/script.js"></script>
    <script>
      // Инициализация галереи изображений
      function initImageGalleries() {
        const galleries = document.querySelectorAll('.section-gallery');
        
        galleries.forEach(gallery => {
          const images = gallery.querySelectorAll('.gallery-img');
          const dots = gallery.querySelectorAll('.gallery-dot');
          let currentIndex = 0;
          let interval = null;
          
          if (images.length < 2) return;
          
          function showSlide(index) {
            images.forEach(img => img.style.display = 'none');
            dots.forEach(dot => dot.style.backgroundColor = 'rgba(255,255,255,0.5)');
            
            if (images[index]) {
              images[index].style.display = 'block';
            }
            
            if (dots[index]) {
              dots[index].style.backgroundColor = '#ffffff';
            }
            
            currentIndex = index;
          }
          
          dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
              clearInterval(interval);
              showSlide(index);
              startAutoScroll();
            });
          });
          
          function startAutoScroll() {
            if (interval) clearInterval(interval);
            interval = setInterval(() => {
              const nextIndex = (currentIndex + 1) % images.length;
              showSlide(nextIndex);
            }, 3000);
          }
          
          gallery.addEventListener('mouseenter', () => clearInterval(interval));
          gallery.addEventListener('mouseleave', startAutoScroll);
          
          startAutoScroll();
        });
      }
      
      // Function to initialize AI elements
      function initAIElements() {
        // Initialize animated counters
        const counters = document.querySelectorAll('.animated-counter .counter');
        counters.forEach(counter => {
          const startValue = parseInt(counter.dataset.start) || 0;
          const endValue = parseInt(counter.dataset.end) || 100;
          const duration = parseInt(counter.dataset.duration) || 2000;
          
          let startTime = null;
          function animateCounter(timestamp) {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const currentValue = Math.floor(startValue + (endValue - startValue) * progress);
            counter.textContent = currentValue;
            
            if (progress < 1) {
              requestAnimationFrame(animateCounter);
            }
          }
          
          // Start animation when element is visible
          const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                requestAnimationFrame(animateCounter);
                observer.unobserve(entry.target);
              }
            });
          });
          observer.observe(counter);
        });
        
        // Initialize typewriter text
        const typewriters = document.querySelectorAll('.typewriter');
        typewriters.forEach(typewriter => {
          const texts = JSON.parse(typewriter.dataset.texts || '["Привет, мир!"]');
          const speed = parseInt(typewriter.dataset.speed) || 150;
          const pauseTime = parseInt(typewriter.dataset.pause) || 2000;
          const repeat = typewriter.dataset.repeat !== 'false';
          
          let currentTextIndex = 0;
          let currentCharIndex = 0;
          let isDeleting = false;
          
          function typeWriter() {
            const currentText = texts[currentTextIndex];
            
            if (isDeleting) {
              typewriter.textContent = currentText.substring(0, currentCharIndex - 1);
              currentCharIndex--;
            } else {
              typewriter.textContent = currentText.substring(0, currentCharIndex + 1);
              currentCharIndex++;
            }
            
            let typeSpeed = speed;
            if (isDeleting) {
              typeSpeed /= 2;
            }
            
            if (!isDeleting && currentCharIndex === currentText.length) {
              typeSpeed = pauseTime;
              isDeleting = true;
            } else if (isDeleting && currentCharIndex === 0) {
              isDeleting = false;
              currentTextIndex = (currentTextIndex + 1) % texts.length;
              typeSpeed = 500;
            }
            
            setTimeout(typeWriter, typeSpeed);
          }
          
          // Start typewriter when element is visible
          const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                typeWriter();
                observer.unobserve(entry.target);
              }
            });
                     });
           observer.observe(typewriter);
         });
         
         // Initialize FAQ accordion functionality
         window.toggleFAQ = function(index) {
           const answer = document.getElementById('faq-answer-' + index);
           const container = answer ? answer.parentElement : null;
           const icon = container ? container.querySelector('span') : null;
           
           if (answer) {
             const isVisible = answer.style.display !== 'none';
             answer.style.display = isVisible ? 'none' : 'block';
             
             // Обновляем иконку
             if (icon) {
               icon.textContent = isVisible ? '▼' : '▲';
             }
             
             // Применяем hover эффекты к контейнеру
             if (container) {
               const originalBg = container.style.backgroundColor;
               const hoverBg = container.getAttribute('data-hover-bg') || '#f0f0f0';
               
               // Добавляем обработчики hover для развернутого состояния
               container.onmouseover = function() {
                 this.style.backgroundColor = hoverBg;
                 if (answer.style.display !== 'none') {
                   answer.style.backgroundColor = hoverBg;
                 }
               };
               
               container.onmouseout = function() {
                 this.style.backgroundColor = originalBg;
                 if (answer.style.display !== 'none') {
                   answer.style.backgroundColor = originalBg;
                 }
               };
             }
           }
         };
         
         // Initialize charts when libraries are loaded
         function initializeCharts() {
           const chartElements = document.querySelectorAll('.chart-component canvas, .chart-component div[id^="chart-"]');
           chartElements.forEach(element => {
             const scripts = element.parentElement.querySelectorAll('script');
             scripts.forEach(script => {
               if (script.textContent.includes('Chart(') || script.textContent.includes('ApexCharts')) {
                 try {
                   eval(script.textContent);
                 } catch (e) {
                   console.log('Chart initialization delayed:', e.message);
                 }
               }
             });
           });
         }
         
         // Try to initialize charts after a delay to ensure libraries are loaded
         setTimeout(initializeCharts, 1000);
         setTimeout(initializeCharts, 2000);
       }
      
      document.addEventListener('DOMContentLoaded', initImageGalleries);
      
      // Функция отправки формы контактов
      function submitContactForm(event) {
        event.preventDefault();
        const form = event.target;
        const formData = new FormData(form);
        
        // Отправляем данные на Formspree
        fetch('https://formspree.io/f/mvgwpqrr', {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        }).finally(() => {
          // Перенаправляем на страницу благодарности с параметрами
          const thankYouMessage = encodeURIComponent('${siteData.contactData?.thankYouMessage || 'Спасибо за обращение! Мы свяжемся с вами в ближайшее время.'}');
          const closeButtonText = encodeURIComponent('${siteData.contactData?.closeButtonText || 'Закрыть'}');
          window.location.href = \`merci.html?message=\${thankYouMessage}&closeButtonText=\${closeButtonText}\`;
        });
        
        return false;
      }
    </script>
</body>
</html>`;
  };

  const generateMultiPageContact = (siteData) => {
    const headerData = siteData.headerData || {};
    let contactData = siteData.contactData;
    const siteName = headerData.siteName || 'My Site';
    const languageCode = typeof headerData.language === 'string' ? headerData.language : 'ru';
    
    console.log('🔍 generateMultiPageContact called with siteData keys:', Object.keys(siteData));
    console.log('🔍 Full contactData structure:', JSON.stringify(contactData, null, 2));
    
    if (!contactData || !contactData.title) {
      console.log('❌ No contact data or title found, checking alternative locations...');
      
      // Проверяем альтернативные места где могут храниться данные контактов
      if (siteData.contact) {
        console.log('🔍 Found contact data in siteData.contact:', siteData.contact);
        contactData = siteData.contact;
      } else if (siteData.contactSection) {
        console.log('🔍 Found contact data in siteData.contactSection:', siteData.contactSection);
        contactData = siteData.contactSection;
      }
      
      if (!contactData || !contactData.title) {
        console.log('❌ Still no contact data found, using defaults');
        contactData = {
          title: 'Свяжитесь с нами',
          description: 'Оставьте свои контактные данные, и мы свяжемся с вами в ближайшее время'
        };
      }
    }

    // Создаем inline стили для контактной секции на основе contactData (как в одностраничном экспорте)
    const sectionStyles = [];
    
    console.log('🎨 Checking background styles in contactData...');
    console.log('🔍 backgroundType:', contactData.backgroundType);
    console.log('🔍 gradientColor1:', contactData.gradientColor1);
    console.log('🔍 gradientColor2:', contactData.gradientColor2);
    console.log('🔍 backgroundColor:', contactData.backgroundColor);
    
    // Улучшенная логика для фонов - проверяем разные варианты хранения данных
    if (contactData.backgroundType === 'gradient') {
      if (contactData.gradientColor1 && contactData.gradientColor2) {
        sectionStyles.push(`background: linear-gradient(${contactData.gradientDirection || 'to bottom'}, ${contactData.gradientColor1}, ${contactData.gradientColor2})`);
        console.log('✅ Applied gradient background:', contactData.gradientColor1, contactData.gradientColor2);
      }
    } else if (contactData.backgroundColor) {
      sectionStyles.push(`background-color: ${contactData.backgroundColor}`);
      console.log('✅ Applied solid background:', contactData.backgroundColor);
    }
    
    // Проверяем альтернативные названия полей для фонов
    if (!sectionStyles.length) {
      console.log('❌ No primary background found, checking alternatives...');
      
      const possibleBgFields = [
        'sectionBackgroundColor', 'bgColor', 'background', 'bg',
        'primaryColor', 'mainColor', 'themeColor'
      ];
      
      for (const field of possibleBgFields) {
        if (contactData[field]) {
          sectionStyles.push(`background-color: ${contactData[field]}`);
          console.log(`✅ Applied ${field}:`, contactData[field]);
          break;
        }
      }
      
      // Проверяем градиенты в альтернативных полях
      const possibleGradientFields = [
        ['gradientStart', 'gradientEnd'],
        ['gradient1', 'gradient2'],
        ['color1', 'color2'],
        ['startColor', 'endColor']
      ];
      
      for (const [field1, field2] of possibleGradientFields) {
        if (contactData[field1] && contactData[field2]) {
          sectionStyles.push(`background: linear-gradient(to bottom, ${contactData[field1]}, ${contactData[field2]})`);
          console.log(`✅ Applied gradient ${field1}/${field2}:`, contactData[field1], contactData[field2]);
          break;
        }
      }
    }
    
    // Стили для форм и информационных блоков
    const formStyles = [];
    const infoStyles = [];
    
    // Применяем фон формы (по умолчанию белый)
    if (contactData.formBackgroundColor) {
      formStyles.push(`background-color: ${contactData.formBackgroundColor}`);
    } else {
      formStyles.push(`background-color: #ffffff`);
    }
    
    if (contactData.formBorderColor) {
      formStyles.push(`border: 1px solid ${contactData.formBorderColor}`);
    }
    
    // Синхронизируем фон с формой
    if (contactData.infoBackgroundColor) {
      infoStyles.push(`background-color: ${contactData.infoBackgroundColor}`);
    } else if (contactData.formBackgroundColor) {
      // Используем тот же фон, что и у формы
      infoStyles.push(`background-color: ${contactData.formBackgroundColor}`);
    } else {
      // По умолчанию белый фон как у формы
      infoStyles.push(`background-color: #ffffff`);
    }
    
    if (contactData.infoBorderColor) {
      infoStyles.push(`border: 1px solid ${contactData.infoBorderColor}`);
    }

    console.log('🎨 Final section styles:', sectionStyles);
    console.log('📋 Form styles:', formStyles);
    console.log('ℹ️ Info styles:', infoStyles);
    
    // 🐛 ОТЛАДКА: Проверяем все данные contactData
    console.log('🔍 [DEBUG] All contactData properties:');
    console.log('   - title:', contactData.title);
    console.log('   - companyName:', contactData.companyName);
    console.log('   - address:', contactData.address);
    console.log('   - phone:', contactData.phone);
    console.log('   - email:', contactData.email);
    console.log('   - workingHours:', contactData.workingHours);
    console.log('   - showCompanyInfo:', contactData.showCompanyInfo);
    console.log('   - showContactForm:', contactData.showContactForm);
    
    return `<!DOCTYPE html>
<html lang="${languageCode}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${contactData.title || 'Контакты'} - ${siteName}</title>
    <meta name="description" content="${contactData.description || 'Свяжитесь с нами'}">
    <link rel="icon" type="image/png" href="assets/images/Favicon.png">
    <link rel="stylesheet" href="assets/css/styles.css">
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet">
    
    <!-- React и основные библиотеки -->
    <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    
    <!-- Material-UI -->
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
    <script src="https://unpkg.com/@mui/material@5.15.10/umd/material-ui.production.min.js"></script>
    <script src="https://unpkg.com/@emotion/react@11.14.0/dist/emotion-react.umd.min.js"></script>
    <script src="https://unpkg.com/@emotion/styled@11.14.1/dist/emotion-styled.umd.min.js"></script>
    
    <!-- Дополнительные библиотеки для элементов -->
    <script src="https://unpkg.com/framer-motion@12.23.0/dist/framer-motion.js"></script>
    <script src="https://unpkg.com/react-countup@6.5.3/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-confetti@6.4.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/qrcode.react@4.2.0/lib/index.umd.js"></script>
    <script src="https://unpkg.com/react-player@3.1.0/dist/ReactPlayer.js"></script>
    <script src="https://unpkg.com/react-rating-stars-component@2.2.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-text-transition@3.1.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-share@5.2.2/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-copy-to-clipboard@5.1.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-color@2.19.3/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-datepicker@8.4.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-select@5.10.1/dist/react-select.umd.js"></script>
    <script src="https://unpkg.com/react-scroll@1.9.3/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-rnd@10.5.2/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-image-crop@11.0.10/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-markdown@9.0.1/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-plotly.js@2.6.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-apexcharts@1.7.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-chartjs-2@5.3.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/recharts@3.0.2/lib/index.umd.js"></script>
    <script src="https://unpkg.com/apexcharts@4.7.0/dist/apexcharts.min.js"></script>
    <script src="https://unpkg.com/chart.js@4.5.0/dist/chart.umd.js"></script>
    <script src="https://unpkg.com/plotly.js@3.0.1/dist/plotly.min.js"></script>
    <script src="https://unpkg.com/swiper@11.2.10/swiper-bundle.min.js"></script>
    <link rel="stylesheet" href="https://unpkg.com/swiper@11.2.10/swiper-bundle.min.css" />
    <script src="https://unpkg.com/axios@1.6.7/dist/axios.min.js"></script>
    <script src="https://unpkg.com/dayjs@1.11.13/dayjs.min.js"></script>
    <script src="https://unpkg.com/marked@15.0.10/marked.min.js"></script>
    <script src="https://unpkg.com/uuid@11.1.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/browser-image-compression@2.0.2/dist/browser-image-compression.umd.js"></script>
    <script src="https://unpkg.com/file-saver@2.0.5/dist/FileSaver.min.js"></script>
    <script src="https://unpkg.com/jszip@3.10.1/dist/jszip.min.js"></script>
    <script src="https://unpkg.com/formik@2.4.6/dist/formik.umd.min.js"></script>
    <script src="https://unpkg.com/yup@1.6.1/dist/yup.umd.min.js"></script>
    <script src="https://unpkg.com/react-hook-form@7.59.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@hookform/resolvers@5.1.1/dist/index.umd.js"></script>
    <script src="https://unpkg.com/slate@0.117.2/dist/index.umd.js"></script>
    <script src="https://unpkg.com/slate-react@0.117.3/dist/index.umd.js"></script>
    <script src="https://unpkg.com/slate-history@0.113.1/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@tiptap/react@2.25.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@tiptap/starter-kit@2.25.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@tiptap/extension-color@2.25.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@tiptap/extension-highlight@2.25.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@tiptap/extension-image@2.25.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@tiptap/extension-link@2.25.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@tiptap/extension-table@2.25.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@tiptap/extension-text-align@2.25.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@tiptap/extension-underline@2.25.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@dnd-kit/core@6.3.1/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@dnd-kit/sortable@10.0.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@dnd-kit/utilities@3.2.2/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@visx/visx@3.12.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/victory@37.3.6/dist/index.umd.js"></script>
    <script src="https://unpkg.com/zustand@5.0.6/umd/index.production.min.js"></script>
    <style>
      /* Contact section styles - точно как в одностраничном экспорте */
      .contact-section {
        padding: 4rem 2rem;
        width: 100%;
        margin: 0;
        position: relative;
        z-index: 2;
      }
      
      .contact-container {
        max-width: 1140px;
        margin: 0 auto;
        padding: 0 20px;
      }
      
      .contact-header {
        text-align: center;
        margin-bottom: 3rem;
      }
      
      .contact-title {
        font-size: 2.5rem;
        margin-bottom: 1rem;
        position: relative;
        display: inline-block;
      }
      
      .contact-title::after {
        content: '';
        position: absolute;
        bottom: -10px;
        left: 50%;
        transform: translateX(-50%);
        width: 50px;
        height: 3px;
        background-color: currentColor;
      }
      
      .contact-description {
        font-size: 1.1rem;
        max-width: 800px;
        margin: 0 auto;
        line-height: 1.6;
      }
      
      .contact-content {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 2rem;
        margin-bottom: 3rem;
      }
      
      .contact-form-container {
        padding: 2.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        border: 1px solid #ddd;
      }
      
      .contact-form .form-group {
        margin-bottom: 1.5rem;
      }
      
      .contact-form label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 500;
      }
      
      .contact-form input,
      .contact-form textarea {
        width: 100%;
        padding: 0.85rem 1rem;
        border: 1px solid #ddd;
        border-radius: 6px;
        font-size: 1rem;
        box-sizing: border-box;
        font-family: inherit;
      }
      
      .contact-form textarea {
        resize: vertical;
        min-height: 100px;
      }
      
      .contact-form button {
        width: 100%;
        padding: 0.9rem 1.5rem;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.3s ease;
        font-weight: 500;
        font-size: 1rem;
        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
      }
      
      .contact-form button:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0,0,0,0.15);
      }
      
      .contact-info-container {
        padding: 2rem;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        border: 1px solid #ddd;
      }
      
      .info-title {
        font-size: 1.5rem;
        margin-bottom: 1.5rem;
        text-align: center;
      }
      
      .contact-info-item {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 1rem;
        padding: 8px 0;
      }

      .contact-icon {
        color: #1976d2;
        font-size: 1.2rem;
        min-width: 24px;
        text-align: center;
      }
      
      .contact-map,
      .contact-map-container {
        margin-top: 2rem;
        border-radius: 8px;
        overflow: hidden;
      }
      
      .contact-map iframe,
      .contact-map-container iframe {
        width: 100%;
        height: 300px;
        border: 0;
      }
      
      @media (max-width: 768px) {
        .contact-section {
          padding: 2rem 1rem;
        }

        .contact-title {
          font-size: 2rem;
        }

        .contact-description {
          font-size: 1.1rem;
        }

        .contact-content {
          grid-template-columns: 1fr;
        }
        
        .contact-form-container,
        .contact-info-container {
          padding: 1.5rem;
        }
      }
    </style>
</head>
<body>
    ${headerData.siteBackgroundType === 'image' ? `
    <div class="background-image" style="
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-image: url('assets/images/fon.jpg');
      background-size: cover;
      background-position: center;
      filter: ${headerData.siteBackgroundBlur ? `blur(${headerData.siteBackgroundBlur}px)` : 'none'};
      z-index: -2;
    "></div>
    ${headerData.siteBackgroundDarkness ? `
    <div class="site-overlay" style="
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, ${headerData.siteBackgroundDarkness / 100});
      z-index: -1;
    "></div>
    ` : ''}
    ` : headerData.siteBackgroundType === 'gradient' ? `
    <div class="background-image" style="
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(${headerData.siteGradientDirection || 'to right'}, 
        ${headerData.siteGradientColor1 || '#ffffff'}, 
        ${headerData.siteGradientColor2 || '#f5f5f5'});
      z-index: -2;
    "></div>
    ` : headerData.siteBackgroundType === 'solid' ? `
    <div class="background-image" style="
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: ${headerData.siteBackgroundColor || '#ffffff'};
      z-index: -2;
    "></div>
    ` : ''}
    
    ${generateMultiPageHeader(siteData, 'contact')}
    
    <main>
        <!-- Применяем точно такую же структуру как в одностраничном экспорте -->
        <section id="contact" class="contact-section" style="${sectionStyles.join('; ')}">
          <div class="contact-container">
            <div class="contact-header">
              <h2 class="contact-title" style="color: ${contactData.titleColor || '#1976d2'}">${contactData.title}</h2>
              ${contactData.description ? `<p class="contact-description" style="color: ${contactData.descriptionColor || '#666666'}">${contactData.description}</p>` : ''}
            </div>
            
            <div class="contact-content">
              ${contactData.showContactForm !== false ? `
                <div class="contact-form-container" style="${formStyles.join('; ')}">
                  <h3 style="color: ${contactData.titleColor || '#1976d2'}">Get In Touch</h3>
                  <form class="contact-form" onsubmit="handleSubmit(event)" id="contactForm">
                    <input type="hidden" name="_captcha" value="false" />
                    <input type="hidden" name="_template" value="table" />
                    <input type="hidden" name="_subject" value="New message from website" />
                    <input type="hidden" name="_language" value="en" />
                    <div class="form-group">
                      <label style="color: ${contactData.labelColor || '#333333'}">Full Name</label>
                      <input type="text" name="name" required style="background-color: ${contactData.inputBackgroundColor || '#f5f9ff'}; color: ${contactData.inputTextColor || '#1a1a1a'};" placeholder="Enter your full name">
                </div>
                    <div class="form-group">
                      <label style="color: ${contactData.labelColor || '#333333'}">Phone Number</label>
                      <input type="tel" name="phone" required style="background-color: ${contactData.inputBackgroundColor || '#f5f9ff'}; color: ${contactData.inputTextColor || '#1a1a1a'};" placeholder="Enter your phone number">
                </div>
                    <div class="form-group">
                      <label style="color: ${contactData.labelColor || '#333333'}">Email</label>
                      <input type="email" name="email" required style="background-color: ${contactData.inputBackgroundColor || '#f5f9ff'}; color: ${contactData.inputTextColor || '#1a1a1a'};" placeholder="Enter your email address">
                    </div>
                    <div class="form-group">
                      <label style="color: ${contactData.labelColor || '#333333'}">Message</label>
                      <textarea name="message" required style="background-color: ${contactData.inputBackgroundColor || '#f5f9ff'}; color: ${contactData.inputTextColor || '#1a1a1a'}; min-height: 100px;" placeholder="Tell us about your inquiry..."></textarea>
                    </div>
                    <button type="submit" style="background-color: ${contactData.buttonColor || '#1976d2'}; color: ${contactData.buttonTextColor || '#ffffff'};">
                      Send Message
                    </button>
                  </form>
                </div>
              ` : ''}
              
              ${contactData.showCompanyInfo !== false ? `
                <div class="contact-info-container" style="${infoStyles.join('; ')}">
                  <h3 class="info-title" style="color: ${contactData.infoTitleColor || contactData.titleColor || '#1976d2'}">Contact Information</h3>
                  <div class="contact-info">
            
                    <!-- Компания -->
                    ${contactData.companyName || contactData.title ? `
                      <div class="contact-info-item">
                        <span class="contact-icon" style="color: ${contactData.iconColor || '#1976d2'}">🏢</span>
                        <span style="color: ${contactData.labelColor || '#333333'}; font-weight: 500;">${contactData.companyName || contactData.title || 'Company Name'}</span>
                      </div>
                    ` : `
                      <div class="contact-info-item">
                        <span class="contact-icon" style="color: ${contactData.iconColor || '#1976d2'}">🏢</span>
                        <span style="color: ${contactData.labelColor || '#333333'}; font-weight: 500;">КриптоИнвест</span>
                      </div>
                    `}
                    
                    <!-- Адрес -->
                    ${contactData.address ? `
                      <div class="contact-info-item">
                        <span class="contact-icon" style="color: ${contactData.iconColor || '#1976d2'}">📍</span>
                        <span style="color: ${contactData.labelColor || '#333333'}; font-weight: 500;">${contactData.address}</span>
                </div>
                    ` : `
                      <div class="contact-info-item">
                        <span class="contact-icon" style="color: ${contactData.iconColor || '#1976d2'}">📍</span>
                        <span style="color: ${contactData.labelColor || '#333333'}; font-weight: 500;">Al Maktoum Street, Deira, P.O. Box 12345, Dubai, UAE</span>
                      </div>
                    `}
                    
                    <!-- Телефон -->
                    ${contactData.phone ? `
                      <div class="contact-info-item">
                        <span class="contact-icon" style="color: ${contactData.iconColor || '#1976d2'}">📞</span>
                        <span style="color: ${contactData.labelColor || '#333333'}; font-weight: 500;">${contactData.phone}</span>
                </div>
                    ` : `
                      <div class="contact-info-item">
                        <span class="contact-icon" style="color: ${contactData.iconColor || '#1976d2'}">📞</span>
                        <span style="color: ${contactData.labelColor || '#333333'}; font-weight: 500;">+971 4 237 7922</span>
                      </div>
                    `}
                    
                    <!-- Email -->
                    ${contactData.email ? `
                      <div class="contact-info-item">
                        <span class="contact-icon" style="color: ${contactData.iconColor || '#1976d2'}">✉️</span>
                        <span style="color: ${contactData.labelColor || '#333333'}; font-weight: 500;">${contactData.email}</span>
                </div>
                    ` : `
                      <div class="contact-info-item">
                        <span class="contact-icon" style="color: ${contactData.iconColor || '#1976d2'}">✉️</span>
                        <span style="color: ${contactData.labelColor || '#333333'}; font-weight: 500;">team@moy-sayt.com</span>
                      </div>
                    `}
                    
                    <!-- Часы работы -->
                    ${contactData.workingHours ? `
                      <div class="contact-info-item">
                        <span class="contact-icon" style="color: ${contactData.iconColor || '#1976d2'}">🕒</span>
                        <span style="color: ${contactData.companyInfoColor || '#333333'}">${contactData.workingHours}</span>
                      </div>
                    ` : ''}
                  </div>
                </div>
              ` : ''}
                </div>
                
            ${contactData.showMap && contactData.mapUrl ? `
              <!-- Используем mapUrl если он есть (как в одностраничном экспорте) -->
              <div class="contact-map-container" style="
                margin-top: 3rem;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 4px 20px rgba(0,0,0,0.1);
              ">
                <div style="position: relative; width: 100%; height: 400px;">
                  <iframe
                    src="${contactData.mapUrl}"
                    width="100%"
                    height="100%"
                    style="border: 0;"
                    allowfullscreen=""
                    loading="lazy"
                    referrerpolicy="no-referrer-when-downgrade"
                    title="Map: ${contactData.address || 'Адрес'}">
                  </iframe>
                  ${contactData.address ? `
                    <div style="
                      position: absolute;
                      bottom: 10px;
                      left: 10px;
                      background: rgba(255, 255, 255, 0.9);
                      padding: 8px 12px;
                      border-radius: 6px;
                      display: flex;
                      align-items: center;
                      gap: 8px;
                      font-size: 14px;
                      color: #333;
                      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                    ">
                      <span style="color: #1976d2;">📍</span>
                      <span>${contactData.address}${contactData.city ? `, ${contactData.city}` : ''}</span>
                    </div>
                  ` : ''}
                </div>
              </div>
            ` : contactData.address ? `
              <!-- Генерируем Google Maps если есть адрес -->
              <div class="contact-map-container" style="
                margin-top: 3rem;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 4px 20px rgba(0,0,0,0.1);
              ">
                <div style="position: relative; width: 100%; height: 400px;">
                  <iframe
                    src="https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(contactData.address + (contactData.city ? `, ${contactData.city}` : ''))}&language=ru"
                    width="100%"
                    height="100%"
                    style="border: 0;"
                    allowfullscreen=""
                    loading="lazy"
                    referrerpolicy="no-referrer-when-downgrade"
                    title="Map: ${contactData.address}">
                  </iframe>
                  <div style="
                    position: absolute;
                    bottom: 10px;
                    left: 10px;
                    background: rgba(255, 255, 255, 0.9);
                    padding: 8px 12px;
                    border-radius: 6px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 14px;
                    color: #333;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                  ">
                    <span style="color: #1976d2;">📍</span>
                    <span>${contactData.address}${contactData.city ? `, ${contactData.city}` : ''}</span>
                  </div>
                </div>
              </div>
            ` : ''}
          </div>
        </section>
    </main>
    
    ${generateMultiPageFooter(siteData)}
    
    <script src="assets/js/script.js"></script>
    <script>
      // Обработчик отправки формы
      function handleSubmit(event) {
        event.preventDefault();
        const form = document.getElementById('contactForm');
        const formData = new FormData(form);
        
        // Отправляем данные формы
        fetch('https://formspree.io/f/mvgwpqrr', {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        }).finally(() => {
          // Всегда перенаправляем на страницу благодарности с параметрами
          const thankYouMessage = encodeURIComponent('${contactData?.thankYouMessage || 'Спасибо за обращение! Мы свяжемся с вами в ближайшее время.'}');
          const closeButtonText = encodeURIComponent('${contactData?.closeButtonText || 'Закрыть'}');
          window.location.href = \`merci.html?message=\${thankYouMessage}&closeButtonText=\${closeButtonText}\`;
        });
      }
    </script>
</body>
</html>`;
  };

  const generateMultiPageLegal = (siteData, docType) => {
    const headerData = siteData.headerData || {};
    const siteName = headerData.siteName || 'My Site';
    const languageCode = typeof headerData.language === 'string' ? headerData.language : 'ru';
    const doc = siteData.legalDocuments[docType];
    
    return `<!DOCTYPE html>
<html lang="${languageCode}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${doc.title} - ${siteName}</title>
    <meta name="description" content="${doc.title}">
    <link rel="icon" type="image/png" href="assets/images/Favicon.png">
    <link rel="stylesheet" href="assets/css/styles.css">
    
    <!-- React и основные библиотеки -->
    <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    
    <!-- Material-UI -->
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
    <script src="https://unpkg.com/@mui/material@5.15.10/umd/material-ui.production.min.js"></script>
    <script src="https://unpkg.com/@emotion/react@11.14.0/dist/emotion-react.umd.min.js"></script>
    <script src="https://unpkg.com/@emotion/styled@11.14.1/dist/emotion-styled.umd.min.js"></script>
    
    <!-- Дополнительные библиотеки для элементов -->
    <script src="https://unpkg.com/framer-motion@12.23.0/dist/framer-motion.js"></script>
    <script src="https://unpkg.com/react-countup@6.5.3/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-confetti@6.4.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/qrcode.react@4.2.0/lib/index.umd.js"></script>
    <script src="https://unpkg.com/react-player@3.1.0/dist/ReactPlayer.js"></script>
    <script src="https://unpkg.com/react-rating-stars-component@2.2.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-text-transition@3.1.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-share@5.2.2/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-copy-to-clipboard@5.1.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-color@2.19.3/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-datepicker@8.4.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-select@5.10.1/dist/react-select.umd.js"></script>
    <script src="https://unpkg.com/react-scroll@1.9.3/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-rnd@10.5.2/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-image-crop@11.0.10/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-markdown@9.0.1/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-plotly.js@2.6.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-apexcharts@1.7.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-chartjs-2@5.3.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/recharts@3.0.2/lib/index.umd.js"></script>
    <script src="https://unpkg.com/apexcharts@4.7.0/dist/apexcharts.min.js"></script>
    <script src="https://unpkg.com/chart.js@4.5.0/dist/chart.umd.js"></script>
    <script src="https://unpkg.com/plotly.js@3.0.1/dist/plotly.min.js"></script>
    <script src="https://unpkg.com/swiper@11.2.10/swiper-bundle.min.js"></script>
    <link rel="stylesheet" href="https://unpkg.com/swiper@11.2.10/swiper-bundle.min.css" />
    <script src="https://unpkg.com/axios@1.6.7/dist/axios.min.js"></script>
    <script src="https://unpkg.com/dayjs@1.11.13/dayjs.min.js"></script>
    <script src="https://unpkg.com/marked@15.0.10/marked.min.js"></script>
    <script src="https://unpkg.com/uuid@11.1.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/browser-image-compression@2.0.2/dist/browser-image-compression.umd.js"></script>
    <script src="https://unpkg.com/file-saver@2.0.5/dist/FileSaver.min.js"></script>
    <script src="https://unpkg.com/jszip@3.10.1/dist/jszip.min.js"></script>
    <script src="https://unpkg.com/formik@2.4.6/dist/formik.umd.min.js"></script>
    <script src="https://unpkg.com/yup@1.6.1/dist/yup.umd.min.js"></script>
    <script src="https://unpkg.com/react-hook-form@7.59.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@hookform/resolvers@5.1.1/dist/index.umd.js"></script>
    <script src="https://unpkg.com/slate@0.117.2/dist/index.umd.js"></script>
    <script src="https://unpkg.com/slate-react@0.117.3/dist/index.umd.js"></script>
    <script src="https://unpkg.com/slate-history@0.113.1/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@tiptap/react@2.25.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@tiptap/starter-kit@2.25.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@tiptap/extension-color@2.25.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@tiptap/extension-highlight@2.25.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@tiptap/extension-image@2.25.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@tiptap/extension-link@2.25.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@tiptap/extension-table@2.25.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@tiptap/extension-text-align@2.25.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@tiptap/extension-underline@2.25.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@dnd-kit/core@6.3.1/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@dnd-kit/sortable@10.0.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@dnd-kit/utilities@3.2.2/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@visx/visx@3.12.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/victory@37.3.6/dist/index.umd.js"></script>
    <script src="https://unpkg.com/zustand@5.0.6/umd/index.production.min.js"></script>
</head>
<body>
    ${headerData.siteBackgroundType === 'image' ? `
    <div class="background-image" style="
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-image: url('assets/images/fon.jpg');
      background-size: cover;
      background-position: center;
      filter: ${headerData.siteBackgroundBlur ? `blur(${headerData.siteBackgroundBlur}px)` : 'none'};
      z-index: -2;
    "></div>
    ${headerData.siteBackgroundDarkness ? `
    <div class="site-overlay" style="
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, ${headerData.siteBackgroundDarkness / 100});
      z-index: -1;
    "></div>
    ` : ''}
    ` : headerData.siteBackgroundType === 'gradient' ? `
    <div class="background-image" style="
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(${headerData.siteGradientDirection || 'to right'}, 
        ${headerData.siteGradientColor1 || '#ffffff'}, 
        ${headerData.siteGradientColor2 || '#f5f5f5'});
      z-index: -2;
    "></div>
    ` : headerData.siteBackgroundType === 'solid' ? `
    <div class="background-image" style="
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: ${headerData.siteBackgroundColor || '#ffffff'};
      z-index: -2;
    "></div>
    ` : ''}
    
    ${generateMultiPageHeader(siteData, docType)}
    
    <main>
        
        <section class="legal-content">
          <div class="container">
            <h1>${doc.title}</h1>
            <div class="content">
              ${doc.content}
            </div>
          </div>
        </section>
    </main>
    
    ${generateMultiPageFooter(siteData)}
    
    <script src="assets/js/script.js"></script>
</body>
</html>`;
  };

  const generateMultiPageSitemap = (siteData) => {
    const domain = siteData.headerData?.domain || 'example.com';
    const baseUrl = domain.startsWith('http') ? domain : `https://${domain}`;
    const currentDate = new Date().toISOString().replace('Z', '+00:00');
    
    const indexFile = getIndexFileName();
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/${indexFile}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>`;

    // Добавляем страницы секций
    Object.entries(siteData.sectionsData || {}).forEach(([sectionId, sectionData]) => {
      const fileName = getSectionFileNameSafe(sectionId, sectionData);
      if (fileName) {
        sitemap += `
  <url>
    <loc>${baseUrl}/${fileName}.html</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
      }
    });

    // Добавляем остальные страницы
    if (siteData.contactData) {
      const contactFileName = getContactFileNameSafe(siteData.contactData);
      sitemap += `
  <url>
    <loc>${baseUrl}/${contactFileName}.html</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
    }
    
    sitemap += `
</urlset>`;
  };

  // Функция для предварительного экспорта изображений карточек (для создания маппинга)
  const exportCardImagesForHTML = async () => {
    console.log('🔥EXPORT🔥 exportCardImagesForHTML STARTED!');
    
    try {
      // Получаем все ключи метаданных
      const allKeys = await imageCacheService.getAllMetadataKeys();
      console.log(`🔥EXPORT🔥 Total metadata keys: ${allKeys.length}`);

      // Ищем все возможные ключи изображений карточек
      const cardImageKeys = allKeys.filter(key => key.startsWith('card-image-metadata-'));
      const newStyleCardKeys = allKeys.filter(key => key.match(/^card_\w+_.*_ImageMetadata$/));
      
      console.log(`🔥EXPORT🔥 Found ${cardImageKeys.length} old-style card image keys`);
      console.log(`🔥EXPORT🔥 Found ${newStyleCardKeys.length} new-style card metadata keys`);

      // Получаем текущие карточки на сайте
      const currentCardIds = new Set();
      
      console.log(`🔥EXPORT🔥 sectionsData type:`, typeof sectionsData);
      console.log(`🔥EXPORT🔥 sectionsData isArray:`, Array.isArray(sectionsData));
      console.log(`🔥EXPORT🔥 sectionsData keys:`, Object.keys(sectionsData));
      
      if (Array.isArray(sectionsData)) {
        // Если это массив
        sectionsData.forEach(sectionData => {
          [sectionData.elements, sectionData.contentElements, sectionData.cards].forEach(elements => {
            if (elements) {
              elements.forEach(element => {
                if ((element.type === 'image-card' || element.type === 'card') && element.id) {
                  const uniqueKey = `${element.id}__SECTION__${sectionData.id}`;
                  currentCardIds.add(uniqueKey);
                }
              });
            }
          });
        });
      } else if (sectionsData && typeof sectionsData === 'object') {
        // Если это объект
        Object.entries(sectionsData).forEach(([sectionId, sectionData]) => {
          console.log(`🔥EXPORT🔥 Processing section object: ${sectionId}`, sectionData);
          [sectionData.elements, sectionData.contentElements, sectionData.cards].forEach(elements => {
            if (elements) {
              elements.forEach(element => {
                if ((element.type === 'image-card' || element.type === 'card') && element.id) {
                  const uniqueKey = `${element.id}__SECTION__${sectionData.id}`;
                  currentCardIds.add(uniqueKey);
                  console.log(`🔥EXPORT🔥 Added card to pre-export: ${uniqueKey}`);
                }
              });
            }
          });
        });
      }

      console.log(`🔥EXPORT🔥 Found ${currentCardIds.size} current cards on site`);

      // Создаем маппинг изображений карточек
      const cardImagesMap = new Map();
      
      // Обрабатываем новый стиль метаданных
      for (const key of newStyleCardKeys) {
        try {
          const metadata = await imageCacheService.getMetadata(key);
          if (metadata && metadata.cardId && metadata.sectionId) {
            const uniqueKey = `${metadata.cardId}__SECTION__${metadata.sectionId}`;
            if (currentCardIds.has(uniqueKey)) {
              const uploadDate = new Date(metadata.lastModified || metadata.uploadDate);
              const existing = cardImagesMap.get(uniqueKey);
              
              if (!existing || uploadDate > existing.uploadDate) {
                cardImagesMap.set(uniqueKey, {
                  metadata: {
                    fileName: metadata.filename || metadata.fileName,
                    uploadDate: metadata.lastModified || metadata.uploadDate
                  },
                  cardId: metadata.cardId,
                  sectionId: metadata.sectionId,
                  uploadDate
                });
              }
            }
          }
        } catch (error) {
          console.warn(`🔥EXPORT🔥 Error processing ${key}:`, error);
        }
      }

      console.log(`🔥EXPORT🔥 Processing ${cardImagesMap.size} unique cards with images`);

      // Create a map for card image filenames
      const cardImageFileMap = new Map();
      
      // Export images and create mapping
      for (const [uniqueCardKey, imageInfo] of cardImagesMap) {
        try {
          const metadata = imageInfo.metadata;
          const cardId = imageInfo.cardId;
          const sectionId = imageInfo.sectionId;
          
          // Generate deterministic filename
          const cardHash = cardId.split('_').pop() || cardId.substring(0, 8);
          const sectionHash = sectionId.split('_').pop() || sectionId.substring(0, 8);
          const deterministicHash = (cardId + '_' + sectionId).split('').reduce((a, b) => {
            a = ((a << 5) - a) + b.charCodeAt(0);
            return a & a;
          }, 0).toString(36).substring(0, 6);
          const cleanFileName = `card_${sectionHash}_${cardHash}_${deterministicHash}.jpg`;
          
          // Store mapping
          cardImageFileMap.set(uniqueCardKey, cleanFileName);
          cardImageFileMap.set(cardId, cleanFileName);
          
          console.log(`🔥EXPORT🔥 Pre-mapped: ${uniqueCardKey} -> ${cleanFileName}`);
        } catch (error) {
          console.error(`🔥EXPORT🔥 Error pre-mapping card:`, error);
        }
      }

      // Store the mapping globally for HTML generation
      window.cardImageFileMap = cardImageFileMap;
      
      console.log(`🔥EXPORT🔥 Pre-export mapping completed: ${cardImageFileMap.size} entries`);
      console.log(`🔥EXPORT🔥 Mapping keys:`, Array.from(cardImageFileMap.keys()));
      
    } catch (error) {
      console.error('🔥EXPORT🔥 Error in exportCardImagesForHTML:', error);
    }
  };

  const handleDownloadSite = async () => {
    console.log('🔥EXPORT🔥 handleDownloadSite STARTED!');
    console.log('🔥EXPORT🔥 currentConstructorMode:', currentConstructorMode);
    console.log('🔥EXPORT🔥 sectionsData:', sectionsData);

    try {
      const zip = new JSZip();
      
      // Create main folders
      const assetsFolder = zip.folder('assets');
      const cssFolder = assetsFolder.folder('css');
      const jsFolder = assetsFolder.folder('js');
      const imagesFolder = assetsFolder.folder('images');

      // Add merci.html to root with language settings
      const merciResponse = await fetch('/merci.html');
      let merciContent = await merciResponse.text();
      
      // Apply language settings from configuration
      const language = headerData?.language || 'ru';
      merciContent = merciContent.replace(
        /<html[^>]*>/,
        `<html lang="${language}">`
      );
      
      // Replace default values with values from edit fields
      const thankYouMessage = contactData?.thankYouMessage || 'Спасибо за обращение! Мы свяжемся с вами в ближайшее время.';
      const closeButtonText = contactData?.closeButtonText || 'Закрыть';
      
      merciContent = merciContent.replace(
        'const message = urlParams.get(\'message\') || \'Спасибо за обращение! Мы свяжемся с вами в ближайшее время.\';',
        `const message = urlParams.get('message') || '${thankYouMessage.replace(/'/g, "\\'")}';`
      );
      
      merciContent = merciContent.replace(
        'const closeButtonText = urlParams.get(\'closeButtonText\') || \'Закрыть\';',
        `const closeButtonText = urlParams.get('closeButtonText') || '${closeButtonText.replace(/'/g, "\\'")}';`
      );
      
      zip.file('merci.html', merciContent);

      // Convert sections from object to array if needed
      console.log('🔍 CHECKING ORIGINAL sectionsData before conversion:');
      Object.entries(sectionsData).forEach(([id, section]) => {
        console.log(`Section ${id}:`, section);
        if (section.elements) {
          section.elements.forEach((element, index) => {
            if (element.type === 'bar-chart') {
              console.log(`🎯 BAR-CHART in original sectionsData[${id}].elements[${index}]:`);
              console.log('element.customStyles:', element.customStyles);
              console.log('element.data type:', typeof element.data, 'isArray:', Array.isArray(element.data));
              if (element.data && typeof element.data === 'object' && !Array.isArray(element.data)) {
                console.log('element.data keys:', Object.keys(element.data));
                if (element.data.customStyles) {
                  console.log('🎨 Found customStyles in element.data:', element.data.customStyles);
                }
                if (element.data.data && element.data.data.customStyles) {
                  console.log('🎨 Found customStyles in element.data.data:', element.data.data.customStyles);
                }
              }
            }
          });
        }
      });
      
      const sectionsArray = Object.entries(sectionsData).map(([id, section]) => ({
        ...section,
        id: id,
        title: section.title || '',
        description: section.description || '',
        titleColor: section.titleColor || '#000000',
        descriptionColor: section.descriptionColor || '#666666',
        cards: section.cards || [],
        elements: section.elements || [],
        aiElements: section.aiElements || [],
        contentElements: section.contentElements || []
      }));

      // Prepare data for HTML generation
      const siteData = {
        headerData: {
          ...headerData,
          siteName: headerData.siteName || 'My Site',
          title: headerData.title || headerData.siteName || 'My Site',
          domain: headerData.domain || '',
          description: headerData.description || 'Our site offers the best solutions',
          menuItems: headerData.menuItems || [],
          siteBackgroundImage: headerData.siteBackgroundType === 'image' ? 'assets/images/fon.jpg' : '',
          language: headerData.language || 'ru'
        },
        heroData: {
          ...heroData,
          title: heroData.title || '',
          subtitle: heroData.subtitle || '',
          buttonText: heroData.buttonText || '',
          backgroundImage: heroData.backgroundImage ? 'assets/images/' + heroData.backgroundImage.split('/').pop() : ''
        },
        sectionsData: sectionsArray,
        contactData: {
          ...contactData,
          title: contactData.title || 'Contact',
          description: contactData.description || ''
        },
        footerData: {
          ...footerData,
          title: footerData.title || 'About Us',
          description: footerData.description || '',
          contacts: footerData.contacts || '',
          copyright: footerData.copyright || '© 2024 All rights reserved',
          backgroundColor: footerData.backgroundColor || '#333',
          textColor: footerData.textColor || '#fff'
        },
        legalDocuments: {
          privacyPolicy: {
            title: legalDocuments?.privacyPolicy?.title || '',
            content: (legalDocuments?.privacyPolicy?.content || '').toString()
          },
          termsOfService: {
            title: legalDocuments?.termsOfService?.title || '',
            content: (legalDocuments?.termsOfService?.content || '').toString()
          },
          cookiePolicy: {
            title: legalDocuments?.cookiePolicy?.title || '',
            content: (legalDocuments?.cookiePolicy?.content || '').toString()
          }
        },
        liveChatData: {
          ...liveChatData,
          enabled: liveChatData.enabled || false,
          apiKey: liveChatData.apiKey || '',
          selectedResponses: liveChatData.selectedResponses || '',
          allTranslations: liveChatData.allTranslations || ''
        }
      };

      // 🔥 ИСПРАВЛЕНИЕ: Проверяем siteData после его объявления
      console.log('🔍 [DEBUG] siteData after declaration:', siteData);
      if (!siteData || !siteData.headerData) {
        console.error('❌ [ERROR] siteData or headerData is missing after declaration:', { siteData, headerData: siteData?.headerData });
        throw new Error('Данные сайта не найдены. Пожалуйста, обновите страницу и попробуйте снова.');
      }

      console.log('🚀 handleDownloadSite - siteData:', siteData);
      console.log('🚀 handleDownloadSite - siteData.liveChatData:', siteData.liveChatData);
      
      // Отладка для advanced-area-chart элементов
      console.log('📊 [DEBUG] Checking for advanced-area-chart elements in siteData...');
      siteData.sectionsData.forEach((section, index) => {
        if (section.aiElements && section.aiElements.length > 0) {
          section.aiElements.forEach((element, elemIndex) => {
            if (element.type === 'advanced-area-chart') {
              console.log('📊 Found advanced-area-chart in section ' + index + ', element ' + elemIndex + ':', element);
            }
          });
        }
        if (section.contentElements && section.contentElements.length > 0) {
          section.contentElements.forEach((element, elemIndex) => {
            if (element.type === 'advanced-area-chart') {
              console.log('📊 Found advanced-area-chart in section ' + index + ', contentElement ' + elemIndex + ':', element);
            }
          });
        }
      });

      // Process and add chat operator photo if live chat is enabled
      if (siteData.liveChatData?.enabled) {
        try {
          console.log('🎭 Processing chat operator photo...');
          const response = await fetch('/api/process-chat-photo', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            }
          });
          
          if (response.ok) {
            const photoBlob = await response.blob();
            const originalFile = response.headers.get('X-Original-File');
            const photoSize = response.headers.get('X-Photo-Size');
            
            imagesFolder.file('operator.jpg', photoBlob);
            console.log(`✅ Chat operator photo added to export: ${originalFile} (${photoSize} bytes)`);
          } else {
            console.warn('⚠️ Could not process chat operator photo:', response.status);
          }
        } catch (error) {
          console.error('❌ Error processing chat operator photo:', error);
        }

        // Add chat open sound
        try {
          console.log('🔊 Adding chat open sound...');
          
          // Try to fetch the sound file from different sources
          const possiblePaths = [
            '/api/get-sound-file',  // API endpoint (приоритет)
            '/1.mp3', 
            './1.mp3', 
            './public/1.mp3', 
            '/public/1.mp3'
          ];
          let soundResponse = null;
          let successPath = null;
          
          for (const path of possiblePaths) {
            try {
              console.log('🔄 Trying sound path:', path);
              soundResponse = await fetch(path);
              console.log('📡 Sound response for', path, ':', soundResponse.status, soundResponse.statusText);
              
              if (soundResponse.ok) {
                successPath = path;
                console.log('✅ Found sound file at:', successPath);
                
                // Дополнительная информация для API endpoint
                if (path === '/api/get-sound-file') {
                  const fileSize = soundResponse.headers.get('X-File-Size');
                  console.log('📊 API endpoint info - Size:', fileSize, 'bytes');
                }
                
                break;
              }
            } catch (error) {
              console.log('❌ Error fetching sound from', path, ':', error.message);
            }
          }
          
          if (soundResponse && soundResponse.ok) {
            console.log('✅ Successfully fetched sound file');
            const soundBlob = await soundResponse.blob();
            console.log('📦 Sound blob size:', soundBlob.size, 'bytes');
            const soundBuffer = await soundBlob.arrayBuffer();
            console.log('🔄 Converting to ArrayBuffer, size:', soundBuffer.byteLength, 'bytes');
            
            // Add only OGG format
            assetsFolder.file('chat-open.ogg', soundBuffer);
            
            console.log('✅ Chat open sound added to export as OGG format');
            console.log(`📊 Final sound file size: ${soundBuffer.byteLength} bytes`);
            console.log('📁 File added to assets/: chat-open.ogg');
          } else {
            console.warn('⚠️ Could not load chat sound file from any path');
            console.warn('📝 Tried paths:', possiblePaths);
            console.warn('🔧 Creating instruction file instead');
            
            // Add manual instruction file
            assetsFolder.file('README-SOUND.txt', 
              'ИНСТРУКЦИЯ ПО ДОБАВЛЕНИЮ ЗВУКА ЧАТА\n' +
              '=====================================\n\n' +
              'Звуковой файл не был найден автоматически.\n' +
              'Исходный файл: C:\\Users\\840G5\\Desktop\\НОВЫЙ\\public\\1.mp3\n\n' +
              'Попробованные пути:\n' +
              possiblePaths.map(path => '- ' + path).join('\n') + '\n\n' +
              'ЧТО ДЕЛАТЬ:\n' +
              '1. Найдите файл 1.mp3 в папке public/\n' +
              '2. Конвертируйте MP3 в OGG формат\n' +
              '3. Поместите файл в эту папку (assets/)\n' +
              '4. Переименуйте в chat-open.ogg\n\n' +
              'ОНЛАЙН КОНВЕРТЕРЫ:\n' +
              '- https://convertio.co/mp3-ogg/\n' +
              '- https://online-audio-converter.com/\n' +
              '- https://cloudconvert.com/mp3-to-ogg'
            );
          }
        } catch (error) {
          console.error('❌ Error processing chat sound:', error);
          // Add manual instruction file with error details
          assetsFolder.file('README-SOUND.txt', 
            'ИНСТРУКЦИЯ ПО ДОБАВЛЕНИЮ ЗВУКА ЧАТА (ОШИБКА)\n' +
            '============================================\n\n' +
            'Произошла ошибка при автоматическом добавлении звука:\n' +
            'Ошибка: ' + error.message + '\n\n' +
            'Исходный файл: C:\\Users\\840G5\\Desktop\\НОВЫЙ\\public\\1.mp3\n\n' +
            'ЧТО ДЕЛАТЬ:\n' +
            '1. Найдите файл 1.mp3 в папке public/\n' +
            '2. Конвертируйте MP3 в OGG формат\n' +
            '3. Поместите файл в эту папку (assets/)\n' +
            '4. Переименуйте в chat-open.ogg\n\n' +
            'ОНЛАЙН КОНВЕРТЕРЫ:\n' +
            '- https://convertio.co/mp3-ogg/\n' +
            '- https://online-audio-converter.com/\n' +
            '- https://cloudconvert.com/mp3-to-ogg\n\n' +
            'ТЕХНИЧЕСКАЯ ИНФОРМАЦИЯ:\n' +
            'Время ошибки: ' + new Date().toISOString() + '\n' +
            'User Agent: ' + (typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown')
          );
        }
      }

      // Выбираем способ генерации в зависимости от режима
      console.log('🔧🔧🔧 MODE CHECK: currentConstructorMode =', currentConstructorMode);
      if (currentConstructorMode) {
        // Режим конструктора - генерируем одностраничный сайт
        console.log('🏗️🏗️🏗️ USING SINGLE PAGE MODE (Constructor mode) 🏗️🏗️🏗️');
        const htmlContent = generateHTML(siteData);
        zip.file('index.html', htmlContent);
      } else {
        // Ручной режим - генерируем многостраничный сайт
        console.log('📄📄📄 USING MULTI-PAGE MODE (Manual mode) 📄📄📄');
        
        // СНАЧАЛА экспортируем изображения карточек, чтобы создать маппинг
        console.log('🔥EXPORT🔥 Pre-exporting card images for HTML generation...');
        await exportCardImagesForHTML();
        
        // Генерируем главную страницу
        const indexContent = generateMultiPageIndex(siteData);
        const indexFileName = getIndexFileName();
        zip.file(indexFileName, indexContent);
        
        // Генерируем страницы для каждой секции
        console.log('📄 Processing sections for multi-page site...');
        console.log('📄 siteData.sectionsData:', siteData.sectionsData);
        siteData.sectionsData.forEach((sectionData) => {
          console.log('📄 Processing section:', sectionData.id, sectionData);
          const fileName = getSectionFileNameSafe(sectionData.id, sectionData);
          if (fileName) {
            console.log('📄 Generating page for section:', sectionData.id, 'file:', fileName);
            const pageContent = generateMultiPageSection(siteData, sectionData.id, sectionData);
            zip.file(`${fileName}.html`, pageContent);
          }
        });
        
        // Генерируем страницу контактов
        if (siteData.contactData) {
          const contactContent = generateMultiPageContact(siteData);
          const contactFileName = getContactFileNameSafe(siteData.contactData);
          zip.file(`${contactFileName}.html`, contactContent);
        }
        
        // Генерируем правовые документы
        if (siteData.legalDocuments) {
          if (siteData.legalDocuments.privacyPolicy?.content) {
            const legalContent = generateMultiPageLegal(siteData, 'privacyPolicy');
            zip.file('privacy-policy.html', legalContent);
          }
          if (siteData.legalDocuments.termsOfService?.content) {
            const legalContent = generateMultiPageLegal(siteData, 'termsOfService');
            zip.file('terms-of-service.html', legalContent);
          }
          if (siteData.legalDocuments.cookiePolicy?.content) {
            const legalContent = generateMultiPageLegal(siteData, 'cookiePolicy');
            zip.file('cookie-policy.html', legalContent);
          }
        }
        
        // Добавляем обновленную карту сайта для многостраничного формата
        const sitemapContent = generateMultiPageSitemap(siteData);
        zip.file('sitemap.xml', sitemapContent);
      }

      // Add CSS file (передаем headerData для многостраничного режима)
      const cssContent = generateCSS(siteData.headerData);
      cssFolder.file('styles.css', cssContent);
      
      // Add JS file
      const jsContent = generateJS();
      jsFolder.file('script.js', jsContent);

      // Add legal documents
      const legalDocs = [
        {
          id: 'privacy-policy',
          title: siteData.legalDocuments.privacyPolicy.title,
          content: siteData.legalDocuments.privacyPolicy.content
        },
        {
          id: 'terms-of-service',
          title: siteData.legalDocuments.termsOfService.title,
          content: siteData.legalDocuments.termsOfService.content
        },
        {
          id: 'cookie-policy',
          title: siteData.legalDocuments.cookiePolicy.title,
          content: siteData.legalDocuments.cookiePolicy.content
        }
      ];

      legalDocs.forEach(doc => {
        // Обработка контента: первая строка будет отцентрирована и выделена
        const contentLines = doc.content.split('\n');
        const firstLine = contentLines[0] ? `<h1>${contentLines[0]}</h1>` : '';
        const remainingContent = contentLines.slice(1).join('\n');
        
        // Улучшенная обработка текста для выделения заголовков разделов и форматирования
        let processedContent = firstLine;
        
        // Шаблоны для определения заголовков разделов
        const sectionHeaderPattern = /^\d+\.\s+(.+)/;  // Для формата: "1. Раздел"
        const sectionHeaderPattern2 = /^([IVX]+)\.\s+(.+)/; // Для римских цифр: "I. Раздел"
        const sectionHeaderPattern3 = /^([А-ЯA-Z][\wа-яА-Я\s]{2,}):$/; // Для ЗАГОЛОВКОВ ПРОПИСНЫМИ
        
        // Разбиваем текст на абзацы
        const paragraphs = remainingContent.split('\n');
        
        // Обрабатываем каждый абзац
        paragraphs.forEach(paragraph => {
          paragraph = paragraph.trim();
          
          if (!paragraph) {
            // Пустые строки превращаем в разделители
            processedContent += '<br>';
            return;
          }
          
          // Проверяем, является ли строка заголовком раздела
          const match1 = paragraph.match(sectionHeaderPattern);
          const match2 = paragraph.match(sectionHeaderPattern2);
          const match3 = paragraph.match(sectionHeaderPattern3);
          
          if (match1) {
            // Формат "1. Заголовок"
            processedContent += `<h2>${paragraph}</h2>`;
          } else if (match2) {
            // Формат "I. Заголовок"
            processedContent += `<h2>${paragraph}</h2>`;
          } else if (match3) {
            // Формат "ЗАГОЛОВОК:"
            processedContent += `<h2>${paragraph}</h2>`;
          } else if (/^\d+\.\d+\./.test(paragraph)) {
            // Подразделы вида "1.1. Подраздел"
            processedContent += `<h3>${paragraph}</h3>`;
          } else if (paragraph.startsWith('•') || paragraph.startsWith('-') || paragraph.startsWith('*')) {
            // Маркированные списки
            if (!processedContent.endsWith('</ul>') && !processedContent.endsWith('<ul>')) {
              processedContent += '<ul>';
            }
            processedContent += `<li>${paragraph.substring(1).trim()}</li>`;
            
            // Проверяем, нужно ли закрыть список
            if (paragraphs.indexOf(paragraph) === paragraphs.length - 1 || 
                !paragraphs[paragraphs.indexOf(paragraph) + 1].startsWith('•') &&
                !paragraphs[paragraphs.indexOf(paragraph) + 1].startsWith('-') &&
                !paragraphs[paragraphs.indexOf(paragraph) + 1].startsWith('*')) {
              processedContent += '</ul>';
            }
          } else {
            // Обычные параграфы
            if (paragraph.length > 0) {
              // Выделяем важные термины жирным
              paragraph = paragraph
                .replace(/«([^»]+)»/g, '«<strong>$1</strong>»')
                .replace(/"([^"]+)"/g, '"<strong>$1</strong>"');
                
              processedContent += `<p>${paragraph}</p>`;
            }
          }
        });
        
        // Дополнительная обработка для улучшения читабельности
        processedContent = processedContent
          .replace(/(\d+\.\d+\.\d+\.)/g, '<strong>$1</strong>') // Выделяем номера подразделов
          .replace(/([А-ЯA-Z]{2,})/g, '<strong>$1</strong>') // Выделяем слова ПРОПИСНЫМИ
          .replace(/(ФЗ [№"]\d+[^<]*?[»"])/g, '<strong>$1</strong>') // Выделяем упоминания законов
          .replace(/([0-9]+\s*(?:января|февраля|марта|апреля|мая|июня|июля|августа|сентября|октября|ноября|декабря)\s*[0-9]{4})/gi, '<em>$1</em>'); // Выделяем даты

        const htmlContent = `
<!DOCTYPE html>
<html lang="${siteData.headerData.language || 'ru'}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${doc.title}</title>
    <style>
        body {
            font-family: 'Roboto', Arial, sans-serif;
            line-height: 1.8;
            max-width: 1000px;
            margin: 0 auto;
            padding: 20px;
            font-size: 18px;
            color: #333;
            background-color: #f9f9f9;
        }
        h1 {
            text-align: center;
            color: #333;
            font-size: 32px;
            font-weight: bold;
            margin-bottom: 30px;
            padding-bottom: 15px;
            border-bottom: 1px solid #eaeaea;
        }
        h2 {
            color: #333;
            font-size: 26px;
            font-weight: 600;
            margin-top: 30px;
            margin-bottom: 20px;
        }
        h3 {
            color: #444;
            font-size: 22px;
                  font-weight: 500;
            margin-top: 25px;
            margin-bottom: 15px;
        }
        .content {
            background-color: #fff;
            padding: 40px;
            border-radius: 10px;
            box-shadow: 0 2px 15px rgba(0,0,0,0.05);
            text-align: left;
        }
        p {
            margin-bottom: 20px;
            text-align: left;
            font-size: 18px;
            line-height: 1.8;
        }
        ul, ol {
            margin-bottom: 20px;
            padding-left: 25px;
        }
        li {
            margin-bottom: 10px;
            font-size: 18px;
        }
        strong {
            font-weight: 600;
        }
        .date {
            text-align: right;
            margin-top: 30px;
            color: #666;
            font-style: italic;
        }
        .contact-info {
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin-top: 40px;
            border-left: 4px solid #4285f4;
        }
        @media (max-width: 768px) {
            body {
                padding: 15px;
                font-size: 16px;
            }
            .content {
                padding: 25px;
            }
            h1 {
                font-size: 28px;
            }
            h2 {
                font-size: 22px;
            }
            h3 {
                font-size: 18px;
            }
            p, li {
                font-size: 16px;
            }
        }
    </style>
</head>
<body>
    <div class="content">
        ${processedContent}
        <div class="date">${new Date().toLocaleDateString('ru-RU')}</div>
    </div>
</body>
</html>`;

        zip.file(`${doc.id}.html`, htmlContent);
      });

      // Add robots.txt to the archive (unchanged from root directory)
      try {
        const robotsResponse = await fetch('/robots.txt');
        const robotsContent = await robotsResponse.text();
        zip.file('robots.txt', robotsContent);
        console.log('robots.txt successfully added to zip');
      } catch (error) {
        console.warn('Could not fetch robots.txt, using default content');
        zip.file('robots.txt', 'User-agent: *\nDisallow:');
      }

      // Add sitemap.xml to the archive (dynamically generated with domain from settings)
      try {
        const sitemapContent = generateSitemap(siteData);
        zip.file('sitemap.xml', sitemapContent);
        console.log('sitemap.xml successfully added to zip with domain:', siteData.headerData.domain);
      } catch (error) {
        console.error('Error generating sitemap.xml:', error);
      }

      // Add update-sitemap.php to site root
      try {
        const updateSitemapResponse = await fetch('/assets/js/update-sitemap.php');
        const updateSitemapContent = await updateSitemapResponse.text();
        zip.file('update-sitemap.php', updateSitemapContent);
        console.log('update-sitemap.php successfully added to site root');
      } catch (error) {
        console.warn('Could not fetch update-sitemap.php, using default content');
        // Fallback content if file is not found
        const defaultContent = `<?php
/**
 * Автоматическое обновление домена в sitemap.xml
 * Запустите этот скрипт один раз после размещения сайта на новом домене
 */

// Определяем текущий домен
$protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https://' : 'http://';
$currentDomain = $protocol . $_SERVER['HTTP_HOST'];

// Путь к файлу sitemap.xml
$sitemapFile = 'sitemap.xml';

// Проверяем, существует ли файл
if (!file_exists($sitemapFile)) {
    die("❌ Файл sitemap.xml не найден!");
}

// Читаем содержимое файла
$sitemapContent = file_get_contents($sitemapFile);

if ($sitemapContent === false) {
    die("❌ Не удалось прочитать файл sitemap.xml!");
}

// Заменяем все вхождения example.com на текущий домен
$updatedContent = str_replace('https://example.com', $currentDomain, $sitemapContent);
$updatedContent = str_replace('http://example.com', $currentDomain, $updatedContent);

// Обновляем дату последнего изменения на текущую
$currentDate = date('c');
$updatedContent = preg_replace(
    '/<lastmod>.*?<\\/lastmod>/',
    '<lastmod>' . $currentDate . '</lastmod>',
    $updatedContent
);

// Сохраняем обновленный файл
if (file_put_contents($sitemapFile, $updatedContent) !== false) {
    echo "✅ <strong>Успешно!</strong><br>";
    echo "📍 Домен обновлен на: <strong>" . htmlspecialchars($currentDomain) . "</strong><br>";
    echo "📅 Дата обновления: " . date('d.m.Y H:i:s') . "<br><br>";
    echo "🎯 <strong>Что дальше:</strong><br>";
    echo "1. Удалите этот файл (update-sitemap.php) с сервера<br>";
    echo "2. Загрузите обновленный sitemap.xml в Google Search Console<br>";
    echo "3. Проверьте работоспособность всех страниц<br>";
} else {
    echo "❌ Ошибка при сохранении файла sitemap.xml!";
}
?>`;
        zip.file('update-sitemap.php', defaultContent);
      }

      // Get hero image from cache
      if (heroData.backgroundImage) {
        try {
          const imageMetadata = JSON.parse(localStorage.getItem('heroImageMetadata') || '{}');
          if (imageMetadata.filename) {
            const blob = await imageCacheService.getImage(imageMetadata.filename);
            if (blob) {
              imagesFolder.file(imageMetadata.filename, blob);
              console.log('Hero image successfully added to zip from cache');
            } else {
              console.warn('Hero image not found in cache');
            }
          }
        } catch (error) {
          console.error('Error getting hero image from cache:', error);
        }
      }

      // Get about image from cache
      try {
        const aboutImageMetadata = JSON.parse(localStorage.getItem('aboutImageMetadata') || '{}');
        // Также проверим наличие метаданных для About.jpg с большой буквы (возможно осталось от предыдущей версии)
        const aboutImageMetadataOld = JSON.parse(localStorage.getItem('AboutImageMetadata') || '{}');
        
        // Пробуем сначала найти изображение с маленькой буквы
        if (aboutImageMetadata.filename) {
          const blob = await imageCacheService.getImage(aboutImageMetadata.filename);
          if (blob) {
            // Всегда сохраняем с именем about.jpg с маленькой буквы
            imagesFolder.file('about.jpg', blob);
            console.log('About image successfully added to zip from cache');
          } else {
            console.warn('About image (lowercase) not found in cache');
          }
        } 
        // Если не нашли с маленькой буквы, проверяем с большой буквы
        else if (aboutImageMetadataOld.filename) {
          const blob = await imageCacheService.getImage(aboutImageMetadataOld.filename);
          if (blob) {
            // Всё равно сохраняем с именем about.jpg с маленькой буквы
            imagesFolder.file('about.jpg', blob);
            console.log('About image (uppercase) converted to lowercase and added to zip');
          } else {
            console.warn('About image (uppercase) not found in cache');
          }
        }
      } catch (error) {
        console.error('Error getting about image from cache:', error);
      }

      // Get section images from cache
      try {
        // Перебираем все пункты меню (секции)
        for (const item of headerData.menuItems) {
          const sectionId = item.id;
          const metadataKey = `section_${sectionId}_ImageMetadata`;
          console.log(`Проверка метаданных для секции ${sectionId}, ключ: ${metadataKey}`);
          
          try {
            const sectionImageMetadata = JSON.parse(localStorage.getItem(metadataKey) || '{}');
            console.log(`Метаданные для секции ${sectionId}:`, sectionImageMetadata);
            
            if (sectionImageMetadata.filename) {
              // Проверяем есть ли файл в кеше
              const blob = await imageCacheService.getImage(sectionImageMetadata.filename);
              
              if (blob) {
                console.log(`Изображение для секции ${sectionId} найдено в кеше:`, sectionImageMetadata.filename);
                imagesFolder.file(sectionImageMetadata.filename, blob);
                console.log(`Section ${sectionId} image successfully added to zip from cache`);
              } else {
                console.warn(`Изображение для секции ${sectionId} не найдено в кеше:`, sectionImageMetadata.filename);
                
                // Пытаемся загрузить изображение по URL
                if (sectionImageMetadata.originalPath) {
                  try {
                    const response = await fetch(sectionImageMetadata.originalPath);
                    if (response.ok) {
                      const blob = await response.blob();
                      imagesFolder.file(sectionImageMetadata.filename, blob);
                      console.log(`Section ${sectionId} image successfully fetched from URL and added to zip`);
                    }
                  } catch (fetchError) {
                    console.error(`Ошибка при загрузке изображения для секции ${sectionId}:`, fetchError);
                  }
                }
              }
            } else {
              console.warn(`Нет метаданных изображения для секции ${sectionId}`);
            }
          } catch (parseError) {
            console.error(`Ошибка при разборе метаданных для секции ${sectionId}:`, parseError);
          }
        }
      } catch (error) {
        console.error('Error getting section images from cache:', error);
      }

      // Get advantages image from cache
      try {
        const advantagesImageMetadata = JSON.parse(localStorage.getItem('advantagesImageMetadata') || '{}');
        if (advantagesImageMetadata.filename) {
          const blob = await imageCacheService.getImage(advantagesImageMetadata.filename);
          if (blob) {
            imagesFolder.file(advantagesImageMetadata.filename, blob);
            console.log('Advantages image successfully added to zip from cache');
          } else {
            console.warn('Advantages image not found in cache');
          }
        }
      } catch (error) {
        console.error('Error getting advantages image from cache:', error);
      }

      // Get site background image from cache
      try {
        const siteBackgroundMetadata = JSON.parse(localStorage.getItem('siteBackgroundMetadata') || '{}');
        if (siteBackgroundMetadata.filename) {
          const blob = await imageCacheService.getImage(siteBackgroundMetadata.filename);
          if (blob) {
            imagesFolder.file(siteBackgroundMetadata.filename, blob);
            console.log('Site background image successfully added to zip from cache');
          } else {
            console.warn('Site background image not found in cache');
          }
        }
      } catch (error) {
        console.error('Error getting site background image from cache:', error);
      }

      // 🔥 НОВОЕ: Get all metadata keys from IndexedDB instead of localStorage
      console.log('🔥EXPORT🔥 Getting all metadata keys from IndexedDB...');
      const allKeys = await imageCacheService.getAllMetadataKeys();
      console.log(`🔥EXPORT🔥 Total metadata keys from IndexedDB: ${allKeys.length}`);

      // Export gallery images
      console.log('🖼️ [handleDownloadSite] Начинаем экспорт изображений галереи');
      try {
        const sectionsData = siteData.sectionsData || {};
        const processedImages = new Set();
        
        // Отладочная информация о кеше
        console.log('🖼️ [handleDownloadSite] Проверяем содержимое localStorage:');
        const imageKeys = allKeys.filter(key => key.includes('image') || key.includes('gallery'));
        console.log('🖼️ [handleDownloadSite] Ключи с изображениями:', imageKeys);
        imageKeys.forEach(key => {
          try {
            const value = localStorage.getItem(key);
            console.log(`🖼️ [handleDownloadSite] ${key}:`, value);
          } catch (e) {
            console.log(`🖼️ [handleDownloadSite] Ошибка чтения ${key}:`, e);
          }
        });
        
        console.log('🖼️ [handleDownloadSite] sectionsData:', sectionsData);
        
        // Проходим по всем секциям
        for (const section of sectionsData) {
          const sectionId = section.id;
          console.log(`🖼️ [handleDownloadSite] Обрабатываем секцию: ${sectionId}`);
          const elements = section.elements || [];
          console.log(`🖼️ [handleDownloadSite] Элементы в секции ${sectionId}:`, elements);
          
          // Ищем элементы image-gallery
          for (const element of elements) {
            if (element.type === 'image-gallery') {
              console.log(`🔥 НАЙДЕН ЭЛЕМЕНТ ГАЛЕРЕИ:`, element);
              console.log(`🔥 element.title:`, element.title);
              console.log(`🔥 element.description:`, element.description);
              console.log(`🔥 element.colorSettings:`, element.colorSettings);
              console.log(`🔥 element.data:`, element.data);
              console.log(`🔥 element.data?.title:`, element.data?.title);
              console.log(`🔥 element.data?.description:`, element.data?.description);
              console.log(`🔥 element.data?.colorSettings:`, element.data?.colorSettings);
              const elementData = element.data || element;
              console.log(`🔥 elementData:`, elementData);
              const images = elementData.images || element.images || [];
              console.log(`🔥 Изображения в галерее:`, images);
              console.log(`🔥 Количество изображений: ${images.length}`);
              
              // Поскольку изображения не сохраняются в состоянии элемента, ищем их в кеше
              console.log(`🖼️ [handleDownloadSite] Ищем изображения галереи в кеше для элемента ${element.id}`);
              
              // Получаем sectionId из элемента или его данных
              const elementSectionId = elementData.sectionId || element.sectionId || sectionId;
              console.log(`🖼️ [handleDownloadSite] sectionId элемента: ${elementSectionId}`);
              
              // Также проверяем все возможные варианты sectionId
              const possibleSectionIds = [
                elementSectionId,
                elementData.id,
                element.id,
                sectionId,
                // Добавляем поиск по новому формату sectionId
                elementData.sectionId,
                // Добавляем поиск по sectionId из editData
                elementData.data?.sectionId,
                elementData.sectionId
              ].filter(Boolean);
              console.log(`🖼️ [handleDownloadSite] Возможные sectionId:`, possibleSectionIds);
              console.log(`🖼️ [handleDownloadSite] elementSectionId: "${elementSectionId}"`);
              console.log(`🖼️ [handleDownloadSite] elementData.id: "${elementData.id}"`);
              console.log(`🖼️ [handleDownloadSite] element.id: "${element.id}"`);
              console.log(`🖼️ [handleDownloadSite] sectionId: "${sectionId}"`);
              console.log(`🖼️ [handleDownloadSite] elementData.title: "${elementData.title}"`);
              console.log(`🖼️ [handleDownloadSite] element.title: "${element.title}"`);
              console.log(`🖼️ [handleDownloadSite] elementData.sectionId: "${elementData.sectionId}"`);
              console.log(`🖼️ [handleDownloadSite] elementData.data?.sectionId: "${elementData.data?.sectionId}"`);
              
              const allKeys = Object.keys(localStorage);
              console.log(`🖼️ [handleDownloadSite] Все ключи localStorage:`, allKeys.filter(key => key.startsWith('gallery-image-')));
              console.log(`🖼️ [handleDownloadSite] Все ключи localStorage (полный список):`, allKeys);
              
              const galleryKeys = allKeys.filter(key => {
                if (!key.startsWith('gallery-image-')) return false;
                
                try {
                  const metadata = JSON.parse(localStorage.getItem(key));
                  console.log(`🖼️ [handleDownloadSite] Метаданные для ${key}:`, metadata);
                  
                  // Проверяем, что изображение принадлежит этому элементу галереи
                  let matches = metadata && possibleSectionIds.includes(metadata.sectionId);
                  
                  // Если точное совпадение не найдено, пробуем частичное совпадение sectionId
                  if (!matches && metadata && metadata.sectionId) {
                    matches = possibleSectionIds.some(id => 
                      metadata.sectionId.includes(id) || id.includes(metadata.sectionId)
                    );
                  }
                  
                  // Если sectionId не совпадает, пробуем по galleryName
                  if (!matches && metadata && metadata.galleryName) {
                    const elementTitle = elementData.title || element.title || '';
                    // Нормализуем названия для сравнения (убираем пробелы, приводим к нижнему регистру)
                    const normalizedGalleryName = metadata.galleryName.toLowerCase().replace(/\s+/g, ' ').trim();
                    const normalizedElementTitle = elementTitle.toLowerCase().replace(/\s+/g, ' ').trim();
                    
                    matches = normalizedGalleryName === normalizedElementTitle || 
                             normalizedGalleryName.includes(normalizedElementTitle) || 
                             normalizedElementTitle.includes(normalizedGalleryName) ||
                             // Проверяем первые 50 символов
                             normalizedGalleryName.substring(0, 50) === normalizedElementTitle.substring(0, 50);
                  }
                  
                  console.log(`🖼️ [handleDownloadSite] ${key} соответствует элементу: ${matches} (sectionId: ${metadata?.sectionId}, galleryName: ${metadata?.galleryName})`);
                  return matches;
                } catch (e) {
                  console.warn(`🖼️ [handleDownloadSite] Ошибка парсинга метаданных для ${key}:`, e);
                  return false;
                }
              });
              console.log(`🖼️ [handleDownloadSite] Найденные ключи галереи для элемента ${element.id}:`, galleryKeys);
              
              // Выводим подробную информацию о каждом найденном ключе
              galleryKeys.forEach((key, index) => {
                try {
                  const metadata = JSON.parse(localStorage.getItem(key));
                  console.log(`🖼️ [handleDownloadSite] Ключ ${index + 1}: ${key}`);
                  console.log(`🖼️ [handleDownloadSite] Метаданные:`, metadata);
                } catch (e) {
                  console.warn(`🖼️ [handleDownloadSite] Ошибка парсинга для ${key}:`, e);
                }
              });
              
              // Обрабатываем каждое изображение из кеша
              console.log(`🖼️ [handleDownloadSite] Начинаем обработку ${galleryKeys.length} изображений`);
              for (let i = 0; i < galleryKeys.length; i++) {
                const galleryKey = galleryKeys[i];
                console.log(`🖼️ [handleDownloadSite] Обрабатываем изображение ${i + 1}/${galleryKeys.length}: ${galleryKey}`);
                
                try {
                  const metadata = JSON.parse(localStorage.getItem(galleryKey));
                  console.log(`🖼️ [handleDownloadSite] Метаданные для ${galleryKey}:`, metadata);
                  
                  // Дополнительная проверка, что изображение принадлежит этому элементу
                  let belongsToElement = metadata && possibleSectionIds.includes(metadata.sectionId);
                  
                  // Если точное совпадение не найдено, пробуем частичное совпадение sectionId
                  if (!belongsToElement && metadata && metadata.sectionId) {
                    belongsToElement = possibleSectionIds.some(id => 
                      metadata.sectionId.includes(id) || id.includes(metadata.sectionId)
                    );
                  }
                  
                  // Если sectionId не совпадает, пробуем по galleryName
                  if (!belongsToElement && metadata && metadata.galleryName) {
                    const elementTitle = elementData.title || element.title || '';
                    // Нормализуем названия для сравнения (убираем пробелы, приводим к нижнему регистру)
                    const normalizedGalleryName = metadata.galleryName.toLowerCase().replace(/\s+/g, ' ').trim();
                    const normalizedElementTitle = elementTitle.toLowerCase().replace(/\s+/g, ' ').trim();
                    
                    belongsToElement = normalizedGalleryName === normalizedElementTitle || 
                                     normalizedGalleryName.includes(normalizedElementTitle) || 
                                     normalizedElementTitle.includes(normalizedGalleryName) ||
                                     // Проверяем первые 50 символов
                                     normalizedGalleryName.substring(0, 50) === normalizedElementTitle.substring(0, 50);
                  }
                  
                  if (metadata && !belongsToElement) {
                    console.log(`🖼️ [handleDownloadSite] Пропускаем ${galleryKey} - не принадлежит элементу ${element.id} (sectionId: ${metadata.sectionId}, galleryName: ${metadata.galleryName})`);
                    continue;
                  }
                  
                  if (metadata && metadata.fileName) {
                    const imageBlob = await imageCacheService.getImage(metadata.fileName);
                    console.log(`🖼️ [handleDownloadSite] Результат getImage(${metadata.fileName}):`, imageBlob);
                    
                    if (imageBlob) {
                      // Создаем объект изображения для генерации имени файла
                      const imageObject = {
                        fileName: metadata.fileName,
                        originalName: metadata.originalName || '',
                        alt: metadata.originalName || `Изображение ${i + 1}`,
                        title: metadata.originalName || `Изображение ${i + 1}`,
                        key: galleryKey
                      };
                      
                      // Генерируем английское имя файла
                      const englishFileName = generateGalleryImageFileName(imageObject, i, sectionId);
                      console.log(`🖼️ [handleDownloadSite] Генерируем имя файла: ${englishFileName}`);
                      
                      // Добавляем изображение в архив
                      imagesFolder.file(englishFileName, imageBlob);
                      console.log(`🖼️ [handleDownloadSite] Файл добавлен в архив: ${englishFileName}`);
                      
                      processedImages.add(metadata.fileName);
                      console.log(`✅ Экспортировано изображение галереи: ${englishFileName}`);
                    } else {
                      console.warn(`⚠️ [handleDownloadSite] Blob не найден для ${metadata.fileName}`);
                    }
                  } else {
                    console.warn(`⚠️ [handleDownloadSite] Нет метаданных для ${galleryKey}`);
                  }
                } catch (error) {
                  console.warn(`⚠️ Не удалось экспортировать изображение галереи ${i}:`, error);
                }
              }
            }
          }
        }
        
        console.log(`🖼️ [handleDownloadSite] Экспорт завершен. Обработано изображений: ${processedImages.size}`);
      } catch (error) {
        console.error('Error exporting gallery images:', error);
      }

      // Export card images (only latest for each card)
      console.log('🔥EXPORT🔥 Starting card images export...');
      try {
        // Ищем все возможные ключи изображений
        const cardImageKeys = allKeys.filter(key => key.startsWith('card-image-metadata-'));
        const allImageKeys = allKeys.filter(key => key.includes('image') || key.includes('card'));
        const siteImageKeys = allKeys.filter(key => key.startsWith('site-images-metadata-'));
        // NEW: keys saved by ImageCard.jsx like card_<cardId>_<sectionId>_ImageMetadata
        const newStyleCardKeys = allKeys.filter(key => key.startsWith('card_') && key.endsWith('_ImageMetadata'));
        
        console.log(`🔥EXPORT🔥 Found ${cardImageKeys.length} card image keys:`, cardImageKeys);
        console.log(`🔥EXPORT🔥 Found ${allImageKeys.length} ALL image-related keys:`, allImageKeys.slice(0, 20));
        console.log(`🔥EXPORT🔥 Found ${siteImageKeys.length} site image keys:`, siteImageKeys.slice(0, 10));
        console.log(`🔥EXPORT🔥 Found ${newStyleCardKeys.length} NEW-STYLE card metadata keys:`, newStyleCardKeys.slice(0, 10));
        
        // Сначала получаем список всех актуальных карточек на сайте
        console.log('🔥EXPORT🔥 Getting current cards from site...');
        const currentCardIds = new Set();
        
        // Проходим по всем секциям и собираем ID актуальных карточек
        console.log(`🔥EXPORT🔥 siteData.sectionsData structure:`, siteData.sectionsData);
        
        // Проверяем два формата данных: объект с ключами и массив
        if (Array.isArray(siteData.sectionsData)) {
          // Если это массив
          siteData.sectionsData.forEach((sectionData, index) => {
            const sectionId = sectionData.id || index;
            console.log(`🔥EXPORT🔥 Checking section ${sectionId} (array format) for cards...`);
            console.log(`🔥EXPORT🔥 Section data:`, sectionData);
            
            // Проверяем все возможные места, где могут быть карточки
            [sectionData.elements, sectionData.contentElements, sectionData.cards].forEach((elements, elemIndex) => {
              if (elements) {
                console.log(`🔥EXPORT🔥 Found ${elements.length} elements in group ${elemIndex}:`, elements);
                elements.forEach(element => {
                  if ((element.type === 'image-card' || element.type === 'card') && element.id) {
                    const uniqueKey = `${element.id}__SECTION__${sectionId}`;
                    currentCardIds.add(uniqueKey);
                    console.log(`🔥EXPORT🔥 Found current card (array): ${uniqueKey}`);
                    
                    // Проверяем, есть ли изображение прямо в данных карточки
                    if (element.imageUrl || element.image) {
                      console.log(`🔥EXPORT🔥 Card has direct image: imageUrl=${element.imageUrl}, image=${element.image}`);
                      
                      // Если это blob URL, пытаемся найти соответствующий файл
                      if (element.imageUrl && element.imageUrl.startsWith('blob:')) {
                        console.log(`🔥EXPORT🔥 Card has blob image, fileName=${element.fileName}`);
                      }
                    }
                  }
                });
              }
            });
          });
        } else {
          // Если это объект
          Object.entries(siteData.sectionsData || {}).forEach(([sectionId, sectionData]) => {
            console.log(`🔥EXPORT🔥 Checking section ${sectionId} (object format) for cards...`);
            console.log(`🔥EXPORT🔥 Section data:`, sectionData);
            
            // Проверяем все возможные места, где могут быть карточки
            [sectionData.elements, sectionData.contentElements, sectionData.cards].forEach((elements, elemIndex) => {
              if (elements) {
                console.log(`🔥EXPORT🔥 Found ${elements.length} elements in group ${elemIndex}:`, elements);
                elements.forEach(element => {
                  if ((element.type === 'image-card' || element.type === 'card') && element.id) {
                    const uniqueKey = `${element.id}__SECTION__${sectionId}`;
                    currentCardIds.add(uniqueKey);
                    console.log(`🔥EXPORT🔥 Found current card (object): ${uniqueKey}`);
                    
                    // Проверяем, есть ли изображение прямо в данных карточки
                    if (element.imageUrl || element.image) {
                      console.log(`🔥EXPORT🔥 Card has direct image: imageUrl=${element.imageUrl}, image=${element.image}`);
                      
                      // Если это blob URL, пытаемся найти соответствующий файл
                      if (element.imageUrl && element.imageUrl.startsWith('blob:')) {
                        console.log(`🔥EXPORT🔥 Card has blob image, fileName=${element.fileName}`);
                      }
                    }
                  }
                });
              }
            });
          });
        }
        
        console.log(`🔥EXPORT🔥 Found ${currentCardIds.size} current cards on site:`, Array.from(currentCardIds));

        // Теперь очищаем "призрачные" метаданные (метаданные без blob'ов) и устаревшие карточки
        console.log('🔥EXPORT🔥 Cleaning phantom and obsolete metadata...');
        const phantomKeys = [];
        const obsoleteKeys = [];
        
        for (const key of cardImageKeys) {
          try {
            const metadata = await imageCacheService.getMetadata(key);
            if (metadata && metadata.fileName) {
              const cardId = metadata.cardId;
              const sectionId = metadata.sectionId || 'default-section';
              const uniqueKey = `${cardId}__SECTION__${sectionId}`;
              
              // Проверяем, существует ли эта карточка на сайте
              if (!currentCardIds.has(uniqueKey)) {
                obsoleteKeys.push(key);
                // Удаляем blob
                try {
                  await imageCacheService.deleteImage(metadata.fileName);
                  console.log(`🔥EXPORT🔥 Removed obsolete blob: ${metadata.fileName}`);
                } catch (e) {
                  console.warn(`🔥EXPORT🔥 Could not remove blob: ${metadata.fileName}`);
                }
                // Удаляем метаданные
                await imageCacheService.deleteMetadata(key);
                console.log(`🔥EXPORT🔥 Removed OBSOLETE metadata for non-existent card: ${key} (uniqueKey: ${uniqueKey})`);
                continue;
              }
              
              // Проверяем, есть ли blob
              const blob = await imageCacheService.getImage(metadata.fileName);
              if (!blob) {
                phantomKeys.push(key);
                await imageCacheService.deleteMetadata(key);
                console.log(`🔥EXPORT🔥 Removed phantom metadata: ${key}`);
              }
            }
          } catch (error) {
            phantomKeys.push(key);
            await imageCacheService.deleteMetadata(key);
            console.log(`🔥EXPORT🔥 Removed corrupted metadata: ${key}`);
          }
        }
        
        // Получаем обновленный список ключей после очистки
        const cleanCardImageKeys = allKeys.filter(key => 
          key.startsWith('card-image-metadata-') && 
          !phantomKeys.includes(key) &&
          !obsoleteKeys.includes(key)
        );
        
        console.log(`🔥EXPORT🔥 After cleanup: ${cleanCardImageKeys.length} valid keys (removed ${phantomKeys.length} phantom keys, ${obsoleteKeys.length} obsolete keys)`);
        
        // Group images by cardId+sectionId combination and keep only the latest one
        const cardImagesMap = new Map();
        
        for (const key of cleanCardImageKeys) {
          try {
            const metadata = await imageCacheService.getMetadata(key);
            const cardId = metadata.cardId;
            const sectionId = metadata.sectionId || 'unknown-section';
            // Создаем уникальный ключ: cardId + sectionId
            const uniqueCardKey = `${cardId}__SECTION__${sectionId}`;
            const uploadDate = new Date(metadata.uploadDate);
            
            console.log(`🔥EXPORT🔥 Found image for unique card ${uniqueCardKey}:`);
            console.log(`  - fileName: ${metadata.fileName}`);
            console.log(`  - uploadDate: ${metadata.uploadDate}`);
            console.log(`  - cardTitle: ${metadata.cardTitle}`);
            console.log(`  - sectionId: ${metadata.sectionId}`);
            console.log(`  - sectionTitle: ${metadata.sectionTitle}`);
            console.log(`  - FULL cardId: "${cardId}"`);
            console.log(`  - uniqueCardKey: "${uniqueCardKey}"`);
            
            if (!cardImagesMap.has(uniqueCardKey) || uploadDate > cardImagesMap.get(uniqueCardKey).uploadDate) {
              cardImagesMap.set(uniqueCardKey, {
                key: key,
                metadata: metadata,
                uploadDate: uploadDate,
                cardId: cardId,
                sectionId: sectionId
              });
              console.log(`🔥EXPORT🔥 Updated LATEST image for unique card ${uniqueCardKey}: ${metadata.fileName} (${metadata.uploadDate})`);
            } else {
              console.log(`🔥EXPORT🔥 Skipping OLDER image for unique card ${uniqueCardKey}: ${metadata.fileName} (${metadata.uploadDate})`);
            }
          } catch (error) {
            console.error(`🔥EXPORT🔥 Error parsing metadata for ${key}:`, error);
          }
        }

        // NEW: also consider NEW-STYLE card metadata keys
        for (const key of newStyleCardKeys) {
          try {
            console.log(`🔥EXPORT🔥 [NEW-STYLE] Processing key: ${key}`);
            const metadata = await imageCacheService.getMetadata(key);
            console.log(`🔥EXPORT🔥 [NEW-STYLE] Raw metadata:`, metadata);
            
            if (!metadata || !metadata.filename) {
              console.log(`🔥EXPORT🔥 [NEW-STYLE] Skipping - no metadata or filename`);
              continue;
            }
            
            const cardId = metadata.cardId; // saved by ImageCard
            const sectionId = metadata.sectionId;
            console.log(`🔥EXPORT🔥 [NEW-STYLE] cardId: ${cardId}, sectionId: ${sectionId}`);
            
            if (!cardId || !sectionId) {
              // fallback: derive from key if fields missing
              const raw = key.substring('card_'.length, key.length - '_ImageMetadata'.length);
              const parts = raw.split('_');
              const sid = parts.pop();
              const cid = parts.join('_');
              metadata.cardId = metadata.cardId || cid;
              metadata.sectionId = metadata.sectionId || sid;
              console.log(`🔥EXPORT🔥 [NEW-STYLE] Fallback - cardId: ${metadata.cardId}, sectionId: ${metadata.sectionId}`);
            }
            
            const uniqueKey = `${metadata.cardId}__SECTION__${metadata.sectionId || 'unknown-section'}`;
            console.log(`🔥EXPORT🔥 [NEW-STYLE] uniqueKey: ${uniqueKey}`);
            console.log(`🔥EXPORT🔥 [NEW-STYLE] currentCardIds has this key:`, currentCardIds.has(uniqueKey));
            console.log(`🔥EXPORT🔥 [NEW-STYLE] All currentCardIds:`, Array.from(currentCardIds));
            
            if (!currentCardIds.has(uniqueKey)) {
              console.log(`🔥EXPORT🔥 [NEW-STYLE] Skipping - card not found in current cards`);
              continue;
            }
            
            const uploadDate = new Date(metadata.lastModified || metadata.uploadDate || new Date().toISOString());
            if (!cardImagesMap.has(uniqueKey) || uploadDate > cardImagesMap.get(uniqueKey).uploadDate) {
              cardImagesMap.set(uniqueKey, {
                key,
                metadata: { fileName: metadata.filename, ...metadata },
                uploadDate,
                cardId: metadata.cardId,
                sectionId: metadata.sectionId || 'unknown-section'
              });
              console.log(`🔥EXPORT🔥 [NEW-STYLE] Updated LATEST image for ${uniqueKey}: ${metadata.filename}`);
            }
          } catch (e) {
            console.warn('🔥EXPORT🔥 Failed to parse NEW-STYLE card metadata:', key, e);
          }
        }
        
        console.log(`🔥EXPORT🔥 Processing ${cardImagesMap.size} unique cards with images`);
        
        // Create a map for card image filenames to update HTML generation
        const cardImageFileMap = new Map();
        
        // ВСЕГДА экспортируем изображения в zip, но используем детерминированные имена
        console.log(`🔥EXPORT🔥 Exporting ${cardImagesMap.size} card images to zip`);
        
        // Export only the latest image for each unique card
        for (const [uniqueCardKey, imageInfo] of cardImagesMap) {
          try {
            const metadata = imageInfo.metadata;
            const cardId = imageInfo.cardId;
            const sectionId = imageInfo.sectionId;
            console.log(`🔥EXPORT🔥 Processing latest image for unique card ${uniqueCardKey} (cardId: ${cardId}, section: ${sectionId}): ${metadata.fileName}`);
            
            // Try to get the image blob - first try the exact filename, then try without extension
            let imageBlob = await imageCacheService.getImage(metadata.fileName);
            
            // If not found, try alternative names
            if (!imageBlob) {
              console.log(`🔥EXPORT🔥 Trying alternative names for: ${metadata.fileName}`);
              
              // Try without .jpg extension
              const nameWithoutExt = metadata.fileName.replace(/\.[^/.]+$/, "");
              imageBlob = await imageCacheService.getImage(nameWithoutExt);
              
              if (!imageBlob) {
                // Try with different extensions
                const extensions = ['.png', '.jpeg', '.webp', '.gif'];
                for (const ext of extensions) {
                  imageBlob = await imageCacheService.getImage(nameWithoutExt + ext);
                  if (imageBlob) {
                    console.log(`🔥EXPORT🔥 Found blob with extension: ${ext}`);
                    break;
                  }
                }
              }
              
              // Try to find by searching all localStorage keys
              if (!imageBlob) {
                console.log(`🔥EXPORT🔥 Searching localStorage for blob...`);
                const allImageKeys = Object.keys(localStorage).filter(key => 
                  key.startsWith('site-images-') && !key.includes('metadata')
                );
                
                for (const imageKey of allImageKeys) {
                  try {
                    const blob = await imageCacheService.getImage(imageKey.replace('site-images-', ''));
                    if (blob) {
                      console.log(`🔥EXPORT🔥 Found blob with key: ${imageKey}`);
                      imageBlob = blob;
                      break;
                    }
                  } catch (e) {
                    // Continue searching
                  }
                }
              }
            }
            
            if (imageBlob) {
              // Generate a clean filename using cardId + sectionId for uniqueness (ДЕТЕРМИНИРОВАННЫЙ)
              const cardHash = cardId.split('_').pop() || cardId.substring(0, 8);
              const sectionHash = sectionId.split('_').pop() || sectionId.substring(0, 8);
              // Используем детерминированный хеш ТОЛЬКО из cardId и sectionId (без metadata.fileName)
              const deterministicHash = (cardId + '_' + sectionId).split('').reduce((a, b) => {
                a = ((a << 5) - a) + b.charCodeAt(0);
                return a & a;
              }, 0).toString(36).substring(0, 6);
              const cleanFileName = `card_${sectionHash}_${cardHash}_${deterministicHash}.jpg`;
              
              console.log(`🔥EXPORT🔥 Generated deterministic filename: ${cleanFileName}`);
              console.log(`🔥EXPORT🔥 Components: cardHash=${cardHash}, sectionHash=${sectionHash}, deterministicHash=${deterministicHash}`);
              
              imagesFolder.file(cleanFileName, imageBlob);
              
              // Store mapping for HTML generation (use uniqueCardKey for mapping)
              cardImageFileMap.set(uniqueCardKey, cleanFileName);
              cardImageFileMap.set(cardId, cleanFileName); // Also store by cardId for backward compatibility
              
              console.log(`🔥EXPORT🔥 Added card image to zip: ${cleanFileName} (original: ${metadata.fileName}, uniqueKey: ${uniqueCardKey})`);
            } else {
              console.warn(`🔥EXPORT🔥 No blob found for card image: ${metadata.fileName}`);
              
              // Debug: list all available image keys
              const allKeys = Object.keys(localStorage).filter(key => key.includes('site-images'));
              console.log(`🔥EXPORT🔥 Available image keys:`, allKeys.slice(0, 10)); // Show first 10
            }
          } catch (error) {
            console.error(`🔥EXPORT🔥 Error processing card ${cardId}:`, error);
          }
        }
        
        // Store the mapping globally for HTML generation (temporary solution)
        window.cardImageFileMap = cardImageFileMap;
        
        console.log(`🔥EXPORT🔥 Card images export completed: ${cardImagesMap.size} unique cards processed`);
        
        // ДОПОЛНИТЕЛЬНО: Ищем изображения карточек в обычном кеше site-images-metadata-
        console.log('🔥EXPORT🔥 Searching for card images in regular site images cache...');
        
        const regularImageKeys = allKeys.filter(key => key.startsWith('site-images-metadata-'));
        let foundCardImages = 0;
        
        for (const key of regularImageKeys) {
          try {
            const metadata = await imageCacheService.getMetadata(key);
            console.log(`🔥EXPORT🔥 Checking regular image metadata:`, metadata);
            
            // Проверяем, связано ли это изображение с карточкой
            if (metadata && (
              metadata.cardId || 
              metadata.cardTitle || 
              (metadata.fileName && metadata.fileName.includes('card')) ||
              key.includes('card')
            )) {
              console.log(`🔥EXPORT🔥 Found potential card image in regular cache: ${key}`);
              
              const imageBlob = await imageCacheService.getImage(metadata.fileName);
              if (imageBlob) {
                const cleanFileName = `card_regular_${foundCardImages}_${Date.now()}.jpg`;
                imagesFolder.file(cleanFileName, imageBlob);
                foundCardImages++;
                console.log(`🔥EXPORT🔥 Added card image from regular cache: ${cleanFileName} (original: ${metadata.fileName})`);
              }
            }
          } catch (error) {
            // Пропускаем поврежденные метаданные
          }
        }
        
        console.log(`🔥EXPORT🔥 Found ${foundCardImages} additional card images in regular cache`);
        
        // ТРЕТИЙ СПОСОБ: Экспортируем изображения напрямую из данных карточек
        console.log('🔥EXPORT🔥 Exporting images directly from card data...');
        
        let directCardImages = 0;
        const processCardImages = async (elements, sectionId) => {
          if (!elements) return;
          
          for (const element of elements) {
            if ((element.type === 'image-card' || element.type === 'card') && (element.imageUrl || element.image)) {
              const imageUrl = element.imageUrl || element.image;
              console.log(`🔥EXPORT🔥 Processing direct card image: ${imageUrl}`);
              
              if (imageUrl && imageUrl.startsWith('blob:')) {
                try {
                  // Пытаемся получить blob из URL
                  const response = await fetch(imageUrl);
                  const blob = await response.blob();
                  
                  if (blob) {
                    const cleanFileName = `card_direct_${sectionId}_${element.id}_${directCardImages}.jpg`;
                    imagesFolder.file(cleanFileName, blob);
                    directCardImages++;
                    console.log(`🔥EXPORT🔥 Added direct card image: ${cleanFileName} from ${imageUrl}`);
                  }
                } catch (error) {
                  console.warn(`🔥EXPORT🔥 Could not fetch blob from ${imageUrl}:`, error);
                  
                  // Пытаемся найти по fileName
                  if (element.fileName) {
                    const imageBlob = await imageCacheService.getImage(element.fileName);
                    if (imageBlob) {
                      const cleanFileName = `card_filename_${sectionId}_${element.id}_${directCardImages}.jpg`;
                      imagesFolder.file(cleanFileName, imageBlob);
                      directCardImages++;
                      console.log(`🔥EXPORT🔥 Added card image by fileName: ${cleanFileName} (${element.fileName})`);
                    }
                  }
                }
              }
            }
          }
        };
        
        // Обрабатываем карточки из всех секций
        if (Array.isArray(siteData.sectionsData)) {
          for (const [index, sectionData] of siteData.sectionsData.entries()) {
            const sectionId = sectionData.id || index;
            await processCardImages(sectionData.elements, sectionId);
            await processCardImages(sectionData.contentElements, sectionId);
            await processCardImages(sectionData.cards, sectionId);
          }
        } else {
          for (const [sectionId, sectionData] of Object.entries(siteData.sectionsData || {})) {
            await processCardImages(sectionData.elements, sectionId);
            await processCardImages(sectionData.contentElements, sectionId);
            await processCardImages(sectionData.cards, sectionId);
          }
        }
        
        console.log(`🔥EXPORT🔥 Found ${directCardImages} direct card images from card data`);
      } catch (error) {
        console.error('🔥EXPORT🔥 Error exporting card images:', error);
      }

      // Add images from sections
      for (const section of sectionsArray) {
        // Обработка массива изображений
        if (Array.isArray(section.images) && section.images.length > 0) {
          for (const image of section.images) {
            try {
              let imageFilename = '';
              
              if (typeof image === 'string') {
                imageFilename = image.split('/').pop();
              } else if (image && (image.path || image.url)) {
                imageFilename = (image.path || image.url).split('/').pop();
              }
              
              if (!imageFilename) continue;
              
              // Пропускаем about.jpg и About.jpg, так как оно уже было добавлено ранее из aboutImageMetadata
              if (imageFilename.toLowerCase() === 'about.jpg') {
                console.log(`Skipping ${imageFilename} as it was already added`);
                continue;
              }
              
              const blob = await imageCacheService.getImage(imageFilename);
              if (blob) {
                imagesFolder.file(imageFilename, blob);
                console.log(`Section multi-image ${imageFilename} successfully added to zip from cache`);
              } else {
                console.warn(`Section multi-image ${imageFilename} not found in cache`);
              }
            } catch (error) {
              console.error(`Error getting section multi-image from cache:`, error);
            }
          }
        }
        
        // Обработка одиночных изображений
        if (section.backgroundImage || section.imagePath) {
          try {
            const imageFilename = (section.backgroundImage || section.imagePath).split('/').pop();
            // Пропускаем about.jpg и About.jpg, так как оно уже было добавлено ранее из aboutImageMetadata
            if (imageFilename.toLowerCase() === 'about.jpg') {
              console.log(`Skipping ${imageFilename} as it was already added`);
              continue;
            }
            const blob = await imageCacheService.getImage(imageFilename);
            if (blob) {
              imagesFolder.file(imageFilename, blob);
              console.log(`Section image ${imageFilename} successfully added to zip from cache`);
            } else {
              console.warn(`Section image ${imageFilename} not found in cache`);
            }
          } catch (error) {
            console.error(`Error getting section image from cache:`, error);
          }
        }
      }

      // Get favicon from cache
      try {
        const faviconMetadata = JSON.parse(localStorage.getItem('faviconMetadata') || '{}');
        if (faviconMetadata.filename) {
          const blob = await imageCacheService.getImage(faviconMetadata.filename);
          if (blob) {
            imagesFolder.file(faviconMetadata.filename, blob);
            console.log('Favicon successfully added to zip from cache');
          } else {
            console.warn('Favicon not found in cache');
          }
        }
      } catch (error) {
        console.error('Error getting favicon from cache:', error);
      }

      // Generate and download the zip file
      const content = await zip.generateAsync({ 
        type: 'blob',
        mimeType: 'application/zip'
      });
      
      // 🔥 ИСПРАВЛЕНИЕ: Добавляем проверку siteData
      console.log('🔍 [DEBUG] siteData before generateSafeFileName:', siteData);
      if (!siteData || !siteData.headerData) {
        console.error('❌ [ERROR] siteData or headerData is missing:', { siteData, headerData: siteData?.headerData });
        throw new Error('Данные сайта не найдены. Пожалуйста, обновите страницу и попробуйте снова.');
      }
      
      const fileName = generateSafeFileName(siteData);
      console.log('🔍 [DEBUG] Generated fileName:', fileName);
      saveAs(content, `${fileName}.zip`);
    } catch (error) {
      console.error('Error during site download:', error);
      alert('Ошибка при скачивании сайта: ' + error.message);
    }
  };

  const handleDownloadPHP = async () => {
    try {
      const zip = new JSZip();
      
      // Create main folders
      const assetsFolder = zip.folder('assets');
      const cssFolder = assetsFolder.folder('css');
      const jsFolder = assetsFolder.folder('js');
      const imagesFolder = assetsFolder.folder('images');

      // Add merci.html to root with language settings
      const merciResponse = await fetch('/merci.html');
      let merciContent = await merciResponse.text();
      
      // Apply language settings from configuration
      const language = headerData?.language || 'ru';
      merciContent = merciContent.replace(
        /<html[^>]*>/,
        `<html lang="${language}">`
      );
      
      // Replace default values with values from edit fields
      const thankYouMessage = contactData?.thankYouMessage || 'Спасибо за обращение! Мы свяжемся с вами в ближайшее время.';
      const closeButtonText = contactData?.closeButtonText || 'Закрыть';
      
      merciContent = merciContent.replace(
        'const message = urlParams.get(\'message\') || \'Спасибо за обращение! Мы свяжемся с вами в ближайшее время.\';',
        `const message = urlParams.get('message') || '${thankYouMessage.replace(/'/g, "\\'")}';`
      );
      
      merciContent = merciContent.replace(
        'const closeButtonText = urlParams.get(\'closeButtonText\') || \'Закрыть\';',
        `const closeButtonText = urlParams.get('closeButtonText') || '${closeButtonText.replace(/'/g, "\\'")}';`
      );
      
      zip.file('merci.html', merciContent);

      // Convert sections from object to array if needed
      const sectionsArray = Object.entries(sectionsData).map(([id, section]) => ({
          ...section,
        id: id,
        title: section.title || '',
        description: section.description || '',
        titleColor: section.titleColor || '#000000',
        descriptionColor: section.descriptionColor || '#666666',
        cards: section.cards || [],
        elements: section.elements || [],
        aiElements: section.aiElements || [],
        contentElements: section.contentElements || []
      }));

      const siteData = {
        headerData: {
          ...headerData,
          siteName: headerData.siteName || 'Мой сайт',
          title: headerData.title || headerData.siteName || 'Мой сайт',
          description: headerData.description || 'Наш сайт предлагает лучшие решения',
          menuItems: headerData.menuItems || [],
          siteBackgroundImage: headerData.siteBackgroundType === 'image' ? 'assets/images/fon.jpg' : '',
          language: headerData.language || 'ru'
        },
        heroData: {
          ...heroData,
          title: heroData.title || '',
          subtitle: heroData.subtitle || '',
          buttonText: heroData.buttonText || '',
          backgroundImage: heroData.backgroundImage ? 'assets/images/' + heroData.backgroundImage.split('/').pop() : ''
        },
        sectionsData: sectionsArray,
        contactData: {
          ...contactData,
          title: contactData.title || 'Контакты',
          description: contactData.description || ''
        },
        footerData: {
          ...footerData,
          title: footerData.title || 'О нас',
          description: footerData.description || '',
          contacts: footerData.contacts || '',
          copyright: footerData.copyright || '© 2024 Все права защищены',
          backgroundColor: footerData.backgroundColor || '#333',
          textColor: footerData.textColor || '#fff'
        },
        legalDocuments: {
          privacyPolicy: {
            title: legalDocuments?.privacyPolicy?.title || '',
            content: (legalDocuments?.privacyPolicy?.content || '').toString()
          },
          termsOfService: {
            title: legalDocuments?.termsOfService?.title || '',
            content: (legalDocuments?.termsOfService?.content || '').toString()
          },
          cookiePolicy: {
            title: legalDocuments?.cookiePolicy?.title || '',
            content: (legalDocuments?.cookiePolicy?.content || '').toString()
          }
        }
      };

      // 🔥 ИСПРАВЛЕНИЕ: Проверяем siteData после его объявления (PHP)
      console.log('🔍 [DEBUG] siteData after declaration (PHP):', siteData);
      if (!siteData || !siteData.headerData) {
        console.error('❌ [ERROR] siteData or headerData is missing after declaration (PHP):', { siteData, headerData: siteData?.headerData });
        throw new Error('Данные сайта не найдены. Пожалуйста, обновите страницу и попробуйте снова.');
      }

      console.log('Generating PHP site with data:', siteData);

      const phpContent = generatePHP(siteData);
      zip.file('index.php', phpContent);

      // Add CSS file (передаем headerData для PHP режима)
      const cssContent = generateCSS(siteData.headerData);
      cssFolder.file('styles.css', cssContent);
      
      // Add JS file
      const jsContent = generateJS();
      jsFolder.file('script.js', jsContent);

      // Add legal documents
      const legalDocs = [
        {
          id: 'privacy-policy',
          type: 'privacyPolicy',
          title: siteData.legalDocuments?.privacyPolicy?.title || '',
          content: siteData.legalDocuments?.privacyPolicy?.content || ''
        },
        {
          id: 'terms-of-service',
          type: 'termsOfService',
          title: siteData.legalDocuments?.termsOfService?.title || '',
          content: siteData.legalDocuments?.termsOfService?.content || ''
        },
        {
          id: 'cookie-policy',
          type: 'cookiePolicy',
          title: siteData.legalDocuments?.cookiePolicy?.title || '',
          content: siteData.legalDocuments?.cookiePolicy?.content || ''
        }
      ];

      legalDocs.forEach(doc => {
        const processedContent = (doc.content || '')
          .replace(/(.{80})/g, '$1<br>')
          .replace(/\n/g, '<br>')
          .replace(/([.!?])\s+/g, '$1<br>')
          .replace(/([^.!?])\s+/g, '$1 ');

        const htmlContent = `
<!DOCTYPE html>
<html lang="${siteData.headerData.language || 'ru'}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${doc.title}</title>
    <style>
        body {
            font-family: 'Roboto', Arial, sans-serif;
            line-height: 1.8;
            max-width: 1000px;
            margin: 0 auto;
            padding: 20px;
            font-size: 18px;
            color: #333;
            background-color: #f9f9f9;
        }
        h1 {
            text-align: center;
            color: #333;
            font-size: 32px;
            font-weight: bold;
            margin-bottom: 30px;
            padding-bottom: 15px;
            border-bottom: 1px solid #eaeaea;
        }
        h2 {
            color: #333;
            font-size: 26px;
            font-weight: 600;
            margin-top: 30px;
            margin-bottom: 20px;
        }
        h3 {
            color: #444;
            font-size: 22px;
            font-weight: 500;
            margin-top: 25px;
            margin-bottom: 15px;
        }
        .content {
            background-color: #fff;
            padding: 40px;
            border-radius: 10px;
            box-shadow: 0 2px 15px rgba(0,0,0,0.05);
            text-align: left;
        }
        p {
            margin-bottom: 20px;
            text-align: left;
            font-size: 18px;
            line-height: 1.8;
        }
        ul, ol {
            margin-bottom: 20px;
            padding-left: 25px;
        }
        li {
            margin-bottom: 10px;
            font-size: 18px;
        }
        strong {
            font-weight: 600;
        }
        .date {
            text-align: right;
            margin-top: 30px;
            color: #666;
            font-style: italic;
        }
        .contact-info {
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin-top: 40px;
            border-left: 4px solid #4285f4;
        }
        @media (max-width: 768px) {
            body {
                padding: 15px;
                font-size: 16px;
            }
            .content {
                padding: 25px;
            }
            h1 {
                font-size: 28px;
            }
            h2 {
                font-size: 22px;
            }
            h3 {
                font-size: 18px;
            }
            p, li {
                font-size: 16px;
            }
        }
    </style>
</head>
<body>
    <div class="content">
        ${processedContent}
        <div class="date">${new Date().toLocaleDateString('ru-RU')}</div>
    </div>
</body>
</html>`;

        zip.file(`${doc.id}.html`, htmlContent);
      });

      // Add robots.txt to the archive (unchanged from root directory)
      try {
        const robotsResponse = await fetch('/robots.txt');
        const robotsContent = await robotsResponse.text();
        zip.file('robots.txt', robotsContent);
        console.log('robots.txt successfully added to PHP zip');
      } catch (error) {
        console.warn('Could not fetch robots.txt for PHP, using default content');
        zip.file('robots.txt', 'User-agent: *\nDisallow:');
      }

      // Add sitemap.xml to the archive (dynamically generated with domain from settings)
      try {
        const sitemapContent = generateSitemapPHP(siteData);
        zip.file('sitemap.xml', sitemapContent);
        console.log('sitemap.xml successfully added to PHP zip with domain:', siteData.headerData.domain);
      } catch (error) {
        console.error('Error generating sitemap.xml for PHP:', error);
      }

      // Add update-sitemap.php to site root
      try {
        const updateSitemapResponse = await fetch('/assets/js/update-sitemap.php');
        const updateSitemapContent = await updateSitemapResponse.text();
        zip.file('update-sitemap.php', updateSitemapContent);
        console.log('update-sitemap.php successfully added to PHP site root');
      } catch (error) {
        console.warn('Could not fetch update-sitemap.php for PHP, using default content');
        // Fallback content if file is not found
        const defaultContent = `<?php
/**
 * Автоматическое обновление домена в sitemap.xml
 * Запустите этот скрипт один раз после размещения сайта на новом домене
 */

// Определяем текущий домен
$protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https://' : 'http://';
$currentDomain = $protocol . $_SERVER['HTTP_HOST'];

// Путь к файлу sitemap.xml
$sitemapFile = 'sitemap.xml';

// Проверяем, существует ли файл
if (!file_exists($sitemapFile)) {
    die("❌ Файл sitemap.xml не найден!");
}

// Читаем содержимое файла
$sitemapContent = file_get_contents($sitemapFile);

if ($sitemapContent === false) {
    die("❌ Не удалось прочитать файл sitemap.xml!");
}

// Заменяем все вхождения example.com на текущий домен
$updatedContent = str_replace('https://example.com', $currentDomain, $sitemapContent);
$updatedContent = str_replace('http://example.com', $currentDomain, $updatedContent);

// Обновляем дату последнего изменения на текущую
$currentDate = date('c');
$updatedContent = preg_replace(
    '/<lastmod>.*?<\\/lastmod>/',
    '<lastmod>' . $currentDate . '</lastmod>',
    $updatedContent
);

// Сохраняем обновленный файл
if (file_put_contents($sitemapFile, $updatedContent) !== false) {
    echo "✅ <strong>Успешно!</strong><br>";
    echo "📍 Домен обновлен на: <strong>" . htmlspecialchars($currentDomain) . "</strong><br>";
    echo "📅 Дата обновления: " . date('d.m.Y H:i:s') . "<br><br>";
    echo "🎯 <strong>Что дальше:</strong><br>";
    echo "1. Удалите этот файл (update-sitemap.php) с сервера<br>";
    echo "2. Загрузите обновленный sitemap.xml в Google Search Console<br>";
    echo "3. Проверьте работоспособность всех страниц<br>";
} else {
    echo "❌ Ошибка при сохранении файла sitemap.xml!";
}
?>`;
        zip.file('update-sitemap.php', defaultContent);
      }

      // Get hero image from cache
      if (heroData.backgroundImage) {
        try {
          const imageMetadata = JSON.parse(localStorage.getItem('heroImageMetadata') || '{}');
          if (imageMetadata.filename) {
            const blob = await imageCacheService.getImage(imageMetadata.filename);
            if (blob) {
              imagesFolder.file(imageMetadata.filename, blob);
              console.log('Hero image successfully added to zip from cache');
            } else {
              console.warn('Hero image not found in cache');
            }
          }
        } catch (error) {
          console.error('Error getting hero image from cache:', error);
        }
      }

      // Get about image from cache
      try {
        const aboutImageMetadata = JSON.parse(localStorage.getItem('aboutImageMetadata') || '{}');
        // Также проверим наличие метаданных для About.jpg с большой буквы (возможно осталось от предыдущей версии)
        const aboutImageMetadataOld = JSON.parse(localStorage.getItem('AboutImageMetadata') || '{}');
        
        // Пробуем сначала найти изображение с маленькой буквы
        if (aboutImageMetadata.filename) {
          const blob = await imageCacheService.getImage(aboutImageMetadata.filename);
          if (blob) {
            // Всегда сохраняем с именем about.jpg с маленькой буквы
            imagesFolder.file('about.jpg', blob);
            console.log('About image successfully added to zip from cache');
          } else {
            console.warn('About image (lowercase) not found in cache');
          }
        } 
        // Если не нашли с маленькой буквы, проверяем с большой буквы
        else if (aboutImageMetadataOld.filename) {
          const blob = await imageCacheService.getImage(aboutImageMetadataOld.filename);
          if (blob) {
            // Всё равно сохраняем с именем about.jpg с маленькой буквы
            imagesFolder.file('about.jpg', blob);
            console.log('About image (uppercase) converted to lowercase and added to zip');
          } else {
            console.warn('About image (uppercase) not found in cache');
          }
        }
      } catch (error) {
        console.error('Error getting about image from cache:', error);
      }

      // Get section images from cache
      try {
        // Перебираем все пункты меню (секции)
        for (const item of headerData.menuItems) {
          const sectionId = item.id;
          const metadataKey = `section_${sectionId}_ImageMetadata`;
          console.log(`Проверка метаданных для секции ${sectionId}, ключ: ${metadataKey}`);
          
          try {
            const sectionImageMetadata = JSON.parse(localStorage.getItem(metadataKey) || '{}');
            console.log(`Метаданные для секции ${sectionId}:`, sectionImageMetadata);
            
            if (sectionImageMetadata.filename) {
              // Проверяем есть ли файл в кеше
              const blob = await imageCacheService.getImage(sectionImageMetadata.filename);
              
              if (blob) {
                console.log(`Изображение для секции ${sectionId} найдено в кеше:`, sectionImageMetadata.filename);
                imagesFolder.file(sectionImageMetadata.filename, blob);
                console.log(`Section ${sectionId} image successfully added to zip from cache`);
              } else {
                console.warn(`Изображение для секции ${sectionId} не найдено в кеше:`, sectionImageMetadata.filename);
                
                // Пытаемся загрузить изображение по URL
                if (sectionImageMetadata.originalPath) {
                  try {
                    const response = await fetch(sectionImageMetadata.originalPath);
                    if (response.ok) {
                      const blob = await response.blob();
                      imagesFolder.file(sectionImageMetadata.filename, blob);
                      console.log(`Section ${sectionId} image successfully fetched from URL and added to zip`);
                    }
                  } catch (fetchError) {
                    console.error(`Ошибка при загрузке изображения для секции ${sectionId}:`, fetchError);
                  }
                }
              }
            } else {
              console.warn(`Нет метаданных изображения для секции ${sectionId}`);
            }
          } catch (parseError) {
            console.error(`Ошибка при разборе метаданных для секции ${sectionId}:`, parseError);
          }
        }
      } catch (error) {
        console.error('Error getting section images from cache:', error);
      }

      // Get advantages image from cache
      try {
        const advantagesImageMetadata = JSON.parse(localStorage.getItem('advantagesImageMetadata') || '{}');
        if (advantagesImageMetadata.filename) {
          const blob = await imageCacheService.getImage(advantagesImageMetadata.filename);
          if (blob) {
            imagesFolder.file(advantagesImageMetadata.filename, blob);
            console.log('Advantages image successfully added to zip from cache');
          } else {
            console.warn('Advantages image not found in cache');
          }
        }
      } catch (error) {
        console.error('Error getting advantages image from cache:', error);
      }

      // Get site background image from cache
      try {
        const siteBackgroundMetadata = JSON.parse(localStorage.getItem('siteBackgroundMetadata') || '{}');
        if (siteBackgroundMetadata.filename) {
          const blob = await imageCacheService.getImage(siteBackgroundMetadata.filename);
          if (blob) {
            imagesFolder.file(siteBackgroundMetadata.filename, blob);
            console.log('Site background image successfully added to zip from cache');
          } else {
            console.warn('Site background image not found in cache');
          }
        }
      } catch (error) {
        console.error('Error getting site background image from cache:', error);
      }

      // Add images from sections for PHP version
      for (const section of sectionsArray) {
        // Обработка массива изображений
        if (Array.isArray(section.images) && section.images.length > 0) {
          for (const image of section.images) {
            try {
              let imageFilename = '';
              
              if (typeof image === 'string') {
                imageFilename = image.split('/').pop();
              } else if (image && (image.path || image.url)) {
                imageFilename = (image.path || image.url).split('/').pop();
              }
              
              if (!imageFilename) continue;
              
              // Пропускаем about.jpg и About.jpg, так как оно уже было добавлено ранее из aboutImageMetadata
              if (imageFilename.toLowerCase() === 'about.jpg') {
                console.log(`Skipping ${imageFilename} as it was already added for PHP version`);
                continue;
              }
              
              const blob = await imageCacheService.getImage(imageFilename);
              if (blob) {
                imagesFolder.file(imageFilename, blob);
                console.log(`Section multi-image ${imageFilename} successfully added to zip from cache for PHP version`);
              } else {
                console.warn(`Section multi-image ${imageFilename} not found in cache for PHP version`);
              }
            } catch (error) {
              console.error(`Error getting section multi-image from cache for PHP version:`, error);
            }
          }
        }
        
        // Обработка одиночных изображений
        if (section.backgroundImage || section.imagePath) {
          try {
            const imageFilename = (section.backgroundImage || section.imagePath).split('/').pop();
            // Пропускаем about.jpg и About.jpg, так как оно уже было добавлено ранее из aboutImageMetadata
            if (imageFilename.toLowerCase() === 'about.jpg') {
              console.log(`Skipping ${imageFilename} as it was already added for PHP version`);
              continue;
            }
            const blob = await imageCacheService.getImage(imageFilename);
            if (blob) {
              imagesFolder.file(imageFilename, blob);
              console.log(`Section image ${imageFilename} successfully added to zip from cache for PHP version`);
            } else {
              console.warn(`Section image ${imageFilename} not found in cache for PHP version`);
            }
          } catch (error) {
            console.error(`Error getting section image from cache for PHP version:`, error);
          }
        }
      }

      // Get favicon from cache
      try {
        const faviconMetadata = JSON.parse(localStorage.getItem('faviconMetadata') || '{}');
        if (faviconMetadata.filename) {
          const blob = await imageCacheService.getImage(faviconMetadata.filename);
          if (blob) {
            imagesFolder.file(faviconMetadata.filename, blob);
            console.log('Favicon successfully added to zip from cache');
          } else {
            console.warn('Favicon not found in cache');
          }
        }
      } catch (error) {
        console.error('Error getting favicon from cache:', error);
      }

      // Generate and download the zip file
      const content = await zip.generateAsync({ 
        type: 'blob',
        mimeType: 'application/zip'
      });
      // 🔥 ИСПРАВЛЕНИЕ: Добавляем проверку siteData
      console.log('🔍 [DEBUG] siteData before generateSafeFileName (PHP):', siteData);
      if (!siteData || !siteData.headerData) {
        console.error('❌ [ERROR] siteData or headerData is missing (PHP):', { siteData, headerData: siteData?.headerData });
        throw new Error('Данные сайта не найдены. Пожалуйста, обновите страницу и попробуйте снова.');
      }
      
      const fileName = generateSafeFileName(siteData);
      console.log('🔍 [DEBUG] Generated fileName (PHP):', fileName);
      saveAs(content, `${fileName}-php.zip`);
    } catch (error) {
      console.error('Error during PHP site download:', error);
      alert('Ошибка при скачивании PHP сайта: ' + error.message);
    }
  };

  const generatePHP = (data) => {
    console.log('Generating PHP site with data:', data);
    
    // Prepare data for HTML generation
    const siteData = {
      headerData: {
        ...data.headerData,
        siteName: data.headerData.siteName || 'My Site',
        title: data.headerData.siteName || 'My Site',
        description: data.headerData.description || 'Our site offers the best solutions',
        menuItems: data.headerData.menuItems || [],
        siteBackgroundImage: data.headerData.siteBackgroundType === 'image' ? 'assets/images/fon.jpg' : '',
        language: data.headerData.language || 'en'
      },
      heroData: data.heroData,
      sectionsData: data.sectionsData,
      contactData: data.contactData,
      footerData: data.footerData,
      legalDocuments: {
        privacyPolicy: data.legalDocuments?.privacyPolicy || '',
        termsOfService: data.legalDocuments?.termsOfService || '',
        cookiePolicy: data.legalDocuments?.cookiePolicy || ''
      }
    };

    console.log('Prepared data for generation:', siteData);

    // Создаем экземпляр JSZip
    const zip = new JSZip();

    // Генерируем HTML документы
    const legalDocs = [
      {
        id: 'privacy-policy',
        type: 'privacyPolicy',
        title: ''
      },
      {
        id: 'terms-of-service',
        type: 'termsOfService',
        title: ''
      },
      {
        id: 'cookie-policy',
        type: 'cookiePolicy',
        title: ''
      }
    ];

    // Генерируем HTML файлы для документов
    legalDocs.forEach(doc => {
      const htmlContent = generateLegalDocument(data, doc.type);
      zip.file(`${doc.id}.html`, htmlContent);
    });

    // Генерируем основной HTML с данными документов
    const mainHtml = generateHTML(data);
    
    return `<?php
require_once DIR. '/../vendor/autoload.php';
$dotenv = Dotenv\\Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->safeLoad();

$returnPage = !empty($_ENV['WHITE_FORM_RETURN_PAGE']) ? $_ENV['WHITE_FORM_RETURN_PAGE'] : 'merci.html';

if (!str_ends_with($returnPage, '.html')) {
    $returnPage = $returnPage . '.html';
}

if (!empty($_ENV['GA4_MEASUREMENT_ID'])) {
   $gtagId = $_ENV['GA4_MEASUREMENT_ID'];
}

if (!empty($_ENV['GOOGLE_CONVERSION_LABEL'])) {
    $gtagCLabel = $_ENV['GOOGLE_CONVERSION_LABEL'];
}

if (!empty($_ENV['BING_PIXEL_ID'])) {
    $bingPixelId = $_ENV['BING_PIXEL_ID'];
}

if (!empty($_ENV['FB_PIXEL_ID'])) {
    $fbPixelId = $_ENV['FB_PIXEL_ID'];
}

if(!empty($_GET['fbpixelevent']) || !empty($_ENV['FB_EVENT_NAME'])) {
   $facebookPixelEventLeadKey = $_GET['fbpixelevent'] ?? $_ENV['FB_EVENT_NAME'];
}

if (isset($_GET['email']) || isset($_GET['name'])) {
   $email = $_GET['email'] ?? '';
   $name = $_GET['name'] ?? '';
   $phone = ltrim('+', $_GET['phone'] ?? '');
   $lastname = $_GET['lastname'] ?? '';

   if(!empty($fbPixelId)) {
      echo <<<EOL
      <script>
         fbq('track', '$facebookPixelEventLeadKey', {
            em: '$email',
            fn: '$name',
            ln: '$lastname',
            ph: '$phone',
         });
      </script>
EOL;
   }

   if(!empty($gtagId) && !empty($gtagCLabel)) {
      echo <<<EOL
      <script>
         gtag('event', 'conversion', {'send_to': '$gtagId/$gtagCLabel'});
         var head = document.head || document.getElementsByTagName('head')[0];
         var scriptsElement = document.createElement('script');
         scriptsElement.innerHTML = "gtag('event', 'conversion', {'send_to': "$gtagId/$gtagCLabel"});";
         head.appendChild(scriptsElement);
      </script>
EOL;
   }

   if(!empty($bingPixelId)) {
      echo <<<EOL
      <script>
         (function(w, d, t, r, u) {
            var f, n, i;
            w[u] = w[u] || [], f = function() {
                  var o = {
                     ti: '$bingPixelId',
                     enableAutoSpaTracking: true
                  };
                  o.q = w[u], w[u] = new UET(o), w[u].push("pageLoad")
            }, n = d.createElement(t), n.src = r, n.async = 1, n.onload = n.onreadystatechange = function() {
                  var s = this.readyState;
                  s && s !== "loaded" && s !== "complete" || (f(), n.onload = n.onreadystatechange = null)
            }, i = d.getElementsByTagName(t)[0], i.parentNode.insertBefore(n, i)
         })(window, document, "script", " //bat.bing.com/bat.js", "uetq");
      </script>
EOL;
   }

   echo <<<EOL
   <script>
      setTimeout( () => {
         window.location.href = '/$returnPage';
      }, 500)
   </script>
EOL;
   exit();
}
?>
<!DOCTYPE html>
<html lang="${data.headerData.language || 'en'}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.headerData.title || data.headerData.siteName}</title>
  <link rel="icon" type="image/png" href="assets/images/Favicon.png">
  <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
  <link rel="stylesheet" href="assets/css/styles.css">
  <meta name="description" content="${data.headerData.description || 'Our site offers the best solutions'}">
  <?php if(!empty($fbPixelId)): ?>
  <script>
     !function (f, b, e, v, n, t, s) {
        if (f.fbq) return;
        n = f.fbq = function () {
              n.callMethod ?
                 n.callMethod.apply(n, arguments) : n.queue.push(arguments)
        };
        if (!f._fbq) f._fbq = n;
        n.push = n;
        n.loaded = !0;
        n.version = '2.0';
        n.queue = [];
        t = b.createElement(e);
        t.async = !0;
        t.src = v;
        s = b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t, s)
     }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
     fbq('init', '$fbPixelId');
     fbq('track', 'PageView');
  </script>
  <?php endif; ?>

  <?php if(!empty($gtagId)): ?>
  <script src="https://www.googletagmanager.com/gtag/js?id=<?= $gtagId ?>"></script>
  <script>
     window.dataLayer = window.dataLayer || [];
     function gtag(){dataLayer.push(arguments);}
     gtag('js', new Date());

     gtag('config', '<?= $gtagId ?>');
  </script>
  <?php endif; ?>
</head>
<body>
${mainHtml}

<!-- Cookie consent notification -->
<div id="cookieConsent" style="
  position: fixed;
  left: 20px;
  bottom: 20px;
  background: rgba(30, 30, 30, 0.97);
  color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.18);
  padding: 1.2rem 1.5rem;
  z-index: 9999;
  display: none;
  min-width: 280px;
  max-width: 350px;
  font-size: 1rem;
  animation: fadeInUp 0.7s cubic-bezier(.23,1.01,.32,1) both;
">
  <div style="display: flex; align-items: flex-start; gap: 12px;">
    <div style="flex:1;">
      <strong>We use cookies</strong><br>
      This website uses cookies to ensure you get the best experience on our website. <a href="cookie-policy.html" style="color:#90caf9;text-decoration:underline;">Learn more</a>.
    </div>
    <button id="cookieAcceptBtn" style="margin-left: 8px; background: #1976d2; color: #fff; border: none; border-radius: 6px; padding: 0.5rem 1.1rem; font-weight: 500; cursor: pointer; transition: background 0.2s;">Accept</button>
  </div>
</div>
<style>
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(40px); }
    to { opacity: 1; transform: translateY(0); }
  }
  #cookieConsent a:hover { color: #fff; text-decoration: underline; }
  #cookieAcceptBtn:hover { background: #1565c0; }
</style>
<script>
  document.addEventListener('DOMContentLoaded', function() {
    var consent = localStorage.getItem('cookieConsent');
    var consentBox = document.getElementById('cookieConsent');
    var acceptBtn = document.getElementById('cookieAcceptBtn');
    if (!consent && consentBox) {
      consentBox.style.display = 'block';
    }
    if (acceptBtn) {
      acceptBtn.onclick = function() {
        localStorage.setItem('cookieConsent', 'accepted');
        if (consentBox) consentBox.style.display = 'none';
      };
    }
  });
</script>
</body>
</html>`;
  };

  const generateLegalDocument = (siteData, type) => {
    const titles = {
      privacyPolicy: '',
      termsOfService: '',
      cookiePolicy: ''
    };
    
    const content = siteData.legalDocuments?.[type]?.content || '';
    const title = siteData.legalDocuments?.[type]?.title || titles[type];
    
    // Обработка контента: первая строка будет отцентрирована и выделена
    const contentLines = content.split('\n');
    const firstLine = contentLines[0] ? `<h1>${contentLines[0]}</h1>` : '';
    const remainingContent = contentLines.slice(1).join('\n');
    
    // Улучшенная обработка текста для выделения заголовков разделов и форматирования
    let processedContent = firstLine;
    
    // Шаблоны для определения заголовков разделов
    const sectionHeaderPattern = /^\d+\.\s+(.+)/;  // Для формата: "1. Раздел"
    const sectionHeaderPattern2 = /^([IVX]+)\.\s+(.+)/; // Для римских цифр: "I. Раздел"
    const sectionHeaderPattern3 = /^([А-ЯA-Z][\wа-яА-Я\s]{2,}):$/; // Для ЗАГОЛОВКОВ ПРОПИСНЫМИ
    
    // Разбиваем текст на абзацы
    const paragraphs = remainingContent.split('\n');
    
    // Обрабатываем каждый абзац
    paragraphs.forEach(paragraph => {
      paragraph = paragraph.trim();
      
      if (!paragraph) {
        // Пустые строки превращаем в разделители
        processedContent += '<br>';
      return;
    }

      // Проверяем, является ли строка заголовком раздела
      const match1 = paragraph.match(sectionHeaderPattern);
      const match2 = paragraph.match(sectionHeaderPattern2);
      const match3 = paragraph.match(sectionHeaderPattern3);
      
      if (match1) {
        // Формат "1. Заголовок"
        processedContent += `<h2>${paragraph}</h2>`;
      } else if (match2) {
        // Формат "I. Заголовок"
        processedContent += `<h2>${paragraph}</h2>`;
      } else if (match3) {
        // Формат "ЗАГОЛОВОК:"
        processedContent += `<h2>${paragraph}</h2>`;
      } else if (/^\d+\.\d+\./.test(paragraph)) {
        // Подразделы вида "1.1. Подраздел"
        processedContent += `<h3>${paragraph}</h3>`;
      } else if (paragraph.startsWith('•') || paragraph.startsWith('-') || paragraph.startsWith('*')) {
        // Маркированные списки
        if (!processedContent.endsWith('</ul>') && !processedContent.endsWith('<ul>')) {
          processedContent += '<ul>';
        }
        processedContent += `<li>${paragraph.substring(1).trim()}</li>`;
        
        // Проверяем, нужно ли закрыть список
        if (paragraphs.indexOf(paragraph) === paragraphs.length - 1 || 
            !paragraphs[paragraphs.indexOf(paragraph) + 1].startsWith('•') &&
            !paragraphs[paragraphs.indexOf(paragraph) + 1].startsWith('-') &&
            !paragraphs[paragraphs.indexOf(paragraph) + 1].startsWith('*')) {
          processedContent += '</ul>';
        }
      } else {
        // Обычные параграфы
        if (paragraph.length > 0) {
          // Выделяем важные термины жирным
          paragraph = paragraph
            .replace(/«([^»]+)»/g, '«<strong>$1</strong>»')
            .replace(/"([^"]+)"/g, '"<strong>$1</strong>"');
            
          processedContent += `<p>${paragraph}</p>`;
        }
      }
    });
    
    // Дополнительная обработка для улучшения читабельности
    processedContent = processedContent
      .replace(/(\d+\.\d+\.\d+\.)/g, '<strong>$1</strong>') // Выделяем номера подразделов
      .replace(/([А-ЯA-Z]{2,})/g, '<strong>$1</strong>') // Выделяем слова ПРОПИСНЫМИ
      .replace(/(ФЗ [№"]\d+[^<]*?[»"])/g, '<strong>$1</strong>') // Выделяем упоминания законов
      .replace(/([0-9]+\s*(?:января|февраля|марта|апреля|мая|июня|июля|августа|сентября|октября|ноября|декабря)\s*[0-9]{4})/gi, '<em>$1</em>'); // Выделяем даты
    
    return `
<!DOCTYPE html>
<html lang="${siteData.headerData.language || 'en'}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        body {
            font-family: 'Roboto', Arial, sans-serif;
            line-height: 1.8;
            max-width: 1000px;
            margin: 0 auto;
            padding: 20px;
            font-size: 18px;
            color: #333;
            background-color: #f9f9f9;
        }
        h1 {
            text-align: center;
            color: #333;
            font-size: 32px;
            font-weight: bold;
            margin-bottom: 30px;
            padding-bottom: 15px;
            border-bottom: 1px solid #eaeaea;
        }
        h2 {
            color: #333;
            font-size: 26px;
            font-weight: 600;
            margin-top: 30px;
            margin-bottom: 20px;
        }
        h3 {
            color: #444;
            font-size: 22px;
            font-weight: 500;
            margin-top: 25px;
            margin-bottom: 15px;
        }
        .content {
            background-color: #fff;
            padding: 40px;
            border-radius: 10px;
            box-shadow: 0 2px 15px rgba(0,0,0,0.05);
            text-align: left;
        }
        p {
            margin-bottom: 20px;
            text-align: left;
            font-size: 18px;
            line-height: 1.8;
        }
        ul, ol {
            margin-bottom: 20px;
            padding-left: 25px;
        }
        li {
            margin-bottom: 10px;
            font-size: 18px;
        }
        strong {
            font-weight: 600;
        }
        .date {
            text-align: right;
            margin-top: 30px;
            color: #666;
            font-style: italic;
        }
        .contact-info {
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin-top: 40px;
            border-left: 4px solid #4285f4;
        }
        @media (max-width: 768px) {
            body {
                padding: 15px;
                font-size: 16px;
            }
            .content {
                padding: 25px;
            }
            h1 {
                font-size: 28px;
            }
            h2 {
                font-size: 22px;
            }
            h3 {
                font-size: 18px;
            }
            p, li {
                font-size: 16px;
            }
        }
    </style>
</head>
<body>
    <div class="content">
        ${processedContent}
        <div class="date">${new Date().toLocaleDateString('ru-RU')}</div>
    </div>
</body>
</html>`;
  };

  const handleExport = async () => {
    console.log('🟢🟢🟢 handleExport CALLED! 🟢🟢🟢');
    alert('handleExport function called!');
    try {
      // Логирование для отладки графиков
      console.log('=== EXPORT DEBUG ===');
      console.log('sectionsData:', sectionsData);
      
      // Проверяем каждый раздел на наличие графиков
      Object.entries(sectionsData).forEach(([sectionId, section]) => {
        if (section.aiElements && section.aiElements.length > 0) {
          console.log(`Section ${sectionId} has ${section.aiElements.length} AI elements:`, section.aiElements);
          section.aiElements.forEach((element, index) => {
            if (element.type === 'bar-chart') {
              console.log(`Bar chart in section ${sectionId}, index ${index}:`, element);
            }
          });
        }
        if (section.contentElements && section.contentElements.length > 0) {
          console.log(`Section ${sectionId} has ${section.contentElements.length} content elements:`, section.contentElements);
        }
      });
      console.log('=====================');
      
      // Логирование heroData для отладки
      console.log('heroData before export:', heroData);
      console.log('heroData.homePageSettings:', heroData.homePageSettings);

      const siteData = {
        headerData: {
          ...headerData,
          siteName: headerData.siteName || 'Мой сайт',
          title: headerData.title || headerData.siteName || 'Мой сайт',
          domain: headerData.domain || '',
          description: headerData.description || 'Наш сайт предлагает лучшие решения',
          menuItems: headerData.menuItems || [],
          siteBackgroundImage: headerData.siteBackgroundType === 'image' ? 'assets/images/hero/fon.jpg' : '',
          language: headerData.language || 'ru'
        },
        heroData: {
          ...heroData,
          title: heroData.title || '',
          subtitle: heroData.subtitle || '',
          buttonText: heroData.buttonText || '',
          backgroundImage: heroData.backgroundImage ? 'assets/images/hero/' + heroData.backgroundImage.split('/').pop() : '',
          homePageSettings: heroData.homePageSettings || {
            showFeaturedSection: true,
            featuredSectionId: '',
            showSectionsPreview: true,
            sectionsDisplayMode: 'cards',
            maxSectionsToShow: 6,
            sectionsOrder: [],
            showContactPreview: true
          }
        },
        sectionsData: Object.entries(sectionsData).map(([id, section]) => ({
          ...section,
          id: id,
          title: section.title || '',
          description: section.description || '',
          titleColor: section.titleColor || '#000000',
          descriptionColor: section.descriptionColor || '#666666',
          cards: section.cards || [],
          aiElements: section.aiElements || [],
          contentElements: (section.contentElements || []).map(element => ({
            ...element,
            // Сохраняем colorSettings в каждом элементе для экспорта
            colorSettings: element.colorSettings || {},
            // Сохраняем все данные элемента включая настройки цветов
            data: {
              ...element.data,
              colorSettings: element.data?.colorSettings || element.colorSettings || {}
            }
          }))
        })),
        contactData: {
          ...contactData,
          title: contactData.title || 'Контакты',
          description: contactData.description || ''
        },
        footerData: {
          ...footerData,
          title: footerData.title || 'О нас',
          description: footerData.description || '',
          contacts: footerData.contacts || '',
          copyright: footerData.copyright || '© 2024 Все права защищены',
          backgroundColor: footerData.backgroundColor || '#333',
          textColor: footerData.textColor || '#fff'
        },
        legalDocuments: {
          privacyPolicy: {
            title: legalDocuments?.privacyPolicy?.title || '',
            content: legalDocuments?.privacyPolicy?.content || ''
          },
          termsOfService: {
            title: legalDocuments?.termsOfService?.title || '',
            content: legalDocuments?.termsOfService?.content || ''
          },
          cookiePolicy: {
            title: legalDocuments?.cookiePolicy?.title || '',
            content: legalDocuments?.cookiePolicy?.content || ''
          }
        },
        liveChatData: {
          ...liveChatData,
          enabled: liveChatData.enabled || false,
          apiKey: liveChatData.apiKey || '',
          selectedResponses: liveChatData.selectedResponses || '',
          allTranslations: liveChatData.allTranslations || ''
        }
      };

      // Выбираем экспортер в зависимости от режима
      if (currentConstructorMode) {
        // Режим конструктора - используем одностраничный экспорт
        console.log('🏗️ Exporting in Constructor mode (single page)');
        await exportSite(siteData);
      } else {
        // Ручной режим - используем многостраничный экспорт
        console.log('📄 Exporting in Manual mode (multi page)');
        await exportMultiPageSite(siteData);
      }
      } catch (error) {
      console.error('Error exporting site:', error);
      alert('Ошибка при экспорте сайта: ' + error.message);
    }
  };

  const handleAboutImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      // Проверка формата
      if (!file.type.startsWith('image/')) {
        throw new Error('Пожалуйста, выберите изображение');
      }

      // Создаем FormData
      const formData = new FormData();
      formData.append('image', file);

      // Отправляем запрос на сервер
      const response = await fetch('/api/upload-about', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Ошибка при загрузке изображения');
      }

      const data = await response.json();
      
      // Сохраняем метаданные изображения в localStorage
      const imageMetadata = {
        filename: 'about.jpg', // Всегда используем about.jpg с маленькой буквы
        originalPath: data.path,
        timestamp: Date.now()
      };
      
      console.log('Метаданные изображения "О нас":', imageMetadata);
      localStorage.setItem('aboutImageMetadata', JSON.stringify(imageMetadata));
      
      // Кешируем изображение
      try {
        // Добавляем временную метку, чтобы избежать кеширования браузером
        const imageUrl = `${data.path}?t=${Date.now()}`;
        const imageBlob = await (await fetch(imageUrl)).blob();
        await imageCacheService.saveImage(imageMetadata.filename, imageBlob);
      } catch (cacheError) {
        console.warn('Ошибка при кешировании изображения "О нас":', cacheError);
        // Продолжаем выполнение, кеширование некритично
      }
      
      // Обновляем путь к изображению в данных секции
      const aboutSection = Object.entries(sectionsData).find(([id, section]) => id === 'about');
      if (aboutSection) {
        const [id, section] = aboutSection;
        onSectionsChange({
          ...sectionsData,
          [id]: {
            ...section,
            imagePath: data.path
          }
        });
      } else {
        console.warn('Секция "О нас" не найдена');
      }
      
      // Отправляем сообщение в превью для обновления изображения
      try {
        // Находим iframe с превью
        const previewIframe = document.querySelector('iframe.preview-iframe');
        if (previewIframe && previewIframe.contentWindow) {
          // Отправляем сообщение с информацией об обновлении изображения
          previewIframe.contentWindow.postMessage({
            type: 'UPDATE_SECTION_IMAGE',
            sectionId: 'about',
            imagePath: data.path
          }, '*');
          console.log(`Отправлено сообщение для обновления изображения секции "О нас"`);
        } else {
          console.warn('Iframe превью не найден');
        }
      } catch (messageError) {
        console.error('Ошибка при отправке сообщения в превью:', messageError);
        // Не критичная ошибка, продолжаем выполнение
      }
      
      alert('Изображение успешно загружено');
    } catch (error) {
      console.error('Ошибка при загрузке изображения:', error);
      alert(error.message || 'Произошла ошибка при загрузке изображения');
    }
  };

  // Функция для удаления изображения секции
  const handleDeleteSectionImage = async (sectionId, imageIndex) => {
    try {
      if (!sectionId) {
        throw new Error('ID секции не указан');
      }

      const section = sectionsData[sectionId];
      if (!section?.images?.[imageIndex]) {
        throw new Error('Изображение не найдено');
      }

      const imageToDelete = section.images[imageIndex];
      console.log('[EditorPanel] Deleting image:', imageToDelete, 'at index:', imageIndex, 'from section:', sectionId);

      // Удаляем изображение из кеша
      await imageCacheService.deleteImage(imageToDelete.filename);

      // Создаем новый массив изображений без удаленного
      const updatedImages = section.images.filter((_, idx) => idx !== imageIndex);
      
      // Обновляем данные секции
      const updatedSectionsData = {
        ...sectionsData,
        [sectionId]: {
          ...sectionsData[sectionId],
          images: updatedImages
        }
      };
      
      onSectionsChange(updatedSectionsData);

      // Отправляем сообщение в превью
      try {
        const previewIframe = document.querySelector('iframe.preview-iframe');
        if (previewIframe && previewIframe.contentWindow) {
          console.log('[EditorPanel] Sending DELETE message to preview for section:', sectionId, 'index:', imageIndex);
          previewIframe.contentWindow.postMessage({
            type: 'REMOVE_SECTION_IMAGE',
            sectionId: sectionId,
            imageIndex: imageIndex
          }, '*');
        }
      } catch (messageError) {
        console.error('Ошибка при отправке сообщения в превью:', messageError);
      }

      alert('Изображение успешно удалено');
    } catch (error) {
      console.error('Ошибка при удалении изображения:', error);
      alert(error.message || 'Произошла ошибка при удалении изображения');
    }
  };

  // Также добавим функцию для удаления изображения "О нас"
  const handleDeleteAboutImage = async () => {
    try {
      // Ищем секцию about
      const aboutSection = Object.entries(sectionsData).find(([id, section]) => id === 'about');
      if (aboutSection) {
        const [id, section] = aboutSection;
        onSectionsChange({
          ...sectionsData,
          [id]: {
            ...section,
            imagePath: null
          }
        });
      }
      
      // Удаляем метаданные изображения из localStorage
      localStorage.removeItem('aboutImageMetadata');
      localStorage.removeItem('AboutImageMetadata'); // На всякий случай удаляем и старый ключ
      
      // Отправляем сообщение в превью для обновления отображения
      try {
        const previewIframe = document.querySelector('iframe.preview-iframe');
        if (previewIframe && previewIframe.contentWindow) {
          previewIframe.contentWindow.postMessage({
            type: 'REMOVE_SECTION_IMAGE',
            sectionId: 'about'
          }, '*');
          console.log('Отправлено сообщение для удаления изображения секции "О нас"');
        } else {
          console.warn('Iframe превью не найден');
        }
      } catch (messageError) {
        console.error('Ошибка при отправке сообщения в превью:', messageError);
      }
      
      alert('Изображение "О нас" успешно удалено');
    } catch (error) {
      console.error('Ошибка при удалении изображения "О нас":', error);
      alert(error.message || 'Произошла ошибка при удалении изображения "О нас"');
    }
  };

  // Создаем блоки для разных частей редактора
  const headerEditorBlock = (
        <HeaderEditor 
          headerData={headerData} 
          onHeaderChange={onHeaderChange}
          heroData={heroData}
          expanded={expandedSections.header}
          onToggle={() => toggleSection('header')}
          id="header"
        />
  );

  const heroEditorBlock = (
        <HeroEditor 
          heroData={heroData}
          onHeroChange={onHeroChange}
          expanded={expandedSections.hero}
          onToggle={() => toggleSection('hero')}
          id="hero"
          sectionsData={sectionsData}
        />
  );

  // Обертка для логирования изменений contactData
  const handleContactChangeWithLogging = (newContactData) => {
    console.log('📡 EDITOR PANEL: Contact data change received');
    console.log('📊 Previous contactData:', contactData);
    console.log('✨ New contactData:', newContactData);
    
    // Сравнение фоновых настроек
    const backgroundFields = ['showBackground', 'backgroundType', 'backgroundColor', 'gradientColor1', 'gradientColor2', 'gradientDirection'];
    const backgroundChanges = {};
    
    backgroundFields.forEach(field => {
      if (contactData[field] !== newContactData[field]) {
        backgroundChanges[field] = {
          from: contactData[field],
          to: newContactData[field]
        };
      }
    });
    
    if (Object.keys(backgroundChanges).length > 0) {
      console.log('🎨 BACKGROUND CHANGES DETECTED:', backgroundChanges);
    }
    
    onContactChange(newContactData);
  };

  // Функция для получения имени файла главной страницы
  const getIndexFileName = () => {
    // Если указано пользовательское имя файла в ручном режиме, используем его
    if (!currentConstructorMode && heroData?.indexFileName?.trim()) {
      return heroData.indexFileName.trim() + '.html';
    }
    return 'index.html';
  };

  // Добавляем блок с AI парсером
  const aiParserBlock = (
    <Box sx={{ mb: 4 }}>
      <AiParser 
        sectionsData={sectionsData} 
        onSectionsChange={onSectionsChange}
        headerData={headerData}
        onHeaderChange={onHeaderChange}
        contactData={contactData}
        onContactChange={handleContactChangeWithLogging}
        legalDocuments={legalDocuments}
        onLegalDocumentsChange={onLegalDocumentsChange}
        heroData={heroData}
        onHeroChange={onHeroChange}
        constructorMode={currentConstructorMode}
        onConstructorModeChange={handleConstructorModeChange}
        aboutData={sectionsData.about}
        onAboutChange={(aboutData) => {
          console.log('onAboutChange called with:', aboutData);
          onSectionsChange({
            ...sectionsData,
            about: aboutData
          });
        }}
        servicesData={sectionsData.services}
        onServicesChange={(servicesData) => {
          console.log('onServicesChange called with:', servicesData);
          onSectionsChange({
            ...sectionsData,
            services: servicesData
          });
        }}
        featuresData={sectionsData.features}
        onFeaturesChange={(featuresData) => {
          console.log('onFeaturesChange called with:', featuresData);
          onSectionsChange({
            ...sectionsData,
            features: featuresData
          });
        }}
        testimonialsData={sectionsData.testimonials}
        onTestimonialsChange={(testimonialsData) => {
          console.log('onTestimonialsChange called with:', testimonialsData);
          onSectionsChange({
            ...sectionsData,
            testimonials: testimonialsData
          });
        }}
        faqData={sectionsData.faq}
        onFaqChange={(faqData) => {
          console.log('onFaqChange called with:', faqData);
          onSectionsChange({
            ...sectionsData,
            faq: faqData
          });
        }}
        newsData={sectionsData.news}
        onNewsChange={(newsData) => {
          console.log('onNewsChange called with:', newsData);
          onSectionsChange({
            ...sectionsData,
            news: newsData
          });
        }}
        merciData={sectionsData.merci}
        onMerciChange={(merciData) => {
          console.log('onMerciChange called with:', merciData);
          onSectionsChange({
            ...sectionsData,
            merci: merciData
          });
        }}
      />
    </Box>
  );

  const contactEditorBlock = (
    <ContactEditor 
      contactData={contactData} 
      onContactChange={handleContactChangeWithLogging}
      expanded={expandedSections.contact}
      onToggle={() => toggleSection('contact')}
      id="contact"
      headerData={headerData}
    />
  );

  const footerEditorBlock = (
    <FooterEditor 
      footerData={footerData} 
      onFooterChange={onFooterChange}
      expanded={expandedSections.footer}
      onToggle={() => toggleSection('footer')}
      id="footer"
    />
  );

  const legalDocumentsEditorBlock = (
    <LegalDocumentsEditor
      documents={legalDocuments}
      onSave={handleLegalDocumentsSave}
      expanded={expandedSections.legal}
      onToggle={() => toggleSection('legal')}
      id="legal"
    />
  );

  const liveChatEditorBlock = (
    <LiveChatEditor
      liveChatData={liveChatData}
      onLiveChatChange={onLiveChatChange}
      expanded={expandedSections.liveChat}
      onToggle={() => toggleSection('liveChat')}
      headerData={headerData}
      id="liveChat"
    />
  );
  const sectionsEditor = (
        <Paper 
          sx={{ 
            p: 2, 
            mb: 2,
            backgroundColor: '#f0fff0'
          }}
          id="menu"
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography 
              variant="h6" 
              sx={{ cursor: 'pointer', flexGrow: 1 }}
              onClick={() => toggleSection('menu')}
            >
              Пункты меню
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Button
                variant="contained"
                size="small"
                startIcon={<AddIcon />}
                onClick={() => handleAddMenuItem('menu')}
                sx={{ 
                  minWidth: 'auto',
                  px: 2,
                  mr: 1
                }}
              >
                Добавить
              </Button>

              <Button
                variant="outlined"
                size="small"
                onClick={handleCreateUAEPaymentsSite}
                sx={{ 
                  minWidth: 'auto',
                  px: 2,
                  mr: 1,
                  color: '#1e3a8a',
                  borderColor: '#1e3a8a',
                  '&:hover': {
                    backgroundColor: '#1e3a8a',
                    color: 'white'
                  }
                }}
              >
                🇦🇪 UAE
              </Button>
              <IconButton
                onClick={() => toggleSection('menu')}
                aria-expanded={expandedSections.menu}
                aria-label="show more"
                sx={{ cursor: 'pointer' }}
              >
                {expandedSections.menu ? <ExpandLess /> : <ExpandMore />}
              </IconButton>
            </Box>
          </Box>

          {/* Поле для переименования главной страницы - показывается только в Manual режиме */}
          {!currentConstructorMode && (
            <TextField
              fullWidth
              size="small"
              label="Имя файла главной страницы (без расширения)"
              value={heroData?.indexFileName || ''}
              onChange={(e) => handleChange('indexFileName', e.target.value)}
              placeholder="index"
              helperText="По умолчанию: index.html. Вы можете изменить на: home.html, main.html и т.д."
              sx={{ mt: 2, mb: 2 }}
            />
          )}

          <Collapse in={expandedSections.menu} timeout="auto" unmountOnExit>
            {/* Блок предустановленных секций убран */}
            
            <Stack spacing={1} sx={{ mt: 2 }}>
              {headerData.menuItems.map((item) => {
                const section = sectionsData[item.id] || {
                  id: item.id,
                  title: '',
                  description: '',
                  cardType: CARD_TYPES.NONE,
                  cards: [],
                  aiElements: [],
                  contentElements: []
                };
                
                return (
                  <Paper
                    key={item.id}
                    elevation={2}
                    sx={{ 
                      p: 2, 
                      mb: 2, 
                      display: 'flex', 
                      flexDirection: 'column',
                      gap: 12,
                      backgroundColor: '#bdc5da',
                      borderRadius: 2,
                      border: '1px solid #c5cae9',
                      '&:hover': {
                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                      }
                    }}
                  >
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        cursor: 'pointer'
                      }}
                      onClick={() => toggleSection(`menuItem_${item.id}`)}
                    >
                      <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
                        {item.text}
                      </Typography>
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSection(`menuItem_${item.id}`);
                        }}
                        aria-expanded={expandedSections.menuItems[item.id]}
                        aria-label="show more"
                        sx={{ cursor: 'pointer' }}
                      >
                        {expandedSections.menuItems[item.id] ? <ExpandLess /> : <ExpandMore />}
                      </IconButton>
                    </Box>

                    <Collapse in={expandedSections.menuItems[item.id]} timeout="auto" unmountOnExit>
                      <Stack spacing={1} sx={{ mt: 2 }}>
                        <TextField
                          fullWidth
                          size="small"
                          label="Название пункта меню"
                          value={item.text}
                          onChange={(e) => handleMenuItemChange(item.id, 'text', e.target.value)}
                          margin="dense"
                        />
                        <TextField
                          fullWidth
                          size="small"
                          label="Заголовок секции"
                          value={section.title || ''}
                          onChange={(e) => handleSectionChange(item.id, 'title', e.target.value)}
                          margin="dense"
                        />
                        <TextField
                          fullWidth
                          size="small"
                          label="Описание секции"
                          value={section.description || ''}
                          onChange={(e) => handleSectionChange(item.id, 'description', e.target.value)}
                          margin="dense"
                          multiline
                          rows={2}
                        />
                        {!currentConstructorMode && (
                          <TextField
                            fullWidth
                            size="small"
                            label="Имя файла HTML (без расширения)"
                            value={section.fileName || ''}
                            onChange={(e) => handleSectionChange(item.id, 'fileName', e.target.value)}
                            margin="dense"
                            placeholder="Например: about-us, services, contact"
                            helperText="Оставьте пустым для автоматической генерации из заголовка"
                          />
                        )}
                        <Box sx={{ display: 'flex', gap: 12, alignItems: 'flex-start', mt: 1 }}>
                          {/* Удаляем первую кнопку и оставляем только вторую */}
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: '100%' }}>
                            <Button
                              variant="contained"
                              startIcon={<ImageIcon />}
                              onClick={() => document.getElementById(`section-image-upload-${item.id}`).click()}
                              sx={{ minWidth: '200px' }}
                            >
                              {section.images && section.images.length > 0 ? 'Добавить еще изображения' : 'Добавить изображения'}
                            </Button>
                            
                            <input
                              type="file"
                              id={`section-image-upload-${item.id}`}
                              accept="image/*"
                              multiple
                              style={{ display: 'none' }}
                              onChange={(e) => handleSectionImageUpload(item.id, e)}
                            />
                            
                            {section.images && section.images.length > 0 && (
                              <Box sx={{ mt: 2, width: '100%' }}>
                                <Typography variant="body2" sx={{ mb: 1 }}>
                                  Загруженные изображения (перетащите для изменения порядка)
                                </Typography>
                                <SectionImageGallery
                                  sectionId={item.id}
                                  images={section.images}
                                  onReorder={(startIndex, endIndex) => handleReorderImagesInSection(item.id, startIndex, endIndex)}
                                  onDelete={(index) => handleDeleteSectionImage(item.id, index)}
                                />
                              </Box>
                            )}
                          </Box>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 12 }}>
                          <TextField
                            fullWidth
                            size="small"
                            label="Цвет заголовка секции"
                            type="color"
                            value={section.titleColor || '#000000'}
                            onChange={(e) => handleSectionChange(item.id, 'titleColor', e.target.value)}
                          />
                          <TextField
                            fullWidth
                            size="small"
                            label="Цвет описания секции"
                            type="color"
                            value={section.descriptionColor || '#666666'}
                            onChange={(e) => handleSectionChange(item.id, 'descriptionColor', e.target.value)}
                          />
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={section.showBackground ?? true}
                                onChange={(e) => handleSectionChange(item.id, 'showBackground', e.target.checked)}
                                color="primary"
                              />
                            }
                            label="Показывать фон секции"
                          />
                        </Box>

                        <Box sx={{ mb: 2, mt: 2 }}>
                          <Typography variant="subtitle2" sx={{ mb: 1 }}>Быстрые стили</Typography>
                          <FormControl fullWidth size="small">
                            <InputLabel>Выберите стиль</InputLabel>
                            <Select
                              label="Выберите стиль"
                              onChange={(e) => applyPreset(e.target.value, item.id)}
                              defaultValue=""
                              MenuProps={{
                                PaperProps: {
                                  style: {
                                    maxHeight: 400,
                                    overflowY: 'auto'
                                  }
                                }
                              }}
                              sx={{
                                '& .MuiSelect-select': {
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 1
                                }
                              }}
                            >
                              {Object.entries(STYLE_PRESETS).map(([key, preset]) => (
                                <MenuItem 
                                  key={key} 
                                  value={key}
                                  sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    minHeight: '48px',
                                    '&:hover': {
                                      backgroundColor: 'rgba(0, 0, 0, 0.04)'
                                    }
                                  }}
                                >
                                  <Box
                                    sx={{
                                      width: 24,
                                      height: 24,
                                      borderRadius: 1,
                                      background: preset.cardBackgroundType === 'gradient'
                                        ? `linear-gradient(${preset.cardGradientDirection}, ${preset.cardGradientColor1}, ${preset.cardGradientColor2})`
                                        : preset.cardBackgroundColor,
                                      border: `1px solid ${preset.borderColor}`,
                                      boxShadow: preset.style.shadow
                                    }}
                                  />
                                  <Typography>
                                    {key.split('_').map(word => word.charAt(0) + word.slice(1).toLowerCase()).join(' ')}
                                  </Typography>
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Box>
                    
                        <FormControl fullWidth size="small">
                          <InputLabel>Тип карточки</InputLabel>
                          <Select
                            value={section.cardType || CARD_TYPES.NONE}
                            label="Тип карточки"
                            onChange={(e) => handleSectionChange(item.id, 'cardType', e.target.value)}
                          >
                            <MenuItem value={CARD_TYPES.NONE}>Без карточек</MenuItem>
                            <MenuItem value={CARD_TYPES.SIMPLE}>Простая</MenuItem>
                            <MenuItem value={CARD_TYPES.ACCENT}>Акцентная</MenuItem>
                            <MenuItem value={CARD_TYPES.ELEVATED}>Приподнятая</MenuItem>
                            <MenuItem value={CARD_TYPES.GRADIENT}>Градиентная</MenuItem>
                          </Select>
                        </FormControl>

                        {section.cardType !== CARD_TYPES.NONE && (
                          <Box sx={{ mt: 2 }}>
                            <Typography variant="subtitle2" sx={{ mb: 1 }}>
                              Карточки секции
                            </Typography>
                            <Stack spacing={2}>
                              {(section.cards || []).length > 0 ? (
                                (section.cards || []).map((card) => (
                                  <Paper key={card.id} sx={{ p: 2 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                      <Typography variant="subtitle2">
                                        Карточка {card.id}
                                      </Typography>
                                      <IconButton
                                        size="small"
                                        color="error"
                                        onClick={() => handleDeleteCard(item.id, card.id)}
                                      >
                                        <DeleteIcon fontSize="small" />
                                      </IconButton>
                                    </Box>
                                    <Stack spacing={2}>
                                      <TextField
                                        fullWidth
                                        size="small"
                                        label="Заголовок карточки"
                                        value={card.title || ''}
                                        onChange={(e) => handleCardChange(item.id, card.id, 'title', e.target.value)}
                                      />
                                      <TextField
                                        fullWidth
                                        size="small"
                                        label="Содержание карточки"
                                        value={card.content || ''}
                                        onChange={(e) => handleCardChange(item.id, card.id, 'content', e.target.value)}
                                        multiline
                                        rows={3}
                                      />
                                      <FormControlLabel
                                        control={
                                          <Switch
                                            checked={card.showTitle !== false}
                                            onChange={(e) => handleCardChange(item.id, card.id, 'showTitle', e.target.checked)}
                                          />
                                        }
                                        label="Показывать заголовок"
                                      />
                                      <Box sx={{ display: 'flex', gap: 12 }}>
                                        <TextField
                                          fullWidth
                                          size="small"
                                          label="Цвет заголовка"
                                          type="color"
                                          value={card.titleColor || '#1976d2'}
                                          onChange={(e) => handleCardChange(item.id, card.id, 'titleColor', e.target.value)}
                                        />
                                        <TextField
                                          fullWidth
                                          size="small"
                                          label="Цвет текста"
                                          type="color"
                                          value={card.contentColor || '#666666'}
                                          onChange={(e) => handleCardChange(item.id, card.id, 'contentColor', e.target.value)}
                                        />
                                      </Box>
                                      <Box sx={{ display: 'flex', gap: 12 }}>
                                        <TextField
                                          fullWidth
                                          size="small"
                                          label="Цвет обводки"
                                          type="color"
                                          value={card.borderColor || '#e0e0e0'}
                                          onChange={(e) => handleCardChange(item.id, card.id, 'borderColor', e.target.value)}
                                        />
                                      </Box>
                                      <FormControl fullWidth size="small">
                                        <InputLabel>Тип фона</InputLabel>
                                        <Select
                                          value={card.backgroundType || 'solid'}
                                          label="Тип фона"
                                          onChange={(e) => handleCardChange(item.id, card.id, 'backgroundType', e.target.value)}
                                        >
                                          <MenuItem value="solid">Сплошной цвет</MenuItem>
                                          <MenuItem value="gradient">Градиент</MenuItem>
                                        </Select>
                                      </FormControl>
                                      {card.backgroundType === 'solid' ? (
                                        <TextField
                                          fullWidth
                                          size="small"
                                          label="Цвет фона"
                                          type="color"
                                          value={card.backgroundColor || '#ffffff'}
                                          onChange={(e) => handleCardChange(item.id, card.id, 'backgroundColor', e.target.value)}
                                        />
                                      ) : (
                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                          <Box sx={{ display: 'flex', gap: 12 }}>
                                            <TextField
                                              fullWidth
                                              size="small"
                                              label="Цвет 1"
                                              type="color"
                                              value={card.gradientColor1 || '#ffffff'}
                                              onChange={(e) => handleCardChange(item.id, card.id, 'gradientColor1', e.target.value)}
                                            />
                                            <TextField
                                              fullWidth
                                              size="small"
                                              label="Цвет 2"
                                              type="color"
                                              value={card.gradientColor2 || '#f5f5f5'}
                                              onChange={(e) => handleCardChange(item.id, card.id, 'gradientColor2', e.target.value)}
                                            />
                                          </Box>
                                          <FormControl fullWidth size="small">
                                            <InputLabel>Направление градиента</InputLabel>
                                            <Select
                                              value={card.gradientDirection || 'to right'}
                                              label="Направление градиента"
                                              onChange={(e) => handleCardChange(item.id, card.id, 'gradientDirection', e.target.value)}
                                            >
                                              <MenuItem value="to right">Слева направо</MenuItem>
                                              <MenuItem value="to left">Справа налево</MenuItem>
                                              <MenuItem value="to bottom">Сверху вниз</MenuItem>
                                              <MenuItem value="to top">Снизу вверх</MenuItem>
                                              <MenuItem value="45deg">По диагонали (45°)</MenuItem>
                                              <MenuItem value="135deg">По диагонали (135°)</MenuItem>
                                            </Select>
                                          </FormControl>
                                        </Box>
                                      )}
                                      <TextField
                                        fullWidth
                                        size="small"
                                        label="Цвет текста заголовка"
                                        type="color"
                                        value={card.titleColor || '#000000'}
                                        onChange={(e) => handleCardChange(item.id, card.id, 'titleColor', e.target.value)}
                                      />
                                      <TextField
                                        fullWidth
                                        size="small"
                                        label="Цвет текста содержимого"
                                        type="color"
                                        value={card.contentColor || '#000000'}
                                        onChange={(e) => handleCardChange(item.id, card.id, 'contentColor', e.target.value)}
                                      />
                                    </Stack>
                                  </Paper>
                                ))
                              ) : (
                                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                                  Нет добавленных карточек
                                </Typography>
                              )}
                              <Button
                                variant="outlined"
                                size="small"
                                startIcon={<AddIcon />}
                                onClick={() => handleAddCard(item.id)}
                                sx={{ mt: 1 }}
                              >
                                Добавить карточку
                              </Button>
                            </Stack>
                          </Box>
                        )}

                        {/* Расширенный редактор секций */}
                        <EnhancedSectionEditor
                          section={section}
                          sectionId={item.id}
                          onSectionChange={handleSectionChange}
                          selectedElement={selectedElement}
                          onElementDeselect={onElementDeselect}
                        />

                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                          <Button
                            size="small"
                            color="error"
                            onClick={() => handleDeleteMenuItem(item.id)}
                            startIcon={<DeleteIcon fontSize="small" />}
                          >
                            Удалить секцию
                          </Button>
                        </Box>
                      </Stack>
                    </Collapse>
                  </Paper>
                );
              })}
            </Stack>
          </Collapse>
        </Paper>
  );

  // Обработчик сообщений для обновления фона и изображений секций
  function handleMessage(event) {
    if (event.data.type === 'UPDATE_BACKGROUND') {
      const backgroundImage = document.querySelector('.background-image');
      if (backgroundImage) {
        backgroundImage.style.backgroundImage = `url(${event.data.imageUrl})`;
      }
    } else if (event.data.type === 'UPDATE_SECTION_IMAGE') {
      // Обновляем изображение для конкретной секции
      const { sectionId, imagePath } = event.data;
      if (sectionId && imagePath) {
        console.log(`Updating image for section ${sectionId}: ${imagePath}`);
        // Добавляем параметр времени, чтобы избежать кеширования браузером
        const imageUrl = `${imagePath}?t=${Date.now()}`;
        
        // Найти элемент изображения секции
        const sectionElement = document.getElementById(sectionId);
        if (sectionElement) {
          const imgElement = sectionElement.querySelector('.section-image img');
          if (imgElement) {
            imgElement.src = imageUrl;
          } else if (sectionId === 'about') {
            // Для секции "О нас" структура может быть другой
            const aboutImgElement = sectionElement.querySelector('.about-image img');
            if (aboutImgElement) {
              aboutImgElement.src = imageUrl;
            }
          }
        }
      }
    } else if (event.data.type === 'REMOVE_SECTION_IMAGE') {
      // Обрабатываем удаление изображения секции
      const { sectionId } = event.data;
      if (sectionId) {
        console.log(`Removing image for section ${sectionId}`);
        
        // Найти элемент изображения секции
        const sectionElement = document.getElementById(sectionId);
        if (sectionElement) {
          // В зависимости от структуры секции, ищем разные элементы
          if (sectionId === 'about') {
            // Для секции "О нас"
            const aboutImgElement = sectionElement.querySelector('.about-image img');
            if (aboutImgElement) {
              // Можно скрыть или поставить заглушку
              aboutImgElement.style.display = 'none';
              // Или установить заглушку 
              // aboutImgElement.src = '/placeholder.jpg'; 
            }
          } else {
            // Для обычных секций
            const sectionImageDiv = sectionElement.querySelector('.section-image');
            if (sectionImageDiv) {
              sectionImageDiv.style.display = 'none';
            }
          }
        }
      }
    }
  }
  // Блок для редактирования "О нас"
  const aboutEditorBlock = (
    <Paper 
      sx={{ 
        p: 2, 
        mb: 2,
        backgroundColor: '#f0f9ff'
      }}
      id="about"
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography 
          variant="h6" 
          sx={{ cursor: 'pointer', flexGrow: 1 }}
          onClick={() => toggleSection('about')}
        >
          О нас
        </Typography>
        <IconButton
          onClick={() => toggleSection('about')}
          aria-expanded={expandedSections.about}
          aria-label="show more"
          sx={{ cursor: 'pointer' }}
        >
          {expandedSections.about ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
      </Box>

      <Collapse in={expandedSections.about} timeout="auto" unmountOnExit>
        <Stack spacing={2} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Заголовок секции"
            value={sectionsData.about?.title || ''}
            onChange={(e) => handleSectionChange('about', 'title', e.target.value)}
          />
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Описание секции"
            value={sectionsData.about?.description || ''}
            onChange={(e) => handleSectionChange('about', 'description', e.target.value)}
          />
          <Box sx={{ display: 'flex', gap: 12 }}>
            <TextField
              fullWidth
              label="Цвет заголовка"
              type="color"
              value={sectionsData.about?.titleColor || '#000000'}
              onChange={(e) => handleSectionChange('about', 'titleColor', e.target.value)}
            />
            <TextField
              fullWidth
              label="Цвет описания"
              type="color"
              value={sectionsData.about?.descriptionColor || '#666666'}
              onChange={(e) => handleSectionChange('about', 'descriptionColor', e.target.value)}
            />
          </Box>
          <Box sx={{ display: 'flex', gap: 12, alignItems: 'center', mt: 1 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Button
                variant="contained"
                startIcon={<ImageIcon />}
                onClick={() => document.getElementById('about-image-upload').click()}
                sx={{ minWidth: '200px' }}
              >
                {sectionsData.about?.imagePath ? 'Изменить изображение' : 'Загрузить изображение'}
              </Button>
              
              {sectionsData.about?.imagePath && (
                <>
                  <IconButton
                    color="error"
                    onClick={handleDeleteAboutImage}
                    aria-label="Удалить изображение"
                  >
                    <DeleteIcon />
                  </IconButton>
                  
                  <Typography variant="body2" color="textSecondary" sx={{ fontSize: '0.8rem', mt: 0.5 }}>
                    {sectionsData.about.imagePath.split('/').pop()}
                  </Typography>
                </>
              )}
            </Box>
            
            <input
              type="file"
              id="about-image-upload"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleAboutImageUpload}
            />
          </Box>
        </Stack>
      </Collapse>
    </Paper>
  );

  // Компонент для отображения галереи изображений секции
  // SectionImageGallery был перемещен в отдельный файл

  const handleReorderImagesInSection = (sectionId, startIndex, endIndex) => {
  const updatedSectionsData = handleReorderImages(sectionsData, sectionId, startIndex, endIndex);
  
  if (updatedSectionsData === sectionsData) return;

  console.log('[EditorPanel] Reordered images for section:', sectionId, 'Images:', updatedSectionsData[sectionId].images);

  onSectionsChange(updatedSectionsData);

  // Обновляем превью
  try {
    const previewIframe = document.querySelector('iframe.preview-iframe');
    if (previewIframe && previewIframe.contentWindow) {
      previewIframe.contentWindow.postMessage({
        type: 'REORDER_SECTION_IMAGES',
        sectionId: sectionId,
        images: updatedSectionsData[sectionId].images
      }, '*');
    }
  } catch (error) {
    console.error('Ошибка при отправке сообщения в превью:', error);
  }
};

  return (
    <Container maxWidth={false} sx={{ maxWidth: '100%', px: 2 }}>
      <Paper sx={{ p: 3 }}>
        {aiParserBlock}
        {headerEditorBlock}
        {heroEditorBlock}
        {sectionsEditor}
        {contactEditorBlock}
        {footerEditorBlock}
        {legalDocumentsEditorBlock}
        {liveChatEditorBlock}
        
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 12 }}>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<DownloadIcon />}
          onClick={() => {
    
            handleDownloadSite();
          }}
        >
          {currentConstructorMode ? '📄 Скачать сайт (одностраничный)' : '📁 Скачать сайт (многостраничный)'}
        </Button>
        <Button
          variant="contained"
          color="secondary"
          startIcon={<DownloadIcon />}
          onClick={handleDownloadPHP}
        >
          Скачать PHP версию
        </Button>
      </Box>
      </Paper>

      {/* Delete confirmation dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCancelDelete}
      >
        <DialogTitle>Delete Confirmation</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this section? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

// Функция для генерации английских имен файлов изображений галереи
const generateGalleryImageFileName = (image, index, sectionId) => {
  // Генерируем простое имя типа image-gallery1.jpg
  const fileName = `image-gallery${index + 1}.jpg`;
  
  console.log(`🖼️ [generateGalleryImageFileName] Генерируем имя файла: ${fileName} для изображения ${index + 1}`);
  
  return fileName;
};

export default EditorPanel; 