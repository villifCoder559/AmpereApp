import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, NgModule } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { Snap4CityService } from '../data/snap4-city.service'
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
  endpoint = 'https://https://iot-app.snap4city.org/orionfilter/orionAMPERE-UNIFI:443/v1'
  constructor(public http: HttpClient, private authService: AuthenticationService, private adapterS4C: Snap4CityService) { }
  testWriteAPI() {
    return new Promise((resolve, reject) => {
      var data = this.adapterS4C.getQRNFCEventPayload();
      console.log('test1')
      //console.log(JSON.stringify(data))
      $.ajax({
        url: "https://iot-app.snap4city.org/orionfilter/orionAMPERE-UNIFI/v2/entities/ampereuser1QRNFCEvent?elementid=ampereuser1QRNFCEvent&type=EventQRNFC",
        headers: {
          'Authorization': 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJOZVBpSFRvREtibWZzbl9hREtETGpGTHFKQXluTXNNWjZjS1lMeGRoS29zIn0.eyJqdGkiOiI0Yjg0YjBlNy02ZGFhLTRlOGEtYTliNi1kMzUwZThiNTU3ODEiLCJleHAiOjE2NDQzMjk2ODQsIm5iZiI6MCwiaWF0IjoxNjQzMDE1ODkxLCJpc3MiOiJodHRwczovL3d3dy5zbmFwNGNpdHkub3JnL2F1dGgvcmVhbG1zL21hc3RlciIsImF1ZCI6InBocC1pb3QtZGlyZWN0b3J5Iiwic3ViIjoiZGI1ZmU3NzYtMzA1YS00NDIwLWIyNDctODQzZmY1ZmFlMGNiIiwidHlwIjoiUmVmcmVzaCIsImF6cCI6InBocC1pb3QtZGlyZWN0b3J5Iiwibm9uY2UiOiJlNmRiZGEzNTBjMzllNjk2ZTlhNTYzMzc2NTRmMDg2MiIsImF1dGhfdGltZSI6MCwic2Vzc2lvbl9zdGF0ZSI6ImQ4NDc4NzVjLTc1MzQtNDVmZi04OTFhLWIyNDMyNzIzZDU3MSIsInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJ1bWFfYXV0aG9yaXphdGlvbiIsIk1hbmFnZXIiXX0sInJlc291cmNlX2FjY2VzcyI6eyJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19fQ.fukRqbFYq8OXHa70Yy3_PcJCxVw-dYh9vW1njAivcenGjfzNlEvS912S8lKSnhfzZV4xzQURDIwiLlSoZeVpsd5owbFd7icXPpbf_RqHhB4d-lPZieL7nD5zyVrKmuXcdxQC2D_YmTKdUc-MgpRXLbH9nSHGkzfne4_uCwy8xVsLK6zCVuW1AZI0Zoud6aK3ARdRMyod4V170Tf4aTjnvL0QhZq8PUlF7ogvk2pb4VhMYUfYECZHtbK9uxge6Fal9H4fgtpPHS8PxRJ8yLlq06fDo-jvdqn8EZfLMScWridpGYOATPLSVTjlXPnOOA_1RNwB1b7w26pygrtBfRrryAeyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJOZVBpSFRvREtibWZzbl9hREtETGpGTHFKQXluTXNNWjZjS1lMeGRoS29zIn0.eyJqdGkiOiI0Yjg0YjBlNy02ZGFhLTRlOGEtYTliNi1kMzUwZThiNTU3ODEiLCJleHAiOjE2NDQzMjk2ODQsIm5iZiI6MCwiaWF0IjoxNjQzMDE1ODkxLCJpc3MiOiJodHRwczovL3d3dy5zbmFwNGNpdHkub3JnL2F1dGgvcmVhbG1zL21hc3RlciIsImF1ZCI6InBocC1pb3QtZGlyZWN0b3J5Iiwic3ViIjoiZGI1ZmU3NzYtMzA1YS00NDIwLWIyNDctODQzZmY1ZmFlMGNiIiwidHlwIjoiUmVmcmVzaCIsImF6cCI6InBocC1pb3QtZGlyZWN0b3J5Iiwibm9uY2UiOiJlNmRiZGEzNTBjMzllNjk2ZTlhNTYzMzc2NTRmMDg2MiIsImF1dGhfdGltZSI6MCwic2Vzc2lvbl9zdGF0ZSI6ImQ4NDc4NzVjLTc1MzQtNDVmZi04OTFhLWIyNDMyNzIzZDU3MSIsInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJ1bWFfYXV0aG9yaXphdGlvbiIsIk1hbmFnZXIiXX0sInJlc291cmNlX2FjY2VzcyI6eyJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19fQ.fukRqbFYq8OXHa70Yy3_PcJCxVw-dYh9vW1njAivcenGjfzNlEvS912S8lKSnhfzZV4xzQURDIwiLlSoZeVpsd5owbFd7icXPpbf_RqHhB4d-lPZieL7nD5zyVrKmuXcdxQC2D_YmTKdUc-MgpRXLbH9nSHGkzfne4_uCwy8xVsLK6zCVuW1AZI0Zoud6aK3ARdRMyod4V170Tf4aTjnvL0QhZq8PUlF7ogvk2pb4VhMYUfYECZHtbK9uxge6Fal9H4fgtpPHS8PxRJ8yLlq06fDo-jvdqn8EZfLMScWridpGYOATPLSVTjlXPnOOA_1RNwB1b7w26pygrtBfRrryA',
          'Content-Type': 'application/json'
        },
        type: "PATCH",
        data: {
          payload: {
            action: {
              value: 'test1234',
              type: 'string'
            },
            dataObserved: {
              value: new Date().toISOString(),
              type: 'string'
            },
            identifier: {
              value: '85',
              type: 'string'
            },
            QRIDorNFC: {
              value: 'NFC',
              type: 'string'
            }
          }
        },
        async: true,
        dataType: 'json',
        success: function (mydata) {
          if (mydata.status != 'ko') {
            console.log('Data')
            console.log(mydata);
            resolve(mydata)
          }
          else {
            reject(mydata)
          }
        },
        error: function (err) {
          console.log("Insert values pool KO");
          console.log(err);
          reject(err)
        }
      });
    })
  }
  checkValidityToken() {

  }
  testAPIGetEntities() {
    return new Promise((resolve, reject) => {
      var data = this.adapterS4C.getQRNFCEventPayload();
      console.log('test1')
      //console.log(JSON.stringify(data))
      $.ajax({
        url: "https://iot-app.snap4city.org/orionfilter/orionAMPERE-UNIFI/v2/entities/ampereuser1QR-NFC-Event?elementid=ampereuser1QR-NFC-Event&type=QR-NFC-Event",
        type: "GET",
        headers:{
          'Content-Type': 'application/json'
        },
        async: true,
        dataType: 'json',
        success: function (mydata) {
          if (mydata.status != 'ko') {
            console.log('Data')
            console.log(mydata);
            resolve(mydata)
          }
          else {
            reject(mydata)
          }
        },
        error: function (err) {
          console.log("Insert values pool KO");
          console.log(err);
          reject(err)
        }
      });
    })
  }
  getDeviceData() {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: "https://iotdirectory.snap4city.org/api/device.php",
        data: {
          action: "get_device_data",
          id: 'ampereuser1QRNFCEvent',
          type: 'EventQRNFC',
          version: 'v2',
          contextbroker: 'orionAMPERE-UNIFI'
        },
        type: "POST",
        async: true,
        dataType: 'json',
        success: function (mydata) {
          if (mydata.status != 'ko') {
            console.log(mydata)
            resolve(mydata)
          }
          else {
            reject(mydata)
          }
        },
        error: function (err) {
          console.log(err)
          reject(err)
        }
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
