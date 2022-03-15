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
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import { BackgroundMode } from '@awesome-cordova-plugins/background-mode/ngx';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { CountdownModule } from 'ngx-countdown';
import {LoginPageModule} from '../app/pages/login/login.module'
import {LoginPage} from '../app/pages/login/login.page'
import {SharedDataService} from '../app/data/shared-data.service'
import {NGSIv2QUERYService} from '../app/data/ngsiv2-query.service'
import {BluetoothService} from '../app/data/bluetooth.service'
import { IBeacon } from '@ionic-native/ibeacon/ngx'
import { BLE } from '@ionic-native/ble/ngx';
import { Snap4CityService } from '../app/data/snap4-city.service'
import { AuthenticationService } from '../app/services/authentication.service'
import { ReadingCodeService } from '../app/data/reading-code.service'
import { SendAuthService } from '../app/data/send-auth.service'
import { IonicStorageModule } from '@ionic/storage-angular';
import { FormsModule } from '@angular/forms';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { BackgroundFetch } from '@awesome-cordova-plugins/background-fetch/ngx';
import {Device} from '@awesome-cordova-plugins/device/ngx'
import {AndroidPermissions} from '@awesome-cordova-plugins/android-permissions/ngx'
import {ForegroundService} from '@awesome-cordova-plugins/foreground-service/ngx'
import {HTTP} from '@awesome-cordova-plugins/http/ngx'
import { LottieSplashScreen } from '@awesome-cordova-plugins/lottie-splash-screen/ngx';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, BrowserAnimationsModule,MatFormFieldModule,CountdownModule,LoginPageModule,FormsModule,
            IonicModule.forRoot(), AppRoutingModule,HttpClientModule,MaterialModule,IonicStorageModule.forRoot()
            ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    Contacts,
    LocationAccuracy,
    Geolocation,
    AndroidPermissions,
    LocalNotifications,
    BackgroundMode,
    NativeAudio,
    LoginPage,
    SharedDataService,
    NGSIv2QUERYService,
    BluetoothService,
    IBeacon,
    BLE,
    Snap4CityService,
    AuthenticationService,
    ReadingCodeService,
    SendAuthService,
    InAppBrowser,
    HTTP,
    BackgroundFetch,
    Device,
    ForegroundService,
    LottieSplashScreen
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
