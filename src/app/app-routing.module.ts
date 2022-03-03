import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { BLE } from '@ionic-native/ble/ngx'
import { AuthGuardService } from './guards/auth-guard.service'
const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule),
    canLoad: [],
  },
  {
    path: 'signup',
    loadChildren: () => import('./pages/signup/signup.module').then(m => m.SignupPageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./pages/menu/menu.module').then(m => m.MenuPageModule),
    canActivate:[AuthGuardService]
  },
  {
    path: 'show-alert',
    loadChildren: () => import('./show-alert/show-alert.module').then(m => m.ShowAlertPageModule),
  },
  {
    path: '',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule),
    canLoad: [],
  },
  {
    path: 'webpage',
    loadChildren: () => import('./pages/webpage/webpage.module').then( m => m.WebpagePageModule)
  },
  {
    path: 'callemergencycontacts',
    loadChildren: () => import('./pages/callemergencycontacts/callemergencycontacts.module').then( m => m.CallemergencycontactsPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule],
  providers: [BLE]
})
export class AppRoutingModule { }
