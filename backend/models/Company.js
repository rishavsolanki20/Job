const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  companySize: {
    type: String,
    required: true,
  },
  phoneNo: {
    type: String,
    required: true,
  },
  verificationCode: {
    type: String, // Field to store OTP or verification code
  },
  isVerified: {
    type: Boolean,
    default: false, // Field to track if the company has been verified
  },
  verificationToken: {
    type: String, // Field to store any other tokens if needed
  },
});

module.exports = mongoose.model('Company', CompanySchema);
