import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Eye, EyeOff } from 'lucide-react'
import axios from 'axios'
import { API_BASE_URL } from '../config'
import blueWaveBackground from '../assets/auth.jpg'

const SignUp = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required'
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required'
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    
    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const newErrors = validateForm()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    
    setLoading(true)
    setErrors({})
    
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/signup`, formData)
      
      // Navigate to OTP verification with email
      navigate('/verify-otp', { 
        state: { 
          email: formData.email,
          otp: response.data.otp // For demo purposes
        }
      })
    } catch (error) {
      setErrors({
        general: error.response?.data?.error || 'An error occurred during signup'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignUp = () => {
    // Google OAuth implementation would go here
    setErrors({
      general: 'Google Sign Up will be implemented with proper OAuth configuration'
    })
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="w-full md:basis-[40%] flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <Card className="border-0 shadow-none">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-semibold text-gray-900">
                Sign up
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {errors.general && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-600">
                    {errors.general}
                  </AlertDescription>
                </Alert>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                      First Name
                    </Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={handleChange}
                      className={`h-12 ${errors.firstName ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="Enter your first name"
                    />
                    {errors.firstName && (
                      <p className="text-sm text-red-500">{errors.firstName}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                      Last Name
                    </Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={handleChange}
                      className={`h-12 ${errors.lastName ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="Enter your last name"
                    />
                    {errors.lastName && (
                      <p className="text-sm text-red-500">{errors.lastName}</p>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`h-12 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Enter your email"
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">{errors.email}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleChange}
                      className={`h-12 pr-10 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-500">{errors.password}</p>
                  )}
                </div>
                
                <Button
                  type="submit"
                  className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium"
                  disabled={loading}
                >
                  {loading ? 'Creating Account...' : 'Sign up'}
                </Button>
              </form>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">Or</span>
                </div>
              </div>
              
              <Button
                type="button"
                variant="outline"
                className="w-full h-12 border-gray-300 text-gray-700 hover:bg-gray-50"
                onClick={handleGoogleSignUp}
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </Button>
              
              <p className="text-center text-sm text-gray-600">
                Already have an account?{' '}
                <Link to="/signin" className="text-blue-600 hover:text-blue-700 font-medium">
                  Sign in
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Right side - Background Image */}
      <div className="hidden md:block md:basis-[60%] relative overflow-hidden m-4 rounded-2xl">
        <img
          src={blueWaveBackground}
          alt="Blue wave background"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Black Overlay */}
  <div className="absolute inset-0 bg-black/20"></div>
      </div>
    </div>
  )
}

export default SignUp

