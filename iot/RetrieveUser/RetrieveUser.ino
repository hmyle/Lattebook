#include <SPI.h>
#include <MFRC522.h>
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <ArduinoJson.h>
#include <ESPping.h>
#include <Wire.h>

#define RST_PIN D9 
#define SS_PIN D10 

MFRC522 mfrc522(SS_PIN, RST_PIN);  // Create MFRC522 instance

const char* ssid = "P2201";
const char* password = "29191948";
const char* serverUrl = "http://192.168.1.8:3001/api/uid";

void setup() {
  Serial.begin(9600);  // Initialize serial communications with the PC
  
  while (!Serial){
    yield();  // Yield to handle background tasks while waiting for serial connection
  };     // Do nothing if no serial port is opened

  SPI.begin();         // Init SPI bus
  mfrc522.PCD_Init();  // Init MFRC522
  delay(4);            // Optional delay
  mfrc522.PCD_DumpVersionToSerial();  // Show details of PCD - MFRC522 Card Reader details
  Serial.println(F("Scan PICC to see UID, SAK, type, and data blocks..."));

  // Connect to Wi-Fi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi");
}

void loop() {
  // Reset the loop if no new card present on the sensor/reader.
  if (!mfrc522.PICC_IsNewCardPresent()) {
    return;
  }

  // Select one of the cards
  if (!mfrc522.PICC_ReadCardSerial()) {
    return;
  }

  // Read UID from the card
  String uidString = "";
  for (byte i = 0; i < mfrc522.uid.size; i++) {
    uidString += String(mfrc522.uid.uidByte[i] < 0x10 ? " 0" : " ") + String(mfrc522.uid.uidByte[i], HEX);
  }
  Serial.println("UID Value: " + uidString);

  // Send UID data to MongoDB && retrieve data
  if (WiFi.status() == WL_CONNECTED) {
    WiFiClient client;
    HTTPClient http;
    http.begin(client, serverUrl);
    http.addHeader("Content-Type", "application/json");

    StaticJsonDocument<200> doc;
    doc["uid"] = uidString;
    String jsonString;
    serializeJson(doc, jsonString);

    int httpResponseCode = http.POST(jsonString);
    if (httpResponseCode > 0) {
      String response = http.getString();
      Serial.println("UID data sent to MongoDB.");
    } else {
      Serial.println("Error sending UID data to MongoDB. HTTP error code: " + String(httpResponseCode));
    }

    if (httpResponseCode == HTTP_CODE_OK) {
      String response = http.getString();
      StaticJsonDocument<256> doc;
      DeserializationError error = deserializeJson(doc, response);

      if (error) {
        Serial.println("Failed to parse JSON response");
        http.end();
        return;
      }

      bool isAdmin = doc["isAdmin"];
      String fullName = doc["fullName"].as<String>();

      if (isAdmin) {
        Serial.write("1");  // Send the command to rotate the stepper motor
        delay(5000);  // Delay to allow the rotation to complete before sending the next command
      } else {
        Serial.println("Access denied for user: " + fullName);
      }

    } else {
      Serial.println("Error retrieving user information. HTTP error code: " + String(httpResponseCode));
    }

    http.end();
  }

  // Halt PICC
  mfrc522.PICC_HaltA();

  delay(1000);
}