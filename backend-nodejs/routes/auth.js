const User = require("../models/User");
const express = require("express");
const { protect, generateToken } = require("../middleware/auth");
const { body, validationResult } = require("express-validator");
const { OAuth2Client } = require("google-auth-library");
const { storeOTP, getOTP, deleteOTP, generateOTP } = require("../utils/otpStore");
const sendEmail = require("../utils/emailService");
const { generateOTPEmailHTML } = require("../utils/emailTemplate");

const router = express.Router();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Validation middleware
const validateSignup = [
  body("firstName").trim().isLength({ min: 1 }).withMessage("First name is required"),
  body("lastName").trim().isLength({ min: 1 }).withMessage("Last name is required"),
  body("email").isEmail().normalizeEmail().withMessage("Please enter a valid email"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
];

const validateLogin = [
  body("email").isEmail().normalizeEmail().withMessage("Please enter a valid email"),
  body("password").notEmpty().withMessage("Password is required"),
];

const validateOTP = [
  body("email").isEmail().normalizeEmail().withMessage("Please enter a valid email"),
  body("otp").isLength({ min: 6, max: 6 }).withMessage("OTP must be 6 digits"),
];

// @desc    Register user and send OTP
// @route   POST /api/auth/signup
// @access  Public
const signup = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: errors.array()[0].msg,
      });
    }

    const { firstName, lastName, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: "User already exists with this email" });
    }

    // Generate OTP
    const otp = generateOTP();

    // Store user data and OTP temporarily
    storeOTP(email, otp, {
      firstName,
      lastName,
      email,
      password,
      provider: "email",
    });

    // Generate the beautiful HTML email
    const message = generateOTPEmailHTML(otp, email);

    try {
      await sendEmail({
        email: email,
        subject: "Verify your email address - Take All Notes",
        message,
      });
      res.status(200).json({
        message: "OTP sent to your email. Please check your inbox.",
        email: email,
      });
    } catch (emailError) {
      console.error("Email sending error:", emailError);
      return res.status(500).json({ error: "Failed to send OTP email. Please try again later." });
    }
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// @desc    Verify OTP and create user
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOTP = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: errors.array()[0].msg,
      });
    }

    const { email, otp } = req.body;

    // Get stored OTP and user data
    const storedData = getOTP(email);
    if (!storedData) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    if (storedData.otp !== otp) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    // Create user
    const user = await User.create({
      ...storedData.userData,
      isVerified: true,
    });

    // Clean up OTP
    deleteOTP(email);

    // Generate JWT token
    const token = generateToken(user._id);

    res.status(201).json({
      message: "User created successfully",
      access_token: token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (error) {
    console.error("OTP verification error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: errors.array()[0].msg,
      });
    }

    const { email, password } = req.body;

    // Find user and include password for comparison
    const user = await User.findOne({ email, provider: "email" }).select("+password");

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Generate JWT token
    const token = generateToken(user._id);

    res.status(200).json({
      message: "Login successful",
      access_token: token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// @desc    Google OAuth login
// @route   POST /api/auth/google
// @access  Public
const googleAuth = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: "Google token is required" });
    }

    // Verify Google token
    let ticket;
    try {
      ticket = await googleClient.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
    } catch (error) {
      return res.status(401).json({ error: "Invalid Google token" });
    }

    const payload = ticket.getPayload();
    const { email, given_name: firstName, family_name: lastName, sub: googleId } = payload;

    // Check if user exists
    let user = await User.findOne({ email });

    if (user) {
      // User exists, login
      const jwtToken = generateToken(user._id);
      return res.status(200).json({
        message: "Login successful",
        access_token: jwtToken,
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        },
      });
    } else {
      // Create new user
      user = await User.create({
        firstName: firstName || "",
        lastName: lastName || "",
        email,
        provider: "google",
        googleId,
        isVerified: true,
      });

      const jwtToken = generateToken(user._id);
      return res.status(201).json({
        message: "User created successfully",
        access_token: jwtToken,
        user: {
          id: user._id,
          email: email,
          firstName: firstName,
          lastName: lastName,
        },
      });
    }
  } catch (error) {
    console.error("Google auth error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
// @desc    Resend OTP
// @route   POST /api/auth/resend-otp
// @access  Public
const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.trim()) {
      return res.status(400).json({ error: "Email is required" });
    }

    const storedData = getOTP(email);
    if (!storedData) {
      // If no OTP data exists, check if user exists and is not verified
      const user = await User.findOne({ email, isVerified: false });
      if (!user) {
        return res.status(404).json({ error: "No pending verification for this email." });
      }
    }

    // Generate a new OTP
    const otp = generateOTP();

    // Update OTP in store (or create if it didn't exist)
    storeOTP(email, otp, storedData ? storedData.userData : { email }); // Preserve user data if exists

    // Send new OTP via email
    // Generate the beautiful HTML email
    const message = generateOTPEmailHTML(otp, email);
    try {
     await sendEmail({
        email: email,
        subject: "Take All Notes App - New OTP Verification Code",
        message,
      });
      res.status(200).json({
        message: "New OTP sent to your email. Please check your inbox.",
        email: email,
      });
    } catch (emailError) {
      console.error("Email resend error:", emailError);
      return res.status(500).json({ error: "Failed to resend OTP email. Please try again later." });
    }
  } catch (error) {
    console.error("Resend OTP error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Routes
router.post("/signup", validateSignup, signup);
router.post("/verify-otp", validateOTP, verifyOTP);
router.post("/login", validateLogin, login);
router.post("/google", googleAuth);
router.get("/me", protect, getMe);
router.post("/resend-otp", resendOTP);

module.exports = router;
