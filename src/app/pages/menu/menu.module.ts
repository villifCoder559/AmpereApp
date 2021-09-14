import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MenuPageRoutingModule } from './menu-routing.module';

import { MenuPage } from './menu.page';
import { Routes } from '@angular/router';
import { MaterialModule } from '../../material-module'


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MenuPageRoutingModule,
    MaterialModule
  ],
  declarations: [MenuPage]
})
export class MenuPageModule { }
