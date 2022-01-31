import { Component, OnInit } from '@angular/core';
import { Base64ToGallery } from '@ionic-native/base64-to-gallery/ngx';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
import { ToastController } from '@ionic/angular';
import * as $ from "jquery";
import { ChangeDetectorRef } from '@angular/core';
import { SharedDataService } from 'src/app/data/shared-data.service';
import { NGSIv2QUERYService, Entity } from 'src/app/data/ngsiv2-query.service'
import { AuthenticationService } from 'src/app/services/authentication.service';
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
  constructor(private authService: AuthenticationService, public sharedData: SharedDataService, private NGSIv2Query: NGSIv2QUERYService, private changeRef: ChangeDetectorRef, private qrScanner: QRScanner, private toastCtrl: ToastController) {
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
    return new Promise((resolve, reject) => {
      this.qrScanner.prepare().then((status: QRScannerStatus) => {
        if (status.authorized) {// camera permission was granted
          // start scanning
          // this.isOn = true;
          console.log('scanner ok')
          $("ion-app").hide(500, () => {
            this.qrScanner.show();
            this.previewCamera = true;
            this.qrScanner.scan().subscribe((text: string) => {
              console.log('camera');
              console.log(this.isOn);
              this.scannedCode = text;
              alert('Scanned something: ' + text);
              var id = parseInt(text);
              console.log(this.scannedCode)
              this.closePreviewCamera();
              this.changeRef.detectChanges();
              $("ion-app").show(500);
              if (!isNaN(id)) {
                this.sharedData.createToast('Valid QR')
                this.NGSIv2Query.getEntity('QRNFCDictionary' + id).then((response: any) => {
                  var action: string = response.action;
                  this.NGSIv2Query.sendQRNFCEvent('QR', action, new Date().toISOString(), response.identifier);
                  window.open(action);
                  resolve(true);
                }, (err) => {
                  alert(err);
                  reject(err);
                })
              }
              else {
                alert('Not valid QR')
                reject('Not valid QR')
              }
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
      }).catch((e: any) => console.log('Error is', e));
    })

  }
  ngOnInit() {
  }
  addQR() {
    if (this.sharedData.user_data.qr_code.length < 4)
      this.NGSIv2Query.getEntity(Entity.NFC,)
  }
  delete(device, index) {
    console.log('delete pos ' + index + " -> " + device.id)
    var a = $('#item' + index).hide(400, () => {
      this.sharedData.user_data.qr_code.splice(index, 1);
      console.log(this.sharedData.user_data.qr_code)
    })
  }
}
