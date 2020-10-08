const express = require('express');
const playerController = require('../controller/player-controller');
const auth = require('../middleware/auth-middleware');

const route = express.Router();

route.get('/listBuilding/:username', auth, playerController.indexBuilding);
route.patch('/changeInfo/:username', auth, playerController.editInformation);
route.get('/:username', auth, playerController.indexResources);
route.get('/:username/collect', auth, playerController.collectResource);
route.put('/:username/createBuilding', auth, playerController.createBuilding);
route.patch('/:username/createinfantry', auth, playerController.createInfantry);
route.post('/:username/invade', auth, playerController.invadePlayer);

module.exports = route;
