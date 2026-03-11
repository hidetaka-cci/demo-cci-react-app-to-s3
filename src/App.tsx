import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

/**
 * Main application component that demonstrates Vite + React integration
 * with Hot Module Replacement (HMR) capabilities.
 *
 * This component showcases:
 * - React Hooks (useState) for state management
 * - Interactive counter functionality
 * - Vite and React logo links to official documentation
 * - HMR demonstration with live reload instructions
 *
 * @returns {JSX.Element} The rendered application interface
 *
 * @example
 * // Used as the root component in main.tsx
 * <App />
 */
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
