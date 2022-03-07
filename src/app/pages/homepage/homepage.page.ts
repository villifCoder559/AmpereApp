import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { Platform } from '@ionic/angular';
import { AlertEvent, DeviceType, Emergency_Contact, QRNFCEvent, SharedDataService, UserData } from '../../data/shared-data.service'
import { NGSIv2QUERYService } from '../../data/ngsiv2-query.service'
import { Snap4CityService } from '../../data/snap4-city.service'
import { HttpClient } from '@angular/common/http';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';
@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.page.html',
  styleUrls: ['./homepage.page.scss'],
})

export class HomepagePage implements OnInit {
  gps_enable = true;
  constructor(private http: HttpClient, private s4c: Snap4CityService, private ngsi: NGSIv2QUERYService, private sharedData: SharedDataService, private platform: Platform, private localNotifications: LocalNotifications, private router: Router, private locationAccuracy: LocationAccuracy, private geolocation: Geolocation, private androidPermissions: AndroidPermissions) {
    this.enableAllPermission()
  }
  enableAllPermission() {
    this.platform.ready().then(() => {
      this.askPermission().then(() => {
        this.sharedData.enableAllBackgroundMode();
        console.log('ASK_PERMISSION')
        this.localNotifications.hasPermission().then(result => {
          if (!result.valueOf())
            this.localNotifications.requestPermission()
        }, (err) => console.log(err))
      }, err => console.log(err))
    })
  }
  ngOnInit() {
  }
  ngAfterViewInit() {
    this.sharedData.dismissLoading().catch((err) => console.log(err))
    console.log('ngAfterViewInit')
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
    //take bluetooth singal
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
    })
  }
  testSendStatus() {
    this.ngsi.updateEntity({ 'status': this.sharedData.user_data.status }, DeviceType.PROFILE).catch((err) => console.log(err))
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
  testDeviceID() {
    this.sharedData.showAlert('25a')
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
  /** From API 28 must ask about perimission ACCESS_BACKGROUND_LOCATION (android) */
  askPermission() {
    return new Promise((resolve, reject) => {
      this.androidPermissions.checkPermission("android.permission.ACCESS_BACKGROUND_LOCATION").then((value) => {
        if (!value.hasPermission) {
          this.geolocation.getCurrentPosition().then((position) => {
            alert('This app needs location access for all the time. Allow it so this app can work properly')
            this.androidPermissions.requestPermissions([
              "android.permission.ACCESS_BACKGROUND_LOCATION",
              "android.permission.ACCESS_COARSE_LOCATION",
              this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION,
            ]).then((response) => {
              console.log('ReusltResponse')
              console.log(response)
              resolve(true)
            }, err => reject(err))
          }, err => reject(err))
        }
      })
    })
  }
  checkAndroidPermission() {
    this.androidPermissions.checkPermission('ACCESS_BACKGROUND_LOCATION').then((value) => {
      if (!value.hasPermission)
        this.askPermission();
      console.log(value)
    })
  }
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
}
