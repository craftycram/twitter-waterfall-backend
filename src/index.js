require('dotenv').config();
const { TwitterApi } = require('twitter-api-v2');
const express = require('express');
const cors = require('cors');

const consumerClient = new TwitterApi({ appKey: process.env.API_KEY, appSecret: process.env.API_SECRET });

const app = express();
app.use(cors());
app.use(express.json());

const query = process.env.QUERY || 'from:davidbombal OR from:networkchuck';

async function start() {
  const client = await consumerClient.appLogin()

  let currentTweet = {};

  function getCurrentTweet() {
      client.v2.search(query).then((response) => {
        if (response) {
          currentTweet = response.tweets[0];
        }
      })
  }

  getCurrentTweet();
  setInterval(getCurrentTweet, 30 * 1000);

  app.get('/', (_req, res) => {
    res.status(200).send(currentTweet);
  });

  app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on port ${process.env.PORT || 3000}`);
  });
}
start();