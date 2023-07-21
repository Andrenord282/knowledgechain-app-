const Router = require('express');
const authController = require('../controllers/authController');
const router = new Router();

router.post('/logup', authController.logUp);
router.post('/login', authController.logIn);
router.get('/logout', authController.logOut);
router.get('/refresh', authController.refresh);

module.exports = router;
