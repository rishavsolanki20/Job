const express = require('express');
const { register, verifyOTP } = require('../controllers/authController'); // Ensure verifyOTP is correctly imported
const { check } = require('express-validator');
const auth = require('../middlewares/authMiddleware'); // Ensure auth middleware is correctly imported

const router = express.Router();

router.post('/register', [
  check('name', 'Name is required').notEmpty(),
  check('email', 'Please include a valid email').isEmail(),
], register);

router.post('/verify-otp', auth, verifyOTP);  // Ensure verifyOTP and auth are functions

module.exports = router;
