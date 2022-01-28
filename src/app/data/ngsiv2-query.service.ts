import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, NgModule } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { Snap4CityService } from '../data/snap4-city.service'
import { SharedDataService } from '../data/shared-data.service'
export enum Entity {
  USERID = 'UserID',
  EVENT = 'Event',
  NFC = 'NFC',
  QR = ''
}
@NgModule({
  providers: [HttpClient]
})
@Injectable({
  providedIn: 'root'
})
export class NGSIv2QUERYService {
  endpoint = 'https://https://iot-app.snap4city.org/orionfilter/orionAMPERE-UNIFI:443/v1'
  constructor(private shared_data: SharedDataService, public http: HttpClient, private authService: AuthenticationService, private adapterS4C: Snap4CityService) { }
  sendQRNFCEvent(qridornfc, action, dateObserved, identifier, latitude, longitude) {
    var id = this.authService.username;
    $.ajax({
      url: "https://iot-app.snap4city.org/orionfilter/orionAMPERE-UNIFI/v2/entities/" + id + "QR-NFC-Event/attrs?elementid=" + id + "QR-NFC-Event&type=QR-NFC-Event",
      headers: {
        'Authorization': 'Bearer ' + this.authService.keycloak.refreshToken,
        'Content-Type': 'application/json'
      },
      type: "PATCH",
      data: {
        "id": id,
        "type": "QR-NFC-Event",
        "QRIDorNFC": { "type": "string", "value": qridornfc },
        "action": { "type": "string", "value": action },
        "dateObserved": { "type": "string", "value": dateObserved },
        "identifier": { "type": "string", "value": identifier },
        "latitude": { "type": "float", "value": latitude },
        "longitude": { "type": "float", "value": longitude }
      },
      async: true,
      dataType: 'json',
      success: function (mydata) {
        if (mydata.status != 'ko') {
          console.log('Data')
          console.log(mydata);
        }
        else {
          console.log('error')
        }
      },
      error: function (err) {
        console.log("Insert values pool KO");
        console.log(err);
      }
    });
  }
  sendUserProfile(dateObserved) {
    return new Promise((resolve, reject) => {
      var data: any = this.shared_data.user_data;
      var id = this.authService.username;
      data.id = id;
      data.type = 'AmpereUserProfile'
      data.dateObserved = dateObserved
      $.ajax({
        url: "https://iot-app.snap4city.org/orionfilter/orionAMPERE-UNIFI/v2/entities/" + id + "AmpereUserProfile/attrs?elementid=" + id + "AmpereUserProfile&type=AmpereUserProfile",
        headers: {
          'Authorization': 'Bearer ' + this.authService.keycloak.refreshToken,
          'Content-Type': 'application/json'
        },
        type: "PATCH",
        data: data,
        async: true,
        dataType: 'json',
        success: function (mydata) {
          if (mydata.status != 'ko') {
            console.log('Data')
            console.log(mydata);
          }
          else {
            console.log('error')
          }
        },
        error: function (err) {
          console.log("Insert values pool KO");
          console.log(err);
        }
      });
    })
  }
  sendEvent(accelX, accelY, accelZ, dateObserved, deviceID, evolution, quote, status, velocity, latitude, longitude) {
    return new Promise((resolve, reject) => {
      var id = this.authService.username;
      $.ajax({
        url: "https://iot-app.snap4city.org/orionfilter/orionAMPERE-UNIFI/v2/entities/" + id + "Event/attrs?elementid=" + id + "Event&type=Event",
        headers: {
          'Authorization': 'Bearer ' + this.authService.keycloak.refreshToken,
          'Content-Type': 'application/json'
        },
        type: "PATCH",
        data: {
          "id": id,
          "type": "Event",
          "accelX": { "type": "string", "value": accelX },
          "accelZ": { "type": "string", "value": accelZ },
          "accelY": { "type": "string", "value": accelY },
          "dateObserved": { "type": "string", "value": dateObserved },
          "deviceID": { "type": "string", "value": deviceID },
          "evolution": { "type": "string", "value": evolution },
          "quote": { "type": "string", "value": quote },
          "status": { "type": "string", "value": status },
          "velocity": { "type": "string", "value": velocity },
          "latitude": { "type": "float", "value": latitude },
          "longitude": { "type": "float", "value": longitude }
        },
        async: true,
        dataType: 'json',
        success: function (mydata) {
          if (mydata.status != 'ko') {
            console.log('Data')
            console.log(mydata);
            resolve(true)
          }
          else {
            console.log('error')
            reject(false)
          }
        },
        error: function (err) {
          console.log("Insert values pool KO");
          console.log(err);
        }
      });
    })
  }
  sendQRNFCDictionary(qridornfc, action, dateObserved, identifier, identifierCode, latitude, longitude) {
    var id = this.authService.username;
    $.ajax({
      url: "https://iot-app.snap4city.org/orionfilter/orionAMPERE-UNIFI/v2/entities/" + id + "QR-NFC-Event/attrs?elementid=" + id + "QR-NFC-Event&type=QR-NFC-Event",
      headers: {
        'Authorization': 'Bearer ' + this.authService.keycloak.refreshToken,
        'Content-Type': 'application/json'
      },
      type: "PATCH",
      data: {
        "id": id,
        "type": "QR-NFC-Event",
        "QRIDorNFC": { "type": "string", "value": qridornfc },
        "action": { "type": "string", "value": action },
        "dateObserved": { "type": "string", "value": dateObserved },
        "identifier": { "type": "string", "value": identifier },
        "identifiercode": { "type": "string", "value": identifierCode },
        "latitude": { "type": "float", "value": latitude },
        "longitude": { "type": "float", "value": longitude }
      },
      async: true,
      dataType: 'json',
      success: function (mydata) {
        if (mydata.status != 'ko') {
          console.log('Data')
          console.log(mydata);
        }
        else {
          console.log('error')
        }
      },
      error: function (err) {
        console.log("Insert values pool KO");
        console.log(err);
      }
    });
  }
  testWriteAPI(type) {
    return new Promise((resolve, reject) => {
      var data = this.adapterS4C.getQRNFCEventPayload();
      var username = this.authService.username;
      console.log('test1')
      //console.log(JSON.stringify(data))
      $.ajax({
        url: "https://iot-app.snap4city.org/orionfilter/orionAMPERE-UNIFI/v2/entities/" + username + type + "/attrs?elementid=" + username + type + "&type=" + type,
        headers: {
          'Authorization': 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJOZVBpSFRvREtibWZzbl9hREtETGpGTHFKQXluTXNNWjZjS1lMeGRoS29zIn0.eyJqdGkiOiI5OTJjMTQyYS00YjhiLTQ3YzEtODBkNi00ODg5NGFiYWJkYmYiLCJleHAiOjE2NDQzMjk2ODQsIm5iZiI6MCwiaWF0IjoxNjQzMzY1NTE2LCJpc3MiOiJodHRwczovL3d3dy5zbmFwNGNpdHkub3JnL2F1dGgvcmVhbG1zL21hc3RlciIsImF1ZCI6InBocC1pb3QtZGlyZWN0b3J5Iiwic3ViIjoiZGI1ZmU3NzYtMzA1YS00NDIwLWIyNDctODQzZmY1ZmFlMGNiIiwidHlwIjoiUmVmcmVzaCIsImF6cCI6InBocC1pb3QtZGlyZWN0b3J5Iiwibm9uY2UiOiI5OGUwYzg4NjdjOTQ5MTBjM2VmOTYzZTAzY2U3MzhjZCIsImF1dGhfdGltZSI6MCwic2Vzc2lvbl9zdGF0ZSI6ImQ4NDc4NzVjLTc1MzQtNDVmZi04OTFhLWIyNDMyNzIzZDU3MSIsInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJ1bWFfYXV0aG9yaXphdGlvbiIsIk1hbmFnZXIiXX0sInJlc291cmNlX2FjY2VzcyI6eyJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19fQ.KVVMMgvS8KGcLvnjQ3FnpBReDLAtEUSyrsjy-G-tNi7N3UOPLuMhOJ_Vp0vO4mjl4cYMCDk2-pw30YtVdSX2-tlchDf73cqhRCWslNTFASb3r0nWGJridk64zgH152EE-NsABPo010-NxPpgH8BbKLurOC9GVOjgOLEy5RVJWvI6K-W18cWIl8X3Qd7kUWGLvDPB3zY7QIcpNGFy84nUsaJewHqoxQyYIysUNHpNGFajw8grpGWXy-swBvpnTG2AM7KQ-0dYhI2Nzbp0ZSOntwo_Ftc99MNzWxWtCIYZG79tbTa4nJwxUdx-7SnaBYMFnKYraS4kl8PfzJ2jJyOaGg',
          'Content-Type': 'application/json'
        },
        type: "PATCH",
        data: {
          "id": "ampereuser1QR-NFC-Event",
          "type": "QR-NFC-Event",
          "QRIDorNFC": { "type": "string", "value": "QR" },
          "action": { "type": "string", "value": "a" },
          "dateObserved": { "type": "string", "value": "2022-01-15T15:05:44.412Z" },
          "identifier": { "type": "string", "value": "78" },
          "latitude": { "type": "float", "value": "43" },
          "longitude": { "type": "float", "value": "12" }
        },
        async: true,
        dataType: 'json',
        success: function (mydata) {
          if (mydata.status != 'ko') {
            console.log('Data')
            console.log(mydata);
            resolve(mydata)
          }
          else {
            reject(mydata)
          }
        },
        error: function (err) {
          console.log("Insert values pool KO");
          console.log(err);
          reject(err)
        }
      });
    })
  }
  getEntity(type) {
    return new Promise((resolve, reject) => {
      var data = this.adapterS4C.getQRNFCEventPayload();
      console.log('test1')
      var username = this.authService.username;
      //console.log(JSON.stringify(data))
      $.ajax({
        url: "https://iot-app.snap4city.org/orionfilter/orionAMPERE-UNIFI/v2/entities/" + username + type + "?elementid=" + username + type + "&type=" + type,
        type: "GET",
        headers: {
          'Content-Type': 'application/json'
        },
        async: true,
        dataType: 'json',
        success: function (mydata) {
          if (mydata.status != 'ko') {
            console.log('Data')
            console.log(mydata);
            resolve(mydata)
          }
          else {
            reject(mydata)
          }
        },
        error: function (err) {
          console.log("Insert values pool KO");
          console.log(err);
          reject(err)
        }
      });
    })
  }
  /* Using device.php */
  getDeviceData() {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: "https://iotdirectory.snap4city.org/api/device.php",
        data: {
          action: "get_device_data",
          id: 'ampereuser1QRNFCEvent',
          type: 'EventQRNFC',
          version: 'v2',
          contextbroker: 'orionAMPERE-UNIFI'
        },
        type: "POST",
        async: true,
        dataType: 'json',
        success: function (mydata) {
          if (mydata.status != 'ko') {
            console.log(mydata)
            resolve(mydata)
          }
          else {
            reject(mydata)
          }
        },
        error: function (err) {
          console.log(err)
          reject(err)
        }
      })
    })
  }

}
