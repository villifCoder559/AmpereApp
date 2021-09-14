import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TestDevicePage } from './test-device.page';

const routes: Routes = [
  {
    path: '',
    component: TestDevicePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TestDevicePageRoutingModule {}
