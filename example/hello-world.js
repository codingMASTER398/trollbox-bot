import { Bot } from "../bot.js";

const owner = "Mc4NjQz";

const bot = new Bot("_", "#ff00ff00", "_");

bot.onConnect(() => {
  console.debug("connected");

  bot.changeRoom("underscore");
  bot.sendMessage("Bot Online");
});

bot.onMessage((message) => {
  let reply = "";
  switch (message.msg) {
    case "Hi":
      reply = "Hello";
      break;
    case "AAAAAAAAAAAAA":
      reply = "h";
      break;
    case "Hello":
      reply = "Welcome";
      break;
    default:
      return;
  }
  bot.sendMessage(reply + " to you, " + message.nick);
});

bot.setCommand("close", () => {
  bot.socket.close();
});

bot.setCommand("goHome", (message) => {
  if (message.home !== owner) {
    return bot.sendMessage("I'm afraid I can't let you do that...");
  }
  bot.changeRoom("atrium");
});

bot.setCommand("help", () => {
  const helpBody =
    "All command names:\n" +
    Object.keys(bot.commands)
      .map((name) => "  _" + name)
      .join("\n");
  bot.sendMessage(helpBody);
});

bot.connect();
