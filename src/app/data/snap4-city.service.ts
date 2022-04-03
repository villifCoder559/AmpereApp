import { Injectable } from '@angular/core';
import { DeviceType, QRNFCEvent, SharedDataService, typeChecking, AlertEvent } from '../data/shared-data.service'
import { AuthenticationService } from '../services/authentication.service'
@Injectable({
  providedIn: 'root'
})
export class Snap4CityService {

  constructor(private shared_data: SharedDataService, private authService: AuthenticationService) {
  }
  //Firstly i create the device then I insert the value when event's fired 
  deleteDevice(type: DeviceType, name = 'ampereuser') {
    return new Promise((resolve, reject) => {
      var device_id;
      device_id = name + this.shared_data.user_data.uuid + type;
      console.log(device_id)
      $.ajax({
        url: "https://iotdirectory.snap4city.org/api/device.php",
        data: {
          action: "delete",
          token: this.authService.keycloak.token,
          id: device_id,
          contextbroker: 'orionAMPERE-UNIFI',
          nodered: true
        },
        type: "POST",
        async: true,
        dataType: 'JSON',
        success: (mydata) => {
          console.log(mydata)
          if (mydata?.status != 'ko')
            resolve(mydata)
          else
            reject(mydata)
        },
        error: (err) => {
          reject(err)
        }
      })
    })
  }
  createDevice(type: DeviceType, lat = 42, long = 12, name = 'ampereuser', broker = 'orionAMPERE-UNIFI') {
    return new Promise((resolve, reject) => {
      var k1, k2;
      console.log('CREATION')
      console.log(type)
      var attr = this.getAttributesPayload(type);
      console.log(attr)
      var device_id = name + this.shared_data.user_data.uuid + type;
      console.log('NAME')
      console.log(device_id)
      k1 = this.generateUUID();
      k2 = this.generateUUID();
      $.ajax({
        url: "https://iotdirectory.snap4city.org/api/device.php",
        data: {
          action: "insert",
          token: this.authService.keycloak.token,
          id: device_id,
          type: type,
          contextbroker: broker,
          subnature: 'Private_security',
          kind: 'sensor',
          format: 'json',
          latitude: lat,
          longitude: long,
          frequency: 300,
          attributes: JSON.stringify(attr),
          producer: '',
          nodered: true,
          model: type,
          k1: k1,
          k2: k2
        },
        type: "POST",
        async: true,
        dataType: 'JSON',
        success: (mydata) => {
          console.log(mydata)
          if (mydata?.status != 'ko') {
            this.delegateModel(device_id, k1, k2).then(() => {
              resolve(mydata)
            }, err => reject(err))
          }
          else {
            console.log('error create device')
            reject(mydata)
          }
        },
        error: (err) => {
          console.log(err)
          console.log('error')
          reject(err)
        }
      })
    })
  }
  private delegateModel(device_id, k1, k2) {
    return new Promise((resolve, reject) => {
      console.log(k1);
      console.log(k2);
      $.ajax({
        url: "https://iotdirectory.snap4city.org/api/device.php",
        data: {
          action: "add_delegation",
          id: device_id,
          contextbroker: 'orionAMPERE-UNIFI',
          delegated_user: 'ampereroot',
          token: this.authService.keycloak.token,
          nodered: true,
          k1: k1,
          k2: k2
        },
        type: "POST",
        async: true,
        dataType: 'json',
        success: function (data) {
          console.log(data)
          resolve(data)
        },
        error: function (errorData) {
          console.log(errorData)
          reject(errorData)
        }
      }).catch((err) => reject(err));
    })

  }
  private generateUUID() { // Public Domain/MIT
    var d = new Date().getTime();
    if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
      d += performance.now(); //use high-precision timer if available
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
  }
  private getAttributesPayload(type: DeviceType) {
    switch (type) {
      case DeviceType.PROFILE:
        return this.getUserIDPayload(true);
      case DeviceType.ALERT_EVENT:
        return this.getEventPayload(true, new AlertEvent());
      case DeviceType.QR_NFC_EVENT:
        return this.getEventPayload(true, new QRNFCEvent('', '', '', -1, -1));
    }
  }
  private createField(name) {
    console.log(name)
    switch (name) {
      case 'identifier': {
        return {
          value_name: 'identifier',
          value_type: 'Identifier',
          value_unit: 'SURI',
          data_type: 'string',
          editable: "0",
          healthiness_criteria: 'refresh_rate',
          healthiness_value: '300'
        }
      }
      case 'dateObserved': {
        return {
          value_name: 'dateObserved',
          value_type: 'timestamp',
          value_unit: 'timestamp',
          data_type: 'string',
          editable: "0",
          healthiness_criteria: 'refresh_rate',
          healthiness_value: '300'
        }
      }
      default: {
        return {
          value_name: name,
          value_type: 'description',
          value_unit: 'text',
          data_type: 'string',
          editable: "0",
          healthiness_criteria: 'refresh_rate',
          healthiness_value: '300'
        };
      }
    }
  }
  getUserIDPayload(createModel: boolean) {
    var newUser: any;
    console.log('UserIdPayLoad')
    if (createModel)
      newUser = this.createModelProfile();
    else
      newUser = this.shared_data.getUserFromLocalToServer()
    return newUser;
  }
  createModelProfile() {
    var newUser = []
    console.log(this.shared_data.user_data)
    Object.keys(this.shared_data.user_data).forEach((field_name) => {
      switch (field_name) {
        // case 'id': {
        //   break;
        // }
        case 'dateObserved': {
          newUser.push(this.createField('dateObserved'))
          break;
        }
        case 'emergency_contacts': {
          console.log(field_name)
          for (var i = 0; i < this.shared_data.MAX_EMERGENCY_CONTACTs; i++) {
            newUser.push(this.createField('emergencyContact' + (i + 1) + 'Name'))
            newUser.push(this.createField('emergencyContact' + (i + 1) + 'Surname'))
            newUser.push(this.createField('emergencyContact' + (i + 1) + 'Number'))
          }
          break;
        }
        case 'disabilities': {
          console.log('ERROR?')
          console.log(this.shared_data.user_data.disabilities)
          Object.keys(this.shared_data.user_data.disabilities).forEach((dis) => {
            newUser.push(this.createField(dis))
          })
          break;
        }
        case 'qr_code': {
          for (var i = 0; i < this.shared_data.MAX_QRs; i++){
            newUser.push(this.createField('QR' + (i + 1)+'_action'))
            newUser.push(this.createField('QR' + (i + 1)+'_identifier'))
          }
          break;
        }
        case 'nfc_code': {
          for (var i = 0; i < this.shared_data.MAX_NFCs; i++){
            newUser.push(this.createField('NFC' + (i + 1)+'_action'))
            newUser.push(this.createField('NFC' + (i + 1)+'_identifier'))
          }
          break;
        }
        case 'public_emergency_contacts': {
          Object.keys(this.shared_data.user_data.public_emergency_contacts).forEach((element) => {
            newUser.push(this.createField(element))
          })
          break;
        }
        case 'paired_devices': {
          for (var i = 0; i < this.shared_data.MAX_DEVICEs; i++)
            newUser.push(this.createField('jewel' + (i + 1) + 'ID'))
          break;
        }
        default: {
          newUser.push(this.createField(field_name))
          break;
        }
      }
    })
    return newUser;
  }
  // getAlertEventPayload(createModel = true, event = new AlertEvent()) {
  //   var newEvent;
  //   if (createModel)
  //     newEvent = [];
  //   else
  //     newEvent = {};
  //   Object.keys(event).forEach((element) => {
  //     if (createModel)
  //       newEvent.push(this.createField(element))
  //     else
  //       newEvent[element] = { value: event[element].toString() }
  //   })
  //   return newEvent;
  // }
  getEventPayload(createModel: boolean, event: QRNFCEvent | AlertEvent) {
    var newQRNFCEvent;
    if (createModel)
      newQRNFCEvent = this.createModelEvent(event);
    else
      newQRNFCEvent = this.getEventFromLocalToServer(event);
    return newQRNFCEvent;
  }
  createModelEvent(event: QRNFCEvent | AlertEvent) {
    var newEvent = [];
    Object.keys(event).forEach((element) => {
      newEvent.push(this.createField(element))
    })
    return newEvent;
  }
  private getEventFromLocalToServer(event: QRNFCEvent | AlertEvent) {
    var newEvent = {}
    Object.keys(event).forEach((element) => {
      newEvent[element] = { value: event[element] }
    })
    return newEvent
  }
  // getQRNFCEventPayload(createModel = true, event: QRNFCEvent = new QRNFCEvent('', '', '')) {
  //   var newQRNFCEvent;
  //   if (createModel)
  //     newQRNFCEvent = this.createModelEvent(DeviceType.QR_NFC_EVENT);
  //   else
  //     newQRNFCEvent = this.getPayloadEvent(event);
  //   return newQRNFCEvent;
  // }
}
