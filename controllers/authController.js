const jwt = require('jsonwebtoken');

const authController = {
    showLogin: (req, res) => {
        res.render('auth/login', { 
            title: 'Login',
            error: req.query.error 
        });
    },

    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.redirect('/auth/login?error=Email and password are required');
            }

            const response = await fetch('http://localhost:4000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok && data.token) {
                // Decode the token to get user info
                const decoded = jwt.decode(data.token);
                
                // Store both token and user info in session
                req.session.token = data.token;
                req.session.user = {
                    email: decoded.email,
                    role: decoded.role,
                    isLoggedIn: true
                };
                
                res.redirect('/');
            } else {
                res.redirect('/login?error=' + encodeURIComponent(data.message || 'Login failed'));
            }
        } catch (error) {
            console.error(error);
            res.redirect('/login?error=Server error occurred');
        }
    },

    showRegister: (req, res) => {
        res.render('auth/register', { 
            title: 'Register',
            error: req.query.error 
        });
    },

    register: async (req, res) => {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.redirect('/register?error=All fields are required');
        }

        try {
            const response = await fetch('http://localhost:4000/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(req.body)
            });

            const data = await response.json();

            if (response.ok) {
                res.redirect('/login?message=Registration successful');
            } else {
                res.redirect('/register?error=' + encodeURIComponent(data.message));
            }
        } catch (error) {
            res.redirect('/register?error=Server error occurred');
        }
    },

    logout: (req, res) => {
        req.session.destroy();
        res.redirect('/');
    }
};

module.exports = authController;