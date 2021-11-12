import { Injectable } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, Platform } from '@ionic/angular';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { DeviceMotion, DeviceMotionAccelerationData } from '@ionic-native/device-motion/ngx';
import { CountdownConfig, CountdownModule } from 'ngx-countdown';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NGSIv2QUERYService, Entity } from '../data/ngsiv2-query.service'
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CountdownModule
  ],
  providers: [
    LocationAccuracy,
    Geolocation,
    AndroidPermissions,
    LocalNotifications,
    BackgroundMode,
    DeviceMotion,
    NativeAudio]
})
export class NFCCode {
  link: string = '';
  id: number = -1;
  description: string = '';
}
export class QRCode {
  description: string = '';
  link: string = '';
  code: string = '';
  id: number = -1;
}
export class Emergency_Contact {
  number: string = '';
  name: string = '';
}
export class Device {
  name: string = '';
  id: string = '-1';
  rssi: string = '';
  battery: number = 100;
  connected: boolean = false;
  advertising=[];
  charateristics=[];
  services=[];
}
/*check iBeacon library */
export class UserData {
  name: string = '';
  surname: string = ''
  email: string = ''
  phoneNumber: string = ''
  birthdate: string = ''
  gender: string = ''
  address: string = ''
  locality: string = ''
  city: string = ''
  height: string = ''
  weight: string = ''
  ethnicity: string = ''
  description: string = ''
  purpose: string = ''
  pin: string = ''
  allergies: string = ''
  medications: string = ''
  password: string = ''
  disabilities = [false, false]
  emergency_contacts = [new Emergency_Contact, new Emergency_Contact, new Emergency_Contact, new Emergency_Contact, new Emergency_Contact]
  public_emergency_contacts = { 113: false, 115: false, 118: false }
  paired_devices = [new Device(), new Device()]
  qr_code = [new QRCode(), new QRCode(), new QRCode(), new QRCode()]
  nfc_code = [new NFCCode(), new NFCCode(), new NFCCode(), new NFCCode()]
  constructor() { }
}

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {
  user_data: UserData=new UserData();
  gps_enable = false;
  is_logged = false;
  snap4city_logged = false;


  count_click_emergency = 0;
  constructor(private backgroundMode: BackgroundMode, private NGSIv2Query: NGSIv2QUERYService, private router: Router, private platform: Platform, private nativeAudio: NativeAudio, private localNotifications: LocalNotifications, private deviceMotion: DeviceMotion,
    private geolocation: Geolocation) {
    this.platform.ready().then(() => {
      this.nativeAudio.preloadSimple('alert', 'assets/sounds/alert.mp3').then(() => { }, (err) => console.log(err));
      this.nativeAudio.preloadSimple('sendData', 'assets/sounds/send_data.mp3').then(() => { }, (err) => console.log(err));
    })
    // this.user_data.emergency_contacts[0] = { number: '123456789', name: 'paul'};
    // this.user_data.emergency_contacts[2] = { number: '058745632', name: 'Leo' }
  }
  getUserData(){
    return this.user_data;
  }
  setUserData(data) {
    this.user_data = data
  }
  setIs_logged(val: boolean) {
    this.is_logged = val
  }
  loadDataUser() {
    var qr_code = new QRCode();
    qr_code.id = 2;
    qr_code.description = "Call Simon smartphone"
    var nfc_code = new NFCCode();
    nfc_code.id = 2;
    nfc_code.description = "How to take Aspirina"
    const data: UserData = {
      address: 'Viale Morgagni 87',
      allergies: 'gluten',
      birthdate: '10/25/1947',
      city: 'Florence',
      description: 'brown hair, blue eyes',
      disabilities: [false, true],
      email: 'email@mail.com',
      emergency_contacts: [{ number: '8541254732', name: 'Paul Rid' }],
      ethnicity: 'white',
      gender: 'male',
      height: '185',
      locality: 'Careggi',
      medications: '',
      name: 'Wayne',
      weight: '85',
      surname: 'Richards',
      phoneNumber: '2587436910',
      public_emergency_contacts: { 113: false, "115": false, "118": true },
      paired_devices: [],
      password: '',
      pin: '0258',
      purpose: 'Personal safety',
      qr_code: [qr_code],
      nfc_code: [nfc_code]
    }
    this.user_data = data;
    // this.setUserData(data)
    //this.setIs_logged(true);
  }
  goHomepage() {
    //load user data from database
    this.loadDataUser();
    this.router.navigateByUrl('/profile/menu/homepage', { replaceUrl: true });
  }
  showAlert() {
    //take bluetooth signal, create handler that takes the signal
    console.log(this.count_click_emergency)
    if (this.count_click_emergency == 0) {
      this.count_click_emergency++;
      this.nativeAudio.play('alert')
      this.router.navigateByUrl('/show-alert', { replaceUrl: true })
    } else {
      this.sendEmergency();
      this.count_click_emergency = 0;
    }
  }
  reset_EmergencyClick() {
    this.count_click_emergency = 0;
  }
  currentLocPosition() {
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
  sendEmergency() {
    this.currentLocPosition().then((data) => {
      this.NGSIv2Query.registerEntity(Entity.EVENT, 0, data).then((result) => {
        this.reset_EmergencyClick();
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

    //this.router.navigateByUrl('/');
  }
  data_device_motion() {
    var sub = this.deviceMotion.watchAcceleration({ frequency: 1500 }).subscribe((acceleration: DeviceMotionAccelerationData) => {
      this.NGSIv2Query.updateEntityAttribute(Entity.EVENT, 'accelX', acceleration.x)
      this.NGSIv2Query.updateEntityAttribute(Entity.EVENT, 'accelY', acceleration.y)
      this.NGSIv2Query.updateEntityAttribute(Entity.EVENT, 'accelZ', acceleration.z)
      console.log(acceleration)
    }, (err) => { console.log(err) })
    setTimeout(() => {
      sub.unsubscribe()
    }, 60000)
  }
  enableAllBackgroundMode() {
    this.backgroundMode.enable();
    this.backgroundMode.overrideBackButton();
    this.backgroundMode.disableWebViewOptimizations();
  }
  disableBackgaundMode() {
    this.backgroundMode.disable();
  }
}
