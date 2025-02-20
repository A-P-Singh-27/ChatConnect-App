const express = require('express');
const { protect } = require('../middleware/auth');
const { SendMessage, AllMessages } = require('../controllers/messageControllers');

const router = express.Router();

router.post('/' , protect , SendMessage)
router.get('/:chatId' , protect , AllMessages)

module.exports = router;
