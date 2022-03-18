import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { ReadQRPageRoutingModule } from './read-qr-routing.module';
import { ReadQRPage } from './read-qr.page';
import { MaterialModule } from '../../material-module'
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReadQRPageRoutingModule,
    MaterialModule
  ],
  declarations: [ReadQRPage],
  providers:[BarcodeScanner,InAppBrowser]
})
export class ReadQRPageModule {}
