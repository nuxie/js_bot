const SlackBot = require("slackbots");

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
  const params = {
    icon_emoji: ":smile:"
  };
  bot.postMessageToChannel(
    "bot",
    "Thanks for talking to me.",
    params
  );
}