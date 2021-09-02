import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { MatSelectModule } from "@angular/material/select";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import {Contacts} from '@ionic-native/contacts'
@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [MatInputModule,MatIconModule,MatSelectModule,BrowserModule, BrowserAnimationsModule,MatFormFieldModule,
            IonicModule.forRoot(), AppRoutingModule,HttpClientModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },Contacts],
  bootstrap: [AppComponent],
})
export class AppModule {}
