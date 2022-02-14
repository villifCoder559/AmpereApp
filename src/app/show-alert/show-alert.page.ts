import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, Platform } from '@ionic/angular';
import { CountdownComponent, CountdownConfig, CountdownModule } from 'ngx-countdown';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { Geolocation, Geoposition } from '@ionic-native/geolocation/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { SMS } from '@ionic-native/sms/ngx';
import { AlertEvent, DeviceType, SharedDataService, UserData } from '../data/shared-data.service'
import { DeviceMotion, DeviceMotionAccelerationData } from '@ionic-native/device-motion/ngx'
import { LocalNotifications } from '@ionic-native/local-notifications/ngx'
import { NativeAudio } from '@ionic-native/native-audio/ngx'
import { NGSIv2QUERYService } from '../data/ngsiv2-query.service'
import { Snap4CityService } from '../data/snap4-city.service'

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
  details_emergency = new AlertEvent();
  @ViewChild('countdown', { static: false }) private countdown: CountdownComponent
  config: CountdownConfig = {
    leftTime: 20,
    formatDate: ({ date }) => `${date / 1000}`,
    // notify: 1
  };;
  constructor(private changeRef: ChangeDetectorRef, private s4c: Snap4CityService, private NGSIv2Query: NGSIv2QUERYService, private route: ActivatedRoute, private platform: Platform, private nativeAudio: NativeAudio, private localNotifications: LocalNotifications, private deviceMotion: DeviceMotion, private shared_data: SharedDataService, private sms: SMS, private alertController: AlertController, private router: Router, private locationAccuracy: LocationAccuracy,
    private geolocation: Geolocation, private androidPermissions: AndroidPermissions) {
    this.localNotifications.schedule({
      id: 1,
      text: 'Emergency notification, click to open and insert PIN to disable alert or click again to send emergency immediatly',
      data: ""
    });
  }
  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.details_emergency.deviceID = this.router.getCurrentNavigation().extras.state.deviceID
      console.log(this.details_emergency.deviceID)
    }, err => console.log(err))
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
      await this.presentAlert('PIN wrong', 70).then(() => {
        for (var i = this.pin.length - 1; i >= 0; i--) {
          (<HTMLInputElement>document.getElementById(i.toString())).value = '';
          if (i == 0)
            document.getElementById(i.toString()).focus();
        }
      })
    }
    else {
      this.presentAlert('PIN correct', 1200);
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
    if (event.action == 'done') {
      this.activateSensors().then(() => {
        this.sendEmergency();
      })
    }
  }
  position;
  acceleration;
  interval
  getPosition() {
    return new Promise((resolve, reject) => {
      this.position = this.geolocation.watchPosition({ enableHighAccuracy: true }).subscribe((response: Geoposition) => {
        if (this.interval === null)
          this.interval = setTimeout(() => {
            var distance = this.distance(this.details_emergency.latitude, this.details_emergency.longitude, response.coords.latitude, response.coords.longitude)
            console.log('DISTANCE')
            console.log(distance)
            console.log(response)
            if (distance > 0.05) {
              this.details_emergency.latitude = response.coords.latitude;
              this.details_emergency.longitude = response.coords.longitude;
              this.details_emergency.quote = response.coords.altitude;
              this.details_emergency.velocity = response.coords.speed !== null ? response.coords.speed : 0;
              this.details_emergency.dateObserved = new Date().toISOString();
              this.interval = null;
              this.sendEmergency();
            }
          }, 5000)
        if (this.details_emergency.latitude == -1 && this.details_emergency.longitude == -1) {
          this.details_emergency.latitude = response.coords.latitude;
          this.details_emergency.longitude = response.coords.longitude;
          this.details_emergency.quote = response.coords.altitude;
          this.details_emergency.velocity = response.coords.speed !== null ? response.coords.speed : 0;
          resolve(true);
        }
      }, (err) => {
        console.log(err);
        reject(err);
      })
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
      this.getPosition().then(() => {
        this.getAcceleration().catch((err) => {console.log(err)})
        setTimeout(() => {
          this.acceleration.unsubscribe();
          this.position.unsubscribe();
        }, 60000)
        resolve(true)
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
      this.router.navigateByUrl('/profile/menu/homepage', { replaceUrl: true })
    }, err => {
      console.log(err)
      //this.sendEvent();
    })
  }
  private sendEmergency() {
    var id = new Date(this.details_emergency.dateObserved);
    console.log('EMERGENCYDETAIL')
    console.log(this.details_emergency.latitude)
    console.log(this.details_emergency.latitude)
    this.s4c.createDevice(DeviceType.ALERT_EVENT, Math.floor(id.getTime() / 1000).toString(), this.details_emergency.latitude, this.details_emergency.longitude).then(() => {
      console.log('CREATE DEVICE')
      this.sendEvent();
      this.router.navigateByUrl('/profile/menu/homepage', { replaceUrl: true })
    }, err => {
      console.log(err.msg);
      //this.sendEmergency();
    })
    // var intervalSendEmergency = setInterval(() => {
    //   this.details_emergency.dateObserved = new Date().toISOString();
    //   this.NGSIv2Query.sendEvent(this.details_emergency);
    // }, freq)
  }
}
