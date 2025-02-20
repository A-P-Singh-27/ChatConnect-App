const express = require('express');
const { protect } = require('../middleware/auth');
const { AccessChats, FetchChats, CreateGroupChat, RenameGroupChat, AddToGroup, RemoveFromGroup } = require('../controllers/chatControllers');

const router = express.Router();

router.post('/' , protect, AccessChats);
router.get('/' , protect, FetchChats);
router.post('/group' ,protect, CreateGroupChat);
router.put('/rename' ,protect, RenameGroupChat);
router.put('/removefromgroup' ,protect, RemoveFromGroup);
router.put('/addtogroup' ,protect, AddToGroup);

module.exports = router;