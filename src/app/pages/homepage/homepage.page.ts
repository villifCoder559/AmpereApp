import { Component, OnInit, ViewChild } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import { AlertController, IonMenuButton, MenuController, Platform } from '@ionic/angular';
import { AlertEvent, DeviceType, Emergency_Contact, QRNFCEvent, SharedDataService, UserData } from '../../data/shared-data.service'
import { NGSIv2QUERYService } from '../../data/ngsiv2-query.service'
import { HttpClient } from '@angular/common/http';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Storage } from '@ionic/storage-angular'
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.page.html',
  styleUrls: ['./homepage.page.scss'],
})
export class HomepagePage implements OnInit {

  gps_enable = true;
  constructor(private translate: TranslateService, private storage: Storage, private menu: MenuController, private authService: AuthenticationService, private http: HttpClient, private ngsi: NGSIv2QUERYService, public sharedData: SharedDataService, private platform: Platform, private router: Router, private locationAccuracy: LocationAccuracy, private geolocation: Geolocation, private androidPermissions: AndroidPermissions) {
  }
  openMenu() {
    this.menu.open();
  }
  ngOnInit() {

  }
  startTour() {
    this.sharedData.startTour();
  }
  ionViewDidEnter() {
    console.log(this.sharedData.checkPermissionAlreadyMake)
    this.platform.ready().then(() => {
      this.storage.get('tour').then((value) => {
        if (!value && !this.sharedData.tour_enabled)
          this.startTour();
        else {
          this.sharedData.tour_enabled = false;
          this.enableCheckPermission();
        }
      },err=>{this.sharedData.dismissLoading().catch()})
    },err=>this.sharedData.dismissLoading().catch())
  }
  enableCheckPermission() {
    if (!this.sharedData.checkPermissionAlreadyMake)
      this.sharedData.presentLoading(this.translate.instant('ALERT.check_permission')).then(() => {
        this.sharedData.checkPermissionAlreadyMake = true;
        this.sharedData.enableAllPermission().then(() => {
          console.log(this.sharedData.checkPermissionAlreadyMake)
          this.sharedData.dismissLoading().catch((err) => console.log(err))
        }, err => { console.log(err); this.sharedData.dismissLoading().catch(err => console.log(err)) })
      }, err => console.log(err))
  }
  enableGPS() {
    return new Promise((resolve, reject) => {
      this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
        () => {
          this.gps_enable = true;
          resolve(true)
        },
        error => {
          alert(JSON.stringify(error))
          this.gps_enable = false;
          reject(false)
        }
      );
    })
  }
  locationAccPermission() {
    return new Promise((resolve, reject) => {
      this.locationAccuracy.canRequest().then((canRequest: boolean) => {
        if (canRequest) {
          resolve(true)
        } else {
          this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION)
            .then(
              () => {
                this.enableGPS().then(() => {
                  resolve(true)
                }, err => reject(err));
              },
              error => {
                reject(error)
                this.gps_enable = false;
              }
            );
        }
      });
    })
  }
  checkPermission() {
    return new Promise((resolve, reject) => {
      this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION).then(
        result => {
          if (result.hasPermission) {
            this.enableGPS().then(() => {
              console.log('hasPermission')
              resolve(true)
            });
          } else {
            console.log('requestPermission')
            this.locationAccPermission().then(() => {
              console.log('requestPermissionDone')
              resolve(true)
            });
          }
        },
        error => {
          console.log(error)
          reject(error)
        }
      );
    })
  }
  showAlert() {
    this.sharedData.showAlert('APP');
  }
  showLoading() {
    this.sharedData.presentLoading('Test 1').then(() => {
      setTimeout(() => {
        this.sharedData.setTextLoading('Test setting new text')
        setTimeout(() => {
          this.sharedData.dismissLoading();
        }, 2000)
      }, 2000)
    }, err => console.log(err))
  }
  testSendStatus() {
    this.ngsi.updateBackgroundEntity({ 'status': this.sharedData.user_data.status }, DeviceType.PROFILE).catch((err) => console.log(err))
  }
  testQuery() {
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
  testEqualTo() {
    var user1 = new UserData()
    var user2 = new UserData()
    user1.disabilities.visionImpaired = true;
    user2.disabilities.visionImpaired = false;
    // user1.paired_devices.push('test0')
    // user1.paired_devices.push('test1')
    // user2.paired_devices.push('test0')
    // user2.paired_devices.push('test2')
    // user1.emergency_contacts.push(new Emergency_Contact('name','surname','1234'))
    // user1.emergency_contacts.push(new Emergency_Contact('name','surname','5678'))
    // user2.emergency_contacts.push(new Emergency_Contact('name','surname','1234'))
    // user2.emergency_contacts.push(new Emergency_Contact('name','surname','5678'))
    console.log('REUSLT-> ' + user1.isEqualTo(user2))
  }
  openAlertPage() {
    let navigationExtras: NavigationExtras = {
      state: { deviceID: 'APP' },
      replaceUrl: true
    };
    this.router.navigate(['/show-alert'], navigationExtras)
  }
  openWebPage() {
    window.open('www.google.com')
  }
  createDeviceFromModel() {
    //this.s4c.createDeviceFromModel();
  }
  getProfile() {

  }
  sendUserProfile() {
    this.ngsi.sendUserProfile().then(() => {
      console.log('OK')
    }, err => console.log(err))
  }
  SendEventQRNFC() {
    var attr = this.ngsi.sendQRNFCEvent(new QRNFCEvent('', '', '', -1, -1))
  }
  testLoading() {
    this.sharedData.presentLoading('TEST 1');
    setTimeout(() => {
      this.sharedData.dismissLoading();
      this.sharedData.presentLoading('TEST 2')
      setTimeout(() => {
        this.sharedData.dismissLoading();
      }, 3500)
    }, 2000)
  }
  /** From API 28 must ask about perimission ACCESS_BACKGROUND_LOCATION (android).
   *  I have to ask for currentPosition for fixing a bug on Samsung devices */
  enableWatchPosition() {
    this.geolocation.watchPosition().subscribe((data) => {
      console.log(data)
    })
  }
  testDeviceMotionEvent() {
    window.addEventListener("devicemotion", function (event) {
      console.log(event)
    }, true);
  }
  uploadToken() {
    this.authService.keycloak.updateToken(18000).then((refreshed) => {
      if (refreshed)
        console.log('refreshed')
      else
        console.log('token still valid')
    }, err => console.log(err))
  }
  checkANDupdateToken() {
    // var url = 'https://www.snap4city.org/auth/realms/master/protocol/openid-connect/token'
    // var params = 'grant_type=refresh_token&refresh_token=' + this.authService.keycloak.refreshToken + '&client_id=js-snap4city-mobile-app'
    this.ngsi.checkANDupdateToken()
  }
  updateProfile() {
    var date = new Date().toISOString()
    this.ngsi.updateBackgroundEntity({ "status": { "value": this.sharedData.user_data.status }, "dateObserved": { "value": date } }, DeviceType.PROFILE).then((response) => {
      console.log(response)
    }, err => console.log(err))
  }
}
