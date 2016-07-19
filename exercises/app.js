'use strict'

var Koa = require('koa');
var sha1 = require('sha1');
var wechat = require('./wechat/g.js')

var config = {
  wechat: {
    appId:'wx6c599e405948d5f2',
    appsecret:'2bd38a9144e7be2aeaddda45dce1e3ba',
    token:'testwechat'
  }
}

var app = new Koa();

app.use(wechat(config.wechat));

app.listen(80);
console.log('Listening: 80');
