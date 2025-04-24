// theme.ts
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2e7d32', // dark green
      light: '#60ad5e', // soft green
      dark: '#005005',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#a5d6a7', // light green
    },
    background: {
      default: '#f1f8f4', // light minty background
      paper: '#ffffff',
    },
  },
  shape: {
    borderRadius: 5, // soft rounded corners
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          boxShadow: 'none',
          borderRadius: 10,
          padding: '10px 20px',
        },
        containedPrimary: {
          backgroundColor: '#2e7d32',
          '&:hover': {
            backgroundColor: '#1b5e20',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          borderRadius: 10,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          boxShadow: '0px 4px 12px rgba(0,0,0,0.1)',
        },
      },
    },
  },
});

export default theme;
