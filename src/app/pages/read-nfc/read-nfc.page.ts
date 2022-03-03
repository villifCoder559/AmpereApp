import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NFC } from '@ionic-native/nfc/ngx'
import { Platform } from '@ionic/angular';
import { SharedDataService, StorageNameType, typeChecking } from 'src/app/data/shared-data.service';
import { ReadingCodeService } from 'src/app/data/reading-code.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogModifyNameComponent } from '../signup/dialog-modify-name/dialog-modify-name.component';

@Component({
  selector: 'app-read-nfc',
  templateUrl: './read-nfc.page.html',
  styleUrls: ['./read-nfc.page.scss'],
  providers: []
})
export class ReadNFCPage implements OnInit {
  StorageNameType = StorageNameType
  NFC_data = '';
  NFC_enable = false;
  scannedCode = null;
  constructor(private changeDetection: ChangeDetectorRef, public dialog: MatDialog, private readCode: ReadingCodeService, public shared_data: SharedDataService, private nfc: NFC, private platform: Platform) {
    console.log(this.shared_data.user_data)
    console.log(this.shared_data.localStorage)
  }
  ngOnInit() {
    this.nfc.enabled().then(() => {
      this.NFC_enable = true;
      this.read_NFC();
    }, err => this.shared_data.createToast('Error :' + err))
  }
  async read_NFC() {
    if (this.platform.is('android')) {
      let flags = this.nfc.FLAG_READER_NFC_A | this.nfc.FLAG_READER_NFC_V;
      var readerMode = this.nfc.readerMode(flags).subscribe(
        tag => {
          var text = this.nfc.bytesToString(tag.ndefMessage[0].payload).substring(3);
          console.log(text);
          this.shared_data.presentLoading('Getting info from server').then(() => {
            this.readCode.readURLFromServer(text, typeChecking.NFC_CODE).then(() => {
              this.shared_data.createToast('QR scanned succesfully')
              this.shared_data.dismissLoading();
            }, err => {
              this.shared_data.createToast(err?.msg)
              this.shared_data.dismissLoading();
            })
          })
        },
        err => this.shared_data.createToast('Error reading tag: ' + err)
      );
    }
  }
  modifyNameDevice(i) {
    const dialogRef = this.dialog.open(DialogModifyNameComponent, {
      maxWidth: '90vw',
      minWidth: '40vw',
      data: {
        id: this.shared_data.user_data.nfc_code[i],
        name: '',
      }
    })
    dialogRef.afterClosed().subscribe(result => {
      console.log(result)
      this.shared_data.setNameDevice(result.value.id, StorageNameType.NFC_CODE, result.value.name);
      const slidingItem = document.getElementById('slidingItem' + i) as any;
      slidingItem.close();
      this.changeDetection.detectChanges();
    });
  }
  ngOnDestroy() {
    this.nfc.close().catch(err => console.log(err))
  }
}
