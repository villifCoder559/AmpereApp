import { Injectable } from '@angular/core';
import { SharedDataService } from '../data/shared-data.service'
import { NGSIv2QUERYService, Entity } from '../data/ngsiv2-query.service'

@Injectable({
  providedIn: 'root'
})
export class Snap4CityService {

  constructor(private shared_data: SharedDataService, private NGSIv2QUERY: NGSIv2QUERYService) {

  }
  registrationUserSnap4City(id: number = -1) {
    return new Promise((resolve, reject) => {
      const query_entity = {
        dataObserved: {
          value: new Date().toTimeString(),
          type: 'timestamp'
        },
        name: {
          value: this.shared_data.user_data.name,
          type: 'name'
        },
        email: {
          value: this.shared_data.user_data.email,
          type: 'description'
        },
        surname: {
          value: this.shared_data.user_data.surname,
          type: 'description'
        },
        phoneNumber: {
          value: this.shared_data.user_data.name,
          type: 'description'
        },
        dateofborn: {
          value: this.shared_data.user_data.birthdate,
          type: 'date'
        },
        gender: {
          value: this.shared_data.user_data.gender,
          type: 'status'
        },
        address: {
          value: this.shared_data.user_data.address,
          type: 'description'
        },
        locality: {
          value: this.shared_data.user_data.locality,
          type: 'description'
        },
        city: {
          value: this.shared_data.user_data.city,
          type: 'description'
        },
        height: {
          value: this.shared_data.user_data.height,
          type: 'height'
        },
        weight: {
          value: this.shared_data.user_data.weight,
          type: 'weight'
        },
        ethnicity: {
          value: this.shared_data.user_data.ethnicity,
          type: 'description'
        },
        description: {
          value: this.shared_data.user_data.description,
          type: 'description'
        },
        purpose: {
          value: this.shared_data.user_data.purpose,
          type: 'description'
        },
        pin: {
          value: this.shared_data.user_data.pin,
          type: 'description'
        },
        visionImpaired: {
          value: this.shared_data.user_data.disabilities[0],
          type: 'description'
        },
        wheelchairUser: {
          value: this.shared_data.user_data.disabilities[1],
          type: 'description'
        },
        allergies: {
          value: this.shared_data.user_data.allergies,
          type: 'description'
        },
        medications: {
          value: this.shared_data.user_data.medications,
          type: 'description'
        },
        emergencyContact1Name: {
          value: this.shared_data.user_data.emergency_contacts[0]?.name,
          type: 'name'
        },
        emergencyContact1Number: {
          value: this.shared_data.user_data.emergency_contacts[0]?.number,
          type: 'description'
        },
        emergencyContact2Name: {
          value: this.shared_data.user_data.emergency_contacts[1]?.name,
          type: 'name'
        },
        emergencyContact2Number: {
          value: this.shared_data.user_data.emergency_contacts[1]?.number,
          type: 'description'
        },
        emergencyContact3Name: {
          value: this.shared_data.user_data.emergency_contacts[2]?.name,
          type: 'name'
        },
        emergencyContact3Number: {
          value: this.shared_data.user_data.emergency_contacts[2]?.number,
          type: 'description'
        },
        emergencyContact4Name: {
          value: this.shared_data.user_data.emergency_contacts[3]?.name,
          type: 'name'
        },
        emergencyContact4Number: {
          value: this.shared_data.user_data.emergency_contacts[3]?.number,
          type: 'description'
        },
        emergencyContact5Name: {
          value: this.shared_data.user_data.emergency_contacts[4]?.name,
          type: 'name'
        },
        emergencyContact5Number: {
          value: this.shared_data.user_data.emergency_contacts[4]?.number,
          type: 'description'
        },
        call_113: {
          value: this.shared_data.user_data.public_emergency_contacts[113],
          type: 'description'
        },
        call_115: {
          value: this.shared_data.user_data.public_emergency_contacts[115],
          type: 'description'
        },
        call_118: {
          value: this.shared_data.user_data.public_emergency_contacts[118],
          type: 'description'
        },
        jewel1ID: {
          value: this.shared_data.user_data.paired_devices[0]?.id,
          type: 'identifier'
        },
        jewel2ID: {
          value: this.shared_data.user_data.paired_devices[1]?.id,
          type: 'identifier'
        },
        QR1: {
          value: this.shared_data.user_data.qr_code[0].id,
          type: 'identifier'
        },
        QR2: {
          value: this.shared_data.user_data.qr_code[1].id,
          type: 'identifier'
        },
        QR3: {
          value: this.shared_data.user_data.qr_code[2].id,
          type: 'identifier'
        },
        QR4: {
          value: this.shared_data.user_data.qr_code[3].id,
          type: 'identifier'
        },
        NFC1: {
          value: this.shared_data.user_data.nfc_code[0].id,
          type: 'identifier'
        },
        NFC2: {
          value: this.shared_data.user_data.nfc_code[1].id,
          type: 'identifier'
        },
        NFC3: {
          value: this.shared_data.user_data.nfc_code[2].id,
          type: 'identifier'
        },
        NFC4: {
          value: this.shared_data.user_data.nfc_code[3].id,
          type: 'identifier'
        },
      }
      console.log(query_entity)
      if (id == -1)
        this.NGSIv2QUERY.registerEntity(Entity.EVENT, id, this.shared_data.user_data).then(() => {
          resolve(true)
        }, (err) => reject(err))
      else
        this.NGSIv2QUERY.updateEntity(Entity.USERID).then(() => {
          resolve(true)
        }, (err) => reject(err))
    })

  }
  getUserSnap4City() {
    var id = 0;
    var query = this.NGSIv2QUERY.getEntity(Entity.USERID)
  }
  updateSnap4City() {
    var id = 0;/* get id in some way */
    this.registrationUserSnap4City(id)
  }
}
