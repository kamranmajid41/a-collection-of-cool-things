import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <MantineProvider defaultColorScheme="dark">
     <StrictMode>
      <App />
    </StrictMode>
  </MantineProvider>
)
