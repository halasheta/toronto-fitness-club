import * as React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';

export const theme = createTheme({
    palette: {
        primary: {
            light: '#ff9d3f',
            main: '#ea7600',
            dark: '#bb4d00',
            contrastText: '#1b1b1b',
        },
    },
    //
    // typography: {
    //     // fontFamily: [
    //     //     '-apple-system',
    //     //     'BlinkMacSystemFont',
    //     //     '"Segoe UI"',
    //     //     'Roboto',
    //     //     '"Helvetica Neue"',
    //     //     'Arial',
    //     //     'sans-serif',
    //     //     '"Apple Color Emoji"',
    //     //     '"Segoe UI Emoji"',
    //     //     '"Segoe UI Symbol"',
    //     // ].join(','),
    //     primary: {
    //         light: '#ff9d3f',
    //         main: '#ea7600',
    //         dark: '#bb4d00',
    //         contrastText: '#1b1b1b',
    //     }
    // },
});