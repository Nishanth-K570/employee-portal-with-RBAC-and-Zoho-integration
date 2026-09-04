const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/auth');
const zoho = require('../controllers/zohoController');

router.get('/my-apps', authenticate, zoho.myApps);
// Wildcard proxy: /api/zoho/proxy/:role/*
router.all('/proxy/:role/*', authenticate, zoho.proxy);

module.exports = router;
