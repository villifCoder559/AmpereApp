import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import {Contacts} from '@ionic-native/contacts'
import { BLE } from '@ionic-native/ble/ngx'
import {MaterialModule} from '../app/material-module';
@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, BrowserAnimationsModule,MatFormFieldModule,
            IonicModule.forRoot(), AppRoutingModule,HttpClientModule,MaterialModule
            ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },Contacts,BLE],
  bootstrap: [AppComponent],
})
export class AppModule {}
