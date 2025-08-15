import { CARD_TYPES } from './configUtils';

export const STYLE_PRESETS = {
  // === БАЗОВЫЕ СТИЛИ ===
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
    titleColor: '#ff0000',
    descriptionColor: '#ff0000',
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
    titleColor: '#ff0000',
    descriptionColor: '#ff0000',
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

  // === НЕОНОВЫЕ СТИЛИ ===
  NEON_BLUE: {
    titleColor: '#00ffff',
    descriptionColor: '#00b8d4',
    cardType: 'gradient',
    backgroundColor: '#000033',
    borderColor: '#18ffff',
    cardBackgroundColor: '#000066',
    cardBorderColor: '#00ffff',
    cardTitleColor: '#ffffff',
    cardContentColor: '#e0f7fa',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#00acc1',
    cardGradientColor2: '#18ffff',
    cardGradientDirection: '45deg',
    style: {
      shadow: '0 6px 12px rgba(24,255,255,0.4)',
      borderRadius: '16px',
      padding: '20px'
    }
  },
  NEON_PURPLE: {
    titleColor: '#ff00ff',
    descriptionColor: '#ea80fc',
    cardType: 'gradient',
    backgroundColor: '#1a0033',
    borderColor: '#e1bee7',
    cardBackgroundColor: '#330066',
    cardBorderColor: '#ff00ff',
    cardTitleColor: '#ffffff',
    cardContentColor: '#ea80fc',
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
  NEON_GREEN: {
    titleColor: '#00ff00',
    descriptionColor: '#69f0ae',
    cardType: 'gradient',
    backgroundColor: '#001a00',
    borderColor: '#69f0ae',
    cardBackgroundColor: '#003300',
    cardBorderColor: '#00ff00',
    cardTitleColor: '#000000',
    cardContentColor: '#000000',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#00ff00',
    cardGradientColor2: '#69f0ae',
    cardGradientDirection: '45deg',
    style: {
      shadow: '0 6px 12px rgba(0,255,0,0.4)',
      borderRadius: '16px',
      padding: '20px'
    }
  },
  NEON_RAINBOW: {
    titleColor: '#ff0080',
    descriptionColor: '#80ff00',
    cardType: 'gradient',
    backgroundColor: '#000033',
    borderColor: '#0080ff',
    cardBackgroundColor: '#1a1a1a',
    cardBorderColor: '#ff0080',
    cardTitleColor: '#ffffff',
    cardContentColor: '#80ff00',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#ff0080',
    cardGradientColor2: '#0080ff',
    cardGradientDirection: '45deg',
    style: {
      shadow: '0 6px 12px rgba(255,0,128,0.4)',
      borderRadius: '16px',
      padding: '20px'
    }
  },
  NEON_CYBERPUNK: {
    titleColor: '#00fff5',
    descriptionColor: '#ffffff',
    cardType: 'gradient',
    backgroundColor: '#0a0a1f',
    borderColor: '#ff00ff',
    cardBackgroundColor: '#000033',
    cardBorderColor: '#00fff5',
    cardTitleColor: '#ffffff',
    cardContentColor: '#ffffff',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#00fff5',
    cardGradientColor2: '#ff00ff',
    cardGradientDirection: '135deg',
    style: {
      shadow: '0 6px 12px rgba(0,255,245,0.4)',
      borderRadius: '16px',
      padding: '20px'
    }
  },
  NEON_SUNSET: {
    titleColor: '#ff0066',
    descriptionColor: '#ff6600',
    cardType: 'gradient',
    backgroundColor: '#1a0033',
    borderColor: '#ff6600',
    cardBackgroundColor: '#330066',
    cardBorderColor: '#ff0066',
    cardTitleColor: '#ffffff',
    cardContentColor: '#ff6600',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#ff0066',
    cardGradientColor2: '#ff6600',
    cardGradientDirection: 'to bottom left',
    style: {
      shadow: '0 6px 12px rgba(255,0,102,0.4)',
      borderRadius: '16px',
      padding: '20px'
    }
  },
  NEON_CYAN: {
    titleColor: '#ffffff',
    descriptionColor: '#e0f7fa',
    cardType: 'gradient',
    backgroundColor: '#006064',
    borderColor: '#18ffff',
    cardBackgroundColor: '#00838f',
    cardBorderColor: '#00acc1',
    cardTitleColor: '#ffffff',
    cardContentColor: '#e0f7fa',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#00acc1',
    cardGradientColor2: '#00e5ff',
    cardGradientDirection: '135deg',
    style: {
      shadow: '0 6px 12px rgba(24,255,255,0.4)',
      borderRadius: '16px',
      padding: '20px'
    }
  },
  NEON_MAGENTA: {
    titleColor: '#ffffff',
    descriptionColor: '#ff69b4',
    cardType: 'gradient',
    backgroundColor: '#1a001a',
    borderColor: '#ff69b4',
    cardBackgroundColor: '#330033',
    cardBorderColor: '#ff1493',
    cardTitleColor: '#ffffff',
    cardContentColor: '#ff69b4',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#330033',
    cardGradientColor2: '#ff1493',
    cardGradientDirection: '135deg',
    style: {
      shadow: '0 6px 12px rgba(255,20,147,0.5)',
      borderRadius: '16px',
      padding: '20px'
    }
  },
  NEON_ELECTRIC: {
    titleColor: '#ffffff',
    descriptionColor: '#00ffff',
    cardType: 'gradient',
    backgroundColor: '#001a1a',
    borderColor: '#00ffff',
    cardBackgroundColor: '#003333',
    cardBorderColor: '#00cccc',
    cardTitleColor: '#ffffff',
    cardContentColor: '#00ffff',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#003333',
    cardGradientColor2: '#00cccc',
    cardGradientDirection: '45deg',
    style: {
      shadow: '0 6px 12px rgba(0,255,255,0.5)',
      borderRadius: '16px',
      padding: '20px'
    }
  },
  NEON_ACID: {
    titleColor: '#ffffff',
    descriptionColor: '#00ff00',
    cardType: 'gradient',
    backgroundColor: '#0d1a00',
    borderColor: '#00ff00',
    cardBackgroundColor: '#1a3300',
    cardBorderColor: '#66ff00',
    cardTitleColor: '#ffffff',
    cardContentColor: '#00ff00',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#1a3300',
    cardGradientColor2: '#66ff00',
    cardGradientDirection: '135deg',
    style: {
      shadow: '0 6px 12px rgba(0,255,0,0.5)',
      borderRadius: '16px',
      padding: '20px'
    }
  },
  NEON_PLASMA: {
    titleColor: '#ffffff',
    descriptionColor: '#ff00aa',
    cardType: 'gradient',
    backgroundColor: '#1a0011',
    borderColor: '#ff00aa',
    cardBackgroundColor: '#330022',
    cardBorderColor: '#ff0066',
    cardTitleColor: '#ffffff',
    cardContentColor: '#ff00aa',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#330022',
    cardGradientColor2: '#ff0066',
    cardGradientDirection: '45deg',
    style: {
      shadow: '0 6px 12px rgba(255,0,170,0.5)',
      borderRadius: '16px',
      padding: '20px'
    }
  },
  NEON_VOLTAGE: {
    titleColor: '#ffffff',
    descriptionColor: '#ffff00',
    cardType: 'gradient',
    backgroundColor: '#1a1a00',
    borderColor: '#ffff00',
    cardBackgroundColor: '#333300',
    cardBorderColor: '#ffff00',
    cardTitleColor: '#ffffff',
    cardContentColor: '#ffff00',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#333300',
    cardGradientColor2: '#ffff33',
    cardGradientDirection: '135deg',
    style: {
      shadow: '0 6px 12px rgba(255,255,0,0.5)',
      borderRadius: '16px',
      padding: '20px'
    }
  },

  // === ПРИРОДНЫЕ/ЭЛЕМЕНТЫ ===
  OCEAN_WAVE: {
    titleColor: '#01579b',
    descriptionColor: '#0277bd',
    cardType: 'gradient',
    backgroundColor: '#e0f7fa',
    borderColor: '#b2ebf2',
    cardBackgroundColor: '#ffffff',
    cardBorderColor: '#4dd0e1',
    cardTitleColor: '#ffffff',
    cardContentColor: '#e0f7fa',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#00acc1',
    cardGradientColor2: '#26c6da',
    cardGradientDirection: '45deg',
    style: {
      shadow: '0 4px 8px rgba(0,172,193,0.3)',
      borderRadius: '14px',
      padding: '18px'
    }
  },
  MAGENTA_GLOW: {
    titleColor: '#ad1457',
    descriptionColor: '#c2185b',
    cardType: 'gradient',
    backgroundColor: '#fce4ec',
    borderColor: '#f8bbd9',
    cardBackgroundColor: '#ffffff',
    cardBorderColor: '#f06292',
    cardTitleColor: '#ffffff',
    cardContentColor: '#fce4ec',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#e91e63',
    cardGradientColor2: '#f06292',
    cardGradientDirection: '45deg',
    style: {
      shadow: '0 4px 8px rgba(233,30,99,0.3)',
      borderRadius: '14px',
      padding: '18px'
    }
  },
  FIRE_BURST: {
    titleColor: '#ffffff',
    descriptionColor: '#ffab91',
    cardType: 'gradient',
    backgroundColor: '#d84315',
    borderColor: '#ff5722',
    cardBackgroundColor: '#bf360c',
    cardBorderColor: '#ff5722',
    cardTitleColor: '#ffffff',
    cardContentColor: '#ffab91',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#d84315',
    cardGradientColor2: '#ff5722',
    cardGradientDirection: '45deg',
    style: {
      shadow: '0 6px 12px rgba(255,87,34,0.4)',
      borderRadius: '16px',
      padding: '20px'
    }
  },
  VIOLET_STORM: {
    titleColor: '#ffffff',
    descriptionColor: '#d1c4e9',
    cardType: 'gradient',
    backgroundColor: '#4527a0',
    borderColor: '#673ab7',
    cardBackgroundColor: '#311b92',
    cardBorderColor: '#512da8',
    cardTitleColor: '#ffffff',
    cardContentColor: '#d1c4e9',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#4527a0',
    cardGradientColor2: '#673ab7',
    cardGradientDirection: '45deg',
    style: {
      shadow: '0 6px 12px rgba(103,58,183,0.4)',
      borderRadius: '16px',
      padding: '20px'
    }
  },
  ELECTRIC_LIME: {
    titleColor: '#33691e',
    descriptionColor: '#689f38',
    cardType: 'gradient',
    backgroundColor: '#f1f8e9',
    borderColor: '#c5e1a5',
    cardBackgroundColor: '#ffffff',
    cardBorderColor: '#8bc34a',
    cardTitleColor: '#ffffff',
    cardContentColor: '#f1f8e9',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#689f38',
    cardGradientColor2: '#8bc34a',
    cardGradientDirection: '45deg',
    style: {
      shadow: '0 4px 8px rgba(139,195,74,0.3)',
      borderRadius: '14px',
      padding: '18px'
    }
  },
  DEEP_OCEAN: {
    titleColor: '#ffffff',
    descriptionColor: '#80deea',
    cardType: 'gradient',
    backgroundColor: '#006064',
    borderColor: '#00acc1',
    cardBackgroundColor: '#00838f',
    cardBorderColor: '#00acc1',
    cardTitleColor: '#ffffff',
    cardContentColor: '#80deea',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#006064',
    cardGradientColor2: '#00838f',
    cardGradientDirection: '45deg',
    style: {
      shadow: '0 6px 12px rgba(0,172,193,0.4)',
      borderRadius: '16px',
      padding: '20px'
    }
  },
  ROSE_GOLD: {
    titleColor: '#ad1457',
    descriptionColor: '#c2185b',
    cardType: 'gradient',
    backgroundColor: '#fce4ec',
    borderColor: '#f8bbd9',
    cardBackgroundColor: '#ffffff',
    cardBorderColor: '#f06292',
    cardTitleColor: '#ffffff',
    cardContentColor: '#fce4ec',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#e91e63',
    cardGradientColor2: '#f06292',
    cardGradientDirection: '45deg',
    style: {
      shadow: '0 4px 8px rgba(233,30,99,0.3)',
      borderRadius: '14px',
      padding: '18px'
    }
  },
  SILVER_MIST: {
    titleColor: '#263238',
    descriptionColor: '#37474f',
    cardType: 'elevated',
    backgroundColor: '#eceff1',
    borderColor: '#78909c',
    cardBackgroundColor: '#ffffff',
    cardBorderColor: '#607d8b',
    cardTitleColor: '#263238',
    cardContentColor: '#37474f',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#eceff1',
    cardGradientColor2: '#cfd8dc',
    cardGradientDirection: '135deg',
    style: {
      shadow: '0 2px 4px rgba(96,125,139,0.2)',
      borderRadius: '8px',
      padding: '16px'
    }
  },
  TROPICAL_PARADISE: {
    titleColor: '#004d40',
    descriptionColor: '#00695c',
    cardType: 'elevated',
    backgroundColor: '#e0f2f1',
    borderColor: '#26a69a',
    cardBackgroundColor: '#ffffff',
    cardBorderColor: '#00897b',
    cardTitleColor: '#004d40',
    cardContentColor: '#00695c',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#e0f2f1',
    cardGradientColor2: '#b2dfdb',
    cardGradientDirection: '45deg',
    style: {
      shadow: '0 3px 6px rgba(0,137,123,0.2)',
      borderRadius: '10px',
      padding: '16px'
    }
  },
  GOLDEN_HOUR: {
    titleColor: '#e65100',
    descriptionColor: '#f57c00',
    cardType: 'elevated',
    backgroundColor: '#fff8e1',
    borderColor: '#ffcc02',
    cardBackgroundColor: '#ffffff',
    cardBorderColor: '#ffc107',
    cardTitleColor: '#e65100',
    cardContentColor: '#f57c00',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#fff8e1',
    cardGradientColor2: '#ffecb3',
    cardGradientDirection: 'to bottom right',
    style: {
      shadow: '0 4px 8px rgba(255,193,7,0.3)',
      borderRadius: '12px',
      padding: '18px'
    }
  },

  // === КОСМИЧЕСКИЕ/ТЕМНЫЕ ===
  COSMIC_BLUE: {
    titleColor: '#ffffff',
    descriptionColor: '#e3f2fd',
    cardType: 'gradient',
    backgroundColor: '#0d47a1',
    borderColor: '#42a5f5',
    cardBackgroundColor: '#1565c0',
    cardBorderColor: '#1976d2',
    cardTitleColor: '#ffffff',
    cardContentColor: '#e3f2fd',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#1976d2',
    cardGradientColor2: '#42a5f5',
    cardGradientDirection: '135deg',
    style: {
      shadow: '0 6px 12px rgba(66,165,245,0.4)',
      borderRadius: '16px',
      padding: '20px'
    }
  },
  ROYAL_PURPLE: {
    titleColor: '#ffffff',
    descriptionColor: '#ede7f6',
    cardType: 'gradient',
    backgroundColor: '#311b92',
    borderColor: '#9575cd',
    cardBackgroundColor: '#512da8',
    cardBorderColor: '#673ab7',
    cardTitleColor: '#ffffff',
    cardContentColor: '#ede7f6',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#512da8',
    cardGradientColor2: '#7986cb',
    cardGradientDirection: '45deg',
    style: {
      shadow: '0 6px 12px rgba(149,117,205,0.4)',
      borderRadius: '16px',
      padding: '20px'
    }
  },
  MIDNIGHT_FOREST: {
    titleColor: '#a5d6a7',
    descriptionColor: '#c8e6c9',
    cardType: 'gradient',
    backgroundColor: '#1b5e20',
    borderColor: '#66bb6a',
    cardBackgroundColor: '#2e7d32',
    cardBorderColor: '#43a047',
    cardTitleColor: '#ffffff',
    cardContentColor: '#c8e6c9',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#2e7d32',
    cardGradientColor2: '#388e3c',
    cardGradientDirection: 'to bottom',
    style: {
      shadow: '0 5px 10px rgba(102,187,106,0.3)',
      borderRadius: '14px',
      padding: '18px'
    }
  },
  SPACE_NEBULA: {
    titleColor: '#e1bee7',
    descriptionColor: '#ce93d8',
    cardType: 'gradient',
    backgroundColor: '#1a0033',
    borderColor: '#ba68c8',
    cardBackgroundColor: '#2d0052',
    cardBorderColor: '#4a0e7a',
    cardTitleColor: '#ffffff',
    cardContentColor: '#e1bee7',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#2d0052',
    cardGradientColor2: '#4a0e7a',
    cardGradientDirection: '135deg',
    style: {
      shadow: '0 6px 12px rgba(186,104,200,0.4)',
      borderRadius: '16px',
      padding: '20px'
    }
  },
  AURORA_GLOW: {
    titleColor: '#ffffff',
    descriptionColor: '#e0aaff',
    cardType: 'gradient',
    backgroundColor: '#10002b',
    borderColor: '#240046',
    cardBackgroundColor: '#3c096c',
    cardBorderColor: '#5a189a',
    cardTitleColor: '#ffffff',
    cardContentColor: '#e0aaff',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#5a189a',
    cardGradientColor2: '#9d4edd',
    cardGradientDirection: '135deg',
    style: {
      shadow: '0 6px 12px rgba(157,78,221,0.5)',
      borderRadius: '16px',
      padding: '20px'
    }
  },
  GALAXY_DREAM: {
    titleColor: '#e0aaff',
    descriptionColor: '#c77dff',
    cardType: 'gradient',
    backgroundColor: '#03071e',
    borderColor: '#370617',
    cardBackgroundColor: '#141624',
    cardBorderColor: '#480ca8',
    cardTitleColor: '#ffffff',
    cardContentColor: '#e0aaff',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#480ca8',
    cardGradientColor2: '#7209b7',
    cardGradientDirection: '45deg',
    style: {
      shadow: '0 8px 16px rgba(114,9,183,0.5)',
      borderRadius: '18px',
      padding: '22px'
    }
  },
  VOLCANIC_FIRE: {
    titleColor: '#ffffff',
    descriptionColor: '#ffba08',
    cardType: 'gradient',
    backgroundColor: '#370617',
    borderColor: '#9d0208',
    cardBackgroundColor: '#6a040f',
    cardBorderColor: '#dc2f02',
    cardTitleColor: '#ffffff',
    cardContentColor: '#ffba08',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#dc2f02',
    cardGradientColor2: '#f48c06',
    cardGradientDirection: '135deg',
    style: {
      shadow: '0 6px 12px rgba(220,47,2,0.4)',
      borderRadius: '16px',
      padding: '20px'
    }
  },

  // === ЯРКИЕ/СВЕЖИЕ ===
  CRIMSON_FLAME: {
    titleColor: '#ffffff',
    descriptionColor: '#ffebee',
    cardType: 'elevated',
    backgroundColor: '#b71c1c',
    borderColor: '#ef5350',
    cardBackgroundColor: '#c62828',
    cardBorderColor: '#d32f2f',
    cardTitleColor: '#ffffff',
    cardContentColor: '#ffebee',
    cardBackgroundType: 'solid',
    cardGradientColor1: '#b71c1c',
    cardGradientColor2: '#c62828',
    cardGradientDirection: '45deg',
    style: {
      shadow: '0 4px 8px rgba(211,47,47,0.3)',
      borderRadius: '12px',
      padding: '18px'
    }
  },
  DESERT_SUNSET: {
    titleColor: '#d62d20',
    descriptionColor: '#e85d04',
    cardType: 'gradient',
    backgroundColor: '#fff3e0',
    borderColor: '#ffcc02',
    cardBackgroundColor: '#ffffff',
    cardBorderColor: '#f48c06',
    cardTitleColor: '#ffffff',
    cardContentColor: '#fff3e0',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#f48c06',
    cardGradientColor2: '#e85d04',
    cardGradientDirection: '45deg',
    style: {
      shadow: '0 5px 10px rgba(244,140,6,0.3)',
      borderRadius: '14px',
      padding: '18px'
    }
  },
  ICE_CRYSTAL: {
    titleColor: '#003566',
    descriptionColor: '#0077b6',
    cardType: 'elevated',
    backgroundColor: '#caf0f8',
    borderColor: '#90e0ef',
    cardBackgroundColor: '#ffffff',
    cardBorderColor: '#00b4d8',
    cardTitleColor: '#003566',
    cardContentColor: '#0077b6',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#caf0f8',
    cardGradientColor2: '#90e0ef',
    cardGradientDirection: 'to bottom',
    style: {
      shadow: '0 3px 6px rgba(0,180,216,0.2)',
      borderRadius: '10px',
      padding: '16px'
    }
  },
  MINT_FRESH: {
    titleColor: '#264653',
    descriptionColor: '#2a9d8f',
    cardType: 'elevated',
    backgroundColor: '#f1faee',
    borderColor: '#e9ecef',
    cardBackgroundColor: '#ffffff',
    cardBorderColor: '#2a9d8f',
    cardTitleColor: '#264653',
    cardContentColor: '#2a9d8f',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#f1faee',
    cardGradientColor2: '#e9c46a',
    cardGradientDirection: 'to bottom',
    style: {
      shadow: '0 4px 8px rgba(42,157,143,0.2)',
      borderRadius: '12px',
      padding: '18px'
    }
  },
  FRESH_LIME: {
    titleColor: '#2d5016',
    descriptionColor: '#52b788',
    cardType: 'elevated',
    backgroundColor: '#d8f3dc',
    borderColor: '#95d5b2',
    cardBackgroundColor: '#ffffff',
    cardBorderColor: '#74c69d',
    cardTitleColor: '#2d5016',
    cardContentColor: '#52b788',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#d8f3dc',
    cardGradientColor2: '#95d5b2',
    cardGradientDirection: 'to bottom',
    style: {
      shadow: '0 4px 8px rgba(116,198,157,0.2)',
      borderRadius: '12px',
      padding: '16px'
    }
  },
  RETRO_WAVE: {
    titleColor: '#ff006e',
    descriptionColor: '#fb5607',
    cardType: 'gradient',
    backgroundColor: '#03071e',
    borderColor: '#6a4c93',
    cardBackgroundColor: '#240046',
    cardBorderColor: '#ff006e',
    cardTitleColor: '#ffffff',
    cardContentColor: '#ffbe0b',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#6a4c93',
    cardGradientColor2: '#ff006e',
    cardGradientDirection: '135deg',
    style: {
      shadow: '0 6px 12px rgba(255,0,110,0.4)',
      borderRadius: '16px',
      padding: '20px'
    }
  },
  CYBER_PUNK: {
    titleColor: '#ff073a',
    descriptionColor: '#f72585',
    cardType: 'gradient',
    backgroundColor: '#0d0d0d',
    borderColor: '#ff073a',
    cardBackgroundColor: '#1a0d1a',
    cardBorderColor: '#ff073a',
    cardTitleColor: '#ffffff',
    cardContentColor: '#f72585',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#480ca8',
    cardGradientColor2: '#f72585',
    cardGradientDirection: '45deg',
    style: {
      shadow: '0 8px 16px rgba(247,37,133,0.4)',
      borderRadius: '20px',
      padding: '24px'
    }
  }
}; 