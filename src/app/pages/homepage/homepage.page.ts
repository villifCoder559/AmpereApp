import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { Platform } from '@ionic/angular';
import { AlertEvent, DeviceType, QRNFCEvent, SharedDataService } from '../../data/shared-data.service'
import { NGSIv2QUERYService } from '../../data/ngsiv2-query.service'
import { Snap4CityService } from '../../data/snap4-city.service'
import { HttpClient } from '@angular/common/http';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';
import { BackgroundGeolocation, BackgroundGeolocationConfig, BackgroundGeolocationEvents, BackgroundGeolocationResponse } from '@awesome-cordova-plugins/background-geolocation/ngx'
@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.page.html',
  styleUrls: ['./homepage.page.scss'],
})

export class HomepagePage implements OnInit {
  gps_enable = true;
  constructor(private backgroundGeolocation: BackgroundGeolocation, private http: HttpClient, private s4c: Snap4CityService, private ngsi: NGSIv2QUERYService, private sharedData: SharedDataService, private platform: Platform, private localNotifications: LocalNotifications, private router: Router, private locationAccuracy: LocationAccuracy, private geolocation: Geolocation, private androidPermissions: AndroidPermissions) {

  }
  ngOnInit() {
  }
  ngAfterViewInit() {
    console.log('ngAfterViewInit')
    this.platform.ready().then(() => {
      this.sharedData.dismissLoading().then(() => {
        this.askPermission().then(() => {
          //this.checkPermission();
          this.sharedData.enableAllBackgroundMode();
          this.enableGPS();
          console.log('ASK_PERMISSION')
          this.localNotifications.hasPermission().then(result => {
            if (!result.valueOf())
              this.localNotifications.requestPermission()
          }, (err) => console.log(err))
        }, err => console.log(err));
      }, (err) => console.log(err))
    }), (err => console.log(err));
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
  async checkPermission() {
    return new Promise((resolve, reject) => {
      this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION).then(
        result => {
          if (result.hasPermission) {
            this.enableGPS();
          } else {
            this.locationAccPermission();
          }
        },
        error =>
          reject(error)
      );
    })
  }
  showAlert() {
    //take bluetooth singal
    this.sharedData.showAlert('APP');
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
  testWriteQuery() {

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
    var attr = this.ngsi.sendQRNFCEvent(new QRNFCEvent('', '', ''))
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
      this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_BACKGROUND_LOCATION).then((response) => {
        console.log(response)
        resolve(true)
      }, err => reject(err))
    })
  }
  checkAndroidPermission() {
    this.androidPermissions.checkPermission('ACCESS_BACKGROUND_LOCATION').then((value) => {
      if (!value.hasPermission)
        this.androidPermissions.requestPermission('ACCESS_BACKGROUND_LOCATION');
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
  backgroundGeolocationMauron() {
    setTimeout(() => {
      const config: BackgroundGeolocationConfig = {
        desiredAccuracy: 0,
        stationaryRadius: 20,
        distanceFilter: 50,
        debug: true, //  enable this hear sounds for background-geolocation life-cycle.
        stopOnTerminate: false, // enable this to clear background location settings when the app terminates
        interval: 3000,
        fastestInterval: 3000,
        activitiesInterval: 3000,
      };
      this.backgroundGeolocation.configure(config)
        .then(() => {
          this.backgroundGeolocation.start();
        });
      // start recording location
      setInterval(() => {
        this.backgroundGeolocation.getCurrentLocation().then((position) => {
          console.log(position)
        })
      }, 2000)
      setTimeout(() => {
        this.backgroundGeolocation.stop()
      }, 20000)
    }, 5000)

    // If you wish to turn OFF background-tracking, call the #stop method.
    //this.backgroundGeolocation.stop();
  }
}
