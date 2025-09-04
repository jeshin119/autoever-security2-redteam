export const lightTheme = {
  colors: {
    // Primary Colors (당근마켓 스타일 오렌지 계열)
    primary: '#FF6F00',
    primaryLight: '#FFA726',
    primaryDark: '#E65100',
    
    // Secondary Colors (번개장터 스타일 블루 계열)
    secondary: '#2196F3',
    secondaryLight: '#64B5F6',
    secondaryDark: '#1976D2',
    
    // Status Colors
    success: '#4CAF50',
    warning: '#FFC107',
    error: '#F44336',
    info: '#00BCD4',
    
    // Background Colors
    background: '#F5F5F5',
    backgroundPaper: '#FFFFFF',
    backgroundDark: '#E0E0E0',
    
    // Text Colors
    text: '#212121',
    textSecondary: '#757575',
    textLight: '#9E9E9E',
    textInverse: '#FFFFFF',
    
    // Border Colors
    border: '#E0E0E0',
    borderLight: '#F5F5F5',
    borderDark: '#BDBDBD',
    
    // Special Colors
    favorite: '#E91E63',
    online: '#4CAF50',
    offline: '#9E9E9E',
    
    // Overlay
    overlay: 'rgba(0, 0, 0, 0.5)',
    overlayLight: 'rgba(0, 0, 0, 0.3)',
  },
  
  typography: {
    fontFamily: "'Noto Sans KR', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
      lineHeight: 1.5,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      fontWeight: 400,
      lineHeight: 1.43,
    },
    caption: {
      fontSize: '0.75rem',
      fontWeight: 400,
      lineHeight: 1.66,
    },
    button: {
      fontSize: '0.875rem',
      fontWeight: 500,
      lineHeight: 1.75,
      textTransform: 'none',
    },
  },
  
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
  },
  
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px',
  },
  
  shadows: {
    sm: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
    md: '0 3px 6px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.12)',
    lg: '0 10px 20px rgba(0, 0, 0, 0.15), 0 3px 6px rgba(0, 0, 0, 0.10)',
    xl: '0 15px 25px rgba(0, 0, 0, 0.15), 0 5px 10px rgba(0, 0, 0, 0.05)',
  },
  
  transitions: {
    fast: '150ms ease-in-out',
    normal: '300ms ease-in-out',
    slow: '500ms ease-in-out',
  },
  
  breakpoints: {
    xs: '320px',
    sm: '576px',
    md: '768px',
    lg: '992px',
    xl: '1200px',
    xxl: '1400px',
  },
  
  zIndex: {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modalBackdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
  },
};

export const darkTheme = {
  ...lightTheme,
  colors: {
    ...lightTheme.colors,
    primary: '#FFA726',
    primaryLight: '#FFB74D',
    primaryDark: '#F57C00',
    
    background: '#121212',
    backgroundPaper: '#1E1E1E',
    backgroundDark: '#0A0A0A',
    
    text: '#FFFFFF',
    textSecondary: '#B0B0B0',
    textLight: '#808080',
    textInverse: '#212121',
    
    border: '#2C2C2C',
    borderLight: '#1A1A1A',
    borderDark: '#3C3C3C',
  },
};

export default lightTheme;