'use strict'

var xml2js = require('xml2js');
var Promise = require('bluebird');
var tpl = require('./tpl.js');


 function parseXMLAsync (xml) {
  return new Promise(function(resolve, reject) {
    xml2js.parseString(xml,{trim:true},function (err,content) {
      if (err) {
        reject(err);
      }
        resolve(content);
    })
  });
};

function formatMessage(result) {
  var message = {};

  if(typeof result === 'object'){
    var keys = Object.keys(result);
    for (var i = 0; i < keys.length; i++) {
      var item = result[keys[i]];
      var key = keys[i];

      if(!(item instanceof Array)||item.length === 0){
        continue;
      }

      if(item.length === 1){
        var val = item[0];

        if (typeof val === 'object') {
          massage[key] = formatMessage(val);
        }else {
          message[key] = (val || '').trim();
        }
      }
      else {
        massage[key]=[]
        for (var j = 0,k = item.length; j < k; j++) {
          message[key].push(formatMessage(item[j]));
        }
      }
    }
  }
  return message;
}

function temple(content,message) {
  console.log('------------------temple-----------------');
  console.log(content.type);
  var info = {};
  var type = 'text';
  // console.log('message:'+message.fromUserName);
  var fromUsername = message.FromUserName;
  var toUsername = message.ToUserName;

  if(Array.isArray(content)){
    type = 'news'
  }

  type = content.type || type;
  info.content = content;
  info.createTime = new Date().getTime();
  info.msgType = type;
  info.toUsername = fromUsername;
  info.fromUsername = toUsername;

  console.log('info:'+info.toUsername);

  return tpl.compiled(info);
}


 module.exports = {
   formatMessage:formatMessage,
   parseXMLAsync:parseXMLAsync,
   tpl:temple
}
