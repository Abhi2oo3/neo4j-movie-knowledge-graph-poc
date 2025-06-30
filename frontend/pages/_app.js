// import '@mui/x-data-grid/styles.css'; // Not needed for v8.5.3
import '../styles/globals.css';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: { main: '#003366' },
    secondary: { main: '#00AEEF' },
    background: { default: '#f4f6f8', paper: '#fff' },
    text: { primary: '#222', secondary: '#555' },
  },
  typography: { fontFamily: 'Roboto, Arial, sans-serif', fontWeightBold: 700 },
});

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider theme={theme}>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
