import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import SignUp from './components/SignUp'
import SignIn from './components/SignIn'
import Dashboard from './components/Dashboard'
import OTPVerification from './components/OTPVerification'
import './App.css'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    
    if (token && userData) {
      setUser(JSON.parse(userData))
    }
    setLoading(false)
  }, [])

  const handleLogin = (userData, token) => {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route 
            path="/signup" 
            element={user ? <Navigate to="/dashboard" /> : <SignUp onLogin={handleLogin} />} 
          />
          <Route 
            path="/signin" 
            element={user ? <Navigate to="/dashboard" /> : <SignIn onLogin={handleLogin} />} 
          />
          <Route 
            path="/verify-otp" 
            element={user ? <Navigate to="/dashboard" /> : <OTPVerification onLogin={handleLogin} />} 
          />
          <Route 
            path="/dashboard" 
            element={user ? <Dashboard user={user} onLogout={handleLogout} /> : <Navigate to="/signin" />} 
          />
          <Route 
            path="/" 
            element={user ? <Navigate to="/dashboard" /> : <Navigate to="/signin" />} 
          />
        </Routes>
      </div>
    </Router>
  )
}

export default App

