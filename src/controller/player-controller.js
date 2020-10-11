const Player = require('../database/entity/player-schema');
const Building = require('../database/entity/build-schema');
const Resource = require('../database/entity/resource-schema');
const Infantry = require('../database/entity/infantry-schema');
const AnError = require('../error/AnError');
const {
  player,
  collect,
  updateDateCollect,
  getValueCollect,
  consumption,
  createBuild,
  updateBuild,
} = require('../helpers/filter-crud');

exports.indexResources = async (req, res, next) => {
  const { username } = req.params;
  const result = await Player.findOne({ username: username });
  if (!result) {
    next(AnError.notFound('Data tidak ada'));
    return;
  }
  res.status(200).json({
    message: 'Data yang di dapat',
    info: { TownName: result.townHallName, Resource: result.resources },
  });
};

exports.indexBuilding = async (req, res, next) => {
  const { username } = req.params;

  try {
    const result = await Player.findOne({ username: username });
    if (!result) {
      next(AnError.notFound('Data tidak ada'));
    }
    res.status(200).json({
      message: 'Data yang di dapat',
      info: { TownName: result.townHallName, Building: result.buildings },
    });
  } catch {
    next(AnError.internalError());
    return;
  }
};

exports.editInformation = async (req, res, next) => {
  const username = req.params.username;
  const { nickname, townHallName } = req.body;
  const userDoc = await Player.findOne({ username: username });
  if (userDoc) {
    if (nickname === userDoc.nickname) {
      next(AnError.badRequest('Nickname sudah digunakan'));
      return;
    } else if (townHallName === userDoc.townHallName) {
      next(AnError).badRequest('Nama Town Hall sudah di gunakan');
      return;
    }
  }
  const result = await Player.findOneAndUpdate(
    { username: username },
    {
      $set: {
        nickname: nickname,
        'townHall.townName': townHallName,
      },
    },
    { new: true },
  );
  res.status(201).json({
    message: 'Berhasil ganti nicknaname dan town hall name',
    data: {
      username: result.username,
      nickname: result.nickname,
      townName: result.townHall.townName,
    },
  });
};

