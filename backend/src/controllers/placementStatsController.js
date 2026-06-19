const PlacementStatistics = require('../models/PlacementStatistics')

function roundToTwo(value) {
  return parseFloat(Number(value || 0).toFixed(2))
}

function calculateMedian(values) {
  if (!values.length) return undefined

  const sorted = [...values].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)

  if (sorted.length % 2 === 0) {
    return roundToTwo((sorted[mid - 1] + sorted[mid]) / 2)
  }

  return roundToTwo(sorted[mid])
}

function normalizeCompanyStats(companyStats = []) {
  return companyStats
    .filter(stat => stat.company && typeof stat.students_hired !== 'undefined')
    .map(stat => ({
      company: stat.company,
      students_hired: Number(stat.students_hired) || 0,
      packages_offered: Array.isArray(stat.packages_offered)
        ? stat.packages_offered.map(Number).filter(pkg => Number.isFinite(pkg) && pkg >= 0)
        : [],
    }))
}

function deriveStatsFromCompanies(totalStudents, companyStats = []) {
  const placedStudents = companyStats.reduce((sum, stat) => sum + stat.students_hired, 0)
  const packages = companyStats.flatMap(stat => stat.packages_offered)
  const packageTotal = packages.reduce((sum, pkg) => sum + pkg, 0)

  return {
    placed_students: placedStudents,
    placement_percentage: totalStudents > 0 ? roundToTwo((placedStudents / totalStudents) * 100) : 0,
    package_stats: packages.length
      ? {
          highest_package: roundToTwo(Math.max(...packages)),
          lowest_package: roundToTwo(Math.min(...packages)),
          average_package: roundToTwo(packageTotal / packages.length),
          median_package: calculateMedian(packages),
        }
      : {},
  }
}

async function createStats(req, res) {
  const body = req.body || {}

  if (!body.year || !body.total_students) {
    return res.status(400).json({ message: 'year and total_students are required' })
  }

  try {
    const totalStudents = Number(body.total_students)
    const companyStats = normalizeCompanyStats(body.company_stats || [])
    const derivedStats = companyStats.length
      ? deriveStatsFromCompanies(totalStudents, companyStats)
      : {
          placed_students: Number(body.placed_students) || 0,
          placement_percentage: body.placement_percentage
            ? Number(body.placement_percentage)
            : roundToTwo(((Number(body.placed_students) || 0) / totalStudents) * 100),
          package_stats: body.package_stats || {},
        }

    if (derivedStats.placed_students > totalStudents) {
      return res.status(400).json({ message: 'Placed students from company stats cannot exceed total students' })
    }

    const updateData = {
      year: Number(body.year),
      total_students: totalStudents,
      placed_students: derivedStats.placed_students,
      placement_percentage: derivedStats.placement_percentage,
      department_stats: body.department_stats || [],
      company_stats: companyStats,
      package_stats: derivedStats.package_stats,
      roles_offered: body.roles_offered || [],
    }

    const doc = await PlacementStatistics.findOneAndUpdate(
      { year: body.year },
      updateData,
      { upsert: true, new: true, setDefaultsOnInsert: true },
    )

    return res.json({ message: 'Placement stats saved', stats: doc })
  } catch (error) {
    return res.status(500).json({ message: 'Error saving stats', error: error.message })
  }
}

async function getAllStats(req, res) {
  try {
    const docs = await PlacementStatistics.find().sort({ year: -1 }).populate('company_stats.company', 'name')
    return res.json(docs)
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching stats', error: error.message })
  }
}

async function getLatestStats(req, res) {
  try {
    const doc = await PlacementStatistics.findOne().sort({ year: -1 }).populate('company_stats.company', 'name')
    if (!doc) return res.status(404).json({ message: 'No stats available' })
    return res.json(doc)
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching latest stats', error: error.message })
  }
}

async function getStatsByYear(req, res) {
  const year = Number(req.params.year)
  if (!year) return res.status(400).json({ message: 'Invalid year' })

  try {
    const doc = await PlacementStatistics.findOne({ year }).populate('company_stats.company', 'name')
    if (!doc) return res.status(404).json({ message: 'Stats for year not found' })
    return res.json(doc)
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching stats', error: error.message })
  }
}

async function deleteStats(req, res) {
  const { id } = req.params
  if (!id) return res.status(400).json({ message: 'Stats ID is required' })

  try {
    const doc = await PlacementStatistics.findByIdAndDelete(id)
    if (!doc) return res.status(404).json({ message: 'Stats not found' })
    return res.json({ message: 'Stats deleted successfully' })
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting stats', error: error.message })
  }
}

module.exports = {
  createStats,
  getAllStats,
  getLatestStats,
  getStatsByYear,
  deleteStats,
}
