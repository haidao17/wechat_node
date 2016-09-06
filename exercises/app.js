'use strict'

var Koa = require('koa');
var g = require('./wechat/g.js');
var config = require('./config.js');
var weixin = require('./weixin.js');
var app = new Koa();

app.use(g(config.wechat,weixin.reply));

app.listen(80);
console.log('Listening: 80');
