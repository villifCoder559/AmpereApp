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
  qrData = ''
  scannedCode = null;
  title = 'app';
  isOn = false;
  constructor(private changeRef: ChangeDetectorRef, private qrScanner: QRScanner, private base64ToGallery: Base64ToGallery, private toastCtrl: ToastController) {
  }
  scanCode() {
    this.qrScanner.prepare()
      .then((status: QRScannerStatus) => {
        if (status.authorized) {// camera permission was granted
          // start scanning
          // this.isOn = true;
          console.log('scanner ok')
          $("#content").hide(500, () => {
            this.qrScanner.show();
            this.qrScanner.scan().subscribe((text: string) => {
              console.log('camera')
              //  this.isOn = false;
              console.log(this.isOn);
              this.scannedCode = text;
              alert('Scanned something: ' + text);
              console.log(this.scannedCode)
              this.qrScanner.hide(); // hide camera preview
              this.qrScanner.destroy();
              this.changeRef.detectChanges();
              $("#content").show(500);
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
  downloadQR() {
    const canvas = document.querySelector('canvas') as HTMLCanvasElement;
    const imageData = canvas.toDataURL('image/jpeg').toString();
    console.log('data: ' + imageData)
    let data = imageData.split(',')[1];
    this.base64ToGallery.base64ToGallery(data, { prefix: '_img', mediaScanner: true })
      .then(async res => {
        let toast = await this.toastCtrl.create({
          header: 'QR Code saved in your PhotoLibrary',
          duration: 2000
        })
        toast.present();
      },
        err => console.log('err ' + err))
  }
  ngOnInit() {
  }

}
