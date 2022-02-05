import { ThrowStmt } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { resolve } from 'dns';
import * as Keycloak from 'keycloak-ionic';
import { element } from 'protractor';
import { DeviceType, Emergency_Contact, QRNFCEvent, QRCode, SharedDataService, typeChecking, AlertEvent, FakeKeycloak } from '../data/shared-data.service'
import { AuthenticationService } from '../services/authentication.service'
import { NGSIv2QUERYService } from './ngsiv2-query.service';
@Injectable({
  providedIn: 'root'
})
export class Snap4CityService {

  constructor(private shared_data: SharedDataService, private authService: AuthenticationService) {
  }
  //Firstly i create the device then I insert the value when event's fired 
  createDevice(type: DeviceType) {
    var attr = this.getAttributesPayload(type);
    var lat = 42;
    var long = 12;
    if (attr['latitude'] != undefined && attr['longitude'] != undefined) {
      lat = attr['latitude'];
      long = attr['longitude'];
    }
    attr.push(this.createDateTimeField())
    return new Promise((resolve, reject) => {
      var device_id = 'ampereuserxxx01' + type;
      $.ajax({
        url: "https://iotdirectory.snap4city.org/api/device.php",
        data: {
          action: "insert",
          token: FakeKeycloak.refresh_token,
          id: device_id,
          type: type,
          contextbroker: 'orionAMPERE-UNIFI',
          kind: 'sensor',
          format: 'json',
          latitude: lat,
          longitude: long,
          frequency: 300,
          attributes: JSON.stringify(attr),
          producer: '',
          model: type,
          k1: this.generateUUID(),
          k2: this.generateUUID()
        },
        type: "POST",
        async: true,
        dataType: 'JSON',
        success: function (mydata) {
          if (mydata.status != 'ko') {
            this.changeVisibility().then(() => {
              console.log(mydata)
              resolve(mydata)
            })
          }
          else {
            reject(mydata)
          }
        },
        error: function (err) {
          console.log(err)
          reject(err)
        }
      }).catch(err => reject(err))
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
          token: FakeKeycloak.refresh_token
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
  createField(name) {
    return {
      value_name: name,
      value_type: 'description',
      value_unit: 'text',
      data_type: 'string',
      editable: "0",
      healthiness_criteria: 'refresh_rate',
      healthiness_value: 300
    };
  }
  createDateTimeField() {
    return {
      value_name: 'dateObserved',
      value_type: 'datetime',
      value_unit: 'timestamp',
      data_type: 'string',
      editable: "0",
      healthiness_criteria: 'refresh_rate',
      healthiness_value: 300
    }
  }
  getAlertEventPayload() {
    var newEvent = [];
    Object.keys(new AlertEvent()).forEach((element) => {
      newEvent[element] = this.createField(element)
    })
    return newEvent
  }
  getUserIDPayload() {
    var newUser = [];
    Object.keys(this.shared_data.user_data).forEach((field_name) => {
      switch (field_name) {
        case 'id': {
          break;
        }
        case typeChecking.EMERGENCY_CONTACTS: {
          for (var i = 0; i < 5; i++) {
            newUser.push(this.createField('emergencyContact' + (i + 1) + 'Name'))
            newUser.push(this.createField('emergencyContact' + (i + 1) + 'Surname'))
            newUser.push(this.createField('emergencyContact' + (i + 1) + 'Number'))
          }
          break;
        }
        case typeChecking.DISABILITIES: {
          newUser.push(this.createField('visionImpaired'))
          newUser.push(this.createField('wheelchairUser'))
          break;
        }
        case typeChecking.QR_CODE: {
          for (var i = 0; i < 4; i++)
            newUser.push(this.createField('QR' + (i + 1)))
          break;
        }
        case typeChecking.NFC_CODE: {
          for (var i = 0; i < 4; i++)
            newUser.push(this.createField('NFC' + (i + 1)))
          break;
        }
        case typeChecking.PUB_EMERGENCY_CONTACTS: {
          Object.keys(this.shared_data.user_data.public_emergency_contacts).forEach((element) => {
            newUser.push(this.createField('call_' + element))
          })
          break;
        }
        case typeChecking.PAIRED_DEVICES: {
          for (var i = 0; i < 2; i++)
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
    // return {
    //   dataObserved: {
    //     value_name: new Date().toISOString(),
    //     type: 'string'
    //   },
    //   name: {
    //     value_name: this.shared_data.user_data.name,
    //     type: 'string'
    //   },
    //   email: {
    //     value_name: this.shared_data.user_data.email,
    //     type: 'string'
    //   },
    //   surname: {
    //     value_name: this.shared_data.user_data.surname,
    //     type: 'string'
    //   },
    //   phoneNumber: {
    //     value_name: this.shared_data.user_data.name,
    //     type: 'string'
    //   },
    //   dateofborn: {
    //     value_name: this.shared_data.user_data.dateofborn,
    //     type: 'string'
    //   },
    //   gender: {
    //     value_name: this.shared_data.user_data.gender,
    //     type: 'status'
    //   },
    //   address: {
    //     value_name: this.shared_data.user_data.address,
    //     type: 'string'
    //   },
    //   locality: {
    //     value_name: this.shared_data.user_data.locality,
    //     type: 'string'
    //   },
    //   city: {
    //     value_name: this.shared_data.user_data.city,
    //     type: 'string'
    //   },
    //   height: {
    //     value_name: this.shared_data.user_data.height,
    //     type: 'string'
    //   },
    //   weight: {
    //     value_name: this.shared_data.user_data.weight,
    //     type: 'string'
    //   },
    //   ethnicity: {
    //     value_name: this.shared_data.user_data.ethnicity,
    //     type: 'string'
    //   },
    //   description: {
    //     value_name: this.shared_data.user_data.description,
    //     type: 'string'
    //   },
    //   purpose: {
    //     value_name: this.shared_data.user_data.purpose,
    //     type: 'string'
    //   },
    //   pin: {
    //     value_name: this.shared_data.user_data.pin,
    //     type: 'string'
    //   },
    //   visionImpaired: {
    //     value_name: this.shared_data.user_data.disabilities[0],
    //     type: 'string'
    //   },
    //   wheelchairUser: {
    //     value_name: this.shared_data.user_data.disabilities[1],
    //     type: 'string'
    //   },
    //   allergies: {
    //     value_name: this.shared_data.user_data.allergies,
    //     type: 'string'
    //   },
    //   medications: {
    //     value_name: this.shared_data.user_data.medications,
    //     type: 'string'
    //   },
    //   emergencyContact1Name: {
    //     value_name: this.shared_data.user_data.emergency_contacts[0]?.name,
    //     type: 'string'
    //   },
    //   emergencyContact1Number: {
    //     value_name: this.shared_data.user_data.emergency_contacts[0]?.number,
    //     type: 'string'
    //   },
    //   emergencyContact2Name: {
    //     value_name: this.shared_data.user_data.emergency_contacts[1]?.name,
    //     type: 'string'
    //   },
    //   emergencyContact2Number: {
    //     value_name: this.shared_data.user_data.emergency_contacts[1]?.number,
    //     type: 'string'
    //   },
    //   emergencyContact3Name: {
    //     value_name: this.shared_data.user_data.emergency_contacts[2]?.name,
    //     type: 'string'
    //   },
    //   emergencyContact3Number: {
    //     value_name: this.shared_data.user_data.emergency_contacts[2]?.number,
    //     type: 'string'
    //   },
    //   emergencyContact4Name: {
    //     value_name: this.shared_data.user_data.emergency_contacts[3]?.name,
    //     type: 'string'
    //   },
    //   emergencyContact4Number: {
    //     value_name: this.shared_data.user_data.emergency_contacts[3]?.number,
    //     type: 'string'
    //   },
    //   emergencyContact5Name: {
    //     value_name: this.shared_data.user_data.emergency_contacts[4]?.name,
    //     type: 'string'
    //   },
    //   emergencyContact5Number: {
    //     value_name: this.shared_data.user_data.emergency_contacts[4]?.number,
    //     type: 'string'
    //   },
    //   call_113: {
    //     value_name: this.shared_data.user_data.public_emergency_contacts[113],
    //     type: 'string'
    //   },
    //   call_115: {
    //     value_name: this.shared_data.user_data.public_emergency_contacts[115],
    //     type: 'string'
    //   },
    //   call_118: {
    //     value_name: this.shared_data.user_data.public_emergency_contacts[118],
    //     type: 'string'
    //   },
    //   jewel1ID: {
    //     value_name: this.shared_data.user_data.paired_devices[0]?.id,
    //     type: 'string'
    //   },
    //   jewel2ID: {
    //     value_name: this.shared_data.user_data.paired_devices[1]?.id,
    //     type: 'string'
    //   },
    //   QR1: {
    //     value_name: this.shared_data.user_data.qr_code[0].id,
    //     type: 'string'
    //   },
    //   QR2: {
    //     value_name: this.shared_data.user_data.qr_code[1].id,
    //     type: 'string'
    //   },
    //   QR3: {
    //     value_name: this.shared_data.user_data.qr_code[2].id,
    //     type: 'string'
    //   },
    //   QR4: {
    //     value_name: this.shared_data.user_data.qr_code[3].id,
    //     type: 'string'
    //   },
    //   NFC1: {
    //     value_name: this.shared_data.user_data.nfc_code[0].id,
    //     type: 'string'
    //   },
    //   NFC2: {
    //     value_name: this.shared_data.user_data.nfc_code[1].id,
    //     type: 'string'
    //   },
    //   NFC3: {
    //     value_name: this.shared_data.user_data.nfc_code[2].id,
    //     type: 'string'
    //   },
    //   NFC4: {
    //     value_name: this.shared_data.user_data.nfc_code[3].id,
    //     type: 'string'
    //   },
    // }

  }
  getQRNFCEventPayload() {
    var newQRNFCEvent = [];
    Object.keys(QRNFCEvent).forEach((element) => {
      newQRNFCEvent[element] = this.createField(element)
    })
    return newQRNFCEvent;
  }
}
