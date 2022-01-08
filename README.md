# Message for Toby222
I couldn't reach out to you any other way, but the point is that you did a much better job at making this package than I did. Mine is spaghetti code (I'm better now), so if you want to you can take full ownership of this, change the LICENSE, whatever you need. Thank you, if you need to reach out to me, DM codingMASTER398#5751 on discord.

# Trollbot

Trollbot is a minimal library for making simple, fast-responding trollbox bots for windows 93.

## Types

```ts
type Home = string;

type User = {
  nick: string;
  color: string;
  style: string;
  home: Home;
  room: string;
  isBot: boolean;
};

type Message = {
  date: number;
  nick: string;
  color: string;
  style: string;
  home: Home;
  msg: string;
};
```

## Usage

First of all, import the bot class, and create a bot.

```js
import Bot from "trollbox-bot";

const bot = new Bot("Name", "Color", "Prefix", "Welcome message");
```

setCommand - Adds a callback that fires when the message begins with the bot's prefix and the command's name

```js
// When a user says "name" with the prefix, the bot will send back its current nickname.
// Have a look through the data variable for info on the command that was sent.

bot.setCommand("name", (message) => {
  bot.sendMessage(`My name is ${bot.name}, ${message.nick}`);
});
```

onConnect - Adds a callback that fires when the bot has successfully connected.

```js
bot.onConnect((socket) => {
  bot.sendMessage("Nvm, I'm out...");
  socket.close();
});
```

onmessage - Adds a callback that fires when a message is received.

```js
bot.onMessage((message) => {
  // ...
});
```

onUserJoined - Adds a callback that fires when a user joins.

```js
bot.onUserJoined((user) => {
  // ...
});
```

onUserLeft - Adds a callback that fires when a user leaves your current room.

```js
bot.onUserLeft((user) => {
  // ...
});
```

updateColor - Updates the color of the bot

```js
bot.updateColor("White");
```

updateName - Updates the name of the bot

```js
bot.updateName("Joebot (=)");
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## Bots made with this

None so far that has been noted

## License

[MIT](https://choosealicense.com/licenses/mit/)
