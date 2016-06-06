/** 各種設定
*
*/
var Config = function(){};

//NCMB
Config.prototype.NCMB_APPLICATION_KEY = "120d6b3c9c260b4463f62f4182268f20dc97c21cb91ec580e0abf5c4ff7619ec";
Config.prototype.NCMB_CLIENT_KEY = "1c6982d4c457b73364a2c23a07fca0f398768c2026c064bff0c56a5f9e9fa2e4";

//Slave1
Config.prototype.SLAVE_I2C_ADDR_1 = 0x08;

//ステータス LED GPIO
Config.prototype.STATUS_LED = 4;

//ステータス LED を OFFするまでの時間
Config.prototype.STATUS_LED_OFF_SEC = 500;

module.exports = new Config();
