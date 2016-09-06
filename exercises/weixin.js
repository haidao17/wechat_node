'use strict'

var config = require('./config');
var Wechat = require('./wechat/wechat');

var wechatApi = new Wechat(config.wechat)


function *reply(next) {

  this.body = 'helloWorld!!!!';

  var message = this.weixin;

  console.log('msg:' + message.MsgType);

  if(message.MsgType === 'event'){
    if(message.Event === 'subscribe'){
      this.body = '你好，请随便输入些什么';
      console.log('sub');
    }else if (message.Event === 'unsubscirbe') {
      this.body = 'unsub';
      console.log('unsub');
    }else if (message.Event === 'LOCATION') {
      this.body = '您上报的地理位置是：'+ message.Latitude + '/' +
        message.longitude + '-' + message.Precision;
      console.log(this.body);
    }else if (message.Event === 'CLICK') {
      this.body = '您点击了菜单： '+ message.EventKey;
      console.log(this.body);
    }else if (message.Event === 'SCAN') {
      this.body = '您扫描了二维码';
      console.log(this.body);
    }else if (message.Event === 'VIEW') {
      this.body = '您点击了菜单中的链接：' + message.EventKey;
      console.log(this.body);
    }
  } else if(message.MsgType === 'text'){
      if (message.Content === '1'){
        this.body = 'love ya!!!!'
      } else if (message.Content === '2') {
        this.body = 'hate ya!!!!'
      } else if (message.Content === '3') {
        var reply = [{
          title:'嘿',
          description:'你好',
          picUrl:'http://att.bbs.duowan.com/forum/201311/04/155748rwgnmsmrzv36nnug.jpg',
          url:'www.soso.com'
        },{
          title:'嘿',
          description:'你好',
          picUrl:'http://att.bbs.duowan.com/forum/201311/04/160953iuidpib35bn541bm.jpg',
          url:'www.bing.com'
        }
      ];
        this.body = reply;
      } else if (message.Content === '4'){
        var data = yield wechatApi.uploadMaterial('image',__dirname + '/xiaomai.jpg')
      } else {
        this.body = '你说的是：' + message.Content;
        var reply = {
          type: 'image',
          mediaId: data.mediaId
        }
      }
  }
  yield next;
}

module.exports = {
  reply:reply
}
