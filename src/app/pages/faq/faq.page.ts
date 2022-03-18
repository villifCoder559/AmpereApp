import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedDataService } from 'src/app/data/shared-data.service';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.page.html',
  styleUrls: ['./faq.page.scss'],
})
export class FaqPage implements OnInit {
  collapsedHeight = '90px';
  constructor(private router: Router, private shared_data: SharedDataService) { }

  ngOnInit() {
  }
  startTour() {
    this.router.navigateByUrl('profile/menu/homepage').finally(()=>{
      setTimeout(()=>{
        this.shared_data.startTour();
      },500)
    })
  }
  openTutorial() {
    this.router.navigateByUrl('tutorial', { replaceUrl: true })
  }
}
