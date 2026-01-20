const express = require('express');
const router = express.Router();
const areaController = require('../controllers/areaDestinoController');

const auth = require('../middlewares/auth'); 
const { admin } = require('../middlewares/roleMiddleware'); 


router.route('/')
    .get(auth, areaController.getAreas) 
    .post(auth, admin, areaController.createArea);

router.route('/:id')
    .put(auth, admin, areaController.updateArea);

router.patch('/:id/estado', auth, admin, areaController.toggleEstado);

module.exports = router;