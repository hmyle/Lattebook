// Include necessary libraries
#include <Wire.h>
#include <ArduinoJson.h>
#include <ESP8266WiFi.h>
#include <Bonezegei_DHT22.h>
#include <ESP8266HTTPClient.h>

// Define wifi connection
const char* ssid = "Samsung";
const char* password = "12345678";
const char* serverUrl = "http://172.20.10.10:3000/api/temperature";

//param = DHT22 signal pin
Bonezegei_DHT22 dht(D7);

unsigned long previousMillis = 0;
const long interval = 600000; // 10 minutes in milliseconds

void setup() {
  Serial.begin(9600);
  dht.begin();
  
  // Connect to Wi-Fi
  WiFi.begin(ssid, password); 
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi");
}

void loop() {
  unsigned long currentMillis = millis();
  
  if (currentMillis - previousMillis >= interval) {
    previousMillis = currentMillis;
    
    if (dht.getData()) {
      // get All data from DHT22
      float tempDeg = dht.getTemperature(); // return temperature in celsius
      float tempFar = dht.getTemperature(true); // return temperature in fahrenheit if true celsius of false
      int hum = dht.getHumidity(); // return humidity
      Serial.printf("Temperature: %0.1lf°C Humidity:%d \n", tempDeg * 4, hum);
      
      // Send temperature and humidity data to MongoDB
      if (WiFi.status() == WL_CONNECTED) {
        WiFiClient client;
        HTTPClient http;
        http.begin(client, serverUrl);
        http.addHeader("Content-Type", "application/json");
        
        StaticJsonDocument<200> doc;
        doc["temperature"] = tempDeg * 4;
        doc["humidity"] = hum;
        
        String jsonString;
        serializeJson(doc, jsonString);
        
        int httpResponseCode = http.POST(jsonString);
        if (httpResponseCode > 0) {
          String response = http.getString();
          Serial.println("Temperature and humidity data sent to MongoDB.");
        } else {
          Serial.println("Error sending temperature and humidity data to MongoDB. HTTP error code: " + String(httpResponseCode));
        }
        
        http.end();
      }
    }
  }
}