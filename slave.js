/** ケージ側デバイス(I2Cスレイブデバイス)との接続や操作モジュール
*
*/
var Slave = function(){};

Slave.prototype.wpi = null;
Slave.prototype.i2cAddr = null;
Slave.prototype.fd = null;
Slave.prototype.lockStatus = false;
Slave.prototype.onSensorCallback = null;

/** 初期化
*  wpi
*  i2cAddr
*/
Slave.prototype.init = function(wpi,i2cAddr){
  this.wpi = wpi;
  this.i2cAddr = i2cAddr;

  this.fd = this.wpi.wiringPiI2CSetup(i2cAddr);

  //センサー値の読み込み
  setInterval(this.fireTimer.bind(this),1000);
};

/** 施錠操作
*  isLock
*/
Slave.prototype.lockingOperation = function(isLock){
  if(isLock == true){
    //施錠
    //this.wpi.wiringPiI2CWrite(this.fd,0x01);
    this.wpi.wiringPiI2CWriteReg8(this.fd,0x00,0x01);
  }
  else{
    //解錠
    //this.wpi.wiringPiI2CWrite(this.fd,0x00);
    this.wpi.wiringPiI2CWriteReg8(this.fd,0x00,0x00);
  }
  this.lockStatus = isLock;
};

//センサー値のコールバック通知
Slave.prototype.setOnSensor = function(callback){
  this.onSensorCallback = callback;
};

//センサー監視タイマー
Slave.prototype.fireTimer = function(){
  if((this.onSensorCallback == null) || (typeof this.onSensorCallback == "undefined")){
    return;
  }
  console.log("fireTimer");

  //センサー値を読み込む 16bit = 2byte
  var solenoid = this.wpi.wiringPiI2CReadReg16(this.fd,0x01);
  var reedSwitch = this.wpi.wiringPiI2CReadReg16(this.fd,0x02);
  var vibration = this.wpi.wiringPiI2CReadReg16(this.fd,0x03);
  var mic = this.wpi.wiringPiI2CReadReg16(this.fd,0x04);
  var humidity = this.wpi.wiringPiI2CReadReg16(this.fd,0x05);
  var temperature = this.wpi.wiringPiI2CReadReg16(this.fd,0x06);
  //console.log(Buffer(solenoid).toString("hex"));
  //console.log(Buffer(reedSwitch).toString("hex"));
  //console.log(Buffer(vibration).toString("hex"));
  //console.log(Buffer(mic).toString("hex"));
  //console.log(Buffer(humidity).toString("hex"));
  //console.log(Buffer(temperature).toString("hex"));
  var data = {
    "solenoid":solenoid,
    "reedSwitch":reedSwitch,
    "vibration":vibration,
    "mic":mic,
    "humidity":humidity,
    "temperature":temperature
  };
  this.onSensorCallback.onRead(data);
};

module.exports = Slave;
