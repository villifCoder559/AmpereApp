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
/*TODO List:
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
  10) add setting button device status(button redirect to profile with 'connect device' open) OK
  11)Fix not loaded data autologin(login works but no autologin), 
  */
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
  showAlert(){
    this.router.navigateByUrl('/show-alert',{replaceUrl:true})
  }
}
