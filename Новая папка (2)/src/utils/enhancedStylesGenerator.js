// Enhanced styles generator for sections
export const generateEnhancedSectionStyles = (headerData, sectionsData) => {
  if (!headerData.menuItems || !sectionsData) return '';

  const styles = headerData.menuItems.map(item => {
    const section = sectionsData.find(s => s.id === item.id);
    if (!section || !section.enhancedStyles) return '';
    
    const enhancedStyles = section.enhancedStyles;
    let css = '';
    
    // Section specific styles
    css += `
      #${item.id} {
        ${enhancedStyles.padding ? `padding: ${enhancedStyles.padding} !important;` : ''}
        ${enhancedStyles.margin ? `margin: ${enhancedStyles.margin} !important;` : ''}
        ${enhancedStyles.borderRadius ? `border-radius: ${enhancedStyles.borderRadius} !important;` : ''}
        ${enhancedStyles.background ? generateBackgroundCSS(enhancedStyles.background) : ''}
      }
    `;
    
    // Title styles
    if (enhancedStyles.titleStyle) {
      css += `
        #${item.id} h2 {
          ${enhancedStyles.titleStyle.fontFamily ? `font-family: ${enhancedStyles.titleStyle.fontFamily} !important;` : ''}
          ${enhancedStyles.titleStyle.fontSize ? `font-size: ${enhancedStyles.titleStyle.fontSize} !important;` : ''}
          ${enhancedStyles.titleStyle.fontWeight ? `font-weight: ${enhancedStyles.titleStyle.fontWeight} !important;` : ''}
          ${enhancedStyles.titleStyle.fontStyle ? `font-style: ${enhancedStyles.titleStyle.fontStyle} !important;` : ''}
          ${enhancedStyles.titleStyle.textDecoration ? `text-decoration: ${enhancedStyles.titleStyle.textDecoration} !important;` : ''}
          ${enhancedStyles.titleStyle.textAlign ? `text-align: ${enhancedStyles.titleStyle.textAlign} !important;` : ''}
          ${enhancedStyles.titleStyle.color ? `color: ${enhancedStyles.titleStyle.color} !important;` : ''}
        }
      `;
    }
    
    // Description styles
    if (enhancedStyles.descriptionStyle) {
      css += `
        #${item.id} p {
          ${enhancedStyles.descriptionStyle.fontFamily ? `font-family: ${enhancedStyles.descriptionStyle.fontFamily} !important;` : ''}
          ${enhancedStyles.descriptionStyle.fontSize ? `font-size: ${enhancedStyles.descriptionStyle.fontSize} !important;` : ''}
          ${enhancedStyles.descriptionStyle.fontWeight ? `font-weight: ${enhancedStyles.descriptionStyle.fontWeight} !important;` : ''}
          ${enhancedStyles.descriptionStyle.fontStyle ? `font-style: ${enhancedStyles.descriptionStyle.fontStyle} !important;` : ''}
          ${enhancedStyles.descriptionStyle.textDecoration ? `text-decoration: ${enhancedStyles.descriptionStyle.textDecoration} !important;` : ''}
          ${enhancedStyles.descriptionStyle.textAlign ? `text-align: ${enhancedStyles.descriptionStyle.textAlign} !important;` : ''}
          ${enhancedStyles.descriptionStyle.color ? `color: ${enhancedStyles.descriptionStyle.color} !important;` : ''}
        }
      `;
    }
    
    // Animation styles
    if (enhancedStyles.animation && enhancedStyles.animation.type !== 'none') {
      css += `
        #${item.id} {
          animation: ${enhancedStyles.animation.type} ${enhancedStyles.animation.duration || 600}ms ease-out;
          animation-delay: ${enhancedStyles.animation.delay || 0}ms;
          animation-fill-mode: both;
          ${enhancedStyles.animation.repeat ? 'animation-iteration-count: infinite;' : ''}
        }
      `;
    }
    
    return css;
  }).join('');

  return `
    /* Enhanced section styles from EnhancedSectionEditor */
    ${styles}

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