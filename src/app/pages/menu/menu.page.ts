import { Component, OnInit } from '@angular/core';
import { Router, RouterEvent } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {
  pages=[
    {
      title:'Homepage',
      url:'/menu/homepage'
    },
    {
      title:'Profile',
      url:'/menu/profile'
    },
    {
      title:'Devices Status',
      url:'/menu/testAlert'
    },
    {
      title:'NFC Reader',
      url:'/menu/read-nfc'
    },
    {
      title:'QR Reader',
      url:'/menu/read-qr'
    },
    {
      title:'FAQ',
      url:'/menu/faq'
    },
    {
      title:'Term of Use',
      url:'/menu/termOfUse'
    },
    {
      title:'Privacy Policy',
      url:'/menu/privacyPolicy'
    },

  ]
  selectedPath=this.pages[0].url
  constructor(private router:Router,private authService: AuthenticationService) { 
    this.router.events.subscribe((event:RouterEvent)=>{
      this.selectedPath=event.url
    })
  }
  go_back(){
    this.router.navigateByUrl('/',{replaceUrl:true})
  }
  ngOnInit() {
  }
  async logout() {
    await this.authService.logout();
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }

}
