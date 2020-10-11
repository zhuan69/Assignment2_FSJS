const express = require('express');
const playerController = require('../controller/player-controller');
const auth = require('../middleware/auth-middleware');

const route = express.Router();

route.get('/listbuilding/:username', auth, playerController.indexBuilding);
route.patch('/changeinfo/:username', auth, playerController.editInformation);
route.get('/:username', auth, playerController.indexResources);
route.get('/:username/collect', auth, playerController.collectResource);
route.put('/:username/createbuilding', auth, playerController.createBuilding);
route.patch('/:username/createinfantry', auth, playerController.createInfantry);
route.post('/:username/invade', auth, playerController.invadePlayer);
route.delete('/:username/demolish', auth, playerController.demolishBuilding);

module.exports = route;
