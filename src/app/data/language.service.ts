import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { StorageService } from './storage.service';

const LNG_KEY = 'SELECTED_LANGUAGE';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  selected_language:any;
  constructor(private translate: TranslateService, private storage: StorageService, private plt: Platform) { 
    this.setInitialAppLanguage();
  }
  setInitialAppLanguage() {
    return new Promise((resolve)=>{
      let language = this.translate.getBrowserLang();
      console.log(language)
      let list_lng = this.getLanguages();
      let index=list_lng.findIndex((item) => item.value==language);
      console.log(index)
      if (index==-1)
        index=0;
      this.translate.setDefaultLang(list_lng[index].value)
        this.storage.get(LNG_KEY).then((val) => {
          if (val) {
            this.setLanguage(val);
          }
          else{
            this.setLanguage(list_lng[index]);
          }
          resolve(true)
          console.log('SetLanguage')
        })
    })
  }
  setLanguage(lng) {
    this.translate.use(lng.value)
    this.selected_language = lng;
    this.storage.set(LNG_KEY, lng)
  }
  getLanguages() {
    return [
      { text: 'English', value: 'en', img: 'gb' },
      { text: 'Italiano', value: 'it', img: 'it' }
    ]
  }
}