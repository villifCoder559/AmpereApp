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
  testWriteAPI(){
    return new Promise((resolve, reject) => {
      var data = this.adapterS4C.getQRNFCEventPayload();
      console.log('test1')
      //console.log(JSON.stringify(data))
      $.ajax({
        url: "https://iot-app.snap4city.org/orionfilter/orionAMPERE-UNIFI/v2/entities/ampereuser1QRNFCEvent?elementid=ampereuser1QRNFCEvent&type=EventQRNFC",
        headers:{
          Authentication:'Bearer eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJOZVBpSFRvREtibWZzbl9hREtETGpGTHFKQXluTXNNWjZjS1lMeGRoS29zIn0.eyJqdGkiOiJjMmQwOGQzZS1mZjkzLTQ2YmYtOGQ5Yi1hYWZjMjJkZWJmZWYiLCJleHAiOjE2NDIyNjMyNjIsIm5iZiI6MCwiaWF0IjoxNjQwMTkzOTU1LCJpc3MiOiJodHRwczovL3d3dy5zbmFwNGNpdHkub3JnL2F1dGgvcmVhbG1zL21hc3RlciIsImF1ZCI6InBocC1pb3QtZGlyZWN0b3J5Iiwic3ViIjoiZGI1ZmU3NzYtMzA1YS00NDIwLWIyNDctODQzZmY1ZmFlMGNiIiwidHlwIjoiUmVmcmVzaCIsImF6cCI6InBocC1pb3QtZGlyZWN0b3J5Iiwibm9uY2UiOiIzODQxNmViOWFjNzEwZDJlNjE4ODZkNDhjZTYwYjY4OSIsImF1dGhfdGltZSI6MCwic2Vzc2lvbl9zdGF0ZSI6IjJmZjM0NTI3LTQ3Y2ItNGU2Ni1hNzZjLTQ0MjRhZDhhOGU5MiIsInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJ1bWFfYXV0aG9yaXphdGlvbiIsIk1hbmFnZXIiXX0sInJlc291cmNlX2FjY2VzcyI6eyJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19fQ.fuEDdPdU2hFyre2DBxHbg65ycWEupT-N1vyt0kng3I6ZNMfKaQNtYTqKkbLD8lpUO0lmiK2Fzfl_0_4PPTVBlh97grSOXgaD5rxaYkZRTwRJ5WzwvoY9x62XelquA66yVO6zxDXuEF_tsh2srpiH8D6eWR2oSajpXka5y6Qtfw6bMquGqGP-_Ic0Ma1_1NhBSKJn31Di3Co6VvsXDSj7bFD9pMB4ecMeDEWdxrJjweAoMSDFuKrIWE7toOZd8ptBsvjMnDvupGCqgiyIV6mHHijsZ0Iu6oRZ0dsxsHbfTr8bRG6fBEYQ_Jef0-wvl-5Yn7SqclNpf6yTTxCoXoSYqw'
        },
        type: "POST",
        data:{
          payload:{
            action:{
              value:'test1234',
              type:'string'
            },
            dataObserved:{
              value: new Date().toISOString(),
              type:'string'
            },
            identifier:{
              value:'85',
              type:'string'
            },
            QRIDorNFC:{
              value:'NFC',
              type:'string'
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
  testAPIGetEntities() {
    return new Promise((resolve, reject) => {
      var data = this.adapterS4C.getQRNFCEventPayload();
      console.log('test1')
      //console.log(JSON.stringify(data))
      $.ajax({
        url: "https://iot-app.snap4city.org/orionfilter/orionAMPERE-UNIFI/v2/entities/ampereuser1QRNFCEvent?elementid=ampereuser1QRNFCEvent&type=EventQRNFC",
        type: "GET",
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
          contextbroker: 'orionAMPERE-UNIFI',
          token: "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJOZVBpSFRvREtibWZzbl9hREtETGpGTHFKQXluTXNNWjZjS1lMeGRoS29zIn0.eyJqdGkiOiIzNGJlNTZkNC1hMzk0LTRmMjUtYWEyOC1kMDk3ZmI2OTI3MTciLCJleHAiOjE2NDIyNjA3NzksIm5iZiI6MCwiaWF0IjoxNjQwMTg4NzA0LCJpc3MiOiJodHRwczovL3d3dy5zbmFwNGNpdHkub3JnL2F1dGgvcmVhbG1zL21hc3RlciIsImF1ZCI6InBocC1pb3QtZGlyZWN0b3J5Iiwic3ViIjoiM2Q0ZTk1ZmQtNmI1Ni00YjM2LWIxMTMtOTM0ZGRlN2EzMmQwIiwidHlwIjoiUmVmcmVzaCIsImF6cCI6InBocC1pb3QtZGlyZWN0b3J5Iiwibm9uY2UiOiIxZmZiNjE3MWQwNzliZjc0MTEyMmEwMDU2OGQ5ZjRmZCIsImF1dGhfdGltZSI6MCwic2Vzc2lvbl9zdGF0ZSI6IjQwN2QzZjcxLWQ5YTEtNGExYS1iOGI1LTBmZjA0NWZkZDM3YiIsInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJBcmVhTWFuYWdlciIsInVtYV9hdXRob3JpemF0aW9uIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fX0.Xozopvm8unIteb3lHkwMyI11MpI7X6ejl8mCS1jUoul1dH6suH_KTAK5Fzs_0YJ2DVBSyIH4JjH-0SUG5_CQ741odH06jtuAlkJhAvtATnFXc_R3v1aOc-SBF4NJAhUpbi1XPLI9vneSZNlbPnHfI2dD5QHwQYv-PphAJvOkuJrDCvFO-5qHYxWv3OegqexYLU_2L8Djew7AilHPMJq6WfuU6FNaCYWk4E3vTIUCWtDJcX8THD7bt2abzqYMt6ESlt11J0i8Kk7X7UnLs42MKI1pB9UawVI1uPmFI9RiJq05qqF_Ue8GL9qyWc7z4omXLKuAF15CxJyX25c5g95d4A"
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