exports.createBuilding = async (req, res, next) => {
  const { username } = req.params;
  const { buildType } = req.body;

  const dataUser = await Player.findOne({ username: username });
  const { stamina } = dataUser.resources;
  if (dataUser.buildings !== undefined) {
    const userBuild = await Player.findOne({ username: username });
    const { buildingType } = userBuild.buildings;
    let exist = false;
    buildingType.forEach((el) => {
      if (buildType === el) {
        return (exist = true);
      }
    });
    if (!exist) {
      if (buildType === 'Barrack') {
        if (stamina < 10) {
          next(AnError.badRequest('Stamina kurang'));
          return;
        }
        if (dataUser.infantries === undefined) {
          const infantry = new Infantry();
          infantry.save();
          const resourceBarrack = await consumption(
            Resource,
            dataUser.resources._id,
            stamina,
            10,
          );
          const barrack = await updateBuild(
            Building,
            userBuild.buildings._id,
            buildType,
          );
          await Player.findOneAndUpdate(
            { username: username },
            { $set: { infantries: infantry._id } },
            { new: true },
          );
          res.status(201).json({
            message: 'Ok',
            data: {
              resource: resourceBarrack.stamina,
              building: barrack,
              infantry: infantry,
            },
          });
        } else {
          const resourceBarrack = await consumption(
            Resource,
            dataUser.resources._id,
            stamina,
            10,
          );
          const barrack = await updateBuild(
            Building,
            userBuild.buildings._id,
            buildType,
          );
          res.status(201).json({
            message: 'Ok',
            data: {
              resource: resourceBarrack.stamina,
              building: barrack,
            },
          });
        }
      } else if (buildType === 'Farm') {
        if (stamina < 8) {
          next(AnError.badRequest('Stamina anda tidak cukup'));
          return;
        }
        const resourceFarm = await consumption(
          Resource,
          dataUser.resources._id,
          stamina,
          8,
        );
        const farm = await updateBuild(
          Building,
          userBuild.buildings._id,
          buildType,
        );
        res.status(201).json({
          message: 'Ok',
          data: {
            resource: resourceFarm.stamina,
            building: farm,
          },
        });
      } else if (buildType === 'Market') {
        if (stamina < 12) {
          next(AnError.badRequest('Stamina tidak cukup'));
          return;
        }
        const resourceMarket = await consumption(
          Resource,
          dataUser.resources._id,
          stamina,
          12,
        );
        const market = await updateBuild(
          Building,
          userBuild.buildings._id,
          buildType,
        );
        res.status(201).json({
          message: 'OK',
          data: {
            resource: resourceMarket.stamina,
            building: market,
          },
        });
      }
    } else {
      next(AnError.badRequest('Maksimum bangunan hanya 1'));
      return;
    }
  } else {
    if (buildType === 'Barrack') {
      if (stamina < 10) {
        next(AnError.badRequest('Stamina tidak cukup'));
        return;
      }
      const buildBarrack = await createBuild(Building, buildType);
      buildBarrack.save();
      const infantry = new Infantry();
      infantry.save();
      const resourceBarrack = await consumption(
        Resource,
        dataUser.resources._id,
        stamina,
        10,
      );
      await Player.findOneAndUpdate(
        { username: username },
        {
          $set: {
            buildings: buildBarrack._id,
            infantries: infantry._id,
          },
        },
        { new: true },
      );
      res.status(201).json({
        message: 'Ok',
        data: {
          resource: resourceBarrack.stamina,
          building: buildBarrack.buildingType,
          infantry: infantry,
        },
      });
    } else if (buildType === 'Farm') {
      if (stamina < 8) {
        next(AnError.badRequest('Stamina tidak cukup'));
        return;
      }
      const buildFarm = await createBuild(Building, buildType);
      buildFarm.save();
      const resourceFarm = await consumption(
        Resource,
        dataUser.resources._id,
        stamina,
        8,
      );
      await Player.findOneAndUpdate(
        { username: username },
        { $set: { buildings: buildFarm._id } },
        { new: true },
      );
      res.status(201).json({
        message: 'Ok',
        data: { resource: resourceFarm.stamina, building: buildFarm },
      });
    } else if (buildType === 'Market') {
      if (stamina <= 12) {
        next(AnError.badRequest('Stamina tidak cukup'));
        return;
      }
      const buildMarket = await createBuild(Building, buildType);
      buildMarket.save();
      const resourceMarket = await consumption(
        Resource,
        dataUser.resources._id,
        stamina,
        12,
      );
      await Player.findOneAndUpdate(
        { username: username },
        { $set: { buildings: buildMarket._id } },
        { new: true },
      );
      res.status(201).json({
        message: 'Ok',
        data: { resource: resourceMarket.stamina, building: buildMarket },
      });
    }
  }
};
exports.collectResource = async (req, res, next) => {
  const { username } = req.params;
  const { collectType } = req.query;
  const unixTime = Date.now();

  const dataUser = await Player.findOne({ username: username });
  if (dataUser.buildings === undefined) {
    next(AnError.notFound('Anda tidak memiliki bangunan apapun'));
    return;
  }
  const { createTown, energyCollect } = dataUser.townHall;
  const { stamina, food, coin } = dataUser.resources;
  const {
    createFarm,
    createMarket,
    farmCollect,
    marketCollect,
  } = dataUser.buildings;
  if (collectType === 'Farm') {
    if (farmCollect === undefined) {
      const unixFarm = Date.parse(createFarm);
      const valueFood = getValueCollect(unixTime, unixFarm);
      if (valueFood >= 20) {
        const resultFood = await collect(
          Resource,
          dataUser.resources._id,
          food,
          20,
          collectType,
        );
        await updateDateCollect(Building, dataUser.buildings._id, collectType);
        res
          .status(201)
          .json({ message: 'Food Collected', Food: resultFood.food });
      } else {
        const resultFood = await collect(
          Resource,
          dataUser.resources._id,
          food,
          valueFood,
          collectType,
        );
        await updateDateCollect(Building, dataUser.buildings._id, collectType);
        res
          .status(201)
          .json({ message: 'Food Collected', Food: resultFood.food });
      }
    } else {
      const unixFoodCollect = Date.parse(farmCollect);
      const valueFoodCollect = getValueCollect(unixTime, unixFoodCollect);
      if (valueFoodCollect > 20) {
        const resultFood = await collect(
          Resource,
          dataUser.resources._id,
          food,
          20,
          collectType,
        );
        await updateDateCollect(Building, dataUser.buildings._id, collectType);
        res
          .status(201)
          .json({ message: 'Food Collected', Food: resultFood.food });
      } else {
        const resultFood = await collect(
          Resource,
          dataUser.resources._id,
          food,
          valueFoodCollect,
          collectType,
        );
        await updateDateCollect(Building, dataUser.buildings._id, collectType);
        res
          .status(201)
          .json({ message: 'Food Collected', Food: resultFood.food });
      }
    }
  } else if (collectType === 'Market') {
    if (marketCollect === undefined) {
      const unixMarket = Date.parse(createMarket);
      const valueCoin = getValueCollect(unixTime, unixMarket);
      if (valueCoin >= 20) {
        const resultCoin = await collect(
          Resource,
          dataUser.resources._id,
          coin,
          20,
          collectType,
        );
        await updateDateCollect(Building, dataUser.buildings._id, collectType);
        res
          .status(201)
          .json({ message: 'Coin Collected', Coin: resultCoin.coin });
      } else {
        const resultCoin = await collect(
          Resource,
          dataUser.resources._id,
          coin,
          valueCoin,
          collectType,
        );
        await updateDateCollect(Building, dataUser.buildings._id, collectType);
        res
          .status(201)
          .json({ message: 'Coin collected', Coin: resultCoin.coin });
      }
    } else {
      const unixCollectMarket = Date.parse(marketCollect);
      const valueCoinCollect = getValueCollect(unixTime, unixCollectMarket);
      if (valueCoinCollect >= 20) {
        const resultCollectCoin = await collect(
          Resource,
          dataUser.resources._id,
          coin,
          20,
          collectType,
        );
        await updateDateCollect(Building, dataUser.buildings._id, collectType);
        res
          .status(201)
          .json({ message: 'Coin collected', Coin: resultCollectCoin });
      } else {
        const resultCollectCoin = await collect(
          Resource,
          dataUser.resources._id,
          coin,
          valueCoinCollect,
          collectType,
        );
        await updateDateCollect(Building, dataUser.buildings._id, collectType);
        res
          .status(201)
          .json({ message: 'Coin collected', Coin: resultCollectCoin.coin });
      }
    }
  } else if (collectType === 'Town Hall') {
    if (energyCollect === undefined) {
      const unixTown = Date.parse(createTown);
      const valueEnergy = getValueCollect(unixTime, unixTown);
      if (valueEnergy >= 50) {
        const resultStamina = await collect(
          Resource,
          dataUser.resources._id,
          stamina,
          50,
        );
        await updateDateCollect(Player, username);
        res.status(201).json({
          message: 'Stamina Collected',
          Stamina: resultStamina.stamina,
        });
      } else {
        const resultStamina = await collect(
          Resource,
          dataUser.resources._id,
          stamina,
          valueEnergy,
        );
        await updateDateCollect(Player, username);
        res.status(201).json({
          message: 'Stamina Collected',
          Stamina: resultStamina.stamina,
        });
      }
    } else {
      const unixEnergyCollect = Date.parse(energyCollect);
      const valueCollectEnergy = getValueCollect(unixTime, unixEnergyCollect);
      if (valueCollectEnergy >= 50) {
        const resultCollectStamina = await collect(
          Resource,
          dataUser.resources._id,
          stamina,
          50,
        );
        await updateDateCollect(Player, username);
        res.status(201).json({
          message: 'Stamina Collected',
          Stamina: resultCollectStamina.stamina,
        });
      } else {
        const resultCollectStamina = await collect(
          Resource,
          dataUser.resource._id,
          stamina,
          valueCollectEnergy,
        );
        await updateDateCollect(Player, username);
        res.status(201).json({
          message: 'Stamina Collected',
          Stamina: resultCollectStamina.stamina,
        });
      }
    }
  }
};

