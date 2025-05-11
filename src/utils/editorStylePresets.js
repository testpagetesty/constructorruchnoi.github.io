import { CARD_TYPES } from './configUtils';

export const STYLE_PRESETS = {
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
  NEON_BLUE: {
    titleColor: '#00ffff',
    descriptionColor: '#00b8d4',
    cardType: 'gradient',
    backgroundColor: '#000033',
    borderColor: '#000066',
    cardBackgroundColor: '#000033',
    cardBorderColor: '#000066',
    cardTitleColor: '#00ffff',
    cardContentColor: '#e0f7fa',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#000033',
    cardGradientColor2: '#000066',
    cardGradientDirection: '45deg',
    style: {
      shadow: '0 4px 8px rgba(0,255,255,0.3)',
      borderRadius: '12px',
      padding: '16px'
    }
  },
  NEON_PURPLE: {
    titleColor: '#ff00ff',
    descriptionColor: '#ea80fc',
    cardType: 'gradient',
    backgroundColor: '#1a0033',
    borderColor: '#330066',
    cardBackgroundColor: '#1a0033',
    cardBorderColor: '#330066',
    cardTitleColor: '#ff00ff',
    cardContentColor: '#ea80fc',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#1a0033',
    cardGradientColor2: '#330066',
    cardGradientDirection: 'to bottom left',
    style: {
      shadow: '0 4px 8px rgba(255,0,255,0.3)',
      borderRadius: '12px',
      padding: '16px'
    }
  },
  NEON_GREEN: {
    titleColor: '#39ff14',
    descriptionColor: '#7fff00',
    cardType: 'gradient',
    backgroundColor: '#001a00',
    borderColor: '#003300',
    cardBackgroundColor: '#001a00',
    cardBorderColor: '#003300',
    cardTitleColor: '#39ff14',
    cardContentColor: '#7fff00',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#001a00',
    cardGradientColor2: '#003300',
    cardGradientDirection: '45deg',
    style: {
      shadow: '0 4px 8px rgba(57,255,20,0.3)',
      borderRadius: '12px',
      padding: '16px'
    }
  },
  NEON_PINK: {
    titleColor: '#ff69b4',
    descriptionColor: '#ffb6c1',
    cardType: 'gradient',
    backgroundColor: '#1a001a',
    borderColor: '#330033',
    cardBackgroundColor: '#1a001a',
    cardBorderColor: '#330033',
    cardTitleColor: '#ff69b4',
    cardContentColor: '#ffb6c1',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#1a001a',
    cardGradientColor2: '#330033',
    cardGradientDirection: 'to bottom left',
    style: {
      shadow: '0 4px 8px rgba(255,105,180,0.3)',
      borderRadius: '12px',
      padding: '16px'
    }
  },
  NEON_ORANGE: {
    titleColor: '#ff9933',
    descriptionColor: '#ffff00',
    cardType: 'gradient',
    backgroundColor: '#1a0f00',
    borderColor: '#331f00',
    cardBackgroundColor: '#1a0f00',
    cardBorderColor: '#331f00',
    cardTitleColor: '#ff9933',
    cardContentColor: '#ffff00',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#1a0f00',
    cardGradientColor2: '#331f00',
    cardGradientDirection: 'to bottom right',
    style: {
      shadow: '0 4px 8px rgba(255,153,51,0.3)',
      borderRadius: '12px',
      padding: '16px'
    }
  },
  NEON_RAINBOW: {
    titleColor: '#ff00ff', 
    descriptionColor: '#00ffff',
    cardType: 'gradient',
    backgroundColor: '#000033',
    borderColor: '#1a0033',
    cardBackgroundColor: '#000033',
    cardBorderColor: '#1a0033',
    cardTitleColor: '#ffffff',
    cardContentColor: '#ffffff',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#ff0000',
    cardGradientColor2: '#0000ff',
    cardGradientDirection: '90deg',
    style: {
      shadow: '0 4px 8px rgba(255,0,255,0.3)',
      borderRadius: '12px',
      padding: '16px'
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
  NEON_RED: {
    titleColor: '#ff0000',
    descriptionColor: '#ff5252',
    cardType: 'gradient',
    backgroundColor: '#1a0000',
    borderColor: '#330000',
    cardBackgroundColor: '#1a0000',
    cardBorderColor: '#330000',
    cardTitleColor: '#ff0000',
    cardContentColor: '#ff5252',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#1a0000',
    cardGradientColor2: '#330000',
    cardGradientDirection: 'to right',
    style: {
      shadow: '0 4px 8px rgba(255,0,0,0.3)',
      borderRadius: '12px',
      padding: '16px'
    }
  },
  NEON_GOLD: {
    titleColor: '#ffd700',
    descriptionColor: '#ffeb3b',
    cardType: 'gradient',
    backgroundColor: '#1a1a00',
    borderColor: '#333300',
    cardBackgroundColor: '#1a1a00',
    cardBorderColor: '#333300',
    cardTitleColor: '#ffd700',
    cardContentColor: '#ffeb3b',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#1a1a00',
    cardGradientColor2: '#333300',
    cardGradientDirection: '135deg',
    style: {
      shadow: '0 4px 8px rgba(255,215,0,0.3)',
      borderRadius: '12px',
      padding: '16px'
    }
  },
  NEON_ICE: {
    titleColor: '#00ffff',
    descriptionColor: '#84ffff',
    cardType: 'gradient',
    backgroundColor: '#001a1a',
    borderColor: '#003333',
    cardBackgroundColor: '#001a1a',
    cardBorderColor: '#003333',
    cardTitleColor: '#00ffff',
    cardContentColor: '#84ffff',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#001a1a',
    cardGradientColor2: '#003333',
    cardGradientDirection: '225deg',
    style: {
      shadow: '0 4px 8px rgba(0,255,255,0.3)',
      borderRadius: '12px',
      padding: '16px'
    }
  },
  NEON_TOXIC: {
    titleColor: '#39ff14',
    descriptionColor: '#5aff26',
    cardType: 'gradient',
    backgroundColor: '#0a1a00',
    borderColor: '#1a3300',
    cardBackgroundColor: '#0a1a00',
    cardBorderColor: '#1a3300',
    cardTitleColor: '#39ff14',
    cardContentColor: '#5aff26',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#0a1a00',
    cardGradientColor2: '#1a3300',
    cardGradientDirection: '315deg',
    style: {
      shadow: '0 4px 8px rgba(57,255,20,0.3)',
      borderRadius: '12px',
      padding: '16px'
    }
  },
  NEON_CYBERPUNK: {
    titleColor: '#ff00ff',
    descriptionColor: '#00fff5',
    cardType: 'gradient',
    backgroundColor: '#120458',
    borderColor: '#1a086d',
    cardBackgroundColor: '#120458',
    cardBorderColor: '#1a086d',
    cardTitleColor: '#ff2a6d',
    cardContentColor: '#00fff5',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#120458',
    cardGradientColor2: '#272ca4',
    cardGradientDirection: 'to bottom left',
    style: {
      shadow: '0 4px 8px rgba(255,42,109,0.3)',
      borderRadius: '12px',
      padding: '16px'
    }
  },
  NEON_SYNTHWAVE: {
    titleColor: '#ff71ce',
    descriptionColor: '#b967ff',
    cardType: 'gradient',
    backgroundColor: '#211042',
    borderColor: '#332063',
    cardBackgroundColor: '#211042',
    cardBorderColor: '#332063',
    cardTitleColor: '#fffb96',
    cardContentColor: '#05ffa1',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#211042',
    cardGradientColor2: '#3c157d',
    cardGradientDirection: '225deg',
    style: {
      shadow: '0 4px 8px rgba(255,113,206,0.3)',
      borderRadius: '12px',
      padding: '16px'
    }
  },
  NEON_RETRO: {
    titleColor: '#ff2975',
    descriptionColor: '#5ce6f7',
    cardType: 'gradient',
    backgroundColor: '#2b1055',
    borderColor: '#3f187d',
    cardBackgroundColor: '#2b1055',
    cardBorderColor: '#3f187d',
    cardTitleColor: '#ff9f51',
    cardContentColor: '#5ce6f7',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#2b1055',
    cardGradientColor2: '#7597de',
    cardGradientDirection: '45deg',
    style: {
      shadow: '0 4px 8px rgba(255,41,117,0.3)',
      borderRadius: '12px',
      padding: '16px'
    }
  },
  NEON_SUNSET: {
    titleColor: '#ff0066',
    descriptionColor: '#ff9933',
    cardType: 'gradient',
    backgroundColor: '#1a0033',
    borderColor: '#330066',
    cardBackgroundColor: '#1a0033',
    cardBorderColor: '#330066',
    cardTitleColor: '#ff0066',
    cardContentColor: '#ff9933',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#1a0033',
    cardGradientColor2: '#330066',
    cardGradientDirection: 'to bottom left',
    style: {
      shadow: '0 4px 8px rgba(255,0,102,0.3)',
      borderRadius: '12px',
      padding: '16px'
    }
  },
  VIBRANT_CORAL: {
    titleColor: '#ffffff',
    descriptionColor: '#ffffff',
    cardType: 'gradient',
    backgroundColor: '#ff4d6d',
    borderColor: '#ff758f',
    cardBackgroundColor: '#ffffff',
    cardBorderColor: '#ff758f',
    cardTitleColor: '#ff4d6d',
    cardContentColor: '#444444',
    cardBackgroundType: 'solid',
    cardGradientColor1: '#ff4d6d',
    cardGradientColor2: '#ff758f',
    cardGradientDirection: 'to right',
    style: {
      shadow: '0 4px 8px rgba(255,77,109,0.3)',
      borderRadius: '16px',
      padding: '16px'
    }
  },
  TEAL_SPLASH: {
    titleColor: '#ffffff',
    descriptionColor: '#e0f7fa',
    cardType: 'elevated',
    backgroundColor: '#00bcd4',
    borderColor: '#26c6da',
    cardBackgroundColor: '#ffffff',
    cardBorderColor: '#80deea',
    cardTitleColor: '#00838f',
    cardContentColor: '#006064',
    cardBackgroundType: 'solid',
    cardGradientColor1: '#e0f7fa',
    cardGradientColor2: '#b2ebf2',
    cardGradientDirection: 'to bottom',
    style: {
      shadow: '0 4px 8px rgba(0,188,212,0.3)',
      borderRadius: '12px',
      padding: '16px'
    }
  },
  MODERN_MUSTARD: {
    titleColor: '#212121',
    descriptionColor: '#424242',
    cardType: 'elevated',
    backgroundColor: '#ffd54f',
    borderColor: '#ffca28',
    cardBackgroundColor: '#ffffff',
    cardBorderColor: '#ffe082',
    cardTitleColor: '#ff6f00',
    cardContentColor: '#4e342e',
    cardBackgroundType: 'solid',
    cardGradientColor1: '#ffd54f',
    cardGradientColor2: '#ffca28',
    cardGradientDirection: 'to right',
    style: {
      shadow: '0 4px 8px rgba(255,213,79,0.3)',
      borderRadius: '8px',
      padding: '16px'
    }
  },
  BRIGHT_LIME: {
    titleColor: '#1b5e20',
    descriptionColor: '#2e7d32',
    cardType: 'elevated',
    backgroundColor: '#c6ff00',
    borderColor: '#aeea00',
    cardBackgroundColor: '#ffffff',
    cardBorderColor: '#d4e157',
    cardTitleColor: '#33691e',
    cardContentColor: '#1b5e20',
    cardBackgroundType: 'solid',
    cardGradientColor1: '#f0f4c3',
    cardGradientColor2: '#dce775',
    cardGradientDirection: 'to bottom',
    style: {
      shadow: '0 4px 8px rgba(198,255,0,0.2)',
      borderRadius: '12px',
      padding: '16px'
    }
  },
  VIVID_TURQUOISE: {
    titleColor: '#ffffff',
    descriptionColor: '#e0f2f1',
    cardType: 'gradient',
    backgroundColor: '#009688',
    borderColor: '#00796b',
    cardBackgroundColor: '#ffffff',
    cardBorderColor: '#4db6ac',
    cardTitleColor: '#00695c',
    cardContentColor: '#004d40',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#e0f2f1',
    cardGradientColor2: '#b2dfdb',
    cardGradientDirection: 'to bottom right',
    style: {
      shadow: '0 4px 8px rgba(0,150,136,0.3)',
      borderRadius: '16px',
      padding: '16px'
    }
  },
  BERRY_ACAI: {
    titleColor: '#ffffff',
    descriptionColor: '#f3e5f5',
    cardType: 'gradient',
    backgroundColor: '#9c27b0',
    borderColor: '#8e24aa',
    cardBackgroundColor: '#ffffff',
    cardBorderColor: '#ab47bc',
    cardTitleColor: '#6a1b9a',
    cardContentColor: '#4a148c',
    cardBackgroundType: 'solid',
    cardGradientColor1: '#e1bee7',
    cardGradientColor2: '#ce93d8',
    cardGradientDirection: 'to bottom',
    style: {
      shadow: '0 4px 8px rgba(156,39,176,0.3)',
      borderRadius: '12px',
      padding: '16px'
    }
  },
  ORANGE_SUNSET: {
    titleColor: '#ffffff',
    descriptionColor: '#fff3e0',
    cardType: 'gradient',
    backgroundColor: '#ff9800',
    borderColor: '#fb8c00',
    cardBackgroundColor: '#ffffff',
    cardBorderColor: '#ffb74d',
    cardTitleColor: '#e65100',
    cardContentColor: '#ef6c00',
    cardBackgroundType: 'solid',
    cardGradientColor1: '#fff3e0',
    cardGradientColor2: '#ffe0b2',
    cardGradientDirection: 'to bottom',
    style: {
      shadow: '0 4px 8px rgba(255,152,0,0.3)',
      borderRadius: '12px',
      padding: '16px'
    }
  },
  BLUE_LAGOON: {
    titleColor: '#ffffff',
    descriptionColor: '#e3f2fd',
    cardType: 'elevated',
    backgroundColor: '#03a9f4',
    borderColor: '#039be5',
    cardBackgroundColor: '#ffffff',
    cardBorderColor: '#4fc3f7',
    cardTitleColor: '#0277bd',
    cardContentColor: '#01579b',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#e3f2fd',
    cardGradientColor2: '#bbdefb',
    cardGradientDirection: 'to bottom right',
    style: {
      shadow: '0 4px 8px rgba(3,169,244,0.3)',
      borderRadius: '16px',
      padding: '16px'
    }
  },
  MODERN_MINT: {
    titleColor: '#ffffff',
    descriptionColor: '#e8f5e9',
    cardType: 'elevated',
    backgroundColor: '#4caf50',
    borderColor: '#43a047',
    cardBackgroundColor: '#ffffff',
    cardBorderColor: '#66bb6a',
    cardTitleColor: '#2e7d32',
    cardContentColor: '#1b5e20',
    cardBackgroundType: 'solid',
    cardGradientColor1: '#e8f5e9',
    cardGradientColor2: '#c8e6c9',
    cardGradientDirection: 'to bottom',
    style: {
      shadow: '0 4px 8px rgba(76,175,80,0.3)',
      borderRadius: '14px',
      padding: '16px'
    }
  },
  TRENDY_CORAL: {
    titleColor: '#ffffff',
    descriptionColor: '#ffffff',
    cardType: 'gradient',
    backgroundColor: '#ff5252',
    borderColor: '#ff1744',
    cardBackgroundColor: '#ffffff',
    cardBorderColor: '#ff8a80',
    cardTitleColor: '#d50000',
    cardContentColor: '#b71c1c',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#ffebee',
    cardGradientColor2: '#ffcdd2',
    cardGradientDirection: 'to bottom right',
    style: {
      shadow: '0 4px 8px rgba(255,82,82,0.3)',
      borderRadius: '16px',
      padding: '16px'
    }
  },
  MODERN_INDIGO: {
    titleColor: '#ffffff',
    descriptionColor: '#e8eaf6',
    cardType: 'gradient',
    backgroundColor: '#3f51b5',
    borderColor: '#3949ab',
    cardBackgroundColor: '#ffffff',
    cardBorderColor: '#5c6bc0',
    cardTitleColor: '#283593',
    cardContentColor: '#1a237e',
    cardBackgroundType: 'solid',
    cardGradientColor1: '#e8eaf6',
    cardGradientColor2: '#c5cae9',
    cardGradientDirection: 'to bottom',
    style: {
      shadow: '0 4px 8px rgba(63,81,181,0.3)',
      borderRadius: '12px',
      padding: '16px'
    }
  }
}; 