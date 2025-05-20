import './index.css'
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthProvider"; // Assurez-vous que le chemin est correct
import { RefreshProvider } from "./contexts/RefreshContext"; // Assurez-vous que le chemin est correct
import { Buffer } from 'buffer';
import App from "./App";

window.Buffer = Buffer;

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter basename="/app">      
      <AuthProvider>
        <RefreshProvider>
          <App />
        </RefreshProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
