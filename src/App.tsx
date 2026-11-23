import React, { Suspense, lazy, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ProtectedRoute } from './components/common/ProtectedRoute'
import LandingPage from './pages/LandingPage'

// Hardware back-button listener for Capacitor Android app
const AndroidBackHandler: React.FC = () => {
  const navigate = useNavigate()

  useEffect(() => {
    let unregister: (() => void) | undefined
    import('./services/capacitorBridge.ts').then(({ registerAndroidBackButton }) => {
      registerAndroidBackButton(() => {
        navigate(-1)
      }).then((cleanup) => {
        unregister = cleanup
      })
    })

    return () => {
      if (unregister) unregister()
    }
  }, [navigate])

  return null
}

// Code-splitting via React.lazy for sub-routes to keep initial bundle size minimal
const LoginPage = lazy(() => import('./pages/LoginPage'))
const SignupPage = lazy(() => import('./pages/SignupPage'))
const DashboardPage = lazy(() => import('./pages/DashboardPage'))
const ProfilePage = lazy(() => import('./pages/ProfilePage'))
const BuilderPage = lazy(() => import('./pages/BuilderPage'))
const MatcherPage = lazy(() => import('./pages/MatcherPage'))
const AtsCheckerPage = lazy(() => import('./pages/AtsCheckerPage'))
const PreviewPage = lazy(() => import('./pages/PreviewPage'))
const SettingsPage = lazy(() => import('./pages/SettingsPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

// Lightweight loading fallback
const PageLoader: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
    <div className="flex flex-col items-center gap-3">
      <div className="w-8 h-8 border-3 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
      <span className="text-xs font-medium text-slate-500">Loading ResumeFit...</span>
    </div>
  </div>
)

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AndroidBackHandler />
      <AuthProvider>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/builder"
              element={
                <ProtectedRoute>
                  <BuilderPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/matcher"
              element={
                <ProtectedRoute>
                  <MatcherPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ats-checker"
              element={
                <ProtectedRoute>
                  <AtsCheckerPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/preview"
              element={
                <ProtectedRoute>
                  <PreviewPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <SettingsPage />
                </ProtectedRoute>
              }
            />

            {/* 404 Route */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
