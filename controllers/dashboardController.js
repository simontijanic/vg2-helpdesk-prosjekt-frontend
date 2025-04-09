const Ticket = require('../models/ticketModel');
const User = require('../models/userModel');

const dashboardController = {
    showDashboard: async (req, res) => {
        try {
            // Get all users and tickets
            const users = await User.find().select('-password');
            const tickets = await Ticket.find()
                .populate('creator', 'email')
                .populate('assignedTo', 'email role');

            // Calculate statistics
            const stats = {
                firstLine: {
                    total: tickets.filter(t => t.supportLevel === 'first-line').length,
                    resolved: tickets.filter(t => t.supportLevel === 'first-line' && t.status === 'resolved').length,
                    users: users.filter(u => u.role === 'first-line').length
                },
                secondLine: {
                    total: tickets.filter(t => t.supportLevel === 'second-line').length,
                    resolved: tickets.filter(t => t.supportLevel === 'second-line' && t.status === 'resolved').length,
                    users: users.filter(u => u.role === 'second-line').length
                }
            };

            res.render('dashboard/index', {
                title: 'Admin Dashboard',
                tickets,
                stats,
                users,
                user: res.locals.user
            });
        } catch (error) {
            console.error('Dashboard error:', error);
            res.render('dashboard/index', { error: 'Failed to load dashboard' });
        }
    },

    updateUserRole: async (req, res) => {
        try {
            // Get the user ID from the URL parameter and role from form body
            const userId = req.params.id;
            const { role } = req.body;

            console.log('Updating user:', userId, 'to role:', role); // Debug log

            // Find and update the user
            const updatedUser = await User.findByIdAndUpdate(
                userId,
                { role },
                { new: true } // Return the updated document
            );

            if (!updatedUser) {
                console.log('User not found'); // Debug log
                return res.redirect('/dashboard?error=Bruker ikke funnet');
            }

            console.log('User updated successfully:', updatedUser); // Debug log
            res.redirect('/dashboard?message=Brukerrolle oppdatert');
        } catch (error) {
            console.error('Role update error:', error);
            res.redirect('/dashboard?error=Kunne ikke oppdatere brukerrolle');
        }
    }
};

module.exports = dashboardController;