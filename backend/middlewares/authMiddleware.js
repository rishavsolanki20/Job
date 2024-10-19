const jwt = require('jsonwebtoken');
const Company = require('../models/Company');

const auth = async (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded); // Log the decoded token

    const companyId = decoded.company.id; // Adjust based on your token structure
    const company = await Company.findById(companyId);

    if (!company) {
      console.log(`Company not found for ID: ${companyId}`); // Log the ID being searched
      return res.status(404).json({ msg: 'Company not found' });
    }

    req.company = company; // Store the full company object in req.company
    next();
  } catch (err) {
    console.error('Authentication error:', err);
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

module.exports = auth;