exports.createInfantry = async (req, res, next) => {
  const { username } = req.params;

  const dataUser = await Player.findOne({ username: username });
  if (dataUser.buildings === undefined) {
    next(AnError.notFound('Anda tidak memiliki bagunan apapun'));
    return;
  }
  const { food, coin } = dataUser.resources;
  const { buildingType } = dataUser.buildings;
  const { totalInfantry, totalPower } = dataUser.infantries;
  let isBarrack;
  buildingType.forEach((el) => {
    if (el === 'Barrack') {
      return (isBarrack = true);
    } else {
      return (isBarrack = false);
    }
  });
  if (isBarrack === false) {
    next(AnError.notFound('Anda belum memiliki barrack'));
    return;
  } else {
    if (food < 5 && coin < 5) {
      next(
        AnError.badRequest(
          'Coin dan food anda tidak cukup untuk membuat infantry',
        ),
      );
      return;
    }
    const attackPoint = Math.floor(Math.random() * (45 - 30 + 1) + 30);
    const powerPoint = attackPoint;

    const resourceInfantry = await Resource.findByIdAndUpdate(
      dataUser.resources._id,
      { $set: { food: food - 5, coin: coin - 5 } },
      { new: true },
    );
    const resultInfantry = await Infantry.findByIdAndUpdate(
      dataUser.infantries._id,
      {
        $push: { soldierAttackPoint: attackPoint },
        $set: {
          totalInfantry: totalInfantry + 1,
          totalPower: totalPower + powerPoint,
        },
      },
      { new: true },
    );
    res.status(201).json({
      message: 'Berhasil membuat infantry',
      data: { infantry: resultInfantry, resource: resourceInfantry },
    });
  }
};

