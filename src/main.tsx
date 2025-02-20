import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Introducing a syntax error
const root = createRoot(document.getElementById("root")!).render(<App />)
const This is a syntax error