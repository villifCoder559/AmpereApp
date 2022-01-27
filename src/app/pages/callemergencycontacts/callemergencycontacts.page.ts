import { Component, OnInit } from '@angular/core';
import { SharedDataService } from 'src/app/data/shared-data.service';
import { CallNumber } from '@awesome-cordova-plugins/call-number/ngx'

@Component({
  selector: 'app-callemergencycontacts',
  templateUrl: './callemergencycontacts.page.html',
  styleUrls: ['./callemergencycontacts.page.scss'],
})
export class CallemergencycontactsPage implements OnInit {
  constructor(public shared_data:SharedDataService,private callNumber: CallNumber) { }

  ngOnInit() {
    console.log(this.shared_data.user_data)
  }
  call(contact){
    this.callNumber.callNumber(contact.number,true).then(()=>{
      console.log('launch dialer')
    },err=>alert('error launching dialer'))
  }
}
