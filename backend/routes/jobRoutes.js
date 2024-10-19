const express = require('express');
const { postJob } = require('../controllers/jobController'); // Import the postJob controller
const auth = require('../middlewares/authMiddleware'); // Import the authentication middleware

const router = express.Router();

// Protected route for posting a job
router.post('/post-job', auth, postJob); // Use the auth middleware

module.exports = router;
