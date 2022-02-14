import { HttpClient, HttpErrorResponse, HttpHeaders, HttpInterceptor } from '@angular/common/http';
import { Injectable, NgModule } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { DeviceType, Emergency_Contact, FakeKeycloak, QRNFCEvent, SharedDataService, typeChecking } from '../data/shared-data.service'
import { Snap4CityService } from '../data/snap4-city.service'

@NgModule({
  providers: [HttpClient]
})
@Injectable({
  providedIn: 'root'
})
export class NGSIv2QUERYService {
  constructor(private http: HttpClient, private s4c: Snap4CityService, private shared_data: SharedDataService, private authService: AuthenticationService) { }
  sendQRNFCEvent(qrnfc_event: QRNFCEvent, name = '') {
    var id = this.shared_data.user_data.id;
    var attrs: any = this.s4c.getQRNFCEventPayload(false, qrnfc_event);
    //attrs.dateObserved = { value: new Date().toISOString() }
    console.log(attrs)
    $.ajax({
      url: "https://iot-app.snap4city.org/orionfilter/orionAMPERE-UNIFI/v2/entities/" + id + DeviceType.QR_NFC_EVENT + name + "/attrs?elementid=" + id + DeviceType.QR_NFC_EVENT + name + "&type=" + DeviceType.QR_NFC_EVENT,
      headers: {
        'Authorization': 'Bearer ' + this.authService.keycloak.token,
        'Content-Type': 'application/json'
      },
      type: "PATCH",
      data: JSON.stringify(attrs),
      async: true,
      dataType: 'json',
      success: function (mydata) {
        if (mydata?.status != 'ko') {
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
    // }, err => (console.log(err)))
  }
  getEmergencyContactsToSend(contacts) {
    var data = [];
    console.log('Contacts ' + contacts)
    for (var i = 0; i < 5; i++) {
      let name = 'emergencyContact' + (i + 1) + 'Name';
      let surname = 'emergencyContact' + (i + 1) + 'Surname';
      let number = 'emergencyContact' + (i + 1) + 'Number';
      if (contacts[i]?.name != '' && contacts[i]?.surname != '' && contacts[i]?.number.length != 0) {
        data[name] = contacts[i]?.name;
        data[surname] = contacts[i]?.surname;
        data[number] = contacts[i]?.number;
      }
      else {
        data[name] = '';
        data[surname] = '';
        data[number] = '';
      }
    }
    return data;
  }
  sendUserProfile() {
    return new Promise((resolve, reject) => {
      var data = this.s4c.getUserIDPayload(false);
      console.log('Send data ' + data)
      var device_id = this.shared_data.user_data.id + DeviceType.PROFILE;
      console.log(data)
      $.ajax({
        url: "https://iot-app.snap4city.org/orionfilter/orionAMPERE-UNIFI/v2/entities/" + device_id + "/attrs?elementid=" + device_id + "&type=" + DeviceType.PROFILE,
        headers: {
          'Authorization': 'Bearer ' + this.authService.keycloak.token,
          'Content-Type': 'application/json'
        },
        type: "PATCH",
        data: JSON.stringify(data),
        async: true,
        dataType: 'json',
        success: function (mydata) {
          resolve(mydata)
        },
        error: function (err) {
          console.log("Insert values pool KO");
          reject('error')
          console.log(err);
        }
      });
    })
  }
  sendAlertEvent(details_emergency) {
    return new Promise((resolve, reject) => {
      var username = this.shared_data.user_data.id;
      var attr = this.s4c.getAlertEventPayload(false, details_emergency);
      var name = Math.floor(new Date(details_emergency.dateObserved).getTime() / 1000).toString();
      //attr.dateObserved=new Date().toISOString();
      $.ajax({
        url: "https://iot-app.snap4city.org/orionfilter/orionAMPERE-UNIFI/v2/entities/" + username + DeviceType.ALERT_EVENT + name + "/attrs?elementid=" + username + DeviceType.ALERT_EVENT + name + "&type=" + DeviceType.ALERT_EVENT,
        headers: {
          'Authorization': 'Bearer ' + this.authService.keycloak.token,
          'Content-Type': 'application/json'
        },
        type: "PATCH",
        data: JSON.stringify(attr),
        async: true,
        dataType: 'json',
        success: function (mydata) {
          if (mydata?.status != 'ko') {
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
  updateEntity(attrs, type: DeviceType) {
    return new Promise((resolve, reject) => {
      var id = this.shared_data.user_data.id;
      var JSONdetails = JSON.stringify(attrs);
      $.ajax({
        url: "https://iot-app.snap4city.org/orionfilter/orionAMPERE-UNIFI/v2/entities/" + id + type + "/attrs?elementid=" + id + type + "&type=" + type,
        headers: {
          'Authorization': 'Bearer ' + this.authService.keycloak.token,
          'Content-Type': 'application/json'
        },
        type: "PATCH",
        data: JSONdetails,
        async: true,
        dataType: 'json',
        success: function (mydata) {
          if (mydata?.status != 'ko') {
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
          reject(err)
        }
      });
    })
  }
  testWriteAPI(type) {
    return new Promise((resolve, reject) => {
      var username = this.shared_data.user_data.id;
      var test = {
        "QRIDorNFC": {
          "value": "test from application"
        },
        "action": {
          "value": "google.com"
        },
        "dateObserved": {
          "value": ""
        },
        "identifier": {
          "value": ""
        }
      }
      if (username == '')
        username = 'ampereuser1'
      //console.log(JSON.stringify(data))
      //console.log(this.authService.keycloak.token)
      $.ajax({
        url: "https://iot-app.snap4city.org/orionfilter/orionAMPERE-UNIFI/v2/entities/ampereuser1QR-NFC-Event/attrs?elementid=ampereuser1QR-NFC-Event&type=QR-NFC-Event",
        headers: {
          'Authorization': 'Bearer ' + this.authService.keycloak.token,
          'Content-Type': 'application/json',
        },
        type: "PATCH",
        data: JSON.stringify(test),
        async: true,
        dataType: 'json',
        success: function (mydata) {
          if (mydata?.status != 'ko') {
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
  getEntityHTTP(name, type) {
    return new Promise((resolve, reject) => {
      var username = 'ampereuser8'
      this.http.get("https://iot-app.snap4city.org/orionfilter/orionAMPERE-UNIFI/v2/entities/" + username + name + "?elementid=" + username + name + "&type=" + type, { observe: "response" })
        .subscribe((result) => {
          console.log(result)
          resolve(result)
        }, (err: HttpErrorResponse) => {
          reject(err)
        })
    })

  }
  getEntity(name, type) {
    return new Promise((resolve, reject) => {
      var username = this.shared_data.user_data.id;
      $.ajax({
        url: "https://iot-app.snap4city.org/orionfilter/orionAMPERE-UNIFI/v2/entities/" + username + name + "?elementid=" + username + name + "&type=" + type,
        type: "GET",
        headers: {},
        async: true,
        dataType: 'json',
        success: (mydata) => {
          if (mydata.status != 'ko') {
            //this.shared_data.textFromServerToClient(mydata);
            resolve(mydata)
          }
          else {
            console.log('mydata')
            console.log(mydata)
            reject(mydata.error_msg)
          }
        },
        error: function (xhr) {
          reject(xhr)
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
