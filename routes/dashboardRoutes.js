const router = require('express').Router();
const dashboardController = require('../controllers/dashboardController');
const { auth, isAdmin } = require('../middleware/auth');

// Admin only routes
router.get('/dashboard', auth, isAdmin, dashboardController.showDashboard);

module.exports = router;