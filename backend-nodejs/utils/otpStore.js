// In-memory OTP storage (in production, use Redis or database)
const otpStore = new Map();

const storeOTP = (email, otp, userData) => {
  const expiresAt = Date.now() + (10 * 60 * 1000); // 10 minutes
  otpStore.set(email, {
    otp,
    userData,
    expiresAt
  });
  
  // Clean up expired OTPs
  setTimeout(() => {
    if (otpStore.has(email)) {
      const stored = otpStore.get(email);
      if (stored.expiresAt <= Date.now()) {
        otpStore.delete(email);
      }
    }
  }, 10 * 60 * 1000);
};

const getOTP = (email) => {
  const stored = otpStore.get(email);
  if (!stored) return null;
  
  if (stored.expiresAt <= Date.now()) {
    otpStore.delete(email);
    return null;
  }
  
  return stored;
};

const deleteOTP = (email) => {
  otpStore.delete(email);
};

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

module.exports = {
  storeOTP,
  getOTP,
  deleteOTP,
  generateOTP
};

