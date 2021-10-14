import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ShowAlertPageRoutingModule } from './show-alert-routing.module';
import { CountdownModule } from 'ngx-countdown';
import { ShowAlertPage } from './show-alert.page';
import { MaterialModule } from '../material-module';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { SMS } from '@ionic-native/sms/ngx';
import { DeviceMotion } from '@ionic-native/device-motion/ngx'
import { LocalNotifications } from '@ionic-native/local-notifications/ngx'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShowAlertPageRoutingModule,
    MaterialModule,
    CountdownModule
  ],
  declarations: [ShowAlertPage],
  providers: [
    LocationAccuracy,
    Geolocation,
    AndroidPermissions,
    SMS,
    DeviceMotion,
    LocalNotifications
  ]
})
export class ShowAlertPageModule { }
