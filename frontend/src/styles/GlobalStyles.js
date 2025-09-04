import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    font-size: 16px;
    scroll-behavior: smooth;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body {
    font-family: ${props => props.theme.typography.fontFamily};
    background-color: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.text};
    line-height: 1.5;
    overflow-x: hidden;
  }

  h1, h2, h3, h4, h5, h6 {
    margin: 0;
    font-weight: ${props => props.theme.typography.h1.fontWeight};
  }

  h1 {
    font-size: ${props => props.theme.typography.h1.fontSize};
    line-height: ${props => props.theme.typography.h1.lineHeight};
  }

  h2 {
    font-size: ${props => props.theme.typography.h2.fontSize};
    line-height: ${props => props.theme.typography.h2.lineHeight};
  }

  h3 {
    font-size: ${props => props.theme.typography.h3.fontSize};
    line-height: ${props => props.theme.typography.h3.lineHeight};
  }

  h4 {
    font-size: ${props => props.theme.typography.h4.fontSize};
    line-height: ${props => props.theme.typography.h4.lineHeight};
  }

  h5 {
    font-size: ${props => props.theme.typography.h5.fontSize};
    line-height: ${props => props.theme.typography.h5.lineHeight};
  }

  h6 {
    font-size: ${props => props.theme.typography.h6.fontSize};
    line-height: ${props => props.theme.typography.h6.lineHeight};
  }

  p {
    margin: 0;
  }

  a {
    color: ${props => props.theme.colors.primary};
    text-decoration: none;
    transition: ${props => props.theme.transitions.fast};

    &:hover {
      color: ${props => props.theme.colors.primaryDark};
    }
  }

  button {
    font-family: inherit;
    cursor: pointer;
    border: none;
    outline: none;
    background: none;
    font-size: ${props => props.theme.typography.button.fontSize};
    font-weight: ${props => props.theme.typography.button.fontWeight};
    line-height: ${props => props.theme.typography.button.lineHeight};
    transition: ${props => props.theme.transitions.fast};

    &:disabled {
      cursor: not-allowed;
      opacity: 0.6;
    }
  }

  input, textarea, select {
    font-family: inherit;
    font-size: inherit;
    border: none;
    outline: none;
    background: none;
    
    &::placeholder {
      color: ${props => props.theme.colors.textLight};
    }
  }

  ul, ol {
    list-style: none;
  }

  img {
    max-width: 100%;
    height: auto;
    display: block;
  }

  svg {
    display: block;
  }

  /* Custom Scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${props => props.theme.colors.backgroundDark};
  }

  ::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.textLight};
    border-radius: ${props => props.theme.borderRadius.sm};

    &:hover {
      background: ${props => props.theme.colors.textSecondary};
    }
  }

  /* Toast Overrides */
  .Toastify__toast {
    font-family: ${props => props.theme.typography.fontFamily};
    border-radius: ${props => props.theme.borderRadius.md};
  }

  .Toastify__toast--success {
    background: ${props => props.theme.colors.success};
  }

  .Toastify__toast--error {
    background: ${props => props.theme.colors.error};
  }

  .Toastify__toast--warning {
    background: ${props => props.theme.colors.warning};
  }

  .Toastify__toast--info {
    background: ${props => props.theme.colors.info};
  }

  /* Loading Animation */
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }

  /* Utility Classes */
  .container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 ${props => props.theme.spacing.md};
  }

  .text-center {
    text-align: center;
  }

  .text-left {
    text-align: left;
  }

  .text-right {
    text-align: right;
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
`;

export default GlobalStyles;