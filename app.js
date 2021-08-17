const express = require("express");
const socket = require("socket.io");
const { Wit } = require('node-wit');
const request = require('request');

// App setup
const PORT = 5000;
const app = express();
const server = app.listen(PORT, function () {
  console.log(`Listening on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});

// Wit setup
const client = new Wit({
  accessToken: `TOKEN`
});

// Socket setup
const io = socket(server);

io.on("connection", socket => {
  console.log('connected...');
  socket.emit("message", "Greetings!");

  socket.on("message", (message) => {
    console.log('message...');
    console.log(message);
    client.message(message, {})
    .then((data) => {
      console.log('Yay, got Wit.ai response: ' + JSON.stringify(data));
      handleMessage(socket, data);
    })
    .catch(console.error);
  });

  socket.on("disconnect", (reason) => {
    console.log('disconnect...');
    console.log(reason);
  });
});

const handleMessage = (socket, {entities, traits}) => {
  const chuckNorris = firstValue(entities, 'chuck-norris:chuck-norris');
  const greetings = firstValue(traits, 'wit$greetings');
  const sentiment = firstValue(traits, 'wit$sentiment');
  const location = firstBody(entities, 'wit$location:location');
  console.log(location);
  if (chuckNorris) {
    chuckNorrisFacts(socket);
  } else if (location) {
    getWeatherFor(socket, location);
  } else if (sentiment) {
    const reply = sentiment === 'positive' ? 'Thank you.' : 'Hmm.';
    socket.emit("message", reply);
  } else if (greetings) {
    socket.emit("message", "Greetings human!");
  } else {
    socket.emit("message", "Sorry, I didn't get that.");
  }
};

const firstValue = (obj, key) => {
  const val = obj && obj[key] &&
    Array.isArray(obj[key]) &&
    obj[key].length > 0 &&
    obj[key][0].value
  ;
  if (!val) {
    return null;
  }
  return val;
};

const firstBody = (obj, key) => {
  const val = obj && obj[key] &&
    Array.isArray(obj[key]) &&
    obj[key].length > 0 &&
    obj[key][0].body
  ;
  if (!val) {
    return null;
  }
  return val;
};

const chuckNorrisFacts = (socket) => {
  request('https://api.chucknorris.io/jokes/random', function(error, response, body) {
    if (!error && response.statusCode == 200) {
      var parsed = JSON.parse(body);
      if (parsed && parsed.value) {
        socket.emit("message", parsed.value);
      } else {
        socket.emit("message", "Oops, I couldn't find any jokes...");
      }
    } else {
      socket.emit("message", "Oops, I couldn't find Chuck Norris!");
    }
  });
};

const getWeatherFor = (socket, location) => {
  request('https://api.openweathermap.org/data/2.5/weather?q=' + location + '&units=imperial&APPID=TOKEN', function(error, response, body) {
    if (!error && response.statusCode == 200) {
      var parsed = JSON.parse(body);
      const description = parsed && parsed.weather && parsed.weather[0] && parsed.weather[0].description;
      const temperature = parsed && parsed.main && parsed.main.temp;
      if (description || temperature) {
        socket.emit("message", "Looks like " + (description ? description : "a normal day") + (temperature ? " with a temperature of " + temperature : ""));
      } else {
        socket.emit("message", "Oops, I couldn't find that weather");
      }
    } else {
      socket.emit("message", "Oops, I couldn't reach the weather!");
    }
  });
};