import { Component, OnInit } from '@angular/core';
import { NFC, Ndef } from '@ionic-native/nfc/ngx'
import { Platform, ToastController } from '@ionic/angular';
@Component({
  selector: 'app-read-nfc',
  templateUrl: './read-nfc.page.html',
  styleUrls: ['./read-nfc.page.scss'],
})
export class ReadNFCPage implements OnInit {
  NFC_data = '';
  readMessage = '';
  NFC_enable = false;
  constructor(private toastCtrl: ToastController, private nfc: NFC, private ndef: Ndef, private platform: Platform) { }

  ngOnInit() {
    this.nfc.enabled().then(() => {
      this.NFC_enable = true;
    }, err => this.create_message('Error :' + err))
  }
  async read_NFC() {
    if (this.platform.is('android')) {
      let flags = this.nfc.FLAG_READER_NFC_A | this.nfc.FLAG_READER_NFC_V;
      var readerMode = this.nfc.readerMode(flags).subscribe(
        tag => {
          this.readMessage = JSON.stringify(tag)
          console.log(this.readMessage)
        },
        err => this.create_message('Error reading tag: ' + err)
      );
    }
    else if (this.platform.is('ios')) {
      try {
        let tag = await this.nfc.scanNdef();
        this.readMessage = JSON.stringify(tag);
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
  add_event() {
    this.nfc.addNdefListener(() => {
      this.read_NFC();
    }, err => this.create_message('Error ' + err));
  }
}
