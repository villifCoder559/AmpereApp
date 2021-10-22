import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { CountdownConfig } from 'ngx-countdown';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { SMS } from '@ionic-native/sms/ngx';
import { SharedDataService, UserData } from '../data/shared-data.service'
import { DeviceMotion, DeviceMotionAccelerationData } from '@ionic-native/device-motion/ngx'
import { Location } from "@angular/common";
import { LocalNotifications } from '@ionic-native/local-notifications/ngx'
/*
  Fix view page OK
  Check cordova elements( localization,accelerometer,if I send emergency check the coords,notification, etc )
  Add sound when I click button and when the time expires
  Add possibility when I click two times the emergency button send immediately notification
*/
@Component({
  selector: 'app-show-alert',
  templateUrl: './show-alert.page.html',
  styleUrls: ['./show-alert.page.scss'],
})
export class ShowAlertPage implements OnInit {
  pin = ['', '', '', '']
  config: CountdownConfig = {
    leftTime: 30,
    formatDate: ({ date }) => `${date / 1000}`
  };
  locationCordinates: any;
  constructor(private localNotifications: LocalNotifications, private locationURL: Location, private deviceMotion: DeviceMotion, private shared_data: SharedDataService, private sms: SMS, private alertController: AlertController, private router: Router, private locationAccuracy: LocationAccuracy,
    private geolocation: Geolocation, private androidPermissions: AndroidPermissions) {
    this.locationCordinates = {
      latitude: "",
      longitude: "",
      accuracy: "",
      date: "",
      timestamp: ''
    }
    document.addEventListener("deviceready", () => {
      this.localNotifications.schedule({
        id: 1,
        text: 'Emergency notification, click to open and insert PIN to disable alert or ignore it and send emergency',
        //sound: 'file://beep.caf',
        data: ""
      });
    });

  }
  ngOnInit() {
    this.currentLocPosition();
  }
  currentLocPosition() {
    this.geolocation.getCurrentPosition().then((response) => {
      this.locationCordinates.latitude = response.coords.latitude;
      this.locationCordinates.longitude = response.coords.longitude;
      this.locationCordinates.accuracy = response.coords.accuracy;
      var app = new Date(response.timestamp);
      this.locationCordinates.date = app.getUTCFullYear() + "-" + (app.getUTCMonth() + 1) + '-' + app.getUTCDate();
      this.locationCordinates.timestamp = (app.getUTCHours() < 10 ? '0' + app.getUTCHours() : app.getUTCHours()) + ':' + (app.getUTCMinutes() < 10 ? '0' + app.getUTCMinutes() : app.getUTCMinutes())
      //console.log(this.locationCordinates)
    }).catch((error) => {
      alert('Error: ' + error);
    });
  }
  enableGPS() {
    this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
      () => {
        this.currentLocPosition()
      },
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
  send_Emergency(event) {
    if (event.action == 'done') {
      var user_data = this.shared_data.getUserData();
      console.log(user_data)
      for (var i = 0; i < user_data.emergency_contacts.length; i++) {
        if (user_data.emergency_contacts[i].number != '')
          this.sms.send(user_data.emergency_contacts[i].number, 'I need a help! My current position is: \n latitude: ' + this.locationCordinates.latitude + ' longitude: ' + this.locationCordinates.longitude)
      }
      //send emergency data
      this.data_device_motion();
      console.log('Emergenza inviata');
      this.router.navigateByUrl('/profile/menu/homepage', { replaceUrl: true })
      //this.router.navigateByUrl('/');
    }
  }
  onDigitInput(event) {
    console.log(event);
    // console.log(event.target.attributes.getNamedItem('ng-reflect-name').value)
    let element;
    console.log(this.pin)
    if (event.code !== 'Backspace')
      element = event.srcElement.nextElementSibling;

    if (event.code === 'Backspace') {
      element = event.srcElement.previousElementSibling;
      element.select()
    }
    if (element == null) {
      this.checkPin();
      return;
    }
    else
      element.focus();
  }
  async checkPin() {
    var ok = true;
    // var pin_saved = window.localStorage.getItem('user.password');
    var pin_saved = ['0', '0', '0', '0',]
    for (var i = 0; i < this.pin.length; i++) {
      if (pin_saved[i] != this.pin[i])
        ok = false
    }
    if (!ok) {
      await this.presentAlert('PIN wrong', 500).then(() => {
        for (var i = this.pin.length - 1; i >= 0; i--) {
          (<HTMLInputElement>document.getElementById(i.toString())).value = '';
          if (i == 0)
            document.getElementById(i.toString()).focus();
        }
      })

    }
    else {
      this.presentAlert('PIN correct', 1500);
      this.router.navigateByUrl('/profile/menu/homepage', { replaceUrl: true })
    }
  }
  async presentAlert(text, time) {
    const alert = await this.alertController.create({
      cssClass: '',
      header: text,
      subHeader: '',
      message: '',
      buttons: ['OK']
    });
    alert.present().then(async () => {
      await new Promise(f => setTimeout(f, time));
      alert.dismiss();
    });
  }
  data_device_motion() {
    var sub = this.deviceMotion.watchAcceleration({ frequency: 1500 }).subscribe((acceleration: DeviceMotionAccelerationData) => {
      //send acceleration data
      console.log(acceleration)
    })
    setTimeout(() => {
      sub.unsubscribe()
    }, 60000)
  }
}
