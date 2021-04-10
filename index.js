var io = require('socket.io-client')
var tbh = require('trollbox-headers').headers()
var address = "http://www.windows93.net:8081";
var fs = require('fs')
var path = require('path')
var he = require('he');
var started = false
var prefix = "-"
var commands = {}
var onmessagecommands = []
var onuserleftcommands = []
var onuserjoinedcommands = []
var currentname = ""
var currentcolor = ""
const socket = "";

function connect(name, color, prefix, welcomemsg) {
  currentname = name
  currentcolor = color

  exports.users = {}
  const socket = io(address, tbh);
  exports.updatecolor= function(color) {
    console.log("Updating color")
    socket.emit('user joined', currentname, color,"beepboop","")
    currentcolor = color
  }
  exports.updatename= function(name) {
    console.log("Updating name")
    socket.emit('user joined', name, currentcolor,"beepboop","")
    currentname = name
  }
  socket.on('_connected', function(data){
    socket.emit('user joined', name, color,"beepboop","")
    if(welcomemsg){
      socket.send(welcomemsg)
    }
    prefix = prefix
    started = true
    exports.onconnect(socket)
  })
  socket.on('disconnect', function(data) {
    console.log("Failed to connect, retrying...")
    connect(name, color, prefix, welcomemsg)
  });
  socket.on('user joined', function(data) {
    for (let index = 0; index < onmessagecommands.length; index++) {
      setTimeout(() => {
        onmessagecommands[index](data);
      }, 1);
    }
  });
  socket.on('user left', function(data) {
    for (let index = 0; index < onuserleftcommands.length; index++) {
      setTimeout(() => {
        onuserleftcommands[index](data);
      }, 1);
    }
  });
  
  socket.on('update users', function (data) {
  
    users={};
    for (var key in data) {
      if (!users[data[key].home]) {
        users[data[key].nick] = data[key]
      }else{
        users[data[key].nick] = data[key]
      }
    exports.users = users
  }});
  
  var uses = 0
  socket.on('message', function(data) {
    data.color = he.decode(data.color)
    data.msg = he.decode(data.msg)
    data.home = he.decode(data.home)
    data.nick = he.decode(data.nick).replace(/discord/g,"").replace(/hugs/g,"")
  
    for (let index = 0; index < onmessagecommands.length; index++) {
      setTimeout(() => {
        onmessagecommands[index](data);
      }, 1);
    }
  
    if (!started) return;
    if (data.msg.startsWith(prefix)) {
      file = data.msg.slice(prefix.length).split(' ')[0]
      if(commands[file]){
        commands[file](data, socket)
      }
    }
    
  })
}

exports.connect = function(name, color, prefix, welcomemsg) {
  connect(name, color, prefix, welcomemsg)
}

exports.updateprefix = function(newprefix){
  prefix = newprefix
}

exports.setcommand = function(command,func){
  commands[command] = func
}

exports.onmessage = function(func) {
  onmessagecommands.push(func)
}

exports.onuserjoined = function(func) {
  onuserjoinedcommands.push(func)
}
exports.onuserleft= function(func) {
  onuserleftcommands.push(func)
}