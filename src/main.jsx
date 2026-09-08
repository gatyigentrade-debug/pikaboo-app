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

  // Native In-App Purchase callbacks — the Android bridge calls these after
  // window.PikaBooNative.buyProduct() completes. They dispatch DOM events so
  // any component can react without coupling to the native layer.
  window.onPurchaseSuccess = function (data) {
    window.dispatchEvent(new CustomEvent('pikaboo:purchase-success', { detail: data }))
  }
  window.onPurchaseError = function (error) {
    window.dispatchEvent(new CustomEvent('pikaboo:purchase-error', { detail: error }))
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
)