const router = require('express').Router();
const ticketController = require('../controllers/ticketController');
const { auth, isAdmin } = require('../middleware/auth');
const { isStaffOrAdmin, isSameLevel } = require('../middleware/roleCheck');

// User routes
router.get('/tickets', auth, ticketController.listTickets);
router.get('/tickets/create', auth, ticketController.showCreateForm);
router.post('/tickets/create', auth, ticketController.createTicket);
router.get('/tickets/:id', auth, ticketController.viewTicket);
router.post('/tickets/:id/comments', auth, ticketController.addComment);

// Support staff and admin routes
router.post('/tickets/:id/status', auth, isStaffOrAdmin, ticketController.updateStatus);
router.post('/tickets/:id/priority', auth, isStaffOrAdmin, ticketController.updatePriority);
router.post('/tickets/:id/resolve', auth, isStaffOrAdmin, ticketController.markAsResolved);

// Admin only routes
router.post('/tickets/:id/assign', auth, isAdmin, ticketController.assignTicket);

module.exports = router;