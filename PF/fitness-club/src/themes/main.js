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
        action: {
            active: '#ea7600',
            activeOpacity: 1,
            hover: '#bb4d00',
            hoverOpacity: 0.7,
            focus: '#bb4d00',
            focusOpacity: 1,
            selected: '#ea7600',
            selectedOpacity: 1
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