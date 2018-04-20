# Automation - Delayed trigger

Example config.json:

```
    "accessories": [
        {
            "accessory": "AutomationDelayedTrigger",
            "name": "Test",
            "delay": 3000
        }  
    ]

```

This accessory will create a fake switch and a fake motion sensors. Turning the switch on will start a timer for X seconds (set by the `delay` config option, in milliseconds). When the timer ends, the sensor will detect a movement. Turning off the switch will stop the timer.

# Example: Trigger a scene if the door is left open
1. Create accessory
2. Link your door sensor to the accessory switch (opening the door will turn the switch on; closing the door will turn the switch off)
3. Link an automation for the sensor (when movement is detected)
4. Open the door, the automation will be executed after X seconds unless the door is closed
