import { TestBed } from '@angular/core/testing';

import { SendAuthService } from './send-auth.service';

describe('SendAuthService', () => {
  let service: SendAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SendAuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
