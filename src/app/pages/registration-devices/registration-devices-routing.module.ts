import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegistrationDevicesPage } from './registration-devices.page';

const routes: Routes = [
  {
    path: '',
    component: RegistrationDevicesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegistrationDevicesPageRoutingModule {}
