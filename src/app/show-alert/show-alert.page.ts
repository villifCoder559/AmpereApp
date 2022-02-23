import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, Platform } from '@ionic/angular';
import { CountdownComponent, CountdownConfig, CountdownModule } from 'ngx-countdown';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { Geolocation, Geoposition } from '@ionic-native/geolocation/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { SMS } from '@ionic-native/sms/ngx';
import { AlertEvent, DeviceType, SharedDataService, UserData } from '../data/shared-data.service'
import { DeviceMotion, DeviceMotionAccelerationData } from '@awesome-cordova-plugins/device-motion/ngx'
import { LocalNotifications } from '@ionic-native/local-notifications/ngx'
import { NativeAudio } from '@ionic-native/native-audio/ngx'
import { NGSIv2QUERYService } from '../data/ngsiv2-query.service'
import { Snap4CityService } from '../data/snap4-city.service'
import { BackgroundGeolocation, BackgroundGeolocationConfig } from '@awesome-cordova-plugins/background-geolocation/ngx';

@Component({
  selector: 'app-show-alert',
  templateUrl: './show-alert.page.html',
  styleUrls: ['./show-alert.page.scss'],
})
export class ShowAlertPage implements OnInit {
  pin = ['', '', '', '']
  details_emergency = new AlertEvent();
  @ViewChild('countdown', { static: false }) private countdown: CountdownComponent
  config: CountdownConfig = {
    leftTime: 20,
    formatDate: ({ date }) => `${date / 1000}`,
    // notify: 1
  };;
  constructor(private backgroundGeolocation: BackgroundGeolocation, private changeRef: ChangeDetectorRef, private s4c: Snap4CityService, private NGSIv2Query: NGSIv2QUERYService, private route: ActivatedRoute, private platform: Platform, private nativeAudio: NativeAudio, private localNotifications: LocalNotifications, private deviceMotion: DeviceMotion, private shared_data: SharedDataService, private sms: SMS, private alertController: AlertController, private router: Router, private locationAccuracy: LocationAccuracy,
    private geolocation: Geolocation, private androidPermissions: AndroidPermissions) {
    this.localNotifications.schedule({
      id: 1,
      text: 'Emergency notification, click to open and insert PIN to disable alert or click again to send emergency immediatly',
      data: ""
    });
  }
  ngOnInit() {
    this.details_emergency.deviceID = this.router.getCurrentNavigation().extras?.state?.deviceID;
    console.log(this.details_emergency)
  }
  immediateEmergency() {
    this.countdown.left = 1;
    this.changeRef.detectChanges();
  }
  onDigitInput(event) {
    console.log(event);
    let element;
    console.log(this.pin)
    if (event.key !== 'Backspace')
      element = event.srcElement.nextElementSibling;

    if (event.key === 'Backspace') {
      element = event.srcElement.previousElementSibling;
      element.select()
    }
    if (element === null) {
      this.checkPin();
    }
    else
      element.focus();
  }
  checkPin() {
    var ok = true;
    // var pin_saved = window.localStorage.getItem('user.password');
    var pin_saved = this.shared_data.user_data.pin;
    console.log('checkPIN')
    console.log(this.shared_data.user_data)
    console.log(this.pin[i])
    for (var i = 0; i < this.pin.length; i++) {
      console.log(pin_saved[i])
      console.log(this.pin[i])
      if (pin_saved[i] != this.pin[i])
        ok = false
    }
    if (!ok) {
      this.presentAlert('PIN wrong', 50).then(() => {
        for (var i = this.pin.length - 1; i >= 0; i--) {
          (<HTMLInputElement>document.getElementById(i.toString())).value = '';
          if (i == 0)
            document.getElementById(i.toString()).focus();
        }
      })
    }
    else {
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
  send_Emergency(event) {//when time is expired
    console.log(event)
    if (event.action === 'done') {
      console.log('activateSensors')
      this.shared_data.createToast('Sending emergency...', 5500);
      this.activateSensors().then(() => {
        console.log('sendEmergency')
        this.sendEmergency().then(() => {
          console.log('emergencySended')
          this.router.navigateByUrl('/profile/menu/homepage', { replaceUrl: true })
          this.shared_data.createToast('Emergency sent successfully')
        }, err => {
          alert(err);
          this.router.navigateByUrl('/profile/menu/homepage', { replaceUrl: true })
        });
      }, err => {
        alert(err);
        this.router.navigateByUrl('/profile/menu/homepage', { replaceUrl: true })
      })
    }
  }
  position;
  acceleration;
  interval = 30000 //milliseconds
  getPosition() {
    return new Promise((resolve, reject) => {
      console.log('startwatchPosition')
      const config: BackgroundGeolocationConfig = {
        desiredAccuracy: 0,
        stationaryRadius: 20,
        distanceFilter: 50,
        debug: true, //  enable this hear sounds for background-geolocation life-cycle.
        stopOnTerminate: true, // enable this to clear background location settings when the app terminates
        interval: 3000,
        fastestInterval: 3000,
        activitiesInterval: 3000
      };
      this.backgroundGeolocation.configure(config)
        .then(() => {
          this.backgroundGeolocation.start();
        }, err => reject(err));
      // start recording location
      this.backgroundGeolocation.getCurrentLocation().then((position) => {
        console.log(position)
        this.details_emergency.latitude = position.latitude;
        this.details_emergency.longitude = position.longitude;
        this.details_emergency.quote = position.altitude;
        this.details_emergency.velocity = position.speed !== null ? position.speed : 0;
        this.details_emergency.dateObserved = new Date().toISOString();
        setTimeout(() => {
          this.backgroundGeolocation.stop()
        }, this.interval)
        resolve(true)
      }, err => reject(err))
    })
  }
  getAcceleration() {
    return new Promise((resolve, reject) => {
      var freq = 1000;
      this.acceleration = this.deviceMotion.watchAcceleration({ frequency: freq }).subscribe((acceleration: DeviceMotionAccelerationData) => {
        this.details_emergency.accelX = acceleration.x;
        this.details_emergency.accelY = acceleration.y;
        this.details_emergency.accelZ = acceleration.z;
        resolve(true);
      }, (err) => {
        console.log(err)
        reject(err);
      })
    })
  }
  private activateSensors() {
    return new Promise((resolve) => {
      console.log('GETPOSITION')
      this.getPosition().then(() => {
        console.log('GETACCELERATION')
        this.getAcceleration().then(() => {
          setTimeout(() => {
            this.acceleration.unsubscribe();
          }, this.interval)
          console.log('resolve')
          resolve(true)
        }, err => resolve(false))
      }, err => { console.log(err) })
    })

  }
  distance(lat1, lon1, lat2, lon2) {
    var p = 0.017453292519943295;    // Math.PI / 180
    var c = Math.cos;
    var a = 0.5 - c((lat2 - lat1) * p) / 2 +
      c(lat1 * p) * c(lat2 * p) *
      (1 - c((lon2 - lon1) * p)) / 2;
    return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
  }
  private sendEvent() {
    this.NGSIv2Query.sendAlertEvent(this.details_emergency).then(() => {
      this.localNotifications.schedule({
        id: 2,
        text: 'Emergency sent!',
        data: ""
      })
    }, err => {
      console.log(err)
      //this.sendEvent();
    })
  }
  private sendEmergency() {
    return new Promise((resolve, reject) => {
      var id = new Date(this.details_emergency.dateObserved);
      console.log('CREATION_DEVICE')
      this.s4c.createDevice(DeviceType.ALERT_EVENT, id.getTime().toString(), this.details_emergency.latitude, this.details_emergency.longitude).then(() => {
        console.log('CREATE DEVICE')
        this.sendEvent();
        resolve(true)
      }, err => {
        console.log(err.msg);
        reject(err.msg)
        //this.sendEmergency();
      })
    })
    // var intervalSendEmergency = setInterval(() => {
    //   this.details_emergency.dateObserved = new Date().toISOString();
    //   this.NGSIv2Query.sendEvent(this.details_emergency);
    // }, freq)
  }
}
