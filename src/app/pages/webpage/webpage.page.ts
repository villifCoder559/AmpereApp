import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-webpage',
  templateUrl: './webpage.page.html',
  styleUrls: ['./webpage.page.scss'],
})

export class WebpagePage implements OnInit {
  urlSafe;
  constructor(public sanitizier: DomSanitizer) {
    this.urlSafe=this.sanitizier.bypassSecurityTrustResourceUrl('https://www.snap4city.org/707');
  }

  ngOnInit() {
  }

}
