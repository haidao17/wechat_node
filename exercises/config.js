'use strict'



var path = require('path');
var util = require('./libs/util.js')
var token_file = path.join(__dirname,'./config/token.txt');

var config = {
  wechat: {
    appId:'wx6c599e405948d5f2',
    appSecret:'2bd38a9144e7be2aeaddda45dce1e3ba',
    token:'testwechat',
    getAccessToken:function () {
      return util.readFileAsync(token_file);
    },
    saveAccessToken:function (data) {
      data = JSON.stringify(data);
      return util.writeFileAsync(token_file,data);
    }
  }
}

module.exports = config;
