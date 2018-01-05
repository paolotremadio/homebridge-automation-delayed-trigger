var Service, Characteristic;

module.exports = function(homebridge) {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;

  homebridge.registerAccessory("homebridge-automation-delayed-trigger", "AutomationDelayedTrigger", AutomationDelayedTrigger);
}

function AutomationDelayedTrigger(log, config) {
  this.log = log;
  this.name = config["name"];
  this.delay = config["delay"] || 1;

  this.isSwitchOn = false;
  this.timerTimeout = null;
  this.isTimerEllapsed = false;

  this.serviceSwitch = new Service.Switch(this.name);

  this.serviceSwitch
    .getCharacteristic(Characteristic.On)
    .on('get', this.getOn.bind(this))
    .on('set', this.setOn.bind(this));

  this.serviceMotion = new Service.MotionSensor(this.name + ' Trigger');

  this.serviceMotion
    .getCharacteristic(Characteristic.MotionDetected)
    .on('get', this.getAlarm.bind(this));
}

AutomationDelayedTrigger.prototype.getOn = function(callback) {
  callback(null, this.isSwitchOn);
}

AutomationDelayedTrigger.prototype.setOn = function(on, callback) {
  if (!on) {
    this.log('Switched turned off. Stopping the timer.');

    // Clear the timer
    clearTimeout(this.timerTimeout);

    // Turn off the switch
    this.isSwitchOn = false;

    // Turn off sensor alarm
    this.isTimerEllapsed = false;
    this.serviceMotion.setCharacteristic(Characteristic.MotionDetected, false);
  } else {
    this.log('Switched turning on, starting the timer.');

    //Turn on the switch
    this.isSwitchOn = true;

    // Start the timer
    this.timerTimeout = setTimeout(function() {
      this.log('Timer ran out. Triggering the sensor movement.');

      this.isTimerEllapsed = true;
      this.serviceMotion.setCharacteristic(Characteristic.MotionDetected, true);
    }.bind(this), this.delay);
  }

  callback();
}

AutomationDelayedTrigger.prototype.getAlarm = function(callback) {
  callback(null, this.isTimerEllapsed);
}

AutomationDelayedTrigger.prototype.getServices = function() {
  return [this.serviceSwitch, this.serviceMotion];
}