import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.page.html',
  styleUrls: ['./homepage.page.scss'],
})
export class HomepagePage implements OnInit {
  gps_enable = false;
  constructor(private router: Router, private locationAccuracy: LocationAccuracy,private backgroundMode: BackgroundMode ,private geolocation: Geolocation, private androidPermissions: AndroidPermissions) {
    this.backgroundMode.enable();
    this.backgroundMode.overrideBackButton();
    this.backgroundMode.disableWebViewOptimizations();
  }

  ngOnInit() {
    this.checkPermission();
  }

  enableGPS() {
    this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
      () => { },
      error => alert(JSON.stringify(error))
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
}
