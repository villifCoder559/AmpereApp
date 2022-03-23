import { AuthenticationService } from './../../services/authentication.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { PopoverController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { DeviceType, SharedDataService, StorageNameType } from '../../data/shared-data.service'
import * as Keycloak from 'keycloak-ionic/keycloak';
import { BluetoothService } from 'src/app/data/bluetooth.service';
import { NGSIv2QUERYService } from 'src/app/data/ngsiv2-query.service';
import { SendAuthService } from 'src/app/data/send-auth.service';
import { Storage } from '@ionic/storage-angular';
import { Network } from '@awesome-cordova-plugins/network/ngx'
import { LanguagePopoverPage } from './language-popover/language-popover.page';
import { LanguageService } from 'src/app/data/language.service';
import { TranslateService } from '@ngx-translate/core';
import { Snap4CityService } from 'src/app/data/snap4-city.service';

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
    private popoverCtrl: PopoverController,
    private network: Network,
    public lng: LanguageService,
    private translate: TranslateService,
    private s4c: Snap4CityService) {
  }

  ngOnInit() {
    //this.language.setInitialAppLanguage().then(()=>console.log('FinishLoad'))
  }
  ionViewDidEnter() {
    console.log('LANGUAGE')
    console.log(this.lng.selected)
    this.storage.create().then(() => {
      this.storage.get('tutorial_read').then((read) => {
        if (read != true)
          this.router.navigateByUrl('/tutorial', { replaceUrl: true })
      })
    }, err => console.log(err))
    this.network.onDisconnect().subscribe(() => {
      alert(this.translate.instant('ALERT.internet_permission'));
    })
  }
  async openLanguagePopover(ev) {
    const popover = await this.popoverCtrl.create({
      component: LanguagePopoverPage,
      event: ev
    })
    await popover.present()
  }
  registration() {
    this.router.navigateByUrl('/registration-s4c', { replaceUrl: true })
  }
  openTutorial() {
    this.router.navigateByUrl('/tutorial', { replaceUrl: true })
  }
  loginTest() {
    this.authService.isAuthenticated.next(true);
    this.sharedData.user_data.uuid = 'ampereuser1'
    this.router.navigateByUrl('/profile/menu/homepage', { replaceUrl: true })
  }
  async login() {
    await this.sharedData.presentLoading(this.translate.instant('ALERT.check_data'));
    try {
      this.authService.loginSnap4City().then((auth) => {
        if (auth) {
          this.sharedData.accessToken = this.authService.keycloak.token;
          this.authService.keycloak.loadUserProfile().then((data) => {
            //this.sharedData.user_data.uuid = data.username;
            console.log('Getting devices....')
            this.ngsi.getOwnDevices().then((devices: any) => {
              console.log('GET_OWN_DEVICES')
              console.log(devices);
              if (devices.length == 3) {
                var index = devices.findIndex((item) => item.model == DeviceType.PROFILE)
                console.log(index)
                this.ngsi.getEntity(devices[index].id, DeviceType.PROFILE).then((data) => {
                  this.authService.isAuthenticated.next(true);
                  console.log('SetUsertValueFromData')
                  this.sharedData.setUserValueFromData(data);
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
                }, err => alert(err))
              }
              else {
                if (devices.length == 0 || devices == null) {
                  this.router.navigateByUrl('/signup', { replaceUrl: true })
                  this.sharedData.dismissLoading();
                }
                else {
                  this.sharedData.setTextLoading(this.translate.instant('ALERT.fixing_problems'))
                  let count = 1;
                  devices.forEach(element => {
                    this.sharedData.setTextLoading(this.translate.instant('ALERT.fixing_problems') +' '+ (count++) + '/' + devices.length)
                    this.s4c.deleteDevice(element.id).catch(() => { alert(this.translate.instant('ALERT.general_error')); this.sharedData.dismissLoading() })
                  });
                  this.sharedData.dismissLoading();
                }
              }
            }, err => {
              console.log(err)
              alert(this.translate.instant('ALERT.generic_error') + ': ' + err?.configuration);
              this.sharedData.dismissLoading();
            })
          }, err => alert(err));
        }
      }, async (err) => {
        console.log('ERR_SNAP4City')
        console.log(err)
        alert(err === undefined ? this.translate.instant('ALERT.internet_connection_fail') : err)
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
