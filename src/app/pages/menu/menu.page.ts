import { Component, OnInit } from '@angular/core';
import { Router, RouterEvent } from '@angular/router';
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
      title: 'Profile',
      url: '/profile/menu/profile'
    },
    {
      title: 'Devices Status',
      url: '/profile/menu/testAlert'
    },
    {
      title: 'NFC Reader',
      url: '/profile/menu/read-nfc'
    },
    {
      title: 'QR Reader',
      url: '/profile/menu/read-qr'
    },
    {
      title: 'FAQ',
      url: '/profile/menu/faq'
    },
    {
      title: 'Term of Use',
      url: '/profile/menu/termOfUse'
    },
    {
      title: 'Privacy Policy',
      url: '/profile/menu/privacyPolicy'
    },

  ]
  selectedPath = ''
  constructor(private router: Router, private authService: AuthenticationService) {
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
  async logout() {
    await this.authService.logout().then(() => {
      this.router.navigateByUrl('/login', { replaceUrl: true });
    });
  }

}
