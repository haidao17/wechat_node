'use strict'

var koa = require('koa');
var wmain = require('./wechat/wmain.js')
var co_wechat = require('co-wechat');
var WechatAPI = require('co-wechat-api');
var Router = require('koa-router');


var app = new koa();

var config = {
  appId:'wx6c599e405948d5f2',
  appSecret:'2bd38a9144e7be2aeaddda45dce1e3ba',
  token:'testwechat'
};

var gRouter = new Router();


app.use(function *(next) {
  var api = new WechatAPI(config.appId, config.appSecret);
  var menu = {
     "button":[
       {
         "type":"view",
         "name":"好妹妹",
         "url":"http://music.163.com/#/song?id=26427663"
       },
       {
         "name":"菜单",
         "sub_button":[
           {
             "type":"view",
             "name":"soso",
             "url":"http://www.soso.com/"
           },
           {
             "type":"view",
             "name":"baidu",
             "url":"http://www.baidu.com"
           }
         ]
      }]
  };
  var result = yield api.createMenu(menu);
  yield next;
});

app.use(co_wechat(config.token).middleware(function *(){
  // console.log(this);
  var message = this.weixin;
  console.log(message);
  if( message.MsgType ==='text'){
    this.body = {
      type:"text",
      content:"hello world"
    }
  }
}));

gRouter.get('/:gname',function *(){
  this.body = this.params;
})

app
  .use(gRouter.routes())
  .use(gRouter.allowedMethods())

app.listen(80);

console.log('Listening: 80');
