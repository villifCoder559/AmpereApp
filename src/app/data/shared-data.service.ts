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
    NativeAudio,]
})
export class Emergency_Contact {
  number: string = '';
  name: string = '';
}
export class Device {
  name: string = '';
  id: string = '';
  rssi: string = '';
  battery: number = 100;
  connected: boolean = false;
}

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
  paired_devices = [new Device, new Device]
  constructor() { }
}
@Injectable({
  providedIn: 'root'
})
export class SharedDataService {
  user_data: UserData;
  gps_enable=false;
  private _is_logged = false;
  currentPosition = {
    latitude: 0.0,
    longitude: 0.0,
    time: '',
    date: '',
    accuracy: 0
  };
  
  count_click_emergency = 0;
  constructor(private backgroundMode: BackgroundMode,private router: Router, private platform: Platform, private nativeAudio: NativeAudio, private localNotifications: LocalNotifications, private deviceMotion: DeviceMotion, private locationAccuracy: LocationAccuracy,
    private geolocation: Geolocation, private androidPermissions: AndroidPermissions) {
    this.platform.ready().then(() => {
      this.nativeAudio.preloadSimple('alert', 'assets/sounds/alert.mp3').then(() => { }, (err) => console.log(err));
      this.nativeAudio.preloadSimple('sendData', 'assets/sounds/send_data.mp3').then(() => { }, (err) => console.log(err));
      
    })
    // this.user_data.emergency_contacts[0] = { number: '123456789', name: 'paul'};
    // this.user_data.emergency_contacts[2] = { number: '058745632', name: 'Leo' }
  }

  public getIs_logged() {
    return this._is_logged;
  }
  public setIs_logged(value) {
    this._is_logged = value;
  }
  setUserData(data) {
    this.user_data = data
    //save data on database
  }
  getUserData() {
    return this.user_data
  }
  loadDataUser() {
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
      paired_devices: [{ name: 'necklace', battery: 50, connected: true, id: '78542', rssi: '-73' }],
      password: '',
      pin: '0258',
      purpose: 'Personal safety'
    }
    this.setUserData(data)
    this.setIs_logged(true);

  }
  goHomepage() {
    //load user data from database
    this.loadDataUser();
    this.router.navigateByUrl('/profile/menu/homepage', { replaceUrl: true });
  }
  showAlertandSendEmergency() {
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
    this.geolocation.getCurrentPosition().then((response) => {
      this.currentPosition.latitude = response.coords.latitude;
      this.currentPosition.longitude = response.coords.longitude;
      this.currentPosition.accuracy = response.coords.accuracy;
      var today = new Date();
      this.currentPosition.date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
      this.currentPosition.time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
      //  this.currentPosition.date = today.getUTCFullYear() + "-" + (today.getUTCMonth() + 1) + '-' + (today.getUTCDate()+1);
      //  this.currentPosition.timestamp = ((today.getUTCHours() < 10 ? '0' + today.getUTCHours() : today.getUTCHours())) + ':' + ((today.getUTCMinutes() < 10 ? '0' + today.getUTCMinutes() : today.getUTCMinutes()))
      console.log(this.currentPosition)
    }).catch((error) => {
      alert('Error: ' + error);
    });
  }
  private async sendEmergency() {
    await this.currentLocPosition();
    this.reset_EmergencyClick();
    this.nativeAudio.play('sendData').catch(
      (err) => console.log(err))
    var user_data = this.getUserData();
    console.log(user_data)
    console.log(this.currentPosition)
    // for (var i = 0; i < user_data.emergency_contacts.length; i++) {
    //if (user_data.emergency_contacts[i].number != '')
    // this.sms.send(user_data.emergency_contacts[i].number, 'I need a help! My current position is: \n latitude: ' + this.locationCordinates.latitude + ' longitude: ' + this.locationCordinates.longitude)
    // }
    //send emergency data
    this.data_device_motion();
    this.localNotifications.schedule({
      id: 2,
      text: 'Emergency sent',
      data: ""
    });
    console.log('Emergenza inviata');
    this.router.navigateByUrl('/profile/menu/homepage', { replaceUrl: true })
    //this.router.navigateByUrl('/');
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
