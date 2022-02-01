import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, NgModule } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { SharedDataService } from '../data/shared-data.service'
export enum DeviceType {
  USERID = 'AmpereUserProfile',
  EVENT = 'Event',
  NFC_QR = 'QR-NFC-Event',
  NFC_QR_DICTIONARY = 'QRNFCDictionary'
}
@NgModule({
  providers: [HttpClient]
})
@Injectable({
  providedIn: 'root'
})
export class NGSIv2QUERYService {
  constructor(private shared_data: SharedDataService, public http: HttpClient, private authService: AuthenticationService) { }
  sendQRNFCEvent(qridornfc, action, dateObserved, identifier) {
    var id = this.shared_data.user_data.id;
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
        "identifier": { "type": "string", "value": identifier }
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
      data.type = 'AmpereUserProfile'
      data.dateObserved = dateObserved;
      data.status = 'active';
      data.Jewel1ID = data.paired_devices[0];
      data.Jewel1ID = data.paired_devices[1];
      delete data.paired_devices;
      for (var i = 0; i < 5; i++) {
        var name = data['emergencyContact' + (i + 1) + 'Name'];
        var surname = data['emergencyContact' + (i + 1) + 'Surname'];
        var number = data['emergencyContact' + (i + 1) + 'Number'];
        if (data.user_data.emergency_contacts[i].name != '' && data.user_data.emergency_contacts[i].surname && data.user_data.emergency_contacts[i].number.length != 0) {
          data[name] = data.user_data.emergency_contacts[i].name;
          data[surname] = data.user_data.emergency_contacts[i].surname;
          data[number] = data.user_data.emergency_contacts[i].number;
        }
      }
      delete data.emergency_contacts;
      for (var i = 0; i < 4; i++) {
        var qrcode = data['QR' + (i + 1)];
        var nfccode = data['NFC' + (i + 1)];
        if (qrcode != '')
          data[qrcode] = data.qr_code[i]
        if (nfccode != '')
          data[nfccode] = data.nfc_code[i]
      }
      delete data.qr_code;
      delete data.nfc_code;
      $.ajax({
        url: "https://iot-app.snap4city.org/orionfilter/orionAMPERE-UNIFI/v2/entities/" + data.id + "AmpereUserProfile/attrs?elementid=" + data.id + "AmpereUserProfile&type=AmpereUserProfile",
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
            resolve(mydata);
          }
          else {
            console.log('error')
            reject('error')
          }
        },
        error: function (err) {
          console.log("Insert values pool KO");
          reject('error')
          console.log(err);
        }
      });
    })
  }
  sendEvent(details_emergency) {
    return new Promise((resolve, reject) => {
      var id = this.shared_data.user_data.id;
      var JSONdetails = JSON.stringify(details_emergency);
      $.ajax({
        url: "https://iot-app.snap4city.org/orionfilter/orionAMPERE-UNIFI/v2/entities/" + id + "Event/attrs?elementid=" + id + "Event&type=Event",
        headers: {
          'Authorization': 'Bearer ' + this.authService.keycloak.refreshToken,
          'Content-Type': 'application/json'
        },
        type: "PATCH",
        data: JSONdetails,
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
  updateEntity(attrName, attrValue, type) {
    return new Promise((resolve, reject) => {
      var id = this.shared_data.user_data.id;
      var JSONdetails = JSON.stringify(attrValue);
      $.ajax({
        url: "https://iot-app.snap4city.org/orionfilter/orionAMPERE-UNIFI/v2/entities/" + id + type + "/attrs/+" + attrName + "/value?elementid=" + id + "Event&type=" + type,
        headers: {
          'Authorization': 'Bearer ' + this.authService.keycloak.refreshToken,
          'Content-Type': 'application/json'
        },
        type: "PATCH",
        data: JSONdetails,
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
            reject('error')
          }
        },
        error: function (err) {
          console.log("Insert values pool KO");
          console.log(err);
          reject('error')
        }
      });
    })
  }
  testWriteAPI(type) {
    return new Promise((resolve, reject) => {
      var username = this.shared_data.user_data.id;
      if (username == '')
        username = 'ampereuser1'
      //console.log(JSON.stringify(data))
      $.ajax({
        url: "https://iot-app.snap4city.org/orionfilter/orionAMPERE-UNIFI/v2/entities/" + username + type + "/attrs?elementid=" + username + type + "&type=" + type,
        headers: {
          'Authorization': 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJOZVBpSFRvREtibWZzbl9hREtETGpGTHFKQXluTXNNWjZjS1lMeGRoS29zIn0.eyJqdGkiOiI1YmM2MjIxMC1jZmEyLTQzNGMtOTI4ZS0zMzJhNDdmNTIwMzMiLCJleHAiOjE2NDU3MDEzMzUsIm5iZiI6MCwiaWF0IjoxNjQzNjM4OTg5LCJpc3MiOiJodHRwczovL3d3dy5zbmFwNGNpdHkub3JnL2F1dGgvcmVhbG1zL21hc3RlciIsImF1ZCI6InBocC1pb3QtZGlyZWN0b3J5Iiwic3ViIjoiM2Q0ZTk1ZmQtNmI1Ni00YjM2LWIxMTMtOTM0ZGRlN2EzMmQwIiwidHlwIjoiUmVmcmVzaCIsImF6cCI6InBocC1pb3QtZGlyZWN0b3J5Iiwibm9uY2UiOiJjMjdjYmJmYWVjZTE1YjNiOTNiOWVjYjlhNGQ4ZDU4MSIsImF1dGhfdGltZSI6MCwic2Vzc2lvbl9zdGF0ZSI6IjAwMDUyN2Q0LWMxNzYtNGI3Ny05Yzc2LTM5MzllOTQyNmEwYyIsInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJBcmVhTWFuYWdlciIsInVtYV9hdXRob3JpemF0aW9uIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fX0.b_yH0oCSxbXPxeTFfpX2vGR4XM7qgp6DyUKb9Ka1q7JBUtyJmkkFQvHSndF0WAlRbgyuEm2xD2uev0REYFddExEQH0PuV3pDkw65yxg9viC9Md3y6UAnvMFsT6JdGfOEBQEExcdg-f5U0ku4SqY2xo_qp9pDPt74zzCD6xGZ4AYaCtBrM8yc5phpowEp81V0tMrd511pQtaUzYVGUwOaBQ1mgY_t9MBua4gmeDTgQmAMOF1SYBHxo9jGf7b3S3zvFYMo4B5Lhy-VQ0L3Jo5S75axvhbl8VjpZzyXVd_Ni_CuZ74e8bfoRCmBftIGu0QaebN4bEG9KpUDACi7OU0NkA',
          'Content-Type': 'application/json'
        },
        type: "PATCH",
        data: {
          "id": username + type,
          "type": type,
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
  getEntity(name,type) {
    return new Promise((resolve, reject) => {
      var username = this.shared_data.user_data.id;
      console.log(username)
      if (username == '')
        username = 'ampereuser1'
      // var type = name
      // console.log(name)
      // switch (name) {
      //   case 'AmpereUserProfile':
      //     type = 'Profile'; break;
      // }
      //console.log(JSON.stringify(data))
      $.ajax({
        url: "https://iot-app.snap4city.org/orionfilter/orionAMPERE-UNIFI/v2/entities/" + username + name + "?elementid=" + username + name + "&type=" + type,
        type: "GET",
        headers: {
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
          reject('Request error')
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
  private preparePayloadUser() {

  }
}
