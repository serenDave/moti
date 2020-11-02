const express = require('express');
const viewsController = require('../controllers/viewsController');

const router = express.Router();

router.get('/', viewsController.getHomepage);
router.get('/alternatives', viewsController.getAlternatives);
router.get('/criteria', viewsController.getCriteria);
router.get('/marks', viewsController.getMarks);
router.get('/results', viewsController.getResults);
router.get('/vectors', viewsController.getVectors);
router.get('/lprs', viewsController.getLPRS);
router.get('/editView/:type/:id', viewsController.getEditView);

module.exports = router;