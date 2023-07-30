const express = require("express");
const bots = require("./src/botsData");
const shuffle = require("./src/shuffle");


const playerRecord = {
  wins: 0,
  losses: 0,
};
const app = express();

app.use(express.json());

var Rollbar = require('rollbar')
var rollbar = new Rollbar({
  accessToken: '9a3342e510e34a40a669aa6bb8bc21cd',
  captureUncaught: true,
  captureUnhandledRejections: true,
})
rollbar.log('Hello world!')

app.use(express.static(`${__dirname}/public`));
app.get('/',(req,res) => {
  rollbar.info('User has enter the homepage.')
  res.sendFile(path.join(__dirname,'../public/index.html'))
})


// Add up the total health of all the robots
const calculateTotalHealth = (robots) =>
  robots.reduce((total, { health }) => total + health, 0);

// Add up the total damage of all the attacks of all the robots
const calculateTotalAttack = (robots) =>
  robots
    .map(({ attacks }) =>
      attacks.reduce((total, { damage }) => total + damage, 0)
    )
    .reduce((total, damage) => total + damage, 0);

// Calculate both players' health points after the attacks
const calculateHealthAfterAttack = ({ playerDuo, compDuo }) => {
  const compAttack = calculateTotalAttack(compDuo);
  const playerHealth = calculateTotalHealth(playerDuo);
  const playerAttack = calculateTotalAttack(playerDuo);
  const compHealth = calculateTotalHealth(compDuo);

  return {
    compHealth: compHealth - playerAttack,
    playerHealth: playerHealth - compAttack,
  };
};

app.get("/api/robots", (req, res) => {
  try {
    res.status(200).send(botsArr);
  } catch (error) {
    rollbar.error('error getting bots');
    console.error("ERROR GETTING BOTS", error);
    res.sendStatus(400);
  }
});

app.get("/api/robots/shuffled", (req, res) => {
  try {
    let shuffled = shuffle(bots);
    res.status(200).send(shuffled);
    rollbar.info('Getting shuffled bots')
  } catch (error) {
    rollbar.error('error getting shuffled bots')
    console.error("ERROR GETTING SHUFFLED BOTS", error);
    res.sendStatus(400);
  }
});

app.post("/api/duel", (req, res) => {
  try {
    const { compDuo, playerDuo } = req.body;

    const { compHealth, playerHealth } = calculateHealthAfterAttack({
      compDuo,
      playerDuo,
    });

    // comparing the total health to determine a winner
    if (compHealth > playerHealth) {
      playerRecord.losses += 1;
      rollbar.log('user lost')
      res.status(200).send("You lost!");
    } else {
      playerRecord.losses += 1;
      rollbar.log('user won')
      res.status(200).send("You won!");
    }
  } catch (error) {
    console.log("ERROR DUELING", error);
    rollbar.error('Error dualing')
    res.sendStatus(400);
  }
});

app.get("/api/player", (req, res) => {
  try {
    res.status(200).send(playerRecord);
  } catch (error) {
    console.log("ERROR GETTING PLAYER STATS", error);
    rollbar.error('error getting player stats')
    res.sendStatus(400);
  }
});

app.listen(8000, () => {
  console.log(`Listening on 8000`);
});
