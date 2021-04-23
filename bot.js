"use strict";
import io from "socket.io-client";
import he from "he";
import trollboxHeaders from "trollbox-headers";
const headers = trollboxHeaders.headers();

/**
 * @typedef {string} Home
 * @typedef {{nick: string; color: string; style: string; home: Home; room: string; isBot: boolean}} User
 * @typedef {{date: number, nick: string, color: string, style: string, home: Home, msg: string}} Message
 */
/**
 * @template DataType
 * @typedef {(data: DataType) => void} Callback<DataType>
 */

export class Bot {
  /**
   * @param {string} name Nickname of the bot
   * @param {string} color User color of the bot
   * @param {string} prefix Prefix of the bot
   * @param {string | undefined} initMessage Message to send when the bot comes online
   */
  constructor(name, color, prefix = "", initMessage) {
    this.socket = undefined;
    this.started = false;
    this.name = name;
    this.color = color;
    this.prefix = prefix;
    this.initMessage = initMessage;

    /** @type {Record<Home, User>} */
    this.users = Object.create(null);
    /** @type {Record<string, Callback<unknown>>} */
    this.commands = Object.create(null);
    /** @type {Callback<Message>[]} */
    this.messageCallbacks = [];
    /** @type {Callback<User>[]} */
    this.userLeftCallbacks = [];
    /** @type {Callback<User>[]} */
    this.userJoinedCallbacks = [];
    /** @type {Callback<unknown>[]} */
    this.onConnectCallbacks = [];
  }

  connect(address = "http://www.windows93.net:8081") {
    this.socket = io(address, {
      timeout: 1000,
      reconnectionAttempts: 2,
      ...headers,
    });
    this.socket.on("_connected", () => {
      this.socket.emit("user joined", this.name, this.color, "red", "red");
      if (this.initMessage) {
        this.socket.send(this.initMessage);
      }
      this.started = true;
      this._onConnect();
    });

    this.socket.on("disconnect", (data) => {
      this.onDisconnect(data);
    });

    this.socket.on("user joined", (data) => this._onUserJoined(data));
    this.socket.on("user left", (data) => this._onUserLeft(data));
    this.socket.on("user change nick", (data) => this._onUserChangeNick(data));
    this.socket.on("update users", (data) => this._updateUsers(data));
    this.socket.on("message", (data) => this._onMessage(data));
  }

  _onConnect() {
    return this.onConnectCallbacks
      .map((callback) => {
        if (typeof callback !== "function") return null;
        /** @type {Promise<void>} */
        const command = new Promise((resolve, reject) => {
          try {
            callback();
            resolve();
          } catch (err) {
            reject(err);
          }
        });
        return command;
      })
      .filter((val) => val !== null);
  }

  /**
   * @param {Callback<never>} callback - Function to get called on connect
   */
  onConnect(callback) {
    if (typeof callback !== "function")
      throw new Error("Callback for onUserJoined has to be a function");
    this.onConnectCallbacks.push(callback);
  }

  /**
   * @param {string} reason
   * @param {string} address
   */
  onDisconnect(reason) {
    console.debug("Disconnected: " + reason);
    this.started = false;
  }

  /**
   * @param {User} data - User who just joined
   */
  _onUserJoined(data) {
    return this.userJoinedCallbacks
      .map((callback) => {
        if (typeof callback !== "function") return null;
        /** @type {Promise<void>} */
        const command = new Promise((resolve, reject) => {
          try {
            callback(data);
            resolve();
          } catch (err) {
            reject(err);
          }
        });
        return command;
      })
      .filter((val) => val !== null);
  }

  /**
   * @param {Callback<User>} callback
   */
  onUserJoined(callback) {
    if (typeof callback !== "function")
      throw new Error("Callback for onUserJoined has to be a function");
    this.userJoinedCallbacks.push(callback);
  }

  _onUserLeft(data) {
    return this.userLeftCallbacks
      .map((callback) => {
        if (typeof callback !== "function") return null;
        /** @type {Promise<void>} */
        const command = new Promise((resolve, reject) => {
          try {
            callback(data);
            resolve();
          } catch (err) {
            reject(err);
          }
        });
        return command;
      })
      .filter((val) => val !== null);
  }

  /**
   * @param {Callback<User>} callback
   */
  onUserLeft(callback) {
    if (typeof callback !== "function")
      throw new Error("Callback for UserLeft has to be a function");
    this.userLeftCallbacks.push(callback);
  }

  /**
   *
   * @param {Message} data
   */
  _onMessage(data) {
    try {
      if (!data) return [];
      data.color = he.decode(data.color);
      data.msg = he.decode(data.msg);
      data.home = he.decode(data.home);
      data.nick = he.decode(data.nick);

      if (!this.started) {
        console.warn("Bot _onMessage called, but not started");
        return [];
      }

      if (data.msg.startsWith(this.prefix)) {
        const commandName = data.msg.slice(this.prefix.length).split(" ")[0];
        if (typeof this.commands[commandName] === "function") {
          this.commands[commandName](data);
        }
      }

      return this.messageCallbacks
        .map((callback) => {
          if (typeof callback !== "function") return null;
          /** @type {Promise<void>} */
          const command = new Promise((resolve, reject) => {
            try {
              callback(data);
              resolve();
            } catch (err) {
              reject(err);
            }
          });
          return command;
        })
        .filter((val) => val !== null);
    } catch (err) {
      console.error(err);
    }
  }

  /**
   *
   * @param {string} name
   * @param {Callback<Message>} callback
   */
  setCommand(name, callback) {
    if (typeof callback !== "function")
      throw new Error("Callback for setCommand has to be a function");
    if (typeof name !== "string")
      throw new Error("Name for setCommand has to be a string");
    this.commands[name] = callback;
  }

  /**
   * @param {Callback<Message>} callback
   */
  onMessage(callback) {
    if (typeof callback !== "function")
      throw new Error("Callback for Message has to be a function");
    this.messageCallbacks.push(callback);
  }

  /**
   *
   * @param {Record<string, User>} data
   */
  _updateUsers(data) {
    for (const key in data) {
      const user = data[key];
      if (user.home !== undefined) {
        this.users[user.home] = user;
      }
    }
  }

  /**
   *
   * @param {[{nick: string; color: string; style: string;}, User]} data
   */
  _onUserChangeNick([changes, user]) {
    if (user.home in this.users) {
      Object.assign(this.users[user.home], changes);
    }
  }

  updateColor(color) {
    console.debug("Updating color");
    this.socket.emit("user joined", this.name, (this.color = color), "", "");
  }

  /**
   * @param {string} nickname
   */
  updateName(nickname) {
    console.debug("Updating name");
    this.socket.emit("user joined", (this.name = nickname), this.color, "", "");
  }

  /**
   * @param {string} message
   */
  sendMessage(message) {
    this.socket.emit("message", message);
  }

  /**
   * @param {string} roomName
   */
  changeRoom(roomName = "atrium") {
    this.sendMessage("/r " + roomName);
  }
}
