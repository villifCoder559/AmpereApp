import { ThrowStmt } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { resolve } from 'dns';
import * as Keycloak from 'keycloak-ionic';
import { element } from 'protractor';
import { DeviceType, Emergency_Contact, QRNFCEvent, SharedDataService, typeChecking, AlertEvent, FakeKeycloak } from '../data/shared-data.service'
import { AuthenticationService } from '../services/authentication.service'
import { NGSIv2QUERYService } from './ngsiv2-query.service';
@Injectable({
  providedIn: 'root'
})
export class Snap4CityService {

  constructor(private shared_data: SharedDataService, private authService: AuthenticationService) {
  }
  //Firstly i create the device then I insert the value when event's fired 
  deleteDevice(type: DeviceType) {
    return new Promise((resolve, reject) => {
      var device_id = this.shared_data.user_data.id + type;
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
          if (mydata.status != 'ko')
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
  createDevice(type: DeviceType, name = '', lat = 42, long = 12, broker = 'orionAMPERE-UNIFI') {
    return new Promise((resolve, reject) => {
      console.log('CREATION')
      console.log(type)
      var attr = this.getAttributesPayload(type);
      console.log(JSON.stringify(attr))
      var device_id = this.shared_data.user_data.id + type + name;
      console.log('NAME')
      console.log(device_id)
      $.ajax({
        url: "https://iotdirectory.snap4city.org/api/device.php",
        data: {
          action: "insert",
          token: this.authService.keycloak.token,
          id: device_id,
          type: type,
          contextbroker: broker,
          kind: 'sensor',
          format: 'json',
          latitude: lat,
          longitude: long,
          frequency: 300,
          attributes: JSON.stringify(attr),
          producer: '',
          nodered: true,
          model: type,
          k1: this.generateUUID(),
          k2: this.generateUUID()
        },
        type: "POST",
        async: true,
        dataType: 'JSON',
        success: (mydata) => {
          console.log(mydata)
          if (mydata.status != 'ko') {
            this.changeVisibilityToPublic(device_id).then(() => {
              //console.log('all ok')
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
  changeVisibilityToPublic(device_id) {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: "https://iotdirectory.snap4city.org/api/device.php",
        data: {
          action: "change_visibility",
          id: device_id,
          contextbroker: 'orionAMPERE-UNIFI',
          visibility: 'public',
          token: this.authService.keycloak.token,
          nodered: true
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
  generateUUID() { // Public Domain/MIT
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
  getAttributesPayload(type: DeviceType) {
    switch (type) {
      case DeviceType.PROFILE:
        return this.getUserIDPayload();
      case DeviceType.ALERT_EVENT:
        return this.getAlertEventPayload();
      case DeviceType.QR_NFC_EVENT:
        return this.getQRNFCEventPayload();
    }
  }
  createField(name, value) {
    if (value === null)
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
  createDateTimeField() {
    return {
      value_name: 'dateObserved',
      value_type: 'timestamp',
      value_unit: 'timestamp',
      data_type: 'string',
      editable: "0",
      healthiness_criteria: 'refresh_rate',
      healthiness_value: 300
    }
  }
  getAlertEventPayload(createDevice = true, event = new AlertEvent()) {
    var newEvent;
    if (createDevice)
      newEvent = [];
    else
      newEvent = {};
    Object.keys(event).forEach((element) => {
      console.log(event[element])
      if (element != 'latitude' && element != 'longitude')
        if (createDevice)
          if (element != 'dateObserved')
            newEvent.push(this.createField(element, null))
          else
            newEvent.push(this.createDateTimeField());
        else {
          var newValue = event[element];
          newEvent[element] = { value: newValue.toString() }
        }
    })
    console.log('newEvent');
    console.log(newEvent)
    return newEvent;
  }
  getUserIDPayload(createDevice = true) {
    console.log(createDevice)
    var newUser: any;
    if (createDevice)
      newUser = [];
    else
      newUser = {}
    Object.keys(this.shared_data.user_data).forEach((field_name) => {
      switch (field_name) {
        case 'id': {
          break;
        }
        case 'dateObserved': {
          if (createDevice)
            newUser.push(this.createDateTimeField())
          else
            newUser[field_name] = { value: this.shared_data.user_data.dateObserved }
          break;
        }
        case typeChecking.EMERGENCY_CONTACTS: {
          for (var i = 0; i < 5; i++) {
            if (createDevice) {
              newUser.push(this.createField('emergencyContact' + (i + 1) + 'Name', null))
              newUser.push(this.createField('emergencyContact' + (i + 1) + 'Surname', null))
              newUser.push(this.createField('emergencyContact' + (i + 1) + 'Number', null))
            }
            else {
              console.log('emergencyContact ' + i)
              console.log(this.shared_data.user_data.emergency_contacts[i]?.name)
              newUser['emergencyContact' + (i + 1) + 'Name'] = { value: this.shared_data.user_data.emergency_contacts[i]?.name === undefined ? '' : this.shared_data.user_data.emergency_contacts[i]?.name }
              newUser['emergencyContact' + (i + 1) + 'Surname'] = { value: this.shared_data.user_data.emergency_contacts[i]?.surname === undefined ? '' : this.shared_data.user_data.emergency_contacts[i]?.surname }
              newUser['emergencyContact' + (i + 1) + 'Number'] = { value: this.shared_data.user_data.emergency_contacts[i]?.number === undefined ? '' : this.shared_data.user_data.emergency_contacts[i]?.number }
            }
          }
          break;
        }
        case typeChecking.DISABILITIES: {
          console.log('ERROR?')
          console.log(this.shared_data.user_data.disabilities)
          Object.keys(this.shared_data.user_data.disabilities).forEach((dis) => {
            if (createDevice)
              newUser.push(this.createField(dis, null))
            else
              newUser[dis] = { value: this.shared_data.user_data.disabilities[dis] }
          })
          break;
        }
        case typeChecking.QR_CODE: {
          for (var i = 0; i < 4; i++)
            if (createDevice)
              newUser.push(this.createField('QR' + (i + 1), null))
            else
              newUser['QR' + (i + 1)] = { value: this.shared_data.user_data.qr_code[i] === undefined ? '' : this.shared_data.user_data.qr_code[i] }
          break;
        }
        case typeChecking.NFC_CODE: {
          for (var i = 0; i < 4; i++)
            if (createDevice)
              newUser.push(this.createField('NFC' + (i + 1), null))
            else
              newUser['NFC' + (i + 1)] = { value: this.shared_data.user_data.nfc_code[i] === undefined ? '' : this.shared_data.user_data.nfc_code[i] }
          break;
        }
        case typeChecking.PUB_EMERGENCY_CONTACTS: {
          Object.keys(this.shared_data.user_data.public_emergency_contacts).forEach((element) => {
            if (createDevice)
              newUser.push(this.createField('call_' + element, null))
            else
              newUser['call_' + element] = { value: this.shared_data.user_data.public_emergency_contacts[element] }
          })
          break;
        }
        case typeChecking.PAIRED_DEVICES: {
          for (var i = 0; i < 2; i++)
            if (createDevice)
              newUser.push(this.createField('jewel' + (i + 1) + 'ID', null))
            else
              newUser['jewel' + (i + 1) + 'ID'] = { value: this.shared_data.user_data.paired_devices[i] === undefined ? '' : this.shared_data.user_data.paired_devices[i] }
          break;
        }
        default: {
          if (createDevice)
            newUser.push(this.createField(field_name, null))
          else
            newUser[field_name] = { value: this.shared_data.user_data[field_name] === undefined ? '' : this.shared_data.user_data[field_name] }
          break;
        }
      }
    })
    return newUser;
  }
  getQRNFCEventPayload(createDevice = true, event: QRNFCEvent = new QRNFCEvent('', '', '')) {
    var newQRNFCEvent;
    if (createDevice)
      newQRNFCEvent = [];
    else
      newQRNFCEvent = {};
    Object.keys(event).forEach((element) => {
      if (createDevice)
        if (element != 'dateObserved')
          newQRNFCEvent.push(this.createField(element, null))
        else
          newQRNFCEvent.push(this.createDateTimeField());
      else
        newQRNFCEvent[element] = { value: event[element] }
    })
    return newQRNFCEvent;
  }
}
