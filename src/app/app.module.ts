import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import {Contacts} from '@ionic-native/contacts'
import {MaterialModule} from '../app/material-module';
//import { ShowAlertPage } from '../app/show-alert/show-alert.page'
//import { ShowAlertPageModule } from '../app/show-alert/show-alert.module'
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { DeviceMotion, DeviceMotionAccelerationData } from '@ionic-native/device-motion/ngx';
import { CountdownModule } from 'ngx-countdown';
import {LoginPageModule} from '../app/pages/login/login.module'
import {LoginPage} from '../app/pages/login/login.page'
import {SharedDataService} from '../app/data/shared-data.service'
import {NGSIv2QUERYService} from '../app/data/ngsiv2-query.service'
import {BluetoothService} from '../app/data/bluetooth.service'
@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, BrowserAnimationsModule,MatFormFieldModule,CountdownModule,LoginPageModule,
            IonicModule.forRoot(), AppRoutingModule,HttpClientModule,MaterialModule
            ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    Contacts,
    LocationAccuracy,
    Geolocation,
    AndroidPermissions,
    LocalNotifications,
    BackgroundMode,
    DeviceMotion,
    NativeAudio,
    LoginPage,
    SharedDataService,
    NGSIv2QUERYService,
    BluetoothService
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
