import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, NgModule } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';

export enum Entity {
  USERID = 'UserID',
  EVENT = 'Event',
  NFC = 'NFC',
  QR = ''
}
@NgModule({
  providers: [HttpClient]
})
@Injectable({
  providedIn: 'root'
})
export class NGSIv2QUERYService {
  endpoint = 'https://broker1.snap4city.org:8080/v1/queryContext?elementid=angelo-prova780'
  httpOptions = {
    headers: new HttpHeaders({ 'Accept': 'application/json', Autentication: this.authService?.keycloak?.token })
  };
  constructor(public http: HttpClient, private authService: AuthenticationService) { }
  testAPIGetEntities() {
    return new Promise((resolve, reject) => {
      var query = {
        "entities": [
          {
            "type": "Ambiental",
            "isPattern": false,
            "id": "mypersonaldatatester-device"
          }
        ],
        "attributes": [
          "temperature"
        ],
      }
      this.http.post(this.endpoint, query, this.httpOptions).subscribe((value) => {
        console.log(value)
        resolve(true)
      }, (err) => reject(err))
    })
  }
  testRegisterEntity() {
    return new Promise((resolve, reject) => {
      var query = {
        "entities": [
          {
            "type": "Ambiental",
            "isPattern": false,
            "id": "mypersonaldatatester-device"
          }
        ],
        "attributes": [
          "temperature"
        ]
      }
      this.http.post(this.endpoint, query, this.httpOptions).subscribe((result) => {
        resolve(result)
      }, (err) => {
        reject(err);
      })
    })
  }
  registerEntity(entity: Entity, userID: number, data) {
    return new Promise((resolve, reject) => {
      resolve(true)
      // data['id'] = userID;
      // data['type'] = entity;
      // this.http.post(this.endpoint, data, this.httpOptions).subscribe((result) => {
      //   resolve(result)
      // }, (err) => {
      //   reject(err);
      // })
    })
  }
  updateEntity(entity: Entity) {
    return new Promise((resolve, reject) => {
      resolve(true)
      //   this.http.get(this.endpoint + '/' + entity, this.httpOptions).subscribe((result) => {
      //     resolve(result)
      //   }, (err) => {
      //     reject(err);
      //   })
    })
  }
  updateEntityAttribute(entity: Entity, name_attribute: string, value_attribute) {
    return new Promise((resolve, reject) => {
      resolve(true)
      //   this.http.put(this.endpoint + '/' + entity + '/' + '/' + name_attribute, +'/' + value_attribute, { headers: { 'Content-Type': 'text/plain' } }).subscribe((entity) => {
      //     resolve(entity)
      //   }, (err) => {
      //     reject(err);
      //   })
    })
  }
  getEntity(entity: Entity, compact_mode: boolean = true) {
    return new Promise((resolve, reject) => {
      resolve(true)
      //   this.http.get(this.endpoint + '/' + entity + '/' + compact_mode ? '?options=keyValues' : '', { headers: { 'Accept': 'application/json' } }).subscribe((entity) => {
      //     resolve(entity)
      //   }, (err) => {
      //     reject(err);
      //   })
    })
  }
}
