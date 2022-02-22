import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DialogAddEmergencyContactComponent } from './dialog-add-emergency-contact.component';

describe('DialogAddEmergencyContactComponent', () => {
  let component: DialogAddEmergencyContactComponent;
  let fixture: ComponentFixture<DialogAddEmergencyContactComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogAddEmergencyContactComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DialogAddEmergencyContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
