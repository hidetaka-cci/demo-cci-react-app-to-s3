import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

/**
 * Application entry point that initializes and renders the React application.
 *
 * This module:
 * - Creates the React root using the React 19 createRoot API
 * - Wraps the application in StrictMode for development-time checks
 * - Mounts the App component to the DOM element with id 'root'
 *
 * StrictMode enables additional checks and warnings including:
 * - Identifying unsafe lifecycle methods
 * - Warning about legacy string ref API usage
 * - Detecting unexpected side effects
 * - Ensuring reusable state
 *
 * @see {@link https://react.dev/reference/react/StrictMode | React StrictMode Documentation}
 */
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
