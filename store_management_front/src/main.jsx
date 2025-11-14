// Import StrictMode from React (helps catch errors in development)
import { StrictMode } from 'react'

// Import createRoot to create the React root for rendering
import { createRoot } from 'react-dom/client'

// Import the main CSS file for global styling
import './index.css'

// Import the main App component
import App from './App.jsx'

// Create a React root inside the HTML element with id="root" and render the App
createRoot(document.getElementById('root')).render(
  // Enable React StrictMode for highlighting potential issues
  <StrictMode>
    {/* Render the App component */}
    <App />
  </StrictMode>,
)