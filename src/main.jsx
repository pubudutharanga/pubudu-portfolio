import React from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom' // Change this line
import App from './App'
import './styles/tailwind.css'

import { HelmetProvider } from 'react-helmet-async'

createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <HelmetProvider>
            <HashRouter>
                <App />
            </HashRouter>
        </HelmetProvider>
    </React.StrictMode>
)