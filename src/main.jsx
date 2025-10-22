import React from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom' // Change this line
import App from './App'
import './styles/tailwind.css'

createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <HashRouter> {/* Change this line */}
            <App/>
        </HashRouter> {/* Change this line */}
    </React.StrictMode>
)