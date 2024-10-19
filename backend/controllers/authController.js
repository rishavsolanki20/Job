const Company = require('../models/Company');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const nodemailer = require('nodemailer');
const axios = require('axios'); // Import Axios

// Function to generate a random verification code
const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // Generates a 6-digit code
};

// Function to send SMS using Textbelt
// Function to send SMS using Textbelt
const sendSMSVerificationCode = async (phoneNo, verificationCode) => {
    try {
      const response = await axios.post('https://textbelt.com/text', {
        phone: phoneNo,
        message: `Your verification code is: ${verificationCode}`,
        key: 'textbelt', // Free key
      });
  
      if (!response.data.success) {
        throw new Error('Error sending SMS: ' + JSON.stringify(response.data)); // Convert the response to string for better error logging
      }
  
      console.log('SMS sent successfully:', response.data);
    } catch (error) {
      // Log the detailed error message
      if (error.response) {
        console.error('Error sending SMS:', error.response.data); // Log the response data from the failed request
      } else {
        console.error('Error sending SMS:', error.message); // Log the error message
      }
    }
  };
  

// Register Company
exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password, companyName, companySize, phoneNo } = req.body;

  try {
    let company = await Company.findOne({ email });
    if (company) {
      return res.status(400).json({ msg: 'Company already exists' });
    }

    const verificationCode = generateVerificationCode();

    // Create a new company instance
    company = new Company({
      name,
      email,
      companyName,
      companySize,
      phoneNo,
      verificationCode,
      // Automatically store the company ID during creation
    });

    // Save the company to the database
    await company.save();

    const payload = { company: { id: company.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Setup nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: company.email,
      subject: 'Account Verification',
      html: `<h3>Your verification code is: ${verificationCode}</h3><p>Please use this code to verify your email address.</p>`,
    };

    // Send verification email
    transporter.sendMail(mailOptions, async (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ msg: 'Failed to send verification email.' });
      }

      await sendSMSVerificationCode(phoneNo, verificationCode);
      console.log('Email sent:', info.response);
      return res.status(200).json({ msg: 'Registration successful, please check your email and SMS for the verification code.', token });
    });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).send('Server error');
  }
};

// Verify Company Email (same as before)
exports.verifyEmail = async (req, res) => {
  const { email, code } = req.body;

  try {
    // Find the company by email
    const company = await Company.findOne({ email });
    if (!company) {
      return res.status(400).json({ msg: 'Company not found' });
    }

    // Check if the verification code matches
    if (company.verificationCode !== code) {
      return res.status(400).json({ msg: 'Invalid verification code' });
    }

    // Update the company to mark it as verified
    company.isVerified = true; // Assuming you have an isVerified field in your Company model
    await company.save();

    return res.status(200).json({ msg: 'Email verified successfully!' });
  } catch (error) {
    console.error('Error during email verification:', error);
    res.status(500).send('Server error');
  }
};




exports.verifyOTP = async (req, res) => {
  const { code } = req.body; // Only get the code from the request body

  try {
      // Use email from req.company
      const email = req.company.email;  // Now email comes from the token
      console.log("Email from token:", email);

      // Find the company in the database using the extracted email
      const company = await Company.findOne({ email });
      console.log("Found Company:", company);
      
      if (!company) {
          return res.status(400).json({ msg: 'Company not found' });
      }

      // Trim the incoming code and the verification code from the database
      const incomingCode = code.trim();
      const storedCode = company.verificationCode.trim();

      // Check if the verification code matches
      if (storedCode !== incomingCode) {
          console.log(`Stored Code: ${storedCode}, Incoming Code: ${incomingCode}`);
          return res.status(400).json({ msg: 'Invalid verification code' });
      }

      // Mark the company as verified
      company.isVerified = true;
      await company.save();

      return res.status(200).json({ msg: 'OTP verified successfully!' });
  } catch (error) {
      console.error('Error during OTP verification:', error);
      res.status(500).send('Server error');
  }
};

  
// Login Company (same as before)
exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    let company = await Company.findOne({ email });
    if (!company) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Check if the company is verified
    if (!company.isVerified) {
      return res.status(403).json({ msg: 'Email not verified' });
    }

    // Compare the hashed password
    const isMatch = await bcrypt.compare(password, company.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Create and sign a JWT token
   

    // Set cookie and respond with token
    res.cookie('token', token, { httpOnly: true }).json({ msg: 'Login successful', token });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).send('Server error');
  }
};
