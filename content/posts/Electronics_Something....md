---
title: "Electronics Something..."
date: 2024-12-18T00:16:54+05:30
draft: false
---
This is a project i made more than a month ago as a first semester student and as a complete beginner. It not only introduced me to new concepts but also to a completely new and foreign field. Most students prefer to display projects like this or similar project certificates on their LinkedIn profiles, filling their profiles with useless certificates and other shits, making a complete mockery of whatever professionalism is left on their profile (seriously man, who the hell posts a "scamper project" they did on a product in a "professional skills development" class, a subject which has 0 credits in college). So instead i put it up in a blog post, and as i also wanted to showcase the new CSS styles Im using for the body part of the blog. I don't expect anyone to read it or follow it given the negligible amount of traffic i get in a months, so yeah. I mean honestly i have thinking about moving this site to nekoweb or neocities to really put it out there, but the awkward loading times of the given alternatives counter the amazing TTFB of cloudflare pages, well i see what i can do, whatever... 
Consider this as a not-so-polished guide of how to make a DIY low power motion activated camera integrating an ESP32-CAM module and a PIR motion sensor (HC-SR501) employing a Telegram bot for remote control and notifications.

### _Setup:_
- **Clone the git repo** : First of all, make sure git is installed and set to path and then clone the git repo
  ```
  git clone https://github.com/M3rcuryLake/TeleCam.git
  cd TeleCam
  ```

- **Setting Up Network Credentials** : Insert your network credentials in the following variables 
  ```
  const char* ssid = "*******"; 
  const char* password = "*********";
  ```

- **Setting Up Telegram :** Create a new bot in telegram with [BotFather](t.me/botfather) with `/newbot` and follow the instructions to create your bot. Give it a name and username. If your bot is successfully created, you’ll receive a message with a link to access the bot and the bot token. Save the bot token because you’ll need it so that the ESP32 can interact with the bot.
In your Telegram account, search for “IDBot” or open this link t.me/myidbot in your smartphone.
Start a conversation with that bot and type `/getid`. You will get a reply back with your user ID, save that for later.
now change the Bottoken and ChatID variables with your own Telegram bot token and ChatID

    ```
    String BOTtoken = "********:***************************";
    String CHAT_ID = "*********";
    ```


- **Pinout and Interfacing:** Now follow the given pinout table to properly interface the ESP32-CAM with HC-SR501 using a FT232RL FTDI to TTL Serial Converter Module (remember that one jumper will be present in the FT232RL, blocking the 3.3V PIN and another at the PIR HC-SR501 at the 'H' position enabling multiple trigger mode, blocking the 'L' connection)

    |ESP-32 CAM |FT232RL    |
    |--------   |-------    |
    |5V         |5V         |
    |RX         |UOT        |
    |TX         |UOR        |
    |GND        |GND        |
    
    |ESP-32 CAM |PIR (HC-SR501) |
    |-------    |-------        |
    |3.3V       |VCC            |
    |GPIO13     |OUT            |
    |GND        |GND            |
    
    |ESP-32 CAM |ESP-32 CAM |
    |-------    |-------        |
    |GND       |GPIO0           |
    

- **Installing Requirements** : To interact with the Telegram bot, we’ll use the Universal Telegram Bot Library created by Brian Lough which provides an easy interface for the Telegram Bot API. The ArduinoJSON library will be installed automatically with the Universal Telegram Bot Library, if not, you will also have to install the ArduinoJson library. You can install both of them through library through the Arduino Library Manager.

    
- **Final Steps :** Flash the code with Arudino IDE, then remove the `GND GPIO0` Jumper Wire. Tune in to the 115200 baud band and press the `RST` button on the ESP32-CAM. After 20 seconds of warming up the surveillance setup should be up and running.
To communicate with the ESP32-CAM, send a `/init` to the Telegram Bot we made earlier. It must output the following :
   ```
   /init: Displays a help menu to guide users.  
   /start: Activates the camera server, enabling motion detection and image capture when movement is detected.  
   /stop: Halts the camera server to conserve resources.  
   ```

**Hardware Configuration**:  
- **PIR Sensor**: Configured with minimal sensitivity and delay in multiple trigger mode (H mode). Its output is connected to GPIO13 with a 45kΩ internal pulldown resistor with `pinMode(pin, mode);` where mode is `INPUT_PULLDOWN`  ([more info here](https://docs.espressif.com/projects/arduino-esp32/en/latest/api/gpio.html#pinmode)) to ensure stable low signals in idle states.  
- **Status Indicators**:  
  - GPIO33 controls a red LED to indicate active operation.  
  - GPIO4 flashes the built-in flashlight, mimicking a camera torch, during image capture.  

**Software Dependencies**:  
The system leverages critical libraries such as `"wifi.h"` for connectivity and `"esp_camera.h"` for camera operations.  


My bad if the guide is not accurate and thank you for checking out.
