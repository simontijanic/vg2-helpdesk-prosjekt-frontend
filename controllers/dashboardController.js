const dashboardController = {
    showDashboard: async (req, res) => {
        try {
            const response = await fetch('http://localhost:4000/api/tickets/all', {
                headers: {
                    'Authorization': `Bearer ${req.session.token}`
                }
            });

            const tickets = await response.json();

            res.render('dashboard/index', {
                title: 'Admin Dashboard',
                tickets,
                user: req.session.user
            });
        } catch (error) {
            res.render('dashboard/index', {
                title: 'Admin Dashboard',
                tickets: [],
                error: 'Failed to load tickets'
            });
        }
    }
};

module.exports = dashboardController;