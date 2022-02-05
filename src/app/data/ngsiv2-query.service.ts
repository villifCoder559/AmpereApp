import { HttpClient, HttpHeaders } from '@angular/common/http';
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
  constructor(private s4c: Snap4CityService, private shared_data: SharedDataService, private authService: AuthenticationService) { }
  sendQRNFCEvent(qrnfc_event: QRNFCEvent) {
    var id = this.shared_data.user_data.id;
    var attrs: any = qrnfc_event;
    attrs.id = id;
    attrs.type = DeviceType.QR_NFC_EVENT;
    // var attrs = {
    //   "id": id,
    //   "type": DeviceType.QR_NFC_EVENT,
    //   "QRIDorNFC": { "type": "string", "value": qridornfc },
    //   "action": { "type": "string", "value": action },
    //   "dateObserved": { "type": "string", "value": dateObserved },
    //   "identifier": { "type": "string", "value": identifier }
    // }
    // this.s4c.createDevice(DeviceType.QR_NFC_EVENT).then(() => {
    $.ajax({
      url: "https://iot-app.snap4city.org/orionfilter/orionAMPERE-UNIFI/v2/entities/" + id + DeviceType.QR_NFC_EVENT + "/attrs?elementid=" + id + DeviceType.QR_NFC_EVENT + "&type=" + DeviceType.QR_NFC_EVENT,
      headers: {
        'Authorization': 'Bearer ' + FakeKeycloak.token,
        'Content-Type': 'application/json'
      },
      type: "PATCH",
      data: JSON.stringify(attrs),
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
    // }, err => (console.log(err)))

  }
  getEmergencyContactsToSend(contacts: Array<Emergency_Contact>) {
    var data;
    for (var i = 0; i < 5; i++) {
      let name = data['emergencyContact' + (i + 1) + 'Name'];
      let surname = data['emergencyContact' + (i + 1) + 'Surname'];
      let number = data['emergencyContact' + (i + 1) + 'Number'];
      if (contacts[i].name != '' && contacts[i].surname && contacts[i].number.length != 0) {
        data[name] = contacts[i].name;
        data[surname] = contacts[i].surname;
        data[number] = contacts[i].number;
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
      var data: any = this.shared_data.user_data;
      data.type = DeviceType.PROFILE;
      data.dateObserved = new Date().toISOString();
      data.status = 'active';
      data.jewel1ID = '';
      data.jewel2ID = '';
      if (data.paired_devices[0] != undefined)
        data.jewel1ID = data.paired_devices[0];
      if (data.paired_devices[1] != undefined)
        data.jewel2ID = data.paired_devices[1];
      delete data.paired_devices;
      Object.keys(data).concat(this.getEmergencyContactsToSend(this.shared_data.user_data.emergency_contacts))
      delete data.emergency_contacts;
      for (var i = 0; i < 4; i++) {
        let qrcode = data['QR' + (i + 1)];
        data[qrcode] = '';
        if (qrcode != '')
          data[qrcode] = data.qr_code[i]
      }
      for (i = 0; i < 4; i++) {
        let nfccode = data['NFC' + (i + 1)];
        data[nfccode] = ''
        if (nfccode != '')
          data[nfccode] = data.nfc_code[i]
      }
      delete data.qr_code;
      delete data.nfc_code;
      data.visionImpaired = this.shared_data.user_data.disabilities[0];
      data.wheelchairUser = this.shared_data.user_data.disabilities[1]
      //add disabilities
      this.s4c.createDevice(DeviceType.PROFILE).then(() => {
        $.ajax({
          url: "https://iot-app.snap4city.org/orionfilter/orionAMPERE-UNIFI/v2/entities/" + data.id + "AmpereUserProfile/attrs?elementid=" + data.id + "AmpereUserProfile&type=AmpereUserProfile",
          headers: {
            'Authorization': 'Bearer ' + FakeKeycloak.token,
            'Content-Type': 'application/json'
          },
          type: "PATCH",
          data: JSON.parse(data),
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
      }, err => (console.log(err)))

    })
  }
  sendEvent(details_emergency) {
    return new Promise((resolve, reject) => {
      var id = this.shared_data.user_data.id;
      var JSONdetails = JSON.stringify(details_emergency);
      $.ajax({
        url: "https://iot-app.snap4city.org/orionfilter/orionAMPERE-UNIFI/v2/entities/" + id + "Event/attrs?elementid=" + id + "Event&type=Event",
        headers: {
          'Authorization': 'Bearer ' + FakeKeycloak.token,
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
  updateEntity(attrs, type: DeviceType) {
    return new Promise((resolve, reject) => {
      var id = this.shared_data.user_data.id;
      var JSONdetails = JSON.stringify(attrs);
      $.ajax({
        url: "https://iot-app.snap4city.org/orionfilter/orionAMPERE-UNIFI/v2/entities/" + id + type + "/attrs?elementid=" + id + type + "&type=" + type,
        headers: {
          'Authorization': 'Bearer ' + FakeKeycloak.token,
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
      var test = {
        "QRIDorNFC": {
          "value": "prova"
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
        url: "https://iot-app.snap4city.org/orionfilter/orionAMPERE-UNIFI/v2/entities/ampereuser1EventQRNFC/attrs?elementid=ampereuser1EventQRNFC&type=QR-NFC-Event",
        headers: {
          'Authorization': 'Bearer' + FakeKeycloak.token,
          'Content-Type': 'application/json'
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
  getEntity(name, type) {
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
        headers: {},
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
}
