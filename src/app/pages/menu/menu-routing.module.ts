import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MenuPage } from './menu.page';

const routes: Routes = [
  {
    path: 'menu',
    component: MenuPage,
    children: [
      {
        path: 'homepage',
        loadChildren: () => import('../homepage/homepage.module').then(m => m.HomepagePageModule),
      },
      {
        path: 'read-nfc',
        loadChildren: () => import('../read-nfc/read-nfc.module').then(m => m.ReadNFCPageModule)
      },
      {
        path: 'read-qr',
        loadChildren: () => import('../read-qr/read-qr.module').then(m => m.ReadQRPageModule)
      },
      {
        path: 'profile',
        loadChildren: () => import('../signup/signup.module').then(m=>m.SignupPageModule)
      },
      {
        path: 'testAlert',
        loadChildren: () => import('../test-device/test-device.module').then(m => m.TestDevicePageModule)
      },
      {
        path: 'termOfUse',
        loadChildren: () => import('../term-of-use/term-of-use.module').then(m => m.TermOfUsePageModule)
      },
      {
        path: 'privacyPolicy',
        loadChildren: () => import('../privacy-policy/privacy-policy.module').then(m => m.PrivacyPolicyPageModule)
      },
      {
        path: 'faq',
        loadChildren: () => import('../faq/faq.module').then(m => m.FaqPageModule)
      },
      {
        path: 'webpage',
        loadChildren: () => import('../webpage/webpage.module').then(m => m.WebpagePageModule)
      },
      {
        path: 'callemergencycontacts',
        loadChildren: () => import('../callemergencycontacts/callemergencycontacts.module').then(m => m.CallemergencycontactsPageModule)
      }
    ]
  },
  {
    path: '',
    redirectTo: 'menu/homepage',
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenuPageRoutingModule { }
