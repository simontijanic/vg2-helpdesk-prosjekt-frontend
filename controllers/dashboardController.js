const dashboardController = {
    showDashboard: async (req, res) => {
        try {
            const response = await fetch('http://localhost:4000/api/tickets/all', {
                headers: {
                    'Authorization': `Bearer ${req.session.token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch tickets');
            }

            const tickets = await response.json();

            // Calculate statistics
            const stats = {
                total: tickets.length,
                open: tickets.filter(t => t.status === 'open').length,
                inProgress: tickets.filter(t => t.status === 'in-progress').length,
                resolved: tickets.filter(t => t.status === 'resolved').length,
                highPriority: tickets.filter(t => t.priority === 'high').length
            };

            res.render('dashboard/index', {
                title: 'Admin Dashboard',
                tickets,
                stats,
                user: req.session.user
            });
        } catch (error) {
            console.error('Dashboard error:', error);
            res.render('dashboard/index', {
                title: 'Admin Dashboard',
                tickets: [],
                stats: { total: 0, open: 0, inProgress: 0, resolved: 0, highPriority: 0 },
                error: 'Failed to load tickets'
            });
        }
    }
};

module.exports = dashboardController;