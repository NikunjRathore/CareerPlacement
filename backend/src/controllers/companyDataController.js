const CompanyData = require('../models/CompanyData');
const Company = require('../models/Company');
const User = require('../models/User');

// GET historical data for a company
exports.getCompanyData = async (req, res) => {
  try {
    const { company_id } = req.params;
    const data = await CompanyData.find({ company: company_id })
      .populate('company')
      .sort({ year: -1 });

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching company data', error: error.message });
  }
};

// GET latest year's company data (for targeting)
exports.getLatestCompanyData = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear() - 1; // Last year
    const data = await CompanyData.find({ year: currentYear })
      .populate('company')
      .sort({ package_stats: -1 });

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching company data', error: error.message });
  }
};

// GET companies similar to user's profile (recommendation)
exports.getRecommendedCompanies = async (req, res) => {
  try {
    const user = req.user;

    // Get companies that have minimum CGPA <= user's CGPA
    const recommendedCompanies = await CompanyData.find({
      $or: [
        { min_cgpa: { $lte: user.cgpa } },
        { cutoff_cgpa: { $lte: user.cgpa } }
      ]
    })
      .populate('company')
      .sort({ 'package_stats.avg_package': -1 })
      .limit(10);

    res.json(recommendedCompanies);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching recommendations', error: error.message });
  }
};

// ADD company to user's target list
exports.addTargetCompany = async (req, res) => {
  try {
    const { company_id } = req.body;

    const user = await User.findById(req.user._id);

    if (!user.target_companies.includes(company_id)) {
      user.target_companies.push(company_id);
      await user.save();
    }

    res.json({ message: 'Company added to targets', target_companies: user.target_companies });
  } catch (error) {
    res.status(400).json({ message: 'Error adding target company', error: error.message });
  }
};

// REMOVE company from target list
exports.removeTargetCompany = async (req, res) => {
  try {
    const { company_id } = req.params;

    const user = await User.findById(req.user._id);
    user.target_companies = user.target_companies.filter(id => id.toString() !== company_id);
    await user.save();

    res.json({ message: 'Company removed from targets', target_companies: user.target_companies });
  } catch (error) {
    res.status(400).json({ message: 'Error removing target company', error: error.message });
  }
};

// GET user's target companies with historical data
exports.getUserTargetCompanies = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('target_companies');

    const targetData = await Promise.all(
      user.target_companies.map(company =>
        CompanyData.findOne({ company: company._id })
          .populate('company')
          .sort({ year: -1 })
      )
    );

    res.json(targetData.filter(Boolean));
  } catch (error) {
    res.status(500).json({ message: 'Error fetching target companies', error: error.message });
  }
};

// CREATE/UPDATE company historical data (admin only)
exports.addCompanyData = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can add company data' });
    }

    const {
      company_id,
      year,
      slots_offered,
      students_interviewed,
      students_selected,
      min_package,
      max_package,
      avg_package,
      min_cgpa,
      cutoff_cgpa,
      roles,
      department_stats,
      interview_type,
      duration
    } = req.body;

    let companyData = await CompanyData.findOne({ company: company_id, year });

    if (!companyData) {
      companyData = new CompanyData({
        company: company_id,
        year,
        slots_offered,
        students_interviewed,
        students_selected,
        package: {
          min_package,
          max_package,
          avg_package
        },
        min_cgpa,
        cutoff_cgpa,
        roles,
        department_stats,
        interview_type,
        duration
      });
    } else {
      companyData.slots_offered = slots_offered;
      companyData.students_interviewed = students_interviewed;
      companyData.students_selected = students_selected;
      companyData.package = { min_package, max_package, avg_package };
      companyData.min_cgpa = min_cgpa;
      companyData.cutoff_cgpa = cutoff_cgpa;
      companyData.roles = roles;
      companyData.department_stats = department_stats;
      companyData.interview_type = interview_type;
      companyData.duration = duration;
    }

    await companyData.save();
    await companyData.populate('company');

    res.status(201).json(companyData);
  } catch (error) {
    res.status(400).json({ message: 'Error saving company data', error: error.message });
  }
};
