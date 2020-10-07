const express = require('express');
const playerController = require('../controller/player-contoller');
const auth = require('../middleware/auth-middleware');

const route = express.Router();

route.get('/listBuilding/:username', auth, playerController.indexBuilding);
route.patch('/changeInfo/:username', auth, playerController.editInformation);
route.get('/:username', auth, playerController.indexResources);
route.put('/:username/createBuilding', auth, playerController.createBuilding);
route.post('/:username/invade', auth, playerController.invadePlayer);
route.get('/:username/collect', auth, playerController.collectResource);

module.exports = route;
