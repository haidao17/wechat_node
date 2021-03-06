'use strict'

var sha1 = require('sha1');
var Wechat = require('./wechat.js');
var getRawBody = require('raw-body');
var util = require('./util.js')


module.exports = function (opts,handler) {
  var wechat = new Wechat(opts);

  return function *(next) {
    // console.log(this.query);
    console.log('-----------------g.js------------------');
    var that = this;
    var token = opts.token;
    var signature = this.query.signature;
    var nonce = this.query.nonce;
    var timestamp = this.query.timestamp;
    var echostr = this.query.echostr;
    var str = [token,timestamp,nonce].sort().join('');
    var sha = sha1(str);

    if(this.method === 'GET'){
      if (sha === signature) {
        this.body = echostr + '';

      }else {
        this.body = 'wrong';

      }
    } else if (this.method === 'POST') {
      if (sha !== signature) {
        this.body = 'wrong';
        return false;
      }else {
        var data = yield getRawBody(this.req,{
          length:this.length,
          limit:'1mb',
          encoding:this.charset
        });
        var content = yield util.parseXMLAsync(data);
        var message = util.formatMessage(content.xml);


        // console.log(message);

        this.weixin = message;
        // console.log('g:'+message);
        yield handler.call(this,next);
        // console.log('body:'+this.body);
        wechat.reply.call(this);
      }
    }
  }
}
