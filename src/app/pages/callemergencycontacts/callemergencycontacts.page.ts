import { Component, OnInit } from '@angular/core';
import { SharedDataService } from 'src/app/data/shared-data.service';
import { CallNumber } from '@awesome-cordova-plugins/call-number/ngx'
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'app-callemergencycontacts',
  templateUrl: './callemergencycontacts.page.html',
  styleUrls: ['./callemergencycontacts.page.scss'],
})
export class CallemergencycontactsPage implements OnInit {
  formGroup = this._formBuilder.group({
    contactName:[],
    contactSurname:[],
    contactNumber:[]
  });
  constructor(private router:Router,public shared_data:SharedDataService,private callNumber: CallNumber,private _formBuilder: FormBuilder) { }

  ngOnInit() {
    console.log(this.shared_data.user_data)
  }
  call(contact){
    this.callNumber.callNumber(contact.number,true).then(()=>{
      console.log('launch dialer')
    },err=>alert('error launching dialer'))
  }
  go_to_deviceSettings(){
    this.router.navigateByUrl('/profile/menu/profile', { replaceUrl: true, state: { page: 2 } })
  }
}
