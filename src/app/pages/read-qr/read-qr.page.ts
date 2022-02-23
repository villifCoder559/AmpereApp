import { Component, OnInit } from '@angular/core';
import { Base64ToGallery } from '@ionic-native/base64-to-gallery/ngx';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
import { ToastController } from '@ionic/angular';
import * as $ from "jquery";
import { ChangeDetectorRef } from '@angular/core';
import { DeviceType, QRNFCEvent, SharedDataService, StorageNameType, typeChecking } from 'src/app/data/shared-data.service';
import { NGSIv2QUERYService } from 'src/app/data/ngsiv2-query.service'
import { LoadingController } from '@ionic/angular';
import { Snap4CityService } from 'src/app/data/snap4-city.service';
import { ReadingCodeService } from 'src/app/data/reading-code.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogModifyNameComponent } from '../signup/dialog-modify-name/dialog-modify-name.component';
/* QR-Code has 3 fields:{"description":"","link":"","code":""} */

@Component({
  selector: 'app-read-qr',
  templateUrl: './read-qr.page.html',
  styleUrls: ['./read-qr.page.scss'],
})
export class ReadQRPage implements OnInit {
  StorageNameType=StorageNameType
  previewCamera = false;
  qrData = ''
  scannedCode = null;
  title = 'app';
  isOn = false;
  constructor(private changeDetection: ChangeDetectorRef, public dialog: MatDialog, private readCode: ReadingCodeService, public shared_data: SharedDataService, private NGSIv2Query: NGSIv2QUERYService, private changeRef: ChangeDetectorRef, private qrScanner: QRScanner) {
    document.addEventListener('ionBackButton', (ev) => {
      if (this.previewCamera) {
        console.log('backbutton');
        this.closePreviewCamera();
        $("ion-app").show(500);
      }
    })
  }
  closePreviewCamera() {
    this.previewCamera = false;
    this.qrScanner.hide();
    this.qrScanner.destroy();
  }
  scanCode() {
    //return new Promise((resolve, reject) => {
    this.qrScanner.prepare().then((status: QRScannerStatus) => {
      if (status.authorized) {// camera permission was granted
        // start scanning
        // this.isOn = true;
        console.log('scanner ok')
        $("ion-app").hide(500, () => {
          this.qrScanner.show();
          this.previewCamera = true;
          this.qrScanner.scan().subscribe((text: string) => {
            this.closePreviewCamera();
            this.changeRef.detectChanges();
            $("ion-app").show(500);
            this.shared_data.presentLoading('Getting info from server').then(() => {
              this.readCode.readURLFromServer(text, typeChecking.QR_CODE).then(() => {
                this.shared_data.createToast('QR scanned succesfully')
                this.shared_data.dismissLoading();
              }, err => {
                this.shared_data.createToast(err?.msg)
                this.shared_data.dismissLoading();
              })
            })
          });
        })
      } else if (status.denied) {
        this.qrScanner.openSettings()
        // camera permission was permanently denied
        // you must use QRScanner.openSettings() method to guide the user to the settings page
        // then they can grant the permission from there
      } else {
        // permission was denied, but not permanently. You can ask for permission again at a later time.
        alert('Grant the permission')
      }
    }).catch((e: any) => alert('Error is ' + e));
    //})

  }
  modifyNameDevice(i) {
    const dialogRef = this.dialog.open(DialogModifyNameComponent, {
      maxWidth: '90vw',
      minWidth: '40vw',
      data: {
        id: this.shared_data.user_data.qr_code[i],
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
