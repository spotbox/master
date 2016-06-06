
/** DogCage メイン
*
*/
var App = function(){};
App.prototype.config = require('./config.js');
App.prototype.wpi = require('wiring-pi');
App.prototype.mfrc522 = require("MFRC522-node");
App.prototype.NCMB = require("ncmb");
App.prototype.Slave = require('./slave.js');

App.prototype.ncmb = null;
App.prototype.slaveList = [{uid:'146,54,42,59',device:new App.prototype.Slave()}];

//初期化
App.prototype.init = function(){
    var _this = this;

    //NCMBとの接続
    this.ncmb = new App.prototype.NCMB(this.config.NCMB_APPLICATION_KEY,this.config.NCMB_CLIENT_KEY);

    //GPIO初期化
    this.wpi.wiringPiSetupGpio();

    //ステータス用の LED 設定
    this.wpi.pinMode(this.config.STATUS_LED,this.wpi.OUTPUT);
    this.setStatusLed(false);

    //I2C デバイス
    var slave1 = this.slaveList[0].device;
    slave1.init(this.wpi,this.config.SLAVE_I2C_ADDR_1);

    //RFIDの UID取得
    var mfrc522Callback = function(){
      //開始
      this.onStart = function(){
        console.log('onStart');
      };

      //UIDを取得時
      this.onUid = function(uid){
        console.log('onUid '+uid);
        var slave1 = _this.slaveList[0];
        if(uid == slave1.uid){
          //TODO: サーバーの 利用登録済み uid を確認して 一致していた場合 解錠 する
          //解錠
          slave1.device.lockingOperation(true);
          //TODO: リードスイッチが ON されたら自動で施錠する
          //TODO: リードスイッチがないので仮実装 3秒後に自動で施錠
          setTimeout(function(){
            //施錠
            slave1.device.lockingOperation(false);
          },3*1000);
        }

        //ステータス LEDを ON する
        _this.setStatusLed(true);
      };

      //終了
      this.onExit = function(){
        console.log('onExit');
      };
    };
    this.mfrc522.start( new mfrc522Callback() );
};

/** ステータスLEDを操作
*/
App.prototype.setStatusLed = function(isOn){
  if(isOn == true){
    //ON
    this.wpi.digitalWrite(this.config.STATUS_LED,this.wpi.HIGH);
    //一定時間経過後に LEDをOFF
    var _this = this;
    setTimeout(function(){
      _this.wpi.digitalWrite(_this.config.STATUS_LED,_this.wpi.LOW);
    },this.config.STATUS_LED_OFF_SEC);
  }
  else{
    //OFF
    this.wpi.digitalWrite(this.config.STATUS_LED,this.wpi.LOW);
  }
};

var app = new App();
app.init();
