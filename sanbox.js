// const random = (min, max) => {
//   return Math.floor(Math.random() * (max - min + 1) + min);
// };

// console.log(random(30, 45));

// let number = 20;
// const generate = setInterval(sumNumber, 1500);

// function sumNumber() {
//   const newNum = number + 10;
//   console.log(number);
//   if (newNum === 50) {
//     clearInterval(generate);
//     return newNum;
//   }
// }

// Player.findOneAndUpdate(
//   { username: username },
//   { $set: { buildings: build._id } },
//   { new: true, useFindAndModify: false },
// )
//   .then((result) => {
//     res.status(201).json({ message: 'Ok', data: result });
//   })
//   .catch((err) => console.log(err));

// const power = Math.floor(Math.random() * (45 - 30 + 1) + 30) * 10;

// console.log(power);

// const date = new Date().toLocaleString('en-US', {
//   hour12: false,
//   timeZone: 'Asia/Bangkok',
// });

// console.log(date);

// let cooldown = false;
// setTimeout(() => {
//   cooldown = true;
// }, 2000);

// const bcrypt = require('bcryptjs');

// async function change() {
//   const password = 'admin';
//   const salt = await bcrypt.genSalt(12);
//   const hash = await bcrypt.hash(password, salt);

//   return hash;
// }

// change().then((pass) => {
//   console.log(pass);
// });
