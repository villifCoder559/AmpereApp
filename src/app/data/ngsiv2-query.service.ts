import { Injectable, NgModule } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { AlertEvent, DeviceType, QRNFCEvent, SharedDataService } from '../data/shared-data.service'
import { Snap4CityService } from '../data/snap4-city.service'

@NgModule({
  providers: []
})
@Injectable({
  providedIn: 'root'
})
export class NGSIv2QUERYService {
  constructor(private s4c: Snap4CityService, private shared_data: SharedDataService) { }
  sendQRNFCEvent(qrnfc_event: QRNFCEvent, name = '') {
    return new Promise((resolve, reject) => {
      var id = this.shared_data.user_data.id;
      var attrs: any = this.s4c.getEventPayload(false, qrnfc_event);
      $.ajax({
        url: "https://iot-app.snap4city.org/orionfilter/orionAMPERE-UNIFI/v2/entities/" + id + DeviceType.QR_NFC_EVENT + name + "/attrs?elementid=" + id + DeviceType.QR_NFC_EVENT + name + "&type=" + DeviceType.QR_NFC_EVENT,
        headers: {
          'Authorization': 'Bearer ' + this.shared_data.accessToken,
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
            resolve(true)
          }
          else {
            console.log('error')
            reject(mydata)
          }
        },
        error: function (err) {
          console.log("Insert values pool KO");
          console.log(err);
          reject(err)
        }
      })
    })
  }

  sendUserProfile() {
    return new Promise((resolve, reject) => {
      this.shared_data.user_data.dateObserved = new Date().toISOString();
      var data = this.s4c.getUserIDPayload(false);
      console.log('Send data ' + data)
      var device_id = this.shared_data.user_data.id + DeviceType.PROFILE;
      console.log(data)
      $.ajax({
        url: "https://iot-app.snap4city.org/orionfilter/orionAMPERE-UNIFI/v2/entities/" + device_id + "/attrs?elementid=" + device_id + "&type=" + DeviceType.PROFILE,
        headers: {
          'Authorization': 'Bearer ' + this.shared_data.accessToken,
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
  sendAlertEvent(details_emergency: AlertEvent) {
    return new Promise((resolve, reject) => {
      var username = this.shared_data.user_data.id;
      var attr = this.s4c.getEventPayload(false, details_emergency);
      console.log('ATTRIBUTES')
      console.log(attr)
      //attr.dateObserved=new Date().toISOString();
      $.ajax({
        url: "https://iot-app.snap4city.org/orionfilter/orionAMPERE-UNIFI/v2/entities/" + username + DeviceType.ALERT_EVENT + "/attrs?elementid=" + username + DeviceType.ALERT_EVENT + "&type=" + DeviceType.ALERT_EVENT,
        headers: {
          'Authorization': 'Bearer ' + this.shared_data.accessToken,
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
          'Authorization': 'Bearer ' + this.shared_data.accessToken,
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
  getEntity(id, type: DeviceType, broker = 'orionAMPERE-UNIFI') {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: "https://iot-app.snap4city.org/orionfilter/" + broker + "/v2/entities/" + id + "?elementid=" + id + "&type=" + type,
        type: "GET",
        headers: {},
        async: true,
        dataType: 'json',
        success: (mydata) => {
          if (mydata.status != 'ko') {
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
}
