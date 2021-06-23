
#include <ESP32_LoRaWAN.h>
#include "Arduino.h"
#define CAYENNELPP
#ifdef CAYENNELPP
#include <TinyGPS++.h>
#include <CayenneLPP.h>
#endif

/*license for Heltec ESP32 LoRaWan, quary your ChipID relevant license: http://resource.heltec.cn/search */
uint32_t  license[4] = {0x87545ABD,0x01747840,0x20DB8A5D,0x342104D3};
/* OTAA para*/
uint8_t DevEui[] = { 0x60, 0x81, 0xF9, 0x4A, 0xDB, 0xC2, 0x84, 0xD0 };
uint8_t AppEui[] = { 0x60, 0x81, 0xF9, 0x6A, 0x7E, 0xC9, 0x27, 0x95 };
uint8_t AppKey[] = { 0x6A, 0x92, 0x9D, 0x84, 0x09, 0x54, 0xBE, 0x94, 0x85, 0xE7, 0x30, 0x12, 0x4A, 0x92, 0x25, 0x86 };
/* ABP para*/
uint8_t NwkSKey[] = { 0x15, 0xb1, 0xd0, 0xef, 0xa4, 0x63, 0xdf, 0xbe, 0x3d, 0x11, 0x18, 0x1e, 0x1e, 0xc7, 0xda,0x85 };
uint8_t AppSKey[] = { 0xd7, 0x2c, 0x78, 0x75, 0x8c, 0xdc, 0xca, 0xbf, 0x55, 0xee, 0x4a, 0x77, 0x8d, 0x16, 0xef,0x67 };
uint32_t DevAddr =  ( uint32_t )0x007e6ae1;

/*LoraWan Class, Class A and Class C are supported*/
DeviceClass_t  loraWanClass = CLASS_A;

/*the application data transmission duty cycle.  value in [ms].*/
uint32_t appTxDutyCycle = 15000;

/*OTAA or ABP*/
bool overTheAirActivation = true;

/*ADR enable*/
bool loraWanAdr = false;

/* Indicates if the node is sending confirmed or unconfirmed messages */
bool isTxConfirmed = false;

/*LoraWan channelsmask, default channels 0-7*/
uint16_t userChannelsMask[6]={ 0xFF00,0x0000,0x0000,0x0000,0x0000,0x0000 };


/* Application port */
uint8_t appPort = 2;

/*!
* Number of trials to transmit the frame, if the LoRaMAC layer did not
* receive an acknowledgment. The MAC performs a datarate adaptation,
* according to the LoRaWAN Specification V1.0.2, chapter 18.4, according
* to the following table:
*
* Transmission nb | Data Rate
* ----------------|-----------
* 1 (first)       | DR
* 2               | DR
* 3               | max(DR-1,0)
* 4               | max(DR-1,0)
* 5               | max(DR-2,0)
* 6               | max(DR-2,0)
* 7               | max(DR-3,0)
* 8               | max(DR-3,0)
*
* Note, that if NbTrials is set to 1 or 2, the MAC will not decrease
* the datarate, in case the LoRaMAC layer did not receive an acknowledgment
*/
uint8_t confirmedNbTrials = 8;

/*LoraWan debug level, select in arduino IDE tools.
* None : print basic info.
* Freq : print Tx and Rx freq, DR info.
* Freq && DIO : print Tx and Rx freq, DR, DIO0 interrupt and DIO1 interrupt info.
* Freq && DIO && PW: print Tx and Rx freq, DR, DIO0 interrupt, DIO1 interrupt, MCU sleep and MCU wake info.
*/
uint8_t debugLevel = LoRaWAN_DEBUG_LEVEL;

/*LoraWan region, select in arduino IDE tools*/
LoRaMacRegion_t loraWanRegion = ACTIVE_REGION;

CayenneLPP lpp(50);

static const int RXPin = 36, TXPin = 37;
static const uint32_t GPSBaud = 9600;

TinyGPSPlus gps;

//static void prepareGpsData(unsigned long ms)
//{
//  unsigned long start = millis();
//  do 
//  {
//    while (Serial2.available())
//      gps.encode(Serial2.read());
//  } while (millis() - start < ms);
//}

static void prepareTxFrame( uint8_t port, float lat, float lng, float alt)
{
    lpp.reset();
    lpp.addGPS(1, lat, lng, alt);
    appDataSize = lpp.getSize();//AppDataSize max value is 64
    uint8_t* lppBuf = lpp.getBuffer();
    for(int i = 0; i < lpp.getSize(); i++){
      appData[i] = lppBuf[i];
    }
}

static void smartDelay(unsigned long ms)
{
  unsigned long start = millis();
  do 
  {
    while(Serial2.available())
    {
        gps.encode(Serial2.read());
    }
  } while (millis() - start < ms);
}

// Add your initialization code here
void setup()
{
  if(mcuStarted==0)
  {
    LoRaWAN.displayMcuInit();
  }
  Serial.begin(115200);
  Serial1.begin(GPSBaud, SERIAL_8N1, RXPin, TXPin);
  while (!Serial);
  while (!Serial1);
  SPI.begin(SCK,MISO,MOSI,SS);
  Mcu.init(SS,RST_LoRa,DIO0,DIO1,license);
  deviceState = DEVICE_STATE_INIT;
}

int lastUpdate = 0;
// The loop function is called in an endless loop
void loop()
{
    while(Serial1.available())
    {
        gps.encode(Serial1.read());
    }

//    if (gps.location.isUpdated())
//    {
//      Serial.println("gps location is updated ");
//    }
//
//    if (gps.satellites.isUpdated())
//    {
//      Serial.println("gps satellites is updated ");
//    }

//        float lat = 12.4;
//    float lng = 10.2;
//    float alt = 123;

  switch( deviceState )
  {
    case DEVICE_STATE_INIT:
    {
      LoRaWAN.init(loraWanClass,loraWanRegion);
      Serial.println("init");
      break;
    }
    case DEVICE_STATE_JOIN:
    {
      LoRaWAN.displayJoining();
      LoRaWAN.join();
      Serial.println("join");
      break;
    }
    case DEVICE_STATE_SEND:
    {
      Serial.println(gps.location.lat(), 6); // Latitude in degrees (double)
      Serial.println(gps.location.lng(), 6); // Longitude in degrees (double)
      Serial.println(gps.altitude.value()); // Raw altitude in centimeters (i32)
      Serial.println(gps.satellites.value()); // Number of satellites in use (u32)
      Serial.println(gps.hdop.value()); // Horizontal Dim. of Precision (100ths-i32)
      float lat = gps.location.lat();
      float lng = gps.location.lng();
      float alt = gps.altitude.meters();
      LoRaWAN.displaySending();
      prepareTxFrame( appPort, lat, lng, alt );
      LoRaWAN.send(loraWanClass);
      deviceState = DEVICE_STATE_CYCLE;
      Serial.println("send");
      break;
    }
    case DEVICE_STATE_CYCLE:
    {
      //Schedule next packet transmission
      txDutyCycleTime = appTxDutyCycle + randr( -APP_TX_DUTYCYCLE_RND, APP_TX_DUTYCYCLE_RND );
      LoRaWAN.cycle(txDutyCycleTime);
      deviceState = DEVICE_STATE_SLEEP;
      break;
    }
    case DEVICE_STATE_SLEEP:
    {
      LoRaWAN.displayAck();
      LoRaWAN.sleep(loraWanClass,debugLevel);
     
      //Serial.println("cycle");
      break;
    }
    default:
    {
      deviceState = DEVICE_STATE_INIT;
      Serial.println("default");
      break;
    }
  }
}
