import { Component, OnInit } from '@angular/core';
import { NFC, Ndef } from '@ionic-native/nfc/ngx'
import { Platform, ToastController } from '@ionic/angular';
import { NFCCode, SharedDataService } from 'src/app/data/shared-data.service';
import { Entity, NGSIv2QUERYService } from 'src/app/data/ngsiv2-query.service';

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
  constructor(private NGSIv2Query: NGSIv2QUERYService, public shared_data: SharedDataService, private toastCtrl: ToastController, private nfc: NFC, private ndef: Ndef, private platform: Platform) {
    console.log(this.shared_data.user_data)
  }
  addNFC() {
    if (this.shared_data.user_data.nfc_code.length < 4)
      this.NGSIv2Query.getEntity(Entity.NFC)
  }
  ngOnInit() {
    this.nfc.enabled().then(() => {
      this.NFC_enable = true;
      this.read_NFC();
    }, err => this.create_message('Error :' + err))
  }
  async read_NFC() {
    if (this.platform.is('android')) {
      let flags = this.nfc.FLAG_READER_NFC_A | this.nfc.FLAG_READER_NFC_V;
      var readerMode = this.nfc.readerMode(flags).subscribe(
        tag => {
          console.log(tag)
          this.scannedCode = JSON.stringify(tag)
          window.open(tag.ndefMessage.toString())
          console.log(this.scannedCode)
        },
        err => this.create_message('Error reading tag: ' + err)
      );
    }
    else if (this.platform.is('ios')) {
      try {
        let tag = await this.nfc.scanNdef();
        this.scannedCode = JSON.stringify(tag);
      } catch (err) {
        alert('Error reading tag ' + err);
      }
    }
  }

  async create_message(txt: string) {
    let toast = await this.toastCtrl.create({
      header: txt,
      duration: 2000
    })
    toast.present();
  }
  delete(device, index) {
    console.log('delete pos ' + index + " -> " + device.id)
    $('#item' + index).hide(400, () => {
      this.shared_data.user_data.nfc_code.splice(index, 1);
      console.log(this.shared_data.user_data)
    })
  }
  ngOnDestroy() {

  }
}
