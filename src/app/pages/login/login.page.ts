import { AuthenticationService } from './../../services/authentication.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { DeviceType, Emergency_Contact, SharedDataService } from '../../data/shared-data.service'
import * as Keycloak from 'keycloak-ionic/keycloak';
import { BluetoothService } from 'src/app/data/bluetooth.service';
import { NGSIv2QUERYService } from 'src/app/data/ngsiv2-query.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  credentials: FormGroup;
  public keycloak: Keycloak.KeycloakInstance;
  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private alertController: AlertController,
    private router: Router,
    private loadingController: LoadingController,
    private sharedData: SharedDataService,
    private toastCtrl: ToastController,
    private bluetoothService: BluetoothService,
    private ngsi: NGSIv2QUERYService) { }

  ngOnInit() {
    this.credentials = this.fb.group({
      email: ['eve.holt@reqres.in', [Validators.required, Validators.email]],
      password: ['cityslickas', [Validators.required, Validators.minLength(6)]],
    });
  }

  async login(platform) {
    console.log(platform)
    const loading = await this.loadingController.create();
    console.log('LOAD DATA USER')
    //this.sharedData.loadDataUser();
    await loading.present();
    if (platform == 'snap4city') {
      try {
        this.authService.loginSnap4City().then((auth) => {
          console.log('IN')
          loading.dismiss();
          console.log('end_auth')
          console.log(auth)
          if (auth) {
            //this.sharedData.enableAllBackgroundMode();
            this.ngsi.getEntity(DeviceType.PROFILE, DeviceType.PROFILE).then((data: any) => {
              this.authService.isAuthenticated.next(true);
              this.sharedData.user_data.nickname = data.nickname.value
              this.sharedData.user_data.address = data.address.value
              this.sharedData.user_data.allergies = data.allergies.value
              this.sharedData.user_data.dateofborn = data.dateofborn.value
              this.sharedData.user_data.city = data.city.value
              this.sharedData.user_data.description = data.description.value
              this.sharedData.user_data.disabilities.visionImpaired = data.visionImpaired.value
              this.sharedData.user_data.disabilities.wheelchairUser = data.wheelchairUser.value
              this.sharedData.user_data.email = data.email.value
              this.sharedData.user_data.ethnicity = data.ethnicity.value
              this.sharedData.user_data.gender = data.gender.value
              this.sharedData.user_data.height = data.height.value
              this.sharedData.user_data.locality = data.locality.value
              this.sharedData.user_data.medications = data.medications.value
              this.sharedData.user_data.name = data.name.value
              this.sharedData.user_data.weight = data.weight.value
              this.sharedData.user_data.surname = data.surname.value
              this.sharedData.user_data.phoneNumber = data.phoneNumber.value
              this.sharedData.user_data.status = data.status.value
              this.sharedData.user_data.pin = data.pin.value
              this.sharedData.user_data.purpose = data.purpose.value
              this.sharedData.user_data.public_emergency_contacts = { 112: data.call_112.value, 115: data.call_115.value, 118: data.call_118.value }
              if (data.jewel1ID.value != '')
                this.sharedData.user_data.paired_devices.push(data.jewel1ID.value)
              if (data.jewel2ID.value != '')
                this.sharedData.user_data.paired_devices.push(data.jewel2ID.value)
              for (var i = 0; i < 5; i++) {
                var name = data['emergencyContact' + (i + 1) + 'Name'];
                var surname = data['emergencyContact' + (i + 1) + 'Surname'];
                var number = data['emergencyContact' + (i + 1) + 'Number'];
                console.log('contact ' + i);
                console.log(name + surname + number)
                if (name != '' && surname != '' && number != '')
                  this.sharedData.user_data.emergency_contacts.push(new Emergency_Contact(name, surname, number))
              }
              for (var i = 0; i < 4; i++) {
                var qrcode = data['QR' + (i + 1)].value;
                if (qrcode != '')
                  this.sharedData.user_data.qr_code.push(qrcode)
              }
              for (var i = 0; i < 4; i++) {
                var nfccode = data['NFC' + (i + 1)].value;
                if (nfccode != '')
                  this.sharedData.user_data.nfc_code.push(nfccode)
              }
              this.sharedData.old_user_data = JSON.parse(JSON.stringify(this.sharedData.user_data))
              //this.bluetoothService.enableAllUserBeaconFromSnap4City();
              this.router.navigateByUrl('/profile/menu/homepage', { replaceUrl: true });
            }, err => {
              console.log(err)
              if (err.status == '401' || err.status == '404') {
                this.router.navigateByUrl('/signup', { replaceUrl: true })
              }
            })
            // this.sharedData.loadDataUser(true).then((result) => {
            //   console.log('result ' + result)
            // });
          }
        }, async (err) => {
          console.log('Orrore ' + err)
          await loading.dismiss()
        });
      } catch (e) {
        await loading.dismiss();
        alert((e as Error).message)
      }
    }
    else {
      this.sharedData.loadDataUser(true).then(async (result) => {
        console.log('result ' + result)
        this.authService.isAuthenticated.next(true)
        this.bluetoothService.enableAllUserBeacon();
        this.router.navigateByUrl('/profile/menu/homepage', { replaceUrl: true });
        await loading.dismiss();
      })
    }
  }
  // Easy access for form fields
  get email() {
    return this.credentials.get('email');
  }

  get password() {
    return this.credentials.get('password');
  }
  go_to_signup() {
    this.router.navigateByUrl('/signup');
  }
  async go_to_forgot_psw() {
    if (this.email.hasError('email'))
      this.show_toast('Insert valid email in the field');
    else if (this.email.hasError('required'))
      this.show_toast('Email field is required');
    else {
      const alert = await this.alertController.create({
        header: 'To reset your password follow the instructions sent to your email',
        buttons: ['OK'],
      });
      await alert.present();
    }
  }
  async show_toast(txt) {
    let toast = this.toastCtrl.create({
      header: txt,
      duration: 2500
    })
      ; (await toast).present();
  }
}
