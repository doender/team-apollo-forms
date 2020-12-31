import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import 'antd/dist/antd.css';
import 'focus-visible/dist/focus-visible';
import * as React from 'react';
import ReactDOM from 'react-dom';
import Builder from './components/Builder';

const theme = extendTheme({
    styles: {
        global: {
            body: {
                bg: 'gray.50',
                overflowY: 'hidden',
            },
        },
    },
    shadows: {
        outline: '0 0 0 2px #4FD1C5',
    },
    colors: {
        primary: {
            50: '#E6FFFA',
            100: '#B2F5EA',
            200: '#81E6D9',
            300: '#4FD1C5',
            400: '#38B2AC',
            500: '#319795',
            600: '#2C7A7B',
            700: '#285E61',
            800: '#234E52',
            900: '#1D4044',
        },
    },
});

const App = () => {
    return (
        <ChakraProvider theme={theme}>
            <Builder />
        </ChakraProvider>
    );
};

ReactDOM.render(<App />, document.getElementById('root'));
