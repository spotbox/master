//db.js
DB = function(){};
DB.prototype.NCMB = require("ncmb");

DB.prototype.ncmb = null;
DB.prototype.config = null;

/** 初期化
*
*/
DB.prototype.init = function(config){
  this.config = config;
  this.ncmb = new App.prototype.NCMB(this.config.NCMB_APPLICATION_KEY,this.config.NCMB_CLIENT_KEY);

  //deviceRegist
  this.deviceRegist();
};

//デバイス登録
DB.prototype.deviceRegist = function(){
  var Device = this.ncmb.DataStore("Device");
  var device = new Device();
  device.set("deviceId", this.config.DEVICE_ID);
  //device.set("id", this.config.DEVICE_ID);
  device.save()
         .then(function(device){
           // 保存後の処理
           console.log(device);
         })
         .catch(function(err){
           // エラー処理
           console.log(err);
         });
};
