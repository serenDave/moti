const express = require('express');
const dbActionsController = require('../controllers/dbActionsController');

const router = express.Router();

router.post('/add/:type', dbActionsController.add);
router.patch('/edit/:type/:id', dbActionsController.edit);
router.delete('/remove/:type/:id', dbActionsController.remove);

module.exports = router;