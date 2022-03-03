import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { ReadQRPageRoutingModule } from './read-qr-routing.module';
import { ReadQRPage } from './read-qr.page';
import { MaterialModule } from '../../material-module'
import { QRScanner } from '@ionic-native/qr-scanner/ngx';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReadQRPageRoutingModule,
    MaterialModule
  ],
  declarations: [ReadQRPage],
  providers:[QRScanner,InAppBrowser]
})
export class ReadQRPageModule {}
