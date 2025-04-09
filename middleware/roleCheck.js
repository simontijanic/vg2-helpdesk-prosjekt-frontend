const roleCheck = {
    isStaffOrAdmin: (req, res, next) => {
        if (req.user && (req.user.role === 'admin' || 
            req.user.role === 'first-line' || 
            req.user.role === 'second-line')) {
            next();
        } else {
            res.redirect('/login?error=Not authorized');
        }
    },

    isSameLevel: (req, res, next) => {
        if (req.user && (
            req.user.role === 'admin' ||
            (req.user.role === 'first-line' && ticket.supportLevel === 'first-line') ||
            (req.user.role === 'second-line' && ticket.supportLevel === 'second-line')
        )) {
            next();
        } else {
            res.redirect('/login?error=Not authorized for this support level');
        }
    }
};

module.exports = roleCheck;