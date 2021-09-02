import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.page.html',
  styleUrls: ['./intro.page.scss'],
})
export class IntroPage implements OnInit {
  @ViewChild(IonSlides)slides: IonSlides;
 
  constructor(private router: Router) { }
 
  ngOnInit() {
  }
 
  next() {
    this.slides.slideNext();
  }
 
  async start() {
    window.localStorage.setItem('INTRO_KEY','true')
    this.router.navigateByUrl('/login', { replaceUrl:true });
  }
}
