import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegistrationS4cPage } from './registration-s4c.page';

const routes: Routes = [
  {
    path: '',
    component: RegistrationS4cPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegistrationS4cPageRoutingModule {}
