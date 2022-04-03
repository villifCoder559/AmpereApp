import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomepagePageRoutingModule } from './homepage-routing.module';

import { HomepagePage } from './homepage.page';
import { MaterialModule } from '../../material-module'
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
//import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { LocalNotifications } from '@awesome-cordova-plugins/local-notifications/ngx';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';
import { BackgroundGeolocation} from '@awesome-cordova-plugins/background-geolocation/ngx'
import {TourMatMenuModule} from 'ngx-ui-tour-md-menu'
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomepagePageRoutingModule,
    MaterialModule,
    TourMatMenuModule,
    TranslateModule.forChild()
  ],
  declarations: [HomepagePage],
  providers: [
    LocationAccuracy,
    Geolocation,
    AndroidPermissions,
    LocalNotifications,
    BackgroundGeolocation
  ]
})
export class HomepagePageModule { }
