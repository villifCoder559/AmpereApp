import { Component, OnInit } from '@angular/core';
import * as $ from "jquery";
import { ChangeDetectorRef } from '@angular/core';
import { SharedDataService, StorageNameType, typeChecking } from 'src/app/data/shared-data.service';
import { NGSIv2QUERYService } from 'src/app/data/ngsiv2-query.service'
import { ReadingCodeService } from 'src/app/data/reading-code.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogModifyNameComponent } from '../signup/dialog-modify-name/dialog-modify-name.component';
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-read-qr',
  templateUrl: './read-qr.page.html',
  styleUrls: ['./read-qr.page.scss'],
})
export class ReadQRPage implements OnInit {
  StorageNameType = StorageNameType
  previewCamera = false;
  qrData = ''
  scannedCode = null;
  title = 'app';
  isOn = false;
  eventBackButton;
  constructor(private translate: TranslateService, private changeDetection: ChangeDetectorRef, public dialog: MatDialog, private readCode: ReadingCodeService, public shared_data: SharedDataService, private NGSIv2Query: NGSIv2QUERYService, private changeRef: ChangeDetectorRef, private qrScanner: BarcodeScanner) {
  }
  testQR(){
    this.readCode.readURLFromServer('pluto12345',typeChecking.QR_CODE).then((response)=>{
      console.log(response)
    },err=>console.log(err))
  }
  scanCode() {
    this.qrScanner.scan().then((element) => {
      //this.closePreviewCamera();
      //this.changeRef.detectChanges();
      $("ion-app").show(500);
      console.log(element)
      console.log(element!=undefined)
      if (element != undefined)
        this.shared_data.presentLoading(this.translate.instant('ALERT.get_info_from_server')).then(() => {
          this.readCode.readURLFromServer(element.text, typeChecking.QR_CODE).then(() => {
            //this.shared_data.createToast('ALERT.qr_scan')
            this.shared_data.dismissLoading();
          }, err => {
            this.shared_data.createToast(err?.msg)
            this.shared_data.dismissLoading();
          })
        })
    }, err => console.log(err));
  }
  modifyNameDevice(i) {
    const dialogRef = this.dialog.open(DialogModifyNameComponent, {
      maxWidth: '90vw',
      minWidth: '40vw',
      data: {
        id: this.shared_data.user_data.qr_code[i].identifier,
        name: '',
      }
    })
    dialogRef.afterClosed().subscribe(result => {
      console.log(result)
      this.shared_data.setNameDevice(result.value.id, StorageNameType.QR_CODE, result.value.name);
      const slidingItem = document.getElementById('slidingItem' + i) as any;
      slidingItem.close();
      this.changeDetection.detectChanges();
    });
  }
  ngOnInit() {
  }
}
