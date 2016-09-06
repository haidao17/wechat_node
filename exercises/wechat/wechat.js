'use strict'

var Promise = require('bluebird');
var request = Promise.promisify(require('request'));
var util = require('./util.js');
var fs = require('fs');
var prefix = 'https://api.weixin.qq.com/cgi-bin/';
var api ={
  accessToken:prefix+'token?grant_type=client_credential',
  upload: prefix+ 'media/upload?'
}

function Wechat(opts) {
  console.log('-----------------wechat.js------------------');
  var that = this;
  this.appId = opts.appId;
  this.appSecret = opts.appSecret;
  this.getAccessToken = opts.getAccessToken;
  this.saveAccessToken = opts.saveAccessToken;
  this.fetchAccessToken();
}

Wechat.prototype.fetchAccessToken = function(data){
  var that = this;

  if (this.access_token && this.expires_in) {
    if (this.isValidAccessToken(this)) {
      return Promise.resolve(this);
    }
  }
  this.getAccessToken()
    .then(function (data) {
      try{
        data = JSON.parse(data);
      }
      catch(e){
        return that.updataAccessToken();
      }
      if(that.isValidAccessToken(data)){
        return Promise.resolve(data)//notice!!!
      }else {
        return that.updataAccessToken();
      }
    }).then(function (data) {
      that.access_token = data.access_token;
      that.expires_in = data.expires_in;
      // console.log(data);
      that.saveAccessToken(data);

      return Promise.resolve(data);
    });
} 

Wechat.prototype.isValidAccessToken = function (data) {
  if(!data || !data.access_token || !data.expires_in){
    return false;
  }
  var access_token = data.access_token;
  var expires_in = data.expires_in;
  var now =(new Date().getTime());

  if(now < expires_in){
    return true;
  }else {
    return false;
  }
}

Wechat.prototype.updataAccessToken = function () {
  var appId = this.appId;
  var appSecret = this.appSecret;
  var url = api.accessToken+ '&appid=' + appId + '&secret='+appSecret;

  return new Promise(function (resolve,reject) {
    request({url:url,json:true})
      .then(function (response) {
        var data = response.body;
        var now = (new Date().getTime());
        var expires_in = now + (data.expires_in - 20)* 1000
        data.expires_in = expires_in;
        resolve(data);
      })
  })
}

Wechat.prototype.reply = function(){
  var content = this.body;
  var message = this.weixin;
  // console.log('reply-message:'+message);
  var xml = util.tpl(content,message)
  // console.log('--------------------------------');
  // console.log(xml);
  this.status = 200;
  this.type = 'application/xml';
  this.body = xml;
}

Wechat.prototype.uploadMaterial = function (type,filePath) {
  var that = this;
  var appId = this.appId;
  var appSecret = this.appSecret;
  var form = {
    media: fs.createReadStream(filePath)
  }
  new Promise(function (resolve, reject) {
      that.fetchAccessToken()
        .then(function (data) {
          var url = api.upload + 'access_token=' + data.access_token 
                    + '&type=' + type
          request({method: 'POST', url: url,formData: from, json: true})
            .then(function (response) {
              console.log(response);
              var _data = response[1];
              if (_data) {
                resolve(_data);
              } else {
                throw new Error('Upload Material Fails');
              }
            })
            .catch(function (err) {
              reject(err);
            })
        })
  });

};

module.exports = Wechat;
