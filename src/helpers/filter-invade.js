exports.player = async (schema, filter) => {
  try {
    const fetch = await schema.findOne({ username: filter });

    const { food, coin, healthTown } = fetch.resources;
    const { soldierAttackPoint, totalInfantry, totalPower } = fetch.infantries;
    return {
      usrId: fetch._id,
      resId: fetch.resources._id,
      infId: fetch.infantries._id,
      food: food,
      coin: coin,
      healthTown: healthTown,
      soldierPoint: soldierAttackPoint,
      soldiers: totalInfantry,
      power: totalPower,
    };
  } catch (err) {
    console.log(err);
  }
};

exports.collect = async function (schema, filter, resource, value, input) {
  if (input === 'Farm') {
    return schema.findByIdAndUpdate(
      { _id: filter },
      { $set: { food: resource + value } },
      { new: true },
    );
  } else if (input === 'Maket') {
    return schema.findByIdAndUpdate(
      { _id: filter },
      { $set: { coin: resource + value } },
      { new: true },
    );
  } else {
    return schema.findByIdAndUpdate(
      { _id: filter },
      { $set: { stamina: resource + value } },
      { new: true },
    );
  }
};

exports.updateDateCollect = async function (schema, filter, input) {
  const updateDate = new Date();
  if (input === 'Farm') {
    return schema.findByIdAndUpdate(
      { _id: filter },
      { $set: { farmCollect: updateDate } },
      { new: true },
    );
  } else if (input === 'Market') {
    return schema.findByIdAndUpdate(
      { _id: filter },
      { $set: { marketCollect: updateDate } },
      { new: true },
    );
  } else if (input === undefined) {
    return schema.findOneAndUpdate(
      { username: filter },
      { $set: { 'townHall.energyCollect': updateDate } },
      { new: true },
    );
  }
};

exports.getValueCollect = function (hitDate, dataDate) {
  return Math.floor((hitDate - dataDate) / 15000);
};

exports.consumption = async function (schema, filter, resource, consumpt) {
  return schema.findByIdAndUpdate(
    { _id: filter },
    { $set: { stamina: resource - consumpt } },
    { new: true },
  );
};

exports.createBuild = async function (schema, type) {
  const createDate = new Date();
  if (type === 'Farm') {
    return new schema({ buildingType: type, createFarm: createDate });
  } else if (type === 'Market') {
    return new schema({ buildingType: type, createMarket: createDate });
  } else {
    return new schema({ buildingType: type });
  }
};

exports.updateBuild = async function (schema, filter, type) {
  const createDate = new Date();
  if (type === 'Farm') {
    return schema.findByIdAndUpdate(
      { _id: filter },
      { $push: { buildingType: type }, $set: { createFarm: createDate } },
      { new: true },
    );
  } else if (type === 'Market') {
    return schema.findByIdAndUpdate(
      { _id: filter },
      { $push: { buildingType: type }, $set: { createMarket: createDate } },
      { new: true },
    );
  } else {
    return schema.findByIdAndUpdate(
      { _id: filter },
      { $push: { buildingType: type } },
      { new: true },
    );
  }
};
