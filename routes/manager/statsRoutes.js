const express = require('express');
const router = express.Router();
const { getGeneralStats, getTopPrestations } = require('../../controllers/manager/statsController');
const jwtAuth=require('../../middlewares/jwtAuth');

router.get('/general',jwtAuth('manager'), getGeneralStats);
router.get('/top-prestations',jwtAuth('manager'), getTopPrestations);

module.exports = router;
