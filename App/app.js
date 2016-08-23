'use strict'

var koa = require('koa');
var sha1 = require('sha1');

var config = {
  appId:'wx6c599e405948d5f2',
  appSecret:'2bd38a9144e7be2aeaddda45dce1e3ba',
  token:'testwechat'
}


var WechatAPI = require('co-wechat-api');
var api = new WechatAPI(config.appId, config.appSecret);
// var result = yield* api.updateRemark('open_id', 'remarked');

var app = new koa();
app.use(function *(next) {
  console.log(this.query);

  var token = config.token;
  var signature = this.query.signature;
  var nonce = this.query.nonce;
  var timestamp = this.query.timestamp;
  var echostr = this.query.echostr;
  var str = [token,timestamp,nonce].sort().join('');
  var sha = sha1(str);

  if (sha === signature) {
    this.body = echostr + '';
  }else {
    this.body = 'wrong';
  }
});

app.listen(80);
console.log('Listening: 80');
