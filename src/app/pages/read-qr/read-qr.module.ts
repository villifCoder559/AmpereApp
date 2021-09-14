import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReadQRPageRoutingModule } from './read-qr-routing.module';
import { ReadQRPage } from './read-qr.page';
import { MaterialModule } from '../../material-module'
import { QRScanner } from '@ionic-native/qr-scanner/ngx';
import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';
import { Base64ToGallery } from '@ionic-native/base64-to-gallery/ngx';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReadQRPageRoutingModule,
    MaterialModule,
    NgxQRCodeModule
  ],
  declarations: [ReadQRPage],
  providers:[QRScanner,Base64ToGallery]
})
export class ReadQRPageModule {}
