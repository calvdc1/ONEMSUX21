import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'

console.log("Main.jsx is loading...");

const container = document.getElementById('root')
if (container) {
  console.log("Found root container, rendering App...");
  const root = createRoot(container)
  root.render(<App />)
} else {
  console.error("Could not find root container!");
}
