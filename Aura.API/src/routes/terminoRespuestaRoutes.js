const express = require('express');
const router = express.Router();
const terminoController = require('../controllers/terminoRespuestaController');

const auth = require('../middlewares/auth');
const { admin } = require('../middlewares/roleMiddleware');


router.get('/', auth, terminoController.getTerminos);

router.post('/', auth, admin, terminoController.createTermino);

router.put('/:id', auth, admin, terminoController.updateTermino);

router.patch('/:id/estado', auth, admin, terminoController.toggleEstado);

module.exports = router;
