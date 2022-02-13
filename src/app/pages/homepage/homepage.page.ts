import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
//import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { Platform } from '@ionic/angular';
import { DeviceType, QRNFCEvent, SharedDataService } from '../../data/shared-data.service'
import { NGSIv2QUERYService } from '../../data/ngsiv2-query.service'
import { Snap4CityService } from '../../data/snap4-city.service'
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.page.html',
  styleUrls: ['./homepage.page.scss'],
})
/*TODO List:
  0)Add alertButton
  1)Enable scroll page OK
  2)Fix validator foreach textarea OK
  3)Import contact from contacts of device TEST OK
  3.1)Improve html of Contacts tab OK
  3.2)Password & confirm_psw, add hide/not-hide_psw button OK
  4)Start page about connection device OK
  5)Save data untill 4 phase OK
  6)Restyle ion list OK
  7)Start to make the page after sign-in OK
  8)password min length 8 and special char OK, load user_data when profile is loaded OK
  9)Find a way to change email and password when logged OK
  10) add setting button device status(button redirect to profile with stepper 'connect device' open) OK
  11)Fix not loaded data autologin(login works but no autologin), OK
  12)Check local notification OK
  13) On device:
        _login page bad resize when open keyboard OK
        _QR code camera not working OK
        _Fix when camera is opened and user clicks back-button or in another menu section OK
        _show_alert doesn't show pin labels OK
        _bad performance OK
  */
export class HomepagePage implements OnInit {
  gps_enable = true;
  constructor(private http: HttpClient, private s4c: Snap4CityService, private ngsi: NGSIv2QUERYService, private sharedData: SharedDataService, private platform: Platform, private localNotifications: LocalNotifications, private router: Router, private locationAccuracy: LocationAccuracy, private geolocation: Geolocation, private androidPermissions: AndroidPermissions) {
    this.platform.ready().then(() => {
      this.localNotifications.hasPermission().then(result => {
        if (!result.valueOf())
          this.localNotifications.requestPermission()
      }, (err) => console.log(err))
      this.checkPermission();
    }, (err) => console.log(err))
  }
  ngOnInit() {

  }
  enableGPS() {
    this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
      () => {
        this.gps_enable = true;
      },
      error => {
        alert(JSON.stringify(error))
        this.gps_enable = false;
      }
    );
  }
  locationAccPermission() {
    this.locationAccuracy.canRequest().then((canRequest: boolean) => {
      if (canRequest) {
      } else {
        this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION)
          .then(
            () => {
              this.enableGPS();
            },
            error => {
              alert(error)
              this.gps_enable = false;
            }
          );
      }
    });
  }
  checkPermission() {
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION).then(
      result => {
        if (result.hasPermission) {
          this.enableGPS();
        } else {
          this.locationAccPermission();
        }
      },
      error => {
        alert(error);
      }
    );
  }
  showAlert() {
    //take bluetooth singal
    this.sharedData.showAlert(0);
  }
  testQuery() {
    this.ngsi.getDeviceData().then((result) => {
      console.log(result)
    }, (err) => console.log(err))
  }
  testAPIEntry() {
    return new Promise((resolve, reject) => {
      this.http.get("https://iot-app.snap4city.org/orionfilter/orionAMPERE-UNIFI/v2/entities/ampereuser1Profile" + "?elementid=" + 'ampereuser1Profile' + "&type=" + 'Profile', { observe: "response" })
        .subscribe((result) => {
          console.log(result)
          resolve(result)
        }, (err) => {
          console.log(err.status)
          reject(err)
        })
    })
    // this.ngsi.getEntity(DeviceType.PROFILE, DeviceType.PROFILE).then((result: any) => {
    //   console.log(result)
    //   console.log(result.address.value)
    // }, (err) => console.log(err))
  }
  testWriteQuery() {
    this.ngsi.testWriteAPI('QR-NFC-Event').then((result) => {
      console.log(result)
    }, (err) => console.log(err))
  }
  openAlertPage() {
    this.router.navigateByUrl('/show-alert', { replaceUrl: true })
  }
  openWebPage() {
    window.open('www.google.com')
  }
  createDeviceFromModel() {
    //this.s4c.createDeviceFromModel();
  }
  getProfile() {
    this.ngsi.getEntityHTTP(DeviceType.PROFILE, DeviceType.PROFILE).then((result) => {
      console.log(result)
    }, err => { })
  }
  getInsertDataS4C() {
    console.log(this.s4c.getUserIDPayload(false));
    console.log(this.s4c.getAlertEventPayload())
    console.log(this.s4c.getQRNFCEventPayload())
  }
  sendUserProfile() {
    this.ngsi.sendUserProfile().then(() => {
      console.log('OK')
    }, err => console.log(err))
  }
  SendEventQRNFC() {
    var attr = this.ngsi.sendQRNFCEvent(new QRNFCEvent('','',''))
  }
}
