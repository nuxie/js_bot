const SlackBot = require("slackbots");
const request = require("request");

const bot = new SlackBot({
  token: "xoxb-933239002181-933697847524-Se0XsxOknVwERJpivNWEYezD",
  name: "626f74"
});

bot.on("start", () => {
  const params = {
    icon_emoji: ":rocket:"
  };
  bot.postMessageToChannel(
    "bot",
    "Tzzzzzt... What a wonderful day to be alive!",
    params
    );
});

bot.on("error", err => console.log(err));

bot.on("message", data => {
  if (data.type !== "message" || data.user == undefined) {
    return;
  }
  handleMessage(data.text);
});

function handleMessage(message) {
  if (/^gif\b/i.test(message)) {
    getGIF(message.substr(4));
  } else if (/joke/i.test(message)) {
    getJoke();
  }
}

function getJoke() {
  request("https://icanhazdadjoke.com/", { json: true }, (err, res, body) => {
    if (err) {
      return console.log(err);
    }
    const joke = body.joke;
    const params = {
      icon_emoji: ":sunglasses:"
    };
    bot.postMessageToChannel("bot", `${joke}`, params);
  });

function getGIF(searched) {
  request(
    "http://api.giphy.com/v1/gifs/search?q=" +
      encodeURIComponent(searched) +
      "&api_key=dc6zaTOxFJmzC",
    { json: true },
    (err, res, body) => {
      if (err) {
        return console.log(err);
      }
      try {
        const max = body.data.length;
        const min = 0;
        const randomNumber = Math.floor(Math.random() * (max - min)) + min;
        const params = {
          icon_emoji: ":frame_with_picture:"
        };
        gifUrl = body.data[randomNumber].images.downsized.url;
        replyMessage = "Here's your GIF: \n" + gifUrl;
        bot.postMessageToChannel("bot", replyMessage, params);
      } catch (error) {
        if (searched.length == 0) {
          bot.postMessageToChannel(
            "bot",
            "What kind of GIF are you looking for?"
          );
        } else if (body.data.length == 0) {
          bot.postMessageToChannel(
            "bot",
            "I couldn't find what you are looking for... :("
          );
        }
        console.error(error);
      }
    }
  );
}