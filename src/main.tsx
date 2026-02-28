import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AssetProvider } from './context/AssetContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AssetProvider>
      <App />
    </AssetProvider>
  </StrictMode>,
)
