const router = require("express").Router();
const authController = require("../controllers/authController");
const { generalLimiter, authLimiter } = require('../middleware/rateLimiter');

router.get("/login", authController.showLogin);
router.post("/login", authLimiter, authController.login);
router.get("/register", authController.showRegister);
router.post("/register", authLimiter, authController.register);
router.get("/logout", authController.logout);

router.get("/", authController.showIndexPage);
router.get("/guide", authController.showGuide);

module.exports = router;
