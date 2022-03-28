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
  ngOnInit() {
    // this.ngsi.getStatus().then((value: any) => {
    //   this.sharedData.user_data.status = value;
    // }, err => this.sharedData.createToast(this.translate.instant('ALERT.retrive_status')))
    if (!this.sharedData.tour_enabled)
      this.platform.ready().then(() => {
        this.storage.get('tour').then((value) => {
          if (!value && !this.sharedData.tour_enabled)
            this.startTour();
          else {
            //this.sharedData.tour_enabled = false;
            if (!this.sharedData.tour_enabled)
              this.enableCheckPermission();
          }
        }, err => { this.sharedData.dismissLoading().catch() })
      }, err => this.sharedData.dismissLoading().catch())
  }
  startTour() {
    this.sharedData.startTour();
  }
  ionViewDidEnter() {
    console.log(this.sharedData.tour_enabled)
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
      this.sharedData.enableGPS().then(() => resolve(true), err => reject(false))
      // this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
      //   () => {
      //     this.gps_enable = true;
      //     resolve(true)
      //   },
      //   error => {
      //     alert(JSON.stringify(error))
      //     this.gps_enable = false;
      //     reject(false)
      //   }
      // );
    })
  }
  locationAccPermission() {
    return new Promise((resolve, reject) => {
      this.sharedData.locationAccPermission().then(() => resolve(true), err => reject(false))
      // this.locationAccuracy.canRequest().then((canRequest: boolean) => {
      //   if (canRequest) {
      //     resolve(true)
      //   } else {
      //     this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION)
      //       .then(
      //         () => {
      //           this.enableGPS().then(() => {
      //             resolve(true)
      //           }, err => reject(err));
      //         },
      //         error => {
      //           reject(error)
      //           this.gps_enable = false;
      //         }
      //       );
      //   }
      // });
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
  openAlertPage() {
    let navigationExtras: NavigationExtras = {
      state: { deviceID: 'APP' },
      replaceUrl: true
    };
    this.router.navigate(['/show-alert'], navigationExtras)
  }
}
