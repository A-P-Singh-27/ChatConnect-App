const express = require('express');
const { RegisterUser, AuthUser, AllUsers } = require('../controllers/userControllers');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/', RegisterUser);
router.post('/login', AuthUser);
router.get('/', protect ,AllUsers)

module.exports = router;