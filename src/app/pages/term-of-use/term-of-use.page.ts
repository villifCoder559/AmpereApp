import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-term-of-use',
  templateUrl: './term-of-use.page.html',
  styleUrls: ['./term-of-use.page.scss'],
})
export class TermOfUsePage implements OnInit {
  urlSafe: any;

  constructor(public sanitizier: DomSanitizer) {
    this.urlSafe=this.sanitizier.bypassSecurityTrustResourceUrl('https://www.snap4city.org/drupal/legal');
  }

  ngOnInit() {
  }

}
