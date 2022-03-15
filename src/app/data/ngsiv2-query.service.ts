import { Injectable, NgModule } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { AlertEvent, DeviceType, QRNFCEvent, SharedDataService } from '../data/shared-data.service'
import { Snap4CityService } from '../data/snap4-city.service'
import { JwtHelperService } from '@auth0/angular-jwt'
import { LocalNotifications } from '@ionic-native/local-notifications/ngx'

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
  sendQRNFCEvent(qrnfc_event: QRNFCEvent, name = '') {
    return new Promise((resolve, reject) => {
      this.checkANDupdateToken().then(() => {
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
            reject(err.responseText)
          }
        });
      }, err => reject({ msg: 'Error update token' }))
    })
  }
  sendAlertEvent(details_emergency: AlertEvent) {
    return new Promise((resolve, reject) => {
      this.checkANDupdateToken().then(() => {
        var username = this.shared_data.user_data.id;
        var attr = this.s4c.getEventPayload(false, details_emergency);
        console.log('TOKEN')
        console.log(this.shared_data.accessToken)
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
        var id = this.shared_data.user_data.id;
        var JSONdetails = JSON.stringify(attrs);
        console.log(JSONdetails)
        var url = "https://iot-app.snap4city.org/orionfilter/orionAMPERE-UNIFI/v2/entities/" + id + type + "/attrs?elementid=" + id + type + "&type=" + type
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
          this.localNotification.schedule({ title: 'Ampere token expired', text: 'Login to continue using this app!' })
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
          reject(xhr.responseText)
        }
      });
    })
  }
}
