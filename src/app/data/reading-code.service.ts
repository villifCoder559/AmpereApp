import { Injectable, NgModule } from '@angular/core';
import { NGSIv2QUERYService } from './ngsiv2-query.service';
import { DeviceType, QRNFCEvent, SharedDataService, typeChecking } from './shared-data.service';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import { TranslateService } from '@ngx-translate/core';

// @NgModule({
//   providers: [InAppBrowser,Geolocation]
// })
@Injectable({
  providedIn: 'root'
})

export class ReadingCodeService {
  readonly numQRNFC = 4;
  readonly array_id = ['broker', 'org', 'deviceID']
  constructor(private translate: TranslateService, private NGSIv2Query: NGSIv2QUERYService, private geolocation: Geolocation, private iab: InAppBrowser, private sharedData: SharedDataService) { }
  searchCode(scanned_text, type: typeChecking.NFC_CODE | typeChecking.QR_CODE) {
    return new Promise((resolve, reject) => {
      let index = this.searchValueInUserData(scanned_text, type);
      if (index != -1)
        this.openUrlAndGenerateEvent(this.sharedData.user_data.qr_code[index].id, this.sharedData.user_data.qr_code[index].action, typeChecking.QR_CODE ? 'QR' : 'NFC').then(()=>resolve(true),err=>reject(err))
      else
        this.getUpdatedListFromServer(type).then(() => {
          let index = this.searchValueInUserData(scanned_text, type);
          console.log('LISTFROMSERVER')
          if (index != -1)
            this.openUrlAndGenerateEvent(this.sharedData.user_data.qr_code[index].id, this.sharedData.user_data.qr_code[index].action, typeChecking.QR_CODE ? 'QR' : 'NFC').then(() => resolve(true), err => reject(err))
          else
            this.NGSIv2Query.getEntity('AmpereDictionary', DeviceType.DICTIONARY).then((dictionary: any) => {
              var code = this.getUrlFromDictionary(scanned_text, dictionary)
              if (code != null) {
                console.log('DICTIONARY')
                this.openUrlAndGenerateEvent(code.uuid, code.url, typeChecking.QR_CODE ? 'QR' : 'NFC').then(() => resolve(true), err => reject(err))
              }
              else
                reject({ msg: this.translate.instant('ALERT.scan_error') })
            }, err => { reject({ msg: this.translate.instant('ALERT.retrive_information') }) })
        }, err => {
          console.log(err)
          reject({ msg: this.translate.instant('ALERT.retrive_information') })
        })
    })
  }
  //uuid1,url1,....,uuidn,urln 
  private getUrlFromDictionary(scanned_text: any, dictionary: any) {
    console.log('RESPONSE')
    console.log(dictionary)
    let i = 0;
    let length = (Object.keys(dictionary).length - 6) / 2;//removes field dateObserved,id,lat,long,model,type and divided by 2 because each code is [key-value]
    //Object.keys(response).forEach(() => {
    for (let i = 1; i < length; i++) {
      console.log(i)
      console.log(typeof (scanned_text))
      console.log(scanned_text)
      console.log(typeof (dictionary['uuid' + i]['value']))
      console.log(dictionary['uuid' + i]['value'])
      console.log(dictionary['uuid' + i]['value'] == scanned_text)
      if (dictionary['uuid' + i]['value'] == scanned_text)
        return { 'url': dictionary['url' + i]['value'], 'uuid': dictionary['uuid' + i]['value'] }
    }
    console.log('OUT')
    //});
    return null;
    // console.log('DICTIONARY')
    // console.log(entries)
    // console.log(scanned_text)
    // for (let i = 1; i < entries.length-5; i++) {
    //   console.log(response['uuid' + i])
    //   if (entries['uuid' + i] == scanned_text)
    //     return { 'url': entries['url' + i], 'uuid': entries['uuid' + i] }
    // }
    // return null;
  }
  searchValueInUserData(value, type) {
    for (let i = 0; i < this.sharedData.user_data[type].length; i++) {
      if (value == this.sharedData.user_data.qr_code[i].identifier)
        return i;
    }
    return -1;
  }
  private openUrlAndGenerateEvent(uuid, url, type) {
    return new Promise((resolve, reject) => {
      console.log('GETPOSITION')
      this.sharedData.setTextLoading(this.translate.instant('ALERT.retrive_info'))
      this.geolocation.getCurrentPosition({timeout:15000}).then((response) => {
        this.generateEventAndshowCode(uuid, url, type, response.coords.latitude, response.coords.longitude).then(() => resolve(true), err => reject(err))
      }, err => {
        this.generateEventAndshowCode(uuid, url, type, 0, 0).then(() => resolve(true), err => reject(err))
      })
    })
  }
  generateEventAndshowCode(id, url, type, lat, long) {
    return new Promise((resolve, reject) => {
      console.log('GenerateEventAndSHow')
      var event = new QRNFCEvent(type == typeChecking.QR_CODE ? 'QR' : 'NFC', id, url, lat, long);
      this.NGSIv2Query.sendQRNFCEvent(event).then(() => {
        console.log(url);
        this.iab.create('https://' + url, '_blank', { hideurlbar: 'yes' })
        resolve(true);
      }, err => reject(err))
    })
  }
  private getUpdatedListFromServer(type: typeChecking.NFC_CODE | typeChecking.QR_CODE) {
    return new Promise((resolve, reject) => {
      this.NGSIv2Query.getEntity('ampereuser' + this.sharedData.user_data.uuid + DeviceType.PROFILE, DeviceType.PROFILE).then((data) => {
        this.fillListCode(data, type);
        resolve(true);
      }, err => reject(err))
    })
  }
  private fillListCode(data, type: typeChecking.NFC_CODE | typeChecking.QR_CODE) {
    this.sharedData.user_data[type] = [];
    console.log(data)
    for (var i = 0; i < this.numQRNFC; i++) {
      var name = typeChecking.QR_CODE ? 'QR' : 'NFC'
      var code = { 'identifier': data[name + (i + 1) + '_identifier'].value, 'action': data[name + (i + 1) + '_action'].value };
      //var code = data[(type === typeChecking.QR_CODE ? 'QR_identifier' : 'NFC_identifier') + (i + 1)]?.value;
      console.log(code)
      if (code !== undefined && code.action != '' && code.identifier != '') {
        this.sharedData.user_data[type].push(code)
        console.log('add-> ' + code)
      }
    }
  }
}


