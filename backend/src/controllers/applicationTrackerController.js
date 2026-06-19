const ApplicationTracker = require('../models/ApplicationTracker');
const Jobs = require('../models/Jobs');

// GET all applications for current user
exports.getUserApplications = async (req, res) => {
  try {
    const applications = await ApplicationTracker.find({ user: req.user._id })
      .populate('job')
      .populate('company')
      .sort({ applied_date: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching applications', error: error.message });
  }
};

// GET single application
exports.getApplication = async (req, res) => {
  try {
    const application = await ApplicationTracker.findById(req.params.id)
      .populate('job')
      .populate('company');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Ensure user owns this application
    if (application.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this application' });
    }

    res.json(application);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching application', error: error.message });
  }
};

// CREATE new application
exports.createApplication = async (req, res) => {
  try {
    const { job_id, company_id } = req.body;

    // Check if user already applied
    const existing = await ApplicationTracker.findOne({
      user: req.user._id,
      job: job_id
    });

    if (existing) {
      return res.status(400).json({ message: 'You already applied for this job' });
    }

    // Try to use rounds from the job if available
    const job = await Jobs.findById(job_id);
    const defaultRounds = ['Online Test', 'Technical Round', 'HR Round'];
    const rounds_pending = (job && Array.isArray(job.rounds) && job.rounds.length) ? job.rounds : defaultRounds;

    const application = new ApplicationTracker({
      user: req.user._id,
      job: job_id,
      company: company_id,
      rounds_pending
    });

    await application.save();
    await application.populate('job').populate('company');

    res.status(201).json(application);
  } catch (error) {
    res.status(400).json({ message: 'Error creating application', error: error.message });
  }
};

// UPDATE application status / round progress
exports.updateApplication = async (req, res) => {
  try {
    const { status, current_round, rounds_completed, rounds_pending, notes, interview_date, offer_package } = req.body;

    const application = await ApplicationTracker.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Check authorization: allow owner or admin
    if (application.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this application' });
    }

    if (status) application.status = status;
    if (current_round !== undefined) application.current_round = current_round;
    if (rounds_completed) application.rounds_completed = rounds_completed;
    if (rounds_pending) application.rounds_pending = rounds_pending;
    if (notes) application.notes = notes;
    if (interview_date) application.interview_date = interview_date;
    if (offer_package) application.offer_package = offer_package;

    application.updated_date = new Date();

    await application.save();
    await application.populate('job').populate('company');

    res.json(application);
  } catch (error) {
    res.status(400).json({ message: 'Error updating application', error: error.message });
  }
};

// DELETE application
exports.deleteApplication = async (req, res) => {
  try {
    const application = await ApplicationTracker.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (application.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this application' });
    }

    await ApplicationTracker.findByIdAndDelete(req.params.id);

    res.json({ message: 'Application deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting application', error: error.message });
  }
};

// GET application statistics for user
exports.getApplicationStats = async (req, res) => {
  try {
    const stats = {
      total_applications: await ApplicationTracker.countDocuments({ user: req.user._id }),
      by_status: {},
      selected_count: 0,
      rejected_count: 0
    };

    const applications = await ApplicationTracker.find({ user: req.user._id });

    applications.forEach(app => {
      stats.by_status[app.status] = (stats.by_status[app.status] || 0) + 1;
      if (app.status === 'selected') stats.selected_count++;
      if (app.status === 'rejected') stats.rejected_count++;
    });

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching application stats', error: error.message });
  }
};
