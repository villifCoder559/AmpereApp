import { Component, OnInit } from '@angular/core';
import { Router, RouterEvent } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { SharedDataService } from 'src/app/data/shared-data.service';
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
      url: '/profile/menu/homepage'
    },
    {
      title: 'Emergency contacts',
      url: '/profile/menu/callemergencycontacts'
    },
    {
      title: 'Webpage',
      url: '/profile/menu/webpage'
    },
    {
      title: 'Devices Status',
      url: '/profile/menu/testAlert'
    },
    {
      title: 'Term of Use',
      url: '/profile/menu/termOfUse'
    },
    {
      title: 'Privacy Policy',
      url: '/profile/menu/privacyPolicy'
    }
  ]
  selectedPath = ''
  constructor(private ctrlMenu: MenuController, private router: Router, private authService: AuthenticationService, public shared_data: SharedDataService) {
    console.log('costruttore')
    this.router.events.subscribe((event: RouterEvent) => {
      this.selectedPath = event.url
    })
  }
  go_back() {
    this.router.navigateByUrl('/', { replaceUrl: true })
  }
  ngOnInit() {

  }
  logout() {
    this.ctrlMenu.close().then(() => {
      console.log('logout');
      this.authService.isAuthenticated.next(false)
      console.log('autentcated.next is false')
      this.authService.logout();
      this.router.navigateByUrl('/login', { replaceUrl: true });
    })
  }
}
