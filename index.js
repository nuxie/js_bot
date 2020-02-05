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
  if (/joke/i.test(message)) {
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
}