import { Injectable, NgModule } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { AlertEvent, DeviceType, QRNFCEvent, SharedDataService } from '../data/shared-data.service'
import { Snap4CityService } from '../data/snap4-city.service'
import { JwtHelperService } from '@auth0/angular-jwt'
import { LocalNotifications } from '@awesome-cordova-plugins/local-notifications/ngx'
const helper = new JwtHelperService();
declare var cordovaHTTP: any;

@NgModule({
  providers: []
})
@Injectable({
  providedIn: 'root'
})
export class NGSIv2QUERYService {
  constructor(private localNotification: LocalNotifications, private authService: AuthenticationService, private s4c: Snap4CityService, private shared_data: SharedDataService) {
    console.log(this.authService.keycloak)
  }
  sendQRNFCEvent(qrnfc_event: QRNFCEvent) {
    return new Promise((resolve, reject) => {
      this.checkANDupdateToken().then(() => {
        var device_id = 'ampereuser' + this.shared_data.user_data.uuid + DeviceType.QR_NFC_EVENT;
        var attrs: any = this.s4c.getEventPayload(false, qrnfc_event);
        $.ajax({
          url: "https://iot-app.snap4city.org/orionfilter/orionAMPERE-UNIFI/v2/entities/" + device_id + "/attrs?elementid=" + device_id + "&type=" + DeviceType.QR_NFC_EVENT,
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
              reject('error package')
            }
          },
          error: function (err) {
            console.log("Insert values pool KO");
            console.log(err.responseText);
            reject(err)
          }
        })
      }, err => reject({ msg: 'Error update token' }))
    })
  }
  sendUserProfile() {
    return new Promise((resolve, reject) => {
      this.checkANDupdateToken().then(() => {
        this.shared_data.user_data.dateObserved = new Date().toISOString();
        var data = this.s4c.getUserIDPayload(false);
        console.log('Send data ' + data)
        var device_id = 'ampereuser' + this.shared_data.user_data.uuid + DeviceType.PROFILE;
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
            reject(err.responseText)
          }
        });
      }, err => reject({ msg: 'Error update token' }))
    })
  }
  sendAlertEvent(details_emergency: AlertEvent) {
    return new Promise((resolve, reject) => {
      this.checkANDupdateToken().then(() => {
        var attr = this.s4c.getEventPayload(false, details_emergency);
        console.log(this.shared_data.accessToken)
        var device_id = 'ampereuser' + this.shared_data.user_data.uuid + DeviceType.ALERT_EVENT;
        $.ajax({
          url: "https://iot-app.snap4city.org/orionfilter/orionAMPERE-UNIFI/v2/entities/" + device_id + "/attrs?elementid=" + device_id + "&type=" + DeviceType.ALERT_EVENT,
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
              resolve(true)
            }
            else
              reject('error package')
          },
          error: function (err) {
            console.log(err.responseText);
            reject(err.responseText)
          }
        });
      }, err => reject({ msg: 'Error update token' }))
    })
  }
  updateBackgroundEntity(attrs, type: DeviceType) {
    return new Promise((resolve, reject) => {
      this.checkANDupdateToken().then(() => {
        var device_id = 'ampereuser' + this.shared_data.user_data.uuid + type;
        var JSONdetails = JSON.stringify(attrs);
        console.log(JSONdetails)
        var url = "https://iot-app.snap4city.org/orionfilter/orionAMPERE-UNIFI/v2/entities/" + device_id + "/attrs?elementid=" + device_id + "&type=" + type
        cordovaHTTP.patch(url, attrs, {
          'Authorization': 'Bearer ' + this.shared_data.accessToken,
          'Content-Type': 'application/json'
        }, (response) => {
          console.log('response')
          console.log(response);
          if (response?.status != 'ko') {
            console.log('UPDATED_SUCCESSFULLY')
            resolve(true)
          }
          else
            reject('error_package')
        }, function (err) {
          console.log("Insert values pool KO");
          reject(err.responseText)
        });
      }, err => reject({ msg: 'Error update token' }))
    })
  }
  /** MinExpiration in seconds */
  checkANDupdateToken(minExpiration = 30) {
    return new Promise((resolve, reject) => {
      minExpiration = minExpiration * 1000;
      console.log('Expiration token')
      console.log(helper.getTokenExpirationDate(this.shared_data.accessToken))
      console.log('Now in seconds')
      console.log(new Date().getTime())
      if (helper.getTokenExpirationDate(this.shared_data.accessToken).getTime() < new Date().getTime() - minExpiration)
        this.updateToken().then(() => {
          resolve(true)
        }, err => {
          console.log(err)
          //this.localNotification.schedule({ title: 'Ampere token expired', text: 'Login to continue using this app!' })
          reject(false)
        })
      else
        resolve(true)
    })
  }
  updateToken() {
    return new Promise((resolve, reject) => {
      var url = 'https://www.snap4city.org/auth/realms/master/protocol/openid-connect/token'
      console.log('requestNewToken')
      cordovaHTTP.post(url, {
        grant_type: 'refresh_token',
        refresh_token: this.authService.keycloak.refreshToken,
        client_id: 'js-snap4city-mobile-app'
      }, {}, (response) => {
        console.log('Get new token');
        this.shared_data.accessToken = response.data.access_token;
        resolve(true)
      }, function (response) {
        console.log(response);
        reject(response)
      });
    })
  }
  getOwnDevices() {
    return new Promise((resolve, reject) => {
      console.log(this.shared_data.accessToken)
      $.ajax({
        url: "https://iotdirectory.snap4city.org/api/device.php",
        data: {
          action: "get_all_device",
          token: this.shared_data.accessToken,
          own:true,
          nodered:true
        },
        type: "GET",
        headers: {},
        async: true,
        dataType: 'json',
        success: (mydata) => {
          if (mydata.status != 'ko') {
            resolve(mydata.data)
          }
          else {
            console.log('mydata')
            console.log(mydata)
            reject(mydata.msg)
          }
        },
        error: function (xhr) {
          reject(xhr.responseText)
        }
      });
    })

  }
  getEntity(id_device, type: DeviceType, broker = 'orionAMPERE-UNIFI') {
    return new Promise((resolve, reject) => {
      console.log(this.shared_data.accessToken)
      $.ajax({
        url: "https://iot-app.snap4city.org/orionfilter/" + broker + "/v2/entities/" + id_device + "?elementid=" + id_device + "&type=" + type,
        type: "GET",
        headers: {
          //'Authorization': 'Bearer ' + this.shared_data.accessToken
        },
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
          reject(xhr.responseText)
        }
      });
    })
  }
  //https://iot-app.snap4city.org/orionfilter/orionAMPERE-UNIFI/v2/entities/ampereuser10802ebe-06b9-4c74-9141-f3b48dbc37e8Profile/attrs/status/value?elementid=ampereuser10802ebe-06b9-4c74-9141-f3b48dbc37e8Profile
  getStatus(){
    return new Promise((resolve, reject) => {
      var device_id = 'ampereuser' + this.shared_data.user_data.uuid + DeviceType.PROFILE;
      $.ajax({
        url: "https://iot-app.snap4city.org/orionfilter/orionAMPERE-UNIFI/v2/entities/" + device_id + "?elementid=" + device_id + "&type=" +DeviceType.PROFILE,
        type: "GET",
        headers: {
          'Authorization': 'Bearer ' + this.shared_data.accessToken
        },
        async: true,
        dataType: 'json',
        success: (mydata) => {
          if (mydata?.status != 'ko') {
            resolve(mydata.status.value)
          }
          else {
            console.log('mydata')
            console.log(mydata)
            reject(mydata.error_msg)
          }
        },
        error: function (xhr) {
          reject(xhr.responseText)
        }
      });
    })
  }
  getAllDictionarys(){
    return new Promise((resolve, reject) => {
      $.ajax({
        url: "https://www.disit.org/superservicemap/api/v1/?selection=42;11&requestFrom=user&categories=Service&maxResults=100&maxDists=0.0&format=json&lang=en&geometry=false&valueName=identifier",
        type: "GET",
        headers: {},
        async: true,
        dataType: 'json',
        success: (mydata) => {
          if (mydata.status != 'ko') {
            console.log(mydata)
            resolve(mydata)
          }
          else {
            console.log('mydata')
            console.log(mydata)
            reject(mydata.msg)
          }
        },
        error: function (xhr) {
          reject(xhr.responseText)
        }
      });
    })
  }
}
