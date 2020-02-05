const SlackBot = require("slackbots");
const request = require("request");
const natural = require("natural");

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
  } else if (/^help\b/i.test(message)) {
    FAQ(message.substr(5));
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



  const questions = [
  "My computer does not turn on, what do I do now?",
  "What do I do when my computer crashes?",
  "There is no display on the monitor, what do I do now?",
  "I am unable to send or receive email?",
  "I can't receive any email attachments?",
  "How do I delete Internet cookies?"
  ];

  const answers = [
  "First check the computer's power cord to make sure it is completely plugged into the wall socket. If you are using a plug strip, make sure it is completely plugged into the wall socket and that the power switch on the plug strip is turned on. Some plug strips also have a built in circuit breaker which usually looks like a black or red button near the power switch. Press the button to reset it and see if that solves the problem.",
  "There are many reasons why a computer may just stop working or freeze. Most of the time there isn't much we can do about it, it is a fact of life that computer programs have become so complex that occasionally users will experience problems even when performing common tasks. When your computer no longer responds to keyboard commands your best bet is to restart the computer.",
  "Make sure the monitor is on. If no power light (green or orange light) is seen on the monitor display try pressing the power button until it comes on. If your computer monitor was on and you stepped away from the computer and upon returning it was black, it's likely that the computer is asleep. Try moving your mouse, clicking the mouse buttons, and/or pressing any key (space bar) on the keyboard to wake it up. Make sure that the monitor is connected properly to the back of the computer.",
  "Verify that your computer is able to see the Internet and/or other computers to ensure that your computer is not encountering a connection issue, which would be causing your e-mail issue. Ensure that your Internet e-mail server or your Network e-mail server is not encountering issues by contacting either your Internet Service Provider or your Network administrator.",
  "If the e-mail box is full of other e-mail messages, and/or your storage space is only a few megabytes, it's possible that the attachment being sent cannot be received. Often if this problem is occurring the person sending the e-mail should get a response back from your e-mail server indicating that your mailbox is full and/or has exceeded its allocated size. Because computer viruses and other malware are best distributed through e-mail, many e-mail service providers, companies, and e-mail programs prevent certain types of file extensions from being distributed or received through e-mail. For example, Microsoft Outlook protect its users by automatically disabling certain file extension types from being received in e-mail.",
  "Microsoft Internet Explorer users can go to 'Tools' (or the little cog icon in the top left), then go to 'Safety' and choose 'Delete browsing history...', you can then choose to delete your Internet cookies. In Google Chrome, go to 'More Tools' and choose 'Clear browsing data...'. Firefox users can go to 'History', then choose 'Clear recent history...'."
  ];


  function stemQuestions(questions) {
    const stemmed = [];
    for (i = 0; i < questions.length; i++) {
      natural.PorterStemmer.attach();
      stemmed.push(questions[i].tokenizeAndStem());
    }
    return stemmed;
  }

  const questionsStemmed = stemQuestions(questions);
  const distanceThreshold = 0.3;

  function highestSimilarity(question) {
    let maxDistance = 0;
    let maxIndex = 0;
    let currentDistance = 0;
    let normalizedDistance = 0;
    natural.PorterStemmer.attach();
    const stemmedQuestion = question.tokenizeAndStem();
    for (i = 0; i < questionsStemmed.length; i++) {
      currentDistance = natural.LevenshteinDistance(
        questionsStemmed[i],
        stemmedQuestion,
        { search: true }
        );
      if (currentDistance !== 0) {
        normalizedDistance =
        currentDistance.distance /
        Math.min(questionsStemmed[i].length, stemmedQuestion.length);
      } else {
        normalizedDistance = 0;
      }
      if (1 - normalizedDistance > maxDistance) {
        maxIndex = i;
        maxDistance = 1 - normalizedDistance;
      }
    }
    if (maxDistance > distanceThreshold) {
      return answers[maxIndex];
    } else {
      return "I am sorry, I can't help you. :(";
    }
  }

  function FAQ(question) {
    let msg = "";
    const params = {
      icon_emoji: ":bulb:"
    };
    if (question == "") {
      msg =
      "I can do a couple of things for you. \n Type 'joke' to hear a random one from me. \n Ask me for a 'GIF' and add keywords - I will return a random one according to your wish. \n I can also answer simple questions about computer problems - send 'help' followed by your question.";
    } else {
      msg = highestSimilarity(question);
    }
    bot.postMessageToChannel("bot", msg, params);
  }