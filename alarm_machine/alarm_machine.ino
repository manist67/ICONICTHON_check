#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>
#include <ArduinoJson.h>
#define RELAY 12

#define SSID "lys"
#define PASSWORD "12345678"
#define API_PATH "http://manist.store:5001/attitudes/3/latest"

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
      // start connection and send HTTP header
      int httpCode = http.GET();

      // httpCode will be negative on error
      if (httpCode > 0) {

        // file found at server
        if (httpCode == HTTP_CODE_OK) {
          String payload = http.getString();
          char s[32] = {0};
          payload.toCharArray(s, payload.length());
  
          JsonDocument doc;
          DeserializationError error = deserializeJson(doc, s);
          Serial.println();
    
          // change the status of arduino board
          Serial.printf("[HTTP] GET... val: %s \n", s);
          if(doc["result"] == 1) digitalWrite(RELAY, LOW);
          else digitalWrite(RELAY, HIGH);
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
