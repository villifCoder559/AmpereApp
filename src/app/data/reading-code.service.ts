import { Injectable, NgModule } from '@angular/core';
import { NGSIv2QUERYService } from './ngsiv2-query.service';
import { DeviceType, QRNFCEvent, SharedDataService, typeChecking } from './shared-data.service';
import { Snap4CityService } from './snap4-city.service';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
// @NgModule({
//   providers: [InAppBrowser,Geolocation]
// })
@Injectable({
  providedIn: 'root'
})

export class ReadingCodeService {
  readonly numQRNFC = 4;
  readonly array_id = ['broker', 'org', 'deviceID']
  constructor(private NGSIv2Query: NGSIv2QUERYService,private geolocation:Geolocation, private iab: InAppBrowser, private sharedData: SharedDataService, private s4c: Snap4CityService) { }

  readURLFromServer(scanned_text, type: typeChecking.NFC_CODE | typeChecking.QR_CODE) {
    return new Promise((resolve, reject) => {
      var json_id = this.parseText(scanned_text)
      console.log(json_id)
      this.getListFromServer(type).then(() => {
        if (this.checkIDValidityNFCorQR(type, json_id['deviceID'])) {
          this.NGSIv2Query.getEntity(json_id['deviceID'], DeviceType.DICTIONARY, json_id['broker']).then((response: any) => {
            console.log(response)
            console.log(event)
            this.geolocation.getCurrentPosition().then((position) => {
              var action: string = response.identifier.value;
              var event = new QRNFCEvent(type == typeChecking.QR_CODE ? 'QR' : 'NFC', response.identifier.value, action,position.coords.latitude,position.coords.longitude);
              this.NGSIv2Query.sendQRNFCEvent(event).then(() => {
                console.log(action);
                this.iab.create('https://' + action, '_blank', { hideurlbar: 'yes' })
                resolve(true);
              }, err => reject(err))
            })
          }, (err) => {
            reject(err);
          })
        }
        else {
          reject({ msg: 'Permission denied' })
        }
      }, err => {
        console.log(err)
        reject(err)
      })
    })
  }
  private getListFromServer(type: typeChecking.NFC_CODE | typeChecking.QR_CODE) {
    return new Promise((resolve, reject) => {
      this.NGSIv2Query.getEntity('ampereuser'+this.sharedData.user_data.uuid + DeviceType.PROFILE, DeviceType.PROFILE).then((data) => {
        this.fillListCode(data, type);
        resolve(true);
      }, err => reject(err))
    })
  }
  private fillListCode(data, type: typeChecking.NFC_CODE | typeChecking.QR_CODE) {
    this.sharedData.user_data[type] = [];
    console.log(data)
    for (var i = 0; i < this.numQRNFC; i++) {
      console.log(type === typeChecking.QR_CODE ? 'QR' : 'NFC')
      var code = data[(type === typeChecking.QR_CODE ? 'QR' : 'NFC') + (i + 1)]?.value;
      console.log(code)
      console.log(data.NFC1.value)
      console.log(data['NFC' + 1].value)
      if (code !== undefined && code != '') {
        this.sharedData.user_data[type].push(code)
        console.log('add-> ' + code)
      }
    }
  }
  private parseText(txt: string) {
    var app = txt.split('/');
    var id = [];
    let i = 0;
    this.array_id.forEach((element) => id[element] = app[i++])
    return id;
  }
  private checkIDValidityNFCorQR(type: typeChecking.QR_CODE | typeChecking.NFC_CODE, id) {
    console.log('userData')
    console.log(this.sharedData.user_data[type])
    var ok = false;
    this.sharedData.user_data[type].forEach(element => {
      console.log((element))
      console.log(id)
      console.log((element) == id)
      if ((element) == id && element !== undefined)
        ok = true
    });
    return ok;
  }
}
