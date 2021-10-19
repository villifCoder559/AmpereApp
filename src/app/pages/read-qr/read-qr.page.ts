import { Component, OnInit } from '@angular/core';
import { Base64ToGallery } from '@ionic-native/base64-to-gallery/ngx';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
import { ToastController } from '@ionic/angular';
import * as $ from "jquery";
import { ChangeDetectorRef } from '@angular/core';

/* QR-Code has 3 fields:{"description":"","link":"","code":""} */

@Component({
  selector: 'app-read-qr',
  templateUrl: './read-qr.page.html',
  styleUrls: ['./read-qr.page.scss'],
})
export class ReadQRPage implements OnInit {
  previewCamera = false;
  qrData = ''
  scannedCode = null;
  title = 'app';
  isOn = false;
  constructor(private changeRef: ChangeDetectorRef, private qrScanner: QRScanner,  private toastCtrl: ToastController) {
    document.addEventListener('ionBackButton', (ev) => {
      //console.log(ev)
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
    this.qrScanner.prepare()
      .then((status: QRScannerStatus) => {
        if (status.authorized) {// camera permission was granted
          // start scanning
          // this.isOn = true;
          console.log('scanner ok')
          $("ion-app").hide(500, () => {
            this.qrScanner.show();
            this.previewCamera = true;
            this.qrScanner.scan().subscribe((text: string) => {
              console.log('camera')
              console.log(this.isOn);
              this.scannedCode = text;
              alert('Scanned something: ' + text);
              console.log(this.scannedCode)
              this.closePreviewCamera();
              this.changeRef.detectChanges();
              $("ion-app").show(500);
            });
          })
        } else if (status.denied) {
          this.qrScanner.openSettings()
          // camera permission was permanently denied
          // you must use QRScanner.openSettings() method to guide the user to the settings page
          // then they can grant the permission from there
        } else {
          // permission was denied, but not permanently. You can ask for permission again at a later time.
        }
      })
      .catch((e: any) => console.log('Error is', e));
  }
  ngOnInit() {
  }

}
