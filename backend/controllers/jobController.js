// jobController.js
const { createJob } = require('../models/Job');
const sendEmail = require('../mailer'); // Import the sendEmail function

exports.postJob = async (req, res) => {
  const { title, description, experienceLevel, candidates, endDate } = req.body;

  try {
    // Prepare jobData including the company ID from the authenticated user
    const jobData = {
      title,
      description,
      company: req.company.id,
      experienceLevel,
      candidates,
      endDate,
    };

    // Create the job
    const job = await createJob(jobData);

    // Send email notifications to candidates
    const emailPromises = candidates.map(candidateEmail => {
      const subject = `New Job Posted: ${title}`;
      const text = `Dear Candidate,\n\nA new job has been posted that might interest you:\n\nTitle: ${title}\nDescription: ${description}\nExperience Level: ${experienceLevel}\nEnd Date: ${endDate}\n\nYou can view the job for more details.\n\nBest Regards,\nYour Company`;

      return sendEmail(candidateEmail, subject, text);
    });

    // Wait for all email promises to resolve
    await Promise.all(emailPromises);

    return res.status(201).json({ msg: 'Job posted successfully', job });
  } catch (error) {
    console.error('Error posting job:', error);
    res.status(500).json({ msg: error.message || 'Server error' });
  }
};
