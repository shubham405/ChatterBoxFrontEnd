import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from "react-router-dom";
import { ChakraProvider } from '@chakra-ui/react';
import axios from 'axios';
import ChatProvider from './Context/chatProvider';

axios.defaults.baseURL = process.env.API_URL||'http://localhost:5000';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <ChatProvider>
      <ChakraProvider>
        
        <App />
      </ChakraProvider>
      </ChatProvider>
  </BrowserRouter>
);
