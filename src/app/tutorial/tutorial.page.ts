import { AfterContentChecked, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { SwiperComponent } from 'swiper/angular';
import { Pagination, SwiperOptions } from 'swiper'
import SwiperCore from 'swiper'
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { Storage } from '@ionic/storage-angular';
import { StorageService } from '../data/storage.service';

SwiperCore.use([Pagination]);
@Component({
  selector: 'app-tutorial',
  templateUrl: './tutorial.page.html',
  styleUrls: ['./tutorial.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TutorialPage implements AfterContentChecked {
  @ViewChild('swiper') swiper: SwiperComponent;

  constructor(private storage: StorageService, private router: Router, private auth: AuthenticationService) { }
  ngAfterContentChecked(): void {
    if (this.swiper) {
      this.swiper.updateSwiper({})
    }
  }
  goToLoginPage() {
    this.storage.set('tutorial_read', true)
    if (this.auth.isAuthenticated.getValue())
      this.router.navigateByUrl('/profile/menu/faq', { replaceUrl: true })
    else
      this.router.navigateByUrl('/login', { replaceUrl: true })
  }
  ngOnInit() {

  }
  next() {
    this.swiper.swiperRef.slideNext();
  }
  back() {
    this.swiper.swiperRef.slidePrev();
  }
}