exports.invadePlayer = async (req, res, next) => {
  const { username } = req.params;
  const { invadeuser } = req.query;

  const invader = await player(Player, username);
  const defender = await player(Player, invadeuser);
  let cooldown = false;
  if (cooldown === true) {
    next(
      AnError.badRequest('Anda sedang cooldown tidak bisa melakukan serangan'),
    );
  } else {
    if (invader.power > defender.power) {
      setTimeout(() => {
        return (cooldown = true);
      }, 60000);
      const resourcePlayer2 = await Resource.findOneAndUpdate(
        { _id: defender.resId },
        {
          $set: {
            food: defender.food / 2,
            coin: defender.coin / 2,
            healthTown: defender.healthTown - (invader.power - defender.power),
          },
        },
        { new: true },
      );
      const resourcePlayer1 = await Resource.findOneAndUpdate(
        { _id: invader.resId },
        {
          $set: {
            food: invader.food + resourcePlayer2.food,
            coin: invader.coin + resourcePlayer2.coin,
          },
        },
        { new: true },
      );
      res.status(201).json({
        message: 'Invade success and you got reward',
        totalResources: resourcePlayer1,
      });
    } else {
      let arrayPoint = invader.soldierPoint;
      arrayPoint.splice(0, 3);
      let casualitiesSoldiers = Math.floor(invader.soldiers / 3);
      let casualitiesPower = arrayPoint.reduce((total, value) => {
        return total + value;
      }, 0);
      if (casualitiesSoldiers >= 0) {
        casualitiesPower = 0;
      }
      const invaderSoldiers = await Infantry.findOneAndUpdate(
        { _id: invader.infId },
        {
          $set: {
            soldierAttackPoint: arrayPoint,
            totalInfantry: casualitiesSoldiers,
            totalPower: casualitiesPower,
          },
        },
        { new: true },
      );
      res.status(201).json({
        message: 'Invade failed and you get casualities',
        casualities: invaderSoldiers,
      });
    }
  }
};

exports.demolishBuilding = async (req, res, next) => {
  const { username } = req.params;
  const { destroy } = req.body;

  const dataUser = await Player.findOne({ username: username });
  const { buildingType } = dataUser.buildings;
  const indexType = buildingType.indexOf(destroy);
  if (destroy !== buildingType[indexType]) {
    next(AnError.badRequest('Bangunan tidak ada'));
    return;
  }
  const deleteBuilding = await Building.findByIdAndUpdate(
    dataUser.buildings._id,
    { $pull: { buildingType: destroy } },
    { new: true },
  );
  res.status(200).json({ messge: 'ok', data: deleteBuilding });
};
