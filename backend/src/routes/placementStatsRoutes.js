const express = require('express')
const router = express.Router()
const adminProtect = require('../middleware/adminMiddleware')
const {
  createStats,
  getAllStats,
  getLatestStats,
  getStatsByYear,
  deleteStats,
} = require('../controllers/placementStatsController')

// Admin: create or upsert stats, list all, delete
router.post('/admin', adminProtect, createStats)
router.get('/admin', adminProtect, getAllStats)
router.delete('/admin/:id', adminProtect, deleteStats)

// Public: latest and by year
router.get('/latest', getLatestStats)
router.get('/:year', getStatsByYear)

module.exports = router
