import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Toaster } from 'react-hot-toast'
import { UserProvider } from './UserContext.jsx'

import { PrimeReactProvider, PrimeReactContext } from 'primereact/api';



ReactDOM.createRoot(document.getElementById('root')).render(
  <PrimeReactProvider>
    <UserProvider>
      <Toaster />
      <App />
    </UserProvider>
  </PrimeReactProvider>
)
