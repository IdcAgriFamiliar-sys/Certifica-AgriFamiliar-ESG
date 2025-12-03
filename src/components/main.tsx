import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '../App.tsx' // <--- CORREÇÃO AQUI: Subindo um nível (..) para encontrar App.tsx em src/
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
