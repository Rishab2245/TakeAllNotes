import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Alert, AlertDescription } from "./ui/alert";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { API_BASE_URL } from "../config";
import blueWaveBackground from "../assets/auth.jpg";
import { GoogleLogin } from "@react-oauth/google";
import { useEffect } from "react";

const SignUp = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    dateOfBirth: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [width, setWidth] = useState(300);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 500) {
        setWidth(window.innerWidth - 120); // small screen → full width with padding
        // small screen → full width with padding
      } else {
        setWidth(350); // default for larger screens
      }
    };

    handleResize(); // run at start
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = "Date of birth is required";
    } else {
      const birthDate = new Date(formData.dateOfBirth);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }

      if (age < 13) {
        newErrors.dateOfBirth = "You must be at least 13 years old to register";
      }
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/auth/signup`,
        formData
      );

      // Navigate to OTP verification with email
      navigate("/verify-otp", {
        state: {
          email: formData.email,
          otp: response.data.otp, // For demo purposes
        },
      });
    } catch (error) {
      setErrors({
        general:
          error.response?.data?.error || "An error occurred during signup",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    setErrors({});
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/google`, {
        token: credentialResponse.credential,
      });
      onLogin(response.data.user, response.data.access_token);
      navigate("/dashboard");
    } catch (error) {
      setErrors({
        general: error.response?.data?.error || "Google sign-up failed.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setErrors({
      general: "Google sign-up was unsuccessful. Please try again.",
    });
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="w-full md:basis-[40%] flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <Card className="border-0 shadow-none">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-4xl text-gray-900 font-bold">
                Sign up
              </CardTitle>
              <CardDescription>
                  Sign up to enjoy the feature of HD
              </CardDescription>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="firstName"
                      className="text-sm font-medium text-gray-700"
                    >
                      First Name
                    </Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={handleChange}
                      className={`h-12 ${
                        errors.firstName ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Enter your first name"
                    />
                    {errors.firstName && (
                      <p className="text-sm text-red-500">{errors.firstName}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="lastName"
                      className="text-sm font-medium text-gray-700"
                    >
                      Last Name
                    </Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={handleChange}
                      className={`h-12 ${
                        errors.lastName ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Enter your last name"
                    />
                    {errors.lastName && (
                      <p className="text-sm text-red-500">{errors.lastName}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="dateOfBirth"
                    className="text-sm font-medium text-gray-700"
                  >
                    Date of Birth
                  </Label>
                  <Input
                    id="dateOfBirth"
                    name="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className={`h-12 ${
                      errors.dateOfBirth ? "border-red-500" : "border-gray-300"
                    }`}
                    max={new Date().toISOString().split("T")[0]} // Prevents future dates
                  />
                  {errors.dateOfBirth && (
                    <p className="text-sm text-red-500">{errors.dateOfBirth}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-sm font-medium text-gray-700"
                  >
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`h-12 ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter your email"
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">{errors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="text-sm font-medium text-gray-700"
                  >
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      className={`h-12 pr-10 ${
                        errors.password ? "border-red-500" : "border-gray-300"
                      }`}
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
                  {loading ? "Creating Account..." : "Sign up"}
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

              <div className="w-full flex justify-center">
                <div className="w-full sm:w-[300px] md:w-[350px] flex justify-center">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleError}
                    text="continue_with"
                    size="large"
                    width={width} // 👈 make button take parent width
                  />
                </div>
              </div>

              <p className="text-center text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                  to="/signin"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
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
  );
};

export default SignUp;
