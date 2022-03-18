import { AuthenticationService } from './../../services/authentication.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { DeviceType, SharedDataService, StorageNameType } from '../../data/shared-data.service'
import * as Keycloak from 'keycloak-ionic/keycloak';
import { BluetoothService } from 'src/app/data/bluetooth.service';
import { NGSIv2QUERYService } from 'src/app/data/ngsiv2-query.service';
import { SendAuthService } from 'src/app/data/send-auth.service';
import { Storage } from '@ionic/storage-angular';
import { Network } from '@awesome-cordova-plugins/network/ngx'
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  credentials: FormGroup;
  public keycloak: Keycloak.KeycloakInstance;
  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private sharedData: SharedDataService,
    private toastCtrl: ToastController,
    private bluetoothService: BluetoothService,
    private ngsi: NGSIv2QUERYService,
    private sendAuth: SendAuthService,
    private storage: Storage,
    private network:Network) {}

  ngOnInit() {
    this.storage.create().then(()=>{
      this.storage.get('tutorial_read').then((read)=>{
        if (read != true)
        this.router.navigateByUrl('/tutorial', { replaceUrl: true })
      })
    },err=>console.log(err))
    this.network.onDisconnect().subscribe(()=>{
      alert('This app needs internet connection, enable it!');
    })
  }
  registration() {
    this.router.navigateByUrl('/registration-s4c', { replaceUrl: true })
  }
  openTutorial() {
    this.router.navigateByUrl('/tutorial', { replaceUrl: true })
  }
  loginTest() {
    this.authService.isAuthenticated.next(true);
    this.sharedData.user_data.id = 'ampereuser1'
    this.router.navigateByUrl('/profile/menu/homepage', { replaceUrl: true })
  }
  async login() {
    await this.sharedData.presentLoading('Checking data...');
    try {
      this.authService.loginSnap4City().then((auth) => {
        if (auth) {
          this.sharedData.accessToken = this.authService.keycloak.token;
          this.authService.keycloak.loadUserProfile().then((data) => {
            this.sharedData.user_data.id = data.username;
            this.ngsi.getEntity(this.sharedData.user_data.id + DeviceType.PROFILE, DeviceType.PROFILE).then((data: any) => {
              this.authService.isAuthenticated.next(true);
              //this.sendAuth.checkAndRequestValidToken();
              console.log('SetUsertValueFromData')
              this.sharedData.setUserValueFromData(data)
              console.log('ENABLE_ALL_BEACON')
              this.bluetoothService.enableAllBeaconFromSnap4City();
              console.log('END_ENABLE_BEACON')
              console.log('Start_Sendig_Valid_Status')
              this.sendAuth.startSendingValidStatus()
              Object.keys(this.sharedData.localStorage).forEach((element: StorageNameType) => {
                this.sharedData.getNameDevices(element);
              })
              this.router.navigateByUrl('/profile/menu/homepage', { replaceUrl: true }).then(() => {
                this.sharedData.dismissLoading();
              })
              console.log('END_ROUTER')
            }, err => {
              console.log(err)
              if (err.status == '401' || err.status == '404') {
                this.router.navigateByUrl('/signup', { replaceUrl: true })
                this.sharedData.dismissLoading();
              }
            })
          }, err => alert(err));
        }
      }, async (err) => {
        console.log(err)
        alert(err === undefined ? 'Check your internet connection' : err)
        await this.sharedData.dismissLoading();
      });
    } catch (e) {
      await this.sharedData.dismissLoading();
      alert((e as Error).message)
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
