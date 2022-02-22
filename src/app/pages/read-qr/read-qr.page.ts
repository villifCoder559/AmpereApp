import { Component, OnInit } from '@angular/core';
import { Base64ToGallery } from '@ionic-native/base64-to-gallery/ngx';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
import { ToastController } from '@ionic/angular';
import * as $ from "jquery";
import { ChangeDetectorRef } from '@angular/core';
import { DeviceType, QRNFCEvent, SharedDataService, typeChecking } from 'src/app/data/shared-data.service';
import { NGSIv2QUERYService } from 'src/app/data/ngsiv2-query.service'
import { LoadingController } from '@ionic/angular';
import { Snap4CityService } from 'src/app/data/snap4-city.service';
import { ReadingCodeService } from 'src/app/data/reading-code.service';
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
  constructor(private readCode: ReadingCodeService, private s4c: Snap4CityService, public sharedData: SharedDataService, private NGSIv2Query: NGSIv2QUERYService, private changeRef: ChangeDetectorRef, private qrScanner: QRScanner, private toastCtrl: ToastController) {
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
            this.sharedData.presentLoading('Getting info from server').then(() => {
              this.readCode.readURLFromServer(text, typeChecking.QR_CODE).then(() => {
                this.sharedData.createToast('QR scanned succesfully')
                this.sharedData.dismissLoading();
              }, err => {
                this.sharedData.createToast(err?.msg)
                this.sharedData.dismissLoading();
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
  // readURLFromServer(json_id) {
  //   return new Promise((resolve, reject) => {
  //     this.sharedData.presentLoading('Getting info from server');
  //     this.getListFromServer().then(() => {
  //       if (this.sharedData.checkIDValidityNFCorQR(typeChecking.QR_CODE, json_id['deviceID'])) {
  //         this.NGSIv2Query.getEntity(json_id['deviceID'], DeviceType.DICTIONARY, json_id['broker']).then((response: any) => {
  //           var event = new QRNFCEvent('QR', response.identifier.value, action);
  //           var action: string = response.action.value;
  //           var identifier_event = (new Date(event.dateObserved).getTime()).toString() //seconds
  //           console.log(identifier_event)
  //           this.s4c.createDevice(DeviceType.QR_NFC_EVENT, identifier_event).then(() => {
  //             this.sharedData.dismissLoading();
  //             this.NGSIv2Query.sendQRNFCEvent(event, identifier_event)
  //             this.scannedCode = action;
  //             console.log(action);
  //             window.open('https://' + action, '_system', 'location=yes')
  //             resolve(true);
  //           }, (err) => {
  //             console.log(err)
  //             reject(err)
  //           })
  //         }, (err) => {
  //           reject(err);
  //         })
  //       }
  //       else {
  //         //this.sharedData.createToast('Permission denied!')
  //         reject({ msg: 'Permission denied' })
  //       }
  //     }, err => {
  //       console.log(err)
  //       reject(err)
  //     })
  //   })
  // }
  // getListFromServer() {
  //   return new Promise((resolve, reject) => {
  //     this.NGSIv2Query.getEntity(this.sharedData.user_data.id + DeviceType.PROFILE, DeviceType.PROFILE).then((data) => {
  //       this.fillListQRCode(data);
  //       resolve(true);
  //     }, err => reject(err))
  //   })
  // }
  // fillListQRCode(data) {
  //   this.sharedData.user_data.qr_code = [];
  //   for (var i = 0; i < 4; i++) {
  //     var qrcode = data['QR' + (i + 1)].value;
  //     if (qrcode != '')
  //       this.sharedData.user_data.qr_code.push(qrcode)
  //   }
  // }
  ngOnInit() {
  }
}
