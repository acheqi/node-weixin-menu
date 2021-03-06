#!/usr/bin/env node
'use strict';
var meow = require('meow');
var nodeWeixinMenu = require('./');
var config = require('node-weixin-config');
var path = require("path");
var fs = require("fs");

var auth = require('node-weixin-auth').create();

var cli = meow({
  help: [
    'Usage',
    '  wxmenu create --id appid --secret appsecret --token apptoken --menu filename.json',
    '  wxmenu (get || remove || customize) --id appid --secret appsecret --token apptoken',
    '',
    'Example',
    '  wxmenu create --id "wx111" --secret "wxSecret" --token "wxtoken" --menu filename.json',
    '  wxmenu get --id "wx111" --secret "wxSecret" --token "wxtoken"'
  ].join('\n')
});

config.app.init(cli.flags);
var app = cli.flags;


var command = cli.input[0];

switch (command) {
  case 'create':
    var menu = cli.flags.menu;
    var filename = null;
    if (path.isAbsolute(menu)) {
      filename = path.normalize(menu);
    } else {
      filename = path.resolve(__dirname, menu);
    }
    console.log(filename);
    if (!fs.existsSync(filename)) {
      console.error("File: " + menu + " not exists");
      return;
    }
    var json = JSON.parse(String(fs.readFileSync(menu)));
    nodeWeixinMenu.create(app, auth, json, function(error, data) {
      if (error) {
        console.log("Error occur: " + data);
      } else {
        console.info("Successfully created a menu!");
      }
    });
    break;
  case 'get':
  case 'remove':
  case 'customize':
    nodeWeixinMenu[command](app, auth, function(error, json) {
      if (error) {
        console.log("Error occur: " + json);
      } else {
        console.info("Action " + command + " succeeded.");
        console.info(JSON.stringify(json));
      }
    });
    break;

}
