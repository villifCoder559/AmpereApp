import { Component, OnInit } from '@angular/core';
import { NFC, Ndef } from '@ionic-native/nfc/ngx'
import { Platform, ToastController } from '@ionic/angular';
import { DeviceType, QRNFCEvent, SharedDataService, typeChecking } from 'src/app/data/shared-data.service';
import { NGSIv2QUERYService } from 'src/app/data/ngsiv2-query.service';
import { Snap4CityService } from 'src/app/data/snap4-city.service';
import { LoadingController } from '@ionic/angular';
import { ReadingCodeService } from 'src/app/data/reading-code.service';

@Component({
  selector: 'app-read-nfc',
  templateUrl: './read-nfc.page.html',
  styleUrls: ['./read-nfc.page.scss'],
  providers: [NGSIv2QUERYService]
})
export class ReadNFCPage implements OnInit {
  NFC_data = '';
  NFC_enable = false;
  scannedCode = null;
  constructor(private readCode: ReadingCodeService, public sharedData: SharedDataService,  private nfc: NFC,  private platform: Platform) {
    console.log(this.sharedData.user_data)
  }
  ngOnInit() {
    this.nfc.enabled().then(() => {
      this.NFC_enable = true;
      this.read_NFC();
    }, err => this.sharedData.createToast('Error :' + err))
  }
  async read_NFC() {
    if (this.platform.is('android')) {
      let flags = this.nfc.FLAG_READER_NFC_A | this.nfc.FLAG_READER_NFC_V;
      var readerMode = this.nfc.readerMode(flags).subscribe(
        tag => {
          var text = this.nfc.bytesToString(tag.ndefMessage[0].payload).substring(3);
          console.log(text);
          this.sharedData.presentLoading('Getting info from server').then(() => {
            this.readCode.readURLFromServer(text, typeChecking.NFC_CODE).then(() => {
              this.sharedData.createToast('QR scanned succesfully')
              this.sharedData.dismissLoading();
            }, err => {
              this.sharedData.createToast(err?.msg)
              this.sharedData.dismissLoading();
            })
          })
        },
        err => this.sharedData.createToast('Error reading tag: ' + err)
      );
    }
  }
  ngOnDestroy(){
    this.nfc.close()
  }
}
