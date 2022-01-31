import { AuthenticationService } from './../../services/authentication.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Emergency_Contact, SharedDataService } from '../../data/shared-data.service'
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
    private ngsi: NGSIv2QUERYService
  ) { }

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
        this.authService.loginSnap4City().then(async (auth) => {
          console.log('IN')
          await loading.dismiss();
          console.log('end_auth')
          console.log(auth)
          if (auth) {
            //this.sharedData.enableAllBackgroundMode();
            this.ngsi.getEntity('AmpereUserProfile').then((data: any) => {
              console.log(data)
              this.sharedData.user_data.nickname = data.nickname
              this.sharedData.user_data.address = data.address
              this.sharedData.user_data.allergies = data.allergies
              this.sharedData.user_data.birthdate = data.dateofborn
              this.sharedData.user_data.city = data.city
              this.sharedData.user_data.description = data.description
              this.sharedData.user_data.disabilities = [data.visionImpaired, data.wheelchairUser]
              this.sharedData.user_data.email = data.email
              for (var i = 0; i < 5; i++) {
                var name = data['emergencyContact' + (i + 1) + 'Name'];
                var surname = data['emergencyContact' + (i + 1) + 'Surname'];
                var number = data['emergencyContact' + (i + 1) + 'Number'];
                if (name != '' && surname != '' && number.length != 0)
                  this.sharedData.user_data.emergency_contacts.push(new Emergency_Contact(name, surname, number))
              }
              for (var i = 0; i < 4; i++) {
                var qrcode = data['QR' + (i + 1)];
                var nfccode = data['NFC' + (i + 1)];
                if (qrcode != '')
                  this.sharedData.user_data.qr_code.push(qrcode)
                if (nfccode != '')
                  this.sharedData.user_data.nfc_code.push(nfccode)
              }
              this.sharedData.user_data.ethnicity = data.ethnicity
              this.sharedData.user_data.gender = data.gender
              this.sharedData.user_data.height = data.height
              this.sharedData.user_data.locality = data.locality
              this.sharedData.user_data.medications = data.medications
              this.sharedData.user_data.name = data.name
              this.sharedData.user_data.weight = data.weight
              this.sharedData.user_data.surname = data.surname
              this.sharedData.user_data.phoneNumber = data.PhoneNumber
              this.sharedData.user_data.public_emergency_contacts = { "112": data.call_113, "115": data.call_115, "118": data.call_118 }
              if (data.Jewel1ID != '')
                this.sharedData.user_data.paired_devices.push(data.Jewel1ID)
              if (data.Jewel2ID)
                this.sharedData.user_data.paired_devices.push(data.Jewel2ID)
              this.sharedData.user_data.pin = data.pin
              this.sharedData.user_data.purpose = data.purpose

              this.bluetoothService.enableAllUserBeaconFromSnap4City();
              this.router.navigateByUrl('/profile/menu/homepage', { replaceUrl: true });
            }, err => alert(err))
            this.sharedData.loadDataUser().then((result) => {
              console.log('result ' + result)

            });
          }
        }, async (err) => {
          console.log(err)
          await loading.dismiss()
        });
      } catch (e) {
        await loading.dismiss();
        alert((e as Error).message)
      }
    }
    else {
      this.authService.login(this.credentials.value).subscribe(
        async (res) => {
          this.sharedData.loadDataUser().then((result) => {
            console.log('result ' + result)
            this.bluetoothService.enableAllUserBeacon();
            this.router.navigateByUrl('/profile/menu/homepage', { replaceUrl: true });
          });
          await loading.dismiss();
        },
        async (res) => {
          await loading.dismiss();
          const alert = await this.alertController.create({
            header: 'Login failed',
            message: res.error.error,
            buttons: ['OK'],
          });
          await alert.present();
        }
      );
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
