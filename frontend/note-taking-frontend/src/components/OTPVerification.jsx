import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from '../config';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Alert, AlertDescription } from "./ui/alert";
import blueWaveBackground from "../assets/auth.jpg";

const OTPVerification = ({ onLogin }) => {
  const [otp, setOtp] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0); // Cooldown in seconds
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;
  const demoOtp = location.state?.otp; // For demo purposes

  useEffect(() => {
    if (!email) {
      navigate("/signup");
    }
  }, [email, navigate]);

  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setTimeout(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const handleChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setOtp(value);
    if (errors.otp) {
      setErrors((prev) => ({
        ...prev,
        otp: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!otp || otp.length !== 6) {
      setErrors({ otp: "Please enter a valid 6-digit OTP" });
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/verify-otp`, {
        email,
        otp,
      });

      // Call onLogin with user data and token
      onLogin(response.data.user, response.data.access_token);
      navigate("/dashboard");
    } catch (error) {
      setErrors({
        general: error.response?.data?.error || "An error occurred during verification",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setResendLoading(true);
    setErrors({});

    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/resend-otp`, {
        email,
      });
      setErrors({ general: response.data.message });
      setResendCooldown(60); // Start cooldown
    } catch (error) {
      setErrors({
        general: error.response?.data?.error || "Failed to resend OTP.",
      });
    } finally {
      setResendLoading(false);
    }
  };

  if (!email) {
    return null;
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="w-full md:basis-[40%] flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <Card className="border-0 shadow-none">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-semibold text-gray-900">
                Verify Your Email
              </CardTitle>
              <p className="text-sm text-gray-600 mt-2">
                We've sent a 6-digit code to {email}
              </p>
              {demoOtp && (
                <p className="text-sm text-blue-600 mt-2 font-medium">
                  Demo OTP: {demoOtp}
                </p>
              )}
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
                <div className="space-y-2">
                  <Label htmlFor="otp" className="text-sm font-medium text-gray-700">
                    Enter OTP
                  </Label>
                  <Input
                    id="otp"
                    name="otp"
                    type="text"
                    value={otp}
                    onChange={handleChange}
                    className={`h-12 text-center text-lg tracking-widest ${errors.otp ? "border-red-500" : "border-gray-300"}`}
                    placeholder="000000"
                    maxLength={6}
                  />
                  {errors.otp && (
                    <p className="text-sm text-red-500">{errors.otp}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium"
                  disabled={loading}
                >
                  {loading ? "Verifying..." : "Verify OTP"}
                </Button>
              </form>

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Didn't receive the code?{" "}
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                    disabled={resendLoading || resendCooldown > 0}
                  >
                    {resendCooldown > 0 ? `Resend OTP (${resendCooldown}s)` : "Resend OTP"}
                  </button>
                </p>
              </div>
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

export default OTPVerification;

