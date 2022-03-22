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
import { DeviceMotion } from '@awesome-cordova-plugins/device-motion/ngx'
import { LocalNotifications } from '@ionic-native/local-notifications/ngx'
import { NativeAudio } from '@ionic-native/native-audio/ngx'
import { BackgroundGeolocation} from '@awesome-cordova-plugins/background-geolocation/ngx'
import {TourMatMenuModule} from 'ngx-ui-tour-md-menu'
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShowAlertPageRoutingModule,
    MaterialModule,
    CountdownModule,
    TourMatMenuModule,
    TranslateModule.forChild()

  ],
  declarations: [ShowAlertPage],
  providers: [
    LocationAccuracy,
    Geolocation,
    AndroidPermissions,
    SMS,
    DeviceMotion,
    LocalNotifications,
    NativeAudio,
    BackgroundGeolocation
  ]
})
export class ShowAlertPageModule { }
