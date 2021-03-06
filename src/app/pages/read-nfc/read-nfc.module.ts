import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReadNFCPageRoutingModule } from './read-nfc-routing.module';
import { NFC,Ndef } from '@ionic-native/nfc/ngx'
import { ReadNFCPage } from './read-nfc.page';
import { MaterialModule } from '../../material-module'
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReadNFCPageRoutingModule,
    MaterialModule,
    TranslateModule.forChild()
  ],
  declarations: [ReadNFCPage],
  providers: [NFC,Ndef]
})
export class ReadNFCPageModule {}
