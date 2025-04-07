const isAuthenticated = (req, res, next) => {
    if (req.session.user && req.session.user.isLoggedIn) {
        next();
    } else {
        res.redirect('/login?error=Please login to access this page');
    }
};

const isAdmin = (req, res, next) => {
    if (req.session.user && req.session.user.role === 'admin') {
        next();
    } else {
        res.redirect('/dashboard?error=Admin access required');
    }
};

const isUser = (req, res, next) => {
    if (req.session.user && req.session.user.role === 'user') {
        next();
    } else {
        res.redirect('/dashboard?error=User access required');
    }
};

module.exports = {
    isAuthenticated,
    isAdmin,
    isUser
};