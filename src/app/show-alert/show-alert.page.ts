import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, Platform } from '@ionic/angular';
import { CountdownConfig, CountdownModule } from 'ngx-countdown';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { SMS } from '@ionic-native/sms/ngx';
import { SharedDataService, UserData } from '../data/shared-data.service'
import { DeviceMotion, DeviceMotionAccelerationData } from '@ionic-native/device-motion/ngx'
import { LocalNotifications } from '@ionic-native/local-notifications/ngx'
import { NativeAudio } from '@ionic-native/native-audio/ngx'
import { NGSIv2QUERYService, Entity } from '../data/ngsiv2-query.service'
/*
  OK Fix view page OK
  OK Add sound when I click button and when the time expires OK
  Check cordova elements( localization,accelerometer,if I send emergency check the coords,notification, etc ) OK
    _fix errors when i click notification OK
  Add possibility when I click two times the emergency button app sends immediately notification OK
  
*/
@Component({
  selector: 'app-show-alert',
  templateUrl: './show-alert.page.html',
  styleUrls: ['./show-alert.page.scss'],
})
export class ShowAlertPage implements OnInit {
  pin = ['', '', '', '']
  config: CountdownConfig = {
    leftTime: 20,
    formatDate: ({ date }) => `${date / 1000}`,
    // notify: 1
  };;
  constructor(private NGSIv2Query: NGSIv2QUERYService, private route: ActivatedRoute, private platform: Platform, private nativeAudio: NativeAudio, private localNotifications: LocalNotifications, private deviceMotion: DeviceMotion, private shared_data: SharedDataService, private sms: SMS, private alertController: AlertController, private router: Router, private locationAccuracy: LocationAccuracy,
    private geolocation: Geolocation, private androidPermissions: AndroidPermissions) {
    this.localNotifications.schedule({
      id: 1,
      text: 'Emergency notification, click to open and insert PIN to disable alert or click again to send emergency immediatly',
      data: ""
    });
  }
  ngOnInit() {
  }

  onDigitInput(event) {
    console.log(event);
    // console.log(event.target.attributes.getNamedItem('ng-reflect-name').value)
    let element;
    console.log(this.pin)
    if (event.key !== 'Backspace')
      element = event.srcElement.nextElementSibling;

    if (event.key === 'Backspace') {
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
    var pin_saved = this.shared_data.user_data.pin;
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
  send_Emergency(event) {
    console.log(event)
    if (event.action == 'done')
      this.sendEmergency();
  }
  private currentLocPosition() {
    return new Promise((resolve, reject) => {
      var details_emergency = {
        latitude: 0.0,
        longitude: 0.0,
        dateObserved: 0,
        quote: 0.0,
        velocity: 0.0,
        evolution: '',
        deviceID: 0,
        accellX: 0.0,
        accellY: 0.0,
        accellZ: 0.0,
        status: 0
      };
      this.geolocation.getCurrentPosition().then((response) => {
        details_emergency.latitude = response.coords.latitude;
        details_emergency.longitude = response.coords.longitude;
        details_emergency.dateObserved = new Date().getTime();
        resolve(details_emergency);
      }).catch((error) => {
        alert('Error: ' + error);
        reject(error)
      });
    })
  }
  private sendEmergency() {
    this.currentLocPosition().then((data) => {
      console.log(data)
      this.NGSIv2Query.sendEvent(1,2,3,4,5,6,7,8,9,10,11).then((result) => {
        this.nativeAudio.play('sendData').catch(
          (err) => console.log(err))
        this.data_device_motion();
        this.localNotifications.schedule({
          id: 2,
          text: 'Emergency sent!',
          data: ""
        });
        this.router.navigateByUrl('/profile/menu/homepage', { replaceUrl: true })
      }, (err) => {
        setTimeout(() => {
          console.log(err);
          this.sendEmergency();
        }, 2000);
      })
    }, (err) => {
      setTimeout(() => {
        console.log(err);
        this.sendEmergency();
      }, 2000);
    });
  }
  private data_device_motion() {
    var avgx = 0, avgy = 0, avgz = 0;
    var vx = 0, vy = 0, vz = 0;
    var count = 0;
    var freq = 1000;
    var sub = this.deviceMotion.watchAcceleration({ frequency: freq }).subscribe((acceleration: DeviceMotionAccelerationData) => {
      vx = (acceleration.x - 0.6) * (freq / 1000);
      vy = (acceleration.y - 0.4) * (freq / 1000);
      vz = (acceleration.z - 0.3 - 9.81) * (freq / 1000);
      console.log('velocity--> ' + (Math.abs(vx) + Math.abs(vy) + Math.abs(vz)))
      count++;
      //send new data accelerometer
      console.log(acceleration)
    }, (err) => { console.log(err) })
    setTimeout(() => {
      console.log('avgX-> ' + (avgx / (60000 / freq)))
      console.log('avgY-> ' + (avgy / (60000 / freq)))
      console.log('avgZ-> ' + (avgz / (60000 / freq)))
      sub.unsubscribe()
    }, 60000)
  }
}
