const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
    try {
        const token = req.cookies.token; // Get token from cookies
        if (!token) {
            return res.redirect("/login?error=Authentication required");
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach user info to the request
        res.locals.user = decoded; // Set user info in locals for views
        next();
    } catch (error) {
        console.error("Authentication error:", error);
        res.redirect("/login?error=Invalid token or session expired");
    }
};

const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        res.redirect("/login?error=You do not have permission to access this page");
    }
};

const isSupport = (req, res, next) => {
    if (req.user && (req.user.role === 'first-line' || req.user.role === 'second-line')) {
        next();
    } else {
        res.redirect("/login?error=Support access required");
    }
};

module.exports = { auth, isAdmin, isSupport };