const mongoose = require('mongoose');

// Define the Job schema
const JobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true }, // Reference to Company model
  experienceLevel: { type: String, required: true }, // Add experience level field
  candidates: [{ type: String, required: true }], // Array to store candidate emails
  endDate: { type: Date, required: true }, // Add end date field
}, { timestamps: true });

// Create the Job model
const Job = mongoose.model('Job', JobSchema);

// Function to create a new job
const createJob = async (jobData) => {
  // Validate jobData to ensure all required fields are present
  if (!jobData.title || !jobData.description || !jobData.experienceLevel || !jobData.candidates || !jobData.endDate) {
    throw new Error('All fields are required to create a job.');
  }

  // Create a new job instance
  const job = new Job(jobData);
  
  // Save the job to the database
  await job.save();
  
  // Return the created job
  return job;
};

// Export the model and functions
module.exports = {
  Job,
  createJob,
};
