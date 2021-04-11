# Trollbox-bot

Trollbox-bot is a minimal library for making simple, fast-responding trollbox bots for windows 93.

## Installation

Use the package manager npm to install trollbox-bot.

```bash
npm i trollbox-bot
```

## Usage

First of all, require() the module into your project.
```js
tb = require("trollbox-bot")
```
Connecting your bot
```js
tb.connect("Name","Color","Prefix","Welcome message")
```
onconnect, all further commands **MUST** be inside this function
```js
tb.onconnect = function(socket) {
  //commands here
}
```
setcommand - to make a message the bot can respond to
```js
tb.setcommand("ah",function(data, socket) {
  socket.send("AH!")
})
//When a user says "a" with the prefix, the bot will send back "AH!"
//Have a look through the data variable for info on the command that was sent.
```
the "data" json passed contains:
```json
{
  date: 1618120112288, 
  nick: 'joe',
  color: '#f78b00',
  style: '',
  home: 'Njg1MDg',
  msg: '=a'
}
The "date" is for when the message was sent in some time thing
The "nick" is the name of the user
The "color" is the html color of the user
The "style"... im not sure, dont worry about it
The "home" is a string that can be used to identify the client as it never changes
The "msg" is the message that was sent that triggered the command, useful for more advanced commands

```

onmessage - Fires a function when a message is sent, complex but useful in some cases.
```js
bt.onmessage(function(data) {
  console.log(data)
  //The "data" is sometimes different to the data on setcommand.
  //Log it in the console and inspect it so you know whats in it
  //Im lazy to put it here
})
```

onuserjoined - Fire a function when a user joins
```js
tb.onuserjoined(function(data) {
  console.log(data)
})
```

onuserleft - Fire a function when a user leaves
```js
tb.onuserleft(function(data) {
  console.log(data)
})
```
updatecolor - Updates the color of the bot
```js
tb.updatecolor("White")
```

updatename - Updates the name of the bot
```js
tb.updatename("Joebot (=)")
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## My bot
Feel free to check out my bot,(even though it wasn't made with this package), BONZI!

On trollbox there should be a bot called "bonzibuddy (-)"

Say -help for a list of commands!

## Bots made with this
None so far that has been noted

If you want your bot in this README, contact me at
lachienoble10@outlook.com.

## License
[MIT](https://choosealicense.com/licenses/mit/)
