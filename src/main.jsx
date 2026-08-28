import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App.jsx'
import '@/index.css'
import Median from 'median-js-bridge'
import isMedianApp from '@/utils/isMedianApp'

// Initialize the Median.co JavaScript Bridge for native iOS/Android wrapper apps.
// The bridge is a no-op in a regular browser; inside a Median app it enables
// native device features (in-app purchases, push notifications, etc.).
if (typeof window !== 'undefined') {
  window.Median = Median
  // Global flag so any component can conditionally render mobile-only features.
  window.isMedianApp = isMedianApp
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
)