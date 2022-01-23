import { Injectable, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, Platform, ToastController } from '@ionic/angular';
// import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
// import { Geolocation } from '@ionic-native/geolocation/ngx';
// import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { BackgroundMode } from '@awesome-cordova-plugins/background-mode/ngx';
// import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
// import { DeviceMotion, DeviceMotionAccelerationData } from '@ionic-native/device-motion/ngx';
import { CountdownConfig, CountdownModule } from 'ngx-countdown';
import { Storage } from '@ionic/storage-angular'
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CountdownModule
  ],
  providers: [
    NativeAudio, BackgroundMode]
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
  public user_data: UserData = new UserData();
  gps_enable = false;
  constructor(private storage: Storage, private toastCtrl: ToastController, private router: Router, private platform: Platform, private nativeAudio: NativeAudio) {
    console.log('contructor')
    this.storage.create();
    this.platform.ready().then(() => {
      this.nativeAudio.preloadSimple('alert', 'assets/sounds/alert.mp3').then(() => { }, (err) => console.log(err));
      this.nativeAudio.preloadSimple('sendData', 'assets/sounds/send_data.mp3').then(() => { }, (err) => console.log(err));
    })
  }
  getkeycloak() {

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
  saveData() {
    this.storage.set('user_data', this.user_data);
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
    this.user_data.address = 'Viale Morgagni 87'
    this.user_data.allergies = 'gluten'
    this.user_data.birthdate = '10/25/1947'
    this.user_data.city = 'Florence'
    this.user_data.description = 'brown hair blue eyes'
    this.user_data.disabilities = [false, true]
    this.user_data.email = 'email@mail.com'
    this.user_data.emergency_contacts = [{ number: '8541254732', name: 'Paul Rid' }]
    this.user_data.ethnicity = 'white'
    this.user_data.gender = 'male'
    this.user_data.height = '185'
    this.user_data.locality = 'Careggi'
    this.user_data.medications = ''
    this.user_data.name = 'Wayne'
    this.user_data.weight = '85'
    this.user_data.surname = 'Richards'
    this.user_data.phoneNumber = '2587436910'
    this.user_data.public_emergency_contacts = { 113: false, "115": false, "118": true }
    this.user_data.paired_devices = []
    this.user_data.password = ''
    this.user_data.pin = '0258'
    this.user_data.purpose = 'Personal safety'
    this.user_data.qr_code = [qr_code]
    this.user_data.nfc_code = [nfc_code]
    console.log('data from service')
    console.log(this.user_data)
    this.storage.get('user_data').then((storageData) => {
      if (storageData != null) {
        this.user_data = storageData;
        console.log(storageData)
      }
    });
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
    // this.backgroundMode.enable();
    // this.backgroundMode.overrideBackButton();
    // this.backgroundMode.disableWebViewOptimizations();
  }
  disableBackgaundMode() {
    // this.backgroundMode.disable();
  }
}
