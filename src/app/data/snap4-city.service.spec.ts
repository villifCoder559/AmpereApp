import { TestBed } from '@angular/core/testing';

import { Snap4CityService } from './snap4-city.service';

describe('Snap4CityService', () => {
  let service: Snap4CityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Snap4CityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
