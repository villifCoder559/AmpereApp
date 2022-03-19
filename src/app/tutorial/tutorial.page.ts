import { AfterContentChecked, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { SwiperComponent } from 'swiper/angular';
import { Pagination } from 'swiper'
import SwiperCore from 'swiper'
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { Storage } from '@ionic/storage-angular';

SwiperCore.use([Pagination]);
@Component({
  selector: 'app-tutorial',
  templateUrl: './tutorial.page.html',
  styleUrls: ['./tutorial.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TutorialPage implements AfterContentChecked {
  @ViewChild('swiper') swiper: SwiperComponent;
  constructor(private storage: Storage, private router: Router, private auth: AuthenticationService) { }
  ngAfterContentChecked(): void {
    if (this.swiper) {
      this.swiper.updateSwiper({})
    }
  }
  goToLoginPage() {
    this.storage.set('tutorial_read', true).then((value) => {
      if (this.auth.isAuthenticated.getValue())
        this.router.navigateByUrl('profile/homepage/faq', { replaceUrl: true })
      else
        this.router.navigateByUrl('/login', { replaceUrl: true })
    },err=>console.log(err))
  }
  ngOnInit() {

  }

}