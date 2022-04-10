import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule,HttpClient } from '@angular/common/http';
import {Contacts} from '@ionic-native/contacts'
import {MaterialModule} from '../app/material-module';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
//import { BackgroundMode } from '@awesome-cordova-plugins/background-mode/ngx';
//import BackgroundMode from 'cordova-plugin-advanced-background-mode';
import { LocalNotifications } from '@awesome-cordova-plugins/local-notifications/ngx';
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
import { SwiperModule } from 'swiper/angular'
import { Network } from '@awesome-cordova-plugins/network/ngx'
import {TourMatMenuModule,TourService} from 'ngx-ui-tour-md-menu'
import {TranslateModule,TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {LanguageService} from '../app/data/language.service'
import {EmergencyService} from '../app/data/emergency.service'
import { BackgroundGeolocation, BackgroundGeolocationConfig } from '@awesome-cordova-plugins/background-geolocation/ngx';
import { DeviceMotion, DeviceMotionAccelerationData } from '@awesome-cordova-plugins/device-motion/ngx';
import {StorageService} from './data/storage.service'
export function createTranslateLoader(http:HttpClient){
  return new TranslateHttpLoader(http,'assets/i18n/',".json");
}
@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule,HttpClientModule, BrowserAnimationsModule,MatFormFieldModule,CountdownModule,LoginPageModule,FormsModule,SwiperModule,
            TranslateModule.forRoot({
              loader:{
                provide:TranslateLoader,
                useFactory:(createTranslateLoader),
                deps:[HttpClient]
              }
            }),IonicModule.forRoot(),TourMatMenuModule.forRoot() ,AppRoutingModule,HttpClientModule,MaterialModule,IonicStorageModule.forRoot()
            ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    Contacts,
    LocationAccuracy,
    Geolocation,
    AndroidPermissions,
    LocalNotifications,
    //BackgroundMode,
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
    LottieSplashScreen,
    Storage,
    Network,
    TourService,
    LanguageService,
    EmergencyService,
    BackgroundGeolocation,
    DeviceMotion,
    StorageService
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
