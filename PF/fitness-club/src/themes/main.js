import * as React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            light: '#6d6d6d',
            main: '#424242',
            dark: '#1b1b1b',
            contrastText: '#fff',
        },
        secondary: {
            light: '#ff9d3f',
            main: '#f57c00',
            dark: '#bb4d00',
            contrastText: '#1b1b1b',
        },
    },
});