import { Injectable } from '@angular/core';
import { SharedDataService } from '../data/shared-data.service'

@Injectable({
  providedIn: 'root'
})
export class Snap4CityService {

  constructor(private shared_data: SharedDataService) {
  }
  getUserIDPayload() {
    return {
      dataObserved: {
        value: Date.now(),
        type: 'string'
      },
      name: {
        value: this.shared_data.user_data.name,
        type: 'string'
      },
      email: {
        value: this.shared_data.user_data.email,
        type: 'string'
      },
      surname: {
        value: this.shared_data.user_data.surname,
        type: 'string'
      },
      phoneNumber: {
        value: this.shared_data.user_data.name,
        type: 'string'
      },
      dateofborn: {
        value: this.shared_data.user_data.birthdate,
        type: 'string'
      },
      gender: {
        value: this.shared_data.user_data.gender,
        type: 'status'
      },
      address: {
        value: this.shared_data.user_data.address,
        type: 'string'
      },
      locality: {
        value: this.shared_data.user_data.locality,
        type: 'string'
      },
      city: {
        value: this.shared_data.user_data.city,
        type: 'string'
      },
      height: {
        value: this.shared_data.user_data.height,
        type: 'string'
      },
      weight: {
        value: this.shared_data.user_data.weight,
        type: 'string'
      },
      ethnicity: {
        value: this.shared_data.user_data.ethnicity,
        type: 'string'
      },
      description: {
        value: this.shared_data.user_data.description,
        type: 'string'
      },
      purpose: {
        value: this.shared_data.user_data.purpose,
        type: 'string'
      },
      pin: {
        value: this.shared_data.user_data.pin,
        type: 'string'
      },
      visionImpaired: {
        value: this.shared_data.user_data.disabilities[0],
        type: 'string'
      },
      wheelchairUser: {
        value: this.shared_data.user_data.disabilities[1],
        type: 'string'
      },
      allergies: {
        value: this.shared_data.user_data.allergies,
        type: 'string'
      },
      medications: {
        value: this.shared_data.user_data.medications,
        type: 'string'
      },
      emergencyContact1Name: {
        value: this.shared_data.user_data.emergency_contacts[0]?.name,
        type: 'string'
      },
      emergencyContact1Number: {
        value: this.shared_data.user_data.emergency_contacts[0]?.number,
        type: 'string'
      },
      emergencyContact2Name: {
        value: this.shared_data.user_data.emergency_contacts[1]?.name,
        type: 'string'
      },
      emergencyContact2Number: {
        value: this.shared_data.user_data.emergency_contacts[1]?.number,
        type: 'string'
      },
      emergencyContact3Name: {
        value: this.shared_data.user_data.emergency_contacts[2]?.name,
        type: 'string'
      },
      emergencyContact3Number: {
        value: this.shared_data.user_data.emergency_contacts[2]?.number,
        type: 'string'
      },
      emergencyContact4Name: {
        value: this.shared_data.user_data.emergency_contacts[3]?.name,
        type: 'string'
      },
      emergencyContact4Number: {
        value: this.shared_data.user_data.emergency_contacts[3]?.number,
        type: 'string'
      },
      emergencyContact5Name: {
        value: this.shared_data.user_data.emergency_contacts[4]?.name,
        type: 'string'
      },
      emergencyContact5Number: {
        value: this.shared_data.user_data.emergency_contacts[4]?.number,
        type: 'string'
      },
      call_113: {
        value: this.shared_data.user_data.public_emergency_contacts[113],
        type: 'string'
      },
      call_115: {
        value: this.shared_data.user_data.public_emergency_contacts[115],
        type: 'string'
      },
      call_118: {
        value: this.shared_data.user_data.public_emergency_contacts[118],
        type: 'string'
      },
      jewel1ID: {
        value: this.shared_data.user_data.paired_devices[0]?.id,
        type: 'string'
      },
      jewel2ID: {
        value: this.shared_data.user_data.paired_devices[1]?.id,
        type: 'string'
      },
      QR1: {
        value: this.shared_data.user_data.qr_code[0].id,
        type: 'string'
      },
      QR2: {
        value: this.shared_data.user_data.qr_code[1].id,
        type: 'string'
      },
      QR3: {
        value: this.shared_data.user_data.qr_code[2].id,
        type: 'string'
      },
      QR4: {
        value: this.shared_data.user_data.qr_code[3].id,
        type: 'string'
      },
      NFC1: {
        value: this.shared_data.user_data.nfc_code[0].id,
        type: 'string'
      },
      NFC2: {
        value: this.shared_data.user_data.nfc_code[1].id,
        type: 'string'
      },
      NFC3: {
        value: this.shared_data.user_data.nfc_code[2].id,
        type: 'string'
      },
      NFC4: {
        value: this.shared_data.user_data.nfc_code[3].id,
        type: 'string'
      },
    }
  }
  getQRNFCEventPayload() {
    return {
      dataObserved: {
        value: new Date().toISOString(),
        type: 'string'
      },
      QRIDorNFC: {
        value: 'QR',
        type: 'string'
      },
      identifier: {
        value: '0',
        type: 'string'
      },
      action: {
        value: 'testfromAPP',
        type: 'string'
      }
    }
  }
}
