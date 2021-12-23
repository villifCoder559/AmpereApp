import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, Platform, ToastController } from '@ionic/angular';
// import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
// import { Geolocation } from '@ionic-native/geolocation/ngx';
// import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
// import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
// import { DeviceMotion, DeviceMotionAccelerationData } from '@ionic-native/device-motion/ngx';
import { CountdownConfig, CountdownModule } from 'ngx-countdown';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CountdownModule
  ],
  providers: [
    BackgroundMode,
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
/**accuray:'15',major:125,mior:758,proximity:'Near',rssi:'-69',tx:'10db',uuid:'51446-54564w-fwfffw4-56d4we5d1e5113d2e1' */

/*check iBeacon library OK
  save data */
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
  paired_devices = [null, null]
  qr_code = [new QRCode(), new QRCode(), new QRCode(), new QRCode()]
  nfc_code = [new NFCCode(), new NFCCode(), new NFCCode(), new NFCCode()]
  constructor() { }
}

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {
  user_data: UserData = new UserData();
  gps_enable = false;
  constructor(private toastCtrl: ToastController, private backgroundMode: BackgroundMode, private router: Router, private platform: Platform, private nativeAudio: NativeAudio) {
    this.platform.ready().then(() => {
      this.nativeAudio.preloadSimple('alert', 'assets/sounds/alert.mp3').then(() => { }, (err) => console.log(err));
      this.nativeAudio.preloadSimple('sendData', 'assets/sounds/send_data.mp3').then(() => { }, (err) => console.log(err));
    })
  }
  getkeycloak(){
    
  }
  async createToast(header) {
    let toast = await this.toastCtrl.create({
      header: header,
      duration: 3500
    })
    toast.present();
  }
  getUserData() {
    return this.user_data;
  }
  setUserData(data) {
    this.user_data = data
  }
  loadDataUser() {
    // return new Promise((resolve,reject)=>{
    //   this.NGSIv2Query.getEntity(Entity.USERID).then(() => {
    //     //this.bluetoothService.enableAllUserBeacon();
    //     resolve(true)
    //   }, (err) => reject(err))
    // })
    var qr_code = new QRCode();
    qr_code.id = 2;
    qr_code.description = "Call Simon smartphone"
    var nfc_code = new NFCCode();
    nfc_code.id = 1;
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
      paired_devices: [{ accuray: '15', major: 125, mior: 758, proximity: 'Near', rssi: '-69', tx: '10db', uuid: '51446-54564w-fwfffw4-56d4we5d1e5113d2e1' }],
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
    this.nativeAudio.play('alert')
    this.router.navigateByUrl('/show-alert', { replaceUrl: true })
    //this.sendEmergency();
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
