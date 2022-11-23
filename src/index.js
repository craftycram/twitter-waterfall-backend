require('dotenv').config();
const Twit = require('twit');
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const Twitter = new Twit({
  consumer_key:         process.env.API_KEY,
  consumer_secret:      process.env.API_SECRET,
  app_only_auth:        true
})

let currentTweet = {};

function getCurrentTweet() {
    const params = {
      q: 'from:Asusrogde OR from:NetworkChuck',
      result_type: 'recent',
      count: 1
  } 

    Twitter.get('search/tweets', params, (err, data, _response) => {
      if (!err && data) {
        
        const tweets = data.statuses
        currentTweet = tweets[0];

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