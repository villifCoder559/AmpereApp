import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DialogScanBluetoothComponent } from './dialog-scan-bluetooth.component';

describe('DialogScanBluetoothComponent', () => {
  let component: DialogScanBluetoothComponent;
  let fixture: ComponentFixture<DialogScanBluetoothComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogScanBluetoothComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DialogScanBluetoothComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
