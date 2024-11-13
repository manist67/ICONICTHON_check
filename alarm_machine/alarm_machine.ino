#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>
#include <ArduinoJson.h>
#define RELAY 12

#define SSID "hshs"
#define PASSWORD "cafenaver"
#define API_PATH "http://1.168.0.27:3000/test.json"

ESP8266WiFiMulti WiFiMulti;

void setup() {
  Serial.begin(115200);
  // Serial.setDebugOutput(true);

  for (uint8_t t = 4; t > 0; t--) {
    Serial.printf("[SETUP] WAIT %d...\n", t);
    Serial.flush();
    delay(1000);
  }

  WiFi.mode(WIFI_STA);
  WiFiMulti.addAP(SSID, PASSWORD);

  pinMode(RELAY, OUTPUT);
}

void loop() {
  if ((WiFiMulti.run() == WL_CONNECTED)) {

    WiFiClient client;

    HTTPClient http;

    Serial.print("[HTTP] begin...\n");
    if (http.begin(client, API_PATH)) {  // HTTP


      Serial.print("[HTTP] GET...\n");
      // start connection and send HTTP header
      int httpCode = http.GET();

      // httpCode will be negative on error
      if (httpCode > 0) {
        // HTTP header has been send and Server response header has been handled
        Serial.printf("[HTTP] GET... code: %d\n", httpCode);

        // file found at server
        if (httpCode == HTTP_CODE_OK) {
          String payload = http.getString();
  
          JsonDocument doc;
          DeserializationError error = deserializeJson(doc, payload);
          Serial.println();
    
          // change the status of arduino board
          if(doc["result"] == 1) digitalWrite(RELAY, HIGH);
          else digitalWrite(RELAY, LOW);
        }
      } else {
        Serial.printf("[HTTP] GET... failed, error: %s\n", http.errorToString(httpCode).c_str());
        digitalWrite(RELAY, LOW);
      }

      http.end();
    } else {
      Serial.println("[HTTP] Unable to connect");
      digitalWrite(RELAY, LOW);
    }
  } else {
    digitalWrite(RELAY, LOW);
  }

  delay(1000);
}
