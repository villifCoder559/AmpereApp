import { Component, OnInit } from '@angular/core';
import { Router, RouterEvent } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { SharedDataService, UserData } from 'src/app/data/shared-data.service';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {
  pages = [
    {
      title: 'Homepage',
      url: '/profile/menu/homepage',
      icon: 'home',
    },
    {
      title: 'Emergency contacts',
      url: '/profile/menu/callemergencycontacts',
      icon: 'people',
    },
    {
      title: 'Webpage',
      url: '/profile/menu/webpage',
      icon: 'earth',
    },
    {
      title: 'Devices Status',
      url: '/profile/menu/testAlert',
      icon: 'phone-portrait',
    },
    {
      title: 'Term of Use',
      url: '/profile/menu/termOfUse',
      icon: 'document',
    },
    {
      title: 'Privacy Policy',
      url: '/profile/menu/privacyPolicy',
      icon: 'document',
    }
  ]
  selectedPath = ''
  constructor(private ctrlMenu: MenuController, private router: Router, private authService: AuthenticationService, public shared_data: SharedDataService) {
    console.log('costruttore')
    this.router.events.subscribe((event: RouterEvent) => {
      this.selectedPath = event.url;
    })
  }
  go_back() {
    this.router.navigateByUrl('/', { replaceUrl: true })
  }
  ngOnInit() {

  }
  logout() {
    this.shared_data.presentLoading('Logout...')
    this.ctrlMenu.close().then(() => {
      console.log('logout');
      this.shared_data.user_data = new UserData();
      this.authService.logout().then(() => {
        this.shared_data.dismissLoading()
      }, err => {
        this.shared_data.dismissLoading();
        alert(err.msg);
      })
    })
  }
}
