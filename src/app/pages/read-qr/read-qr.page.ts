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
  constructor(private s4c: Snap4CityService, public sharedData: SharedDataService, private NGSIv2Query: NGSIv2QUERYService, private changeRef: ChangeDetectorRef, private qrScanner: QRScanner, private toastCtrl: ToastController) {
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
            // this.scannedCode = text;
            alert('Scanned something: ' + text);
            var id = parseInt(text);
            this.closePreviewCamera();
            this.changeRef.detectChanges();
            $("ion-app").show(500);
            console.log(isNaN(id))
            if (!isNaN(id)) {
              this.readURLFromServer(id).then(() => {
                
              }, err => alert(err.msg))
            }
            else
              alert('Not valid QR')
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
    }).catch((e: any) => console.log('Error is', e));
    //})

  }
  readURLFromServer(id) {
    return new Promise((resolve, reject) => {
      if (this.sharedData.checkIDValidityNFCorQR(typeChecking.QR_CODE, id)) {
        this.sharedData.presentLoading('Getting info from server')
        this.NGSIv2Query.getEntity('QRNFCDictionary' + id, 'DictionaryOfQRNFC').then((response: any) => {
          var event=new QRNFCEvent('QR', response.identifier.value, action);
          var action: string = response.action.value;
          var identifier_event = (Math.floor(new Date(event.dateObserved).getTime() / 1000)).toString() //seconds
          console.log(identifier_event)
          this.s4c.createDevice(DeviceType.QR_NFC_EVENT, identifier_event).then(() => {//gestione numerazione device quando creo eventi
            this.sharedData.dismissLoading();
            this.NGSIv2Query.sendQRNFCEvent(event, identifier_event)
            this.scannedCode = action;
            console.log(action);
            window.open('https://' + action, '_system', 'location=yes')
            resolve(true);
          }, (err) => {
            this.sharedData.dismissLoading();
            console.log(err)
            reject(err)
          })
        }, (err) => {
          this.sharedData.dismissLoading()
          reject(err);
        })
      }
      else {
        this.sharedData.createToast('Permission denied!')
        resolve('Permission denied')
      }
    })
  }
  ngOnInit() {
    this.fillListQRCode()
  }
  fillListQRCode() {
    console.log(this.sharedData.user_data.qr_code)
    // this.sharedData.user_data.qr_code.forEach((element) => {
    //   console.log(element)
    //   this.NGSIv2Query.getEntity('QRNFCDictionary' + element.id, 'DictionaryOfQRNFC').then((data: any) => {
    //     if (data.QRIDorNFC == 'QR') {
    //       this.sharedData.user_data.qr_code[data.identifier].action = data.action;
    //     }
    //   })
    // })
  }
  addQR() {

  }
  delete(device, index) {
    console.log('delete pos ' + index + " -> " + device.id)
    var a = $('#item' + index).hide(400, () => {
      this.sharedData.user_data.qr_code.splice(index, 1);
      console.log(this.sharedData.user_data.qr_code)
    })
  }
}
