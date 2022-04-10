import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { TourService } from 'ngx-ui-tour-md-menu';
import { LanguageService } from 'src/app/data/language.service';
import { SharedDataService } from 'src/app/data/shared-data.service';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.page.html',
  styleUrls: ['./faq.page.scss'],
})
export class FaqPage implements OnInit {
  urlSafe;
  constructor(private translate:TranslateService,private tourService: TourService,private languageService: LanguageService, private router: Router, private shared_data: SharedDataService, public sanitizier: DomSanitizer) {
    if (this.languageService.selected_language.value == 'it')
      this.urlSafe = this.sanitizier.bypassSecurityTrustResourceUrl('https://www.snap4city.org/drupal/node/781');
    else
      this.urlSafe = this.sanitizier.bypassSecurityTrustResourceUrl('https://www.snap4city.org/drupal/node/782');
  }

  ngOnInit() {
    // setTimeout(()=>{
    //   this.tourService.initialize([{
    //     anchorId:'button_tour',
    //     title: this.translate.instant('FAQ.tour.button_tour.title'),
    //     content: this.translate.instant('FAQ.tour.button_tour.content'),
    //     prevBtnTitle:this.translate.instant('TOUR.button.previous'),
    //     endBtnTitle:this.translate.instant('TOUR.button.end'),
    //     enableBackdrop: true
    //   }])
    //   this.tourService.start();
    // },1200)
  }
  startTour() {
    this.router.navigateByUrl('profile/menu/homepage').finally(() => {
      setTimeout(() => {
        this.shared_data.startTour();
      }, 650)
    })
  }
  ngOnDestroy(){

  }
}
