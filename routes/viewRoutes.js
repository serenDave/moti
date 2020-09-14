const express = require('express');
const viewsController = require('../controllers/viewsController');

const router = express.Router();

router.get('/', viewsController.getHomepage);
router.get('/alternatives', viewsController.getAlternatives);
router.get('/criteria', viewsController.getCriteria);
router.get('/marks', viewsController.getMarks);
router.get('/results', viewsController.getResults);

module.exports = router;