/** ケージ側デバイス(I2Cスレイブデバイス)との接続や操作モジュール
*
*/
var Slave = function(){};

Slave.prototype.wpi = null;
Slave.prototype.i2cAddr = null;
Slave.prototype.fd = null;
Slave.prototype.lockStatus = false;

/** 初期化
*  wpi
*  i2cAddr
*/
Slave.prototype.init = function(wpi,i2cAddr){
  this.wpi = wpi;
  this.i2cAddr = i2cAddr;

  this.fd = this.wpi.wiringPiI2CSetup(i2cAddr);
};

/** 施錠操作
*  isLock
*/
Slave.prototype.lockingOperation = function(isLock){
  if(isLock == true){
    //施錠
    this.wpi.wiringPiI2CWrite(this.fd,0x01);
  }
  else{
    //解錠
    this.wpi.wiringPiI2CWrite(this.fd,0x00);
  }
  this.lockStatus = isLock;
};

module.exports = Slave;
