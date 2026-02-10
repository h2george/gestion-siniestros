import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import SetupCheck from './components/SetupCheck'
import Login from './pages/Login'
import Setup from './pages/Setup'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <SetupCheck>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/setup" element={<Setup />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<App />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </SetupCheck>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
)
