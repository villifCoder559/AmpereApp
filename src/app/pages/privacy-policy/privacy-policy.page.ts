import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.page.html',
  styleUrls: ['./privacy-policy.page.scss'],
})
export class PrivacyPolicyPage implements OnInit {
  urlSafe: any;

  constructor(public sanitizier: DomSanitizer) {
    this.urlSafe=this.sanitizier.bypassSecurityTrustResourceUrl('https://www.snap4city.org/49');
  }

  ngOnInit() {
  }

}
