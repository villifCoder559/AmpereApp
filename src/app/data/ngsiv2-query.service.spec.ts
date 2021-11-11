import { TestBed } from '@angular/core/testing';

import { NGSIv2QUERYService } from './ngsiv2-query.service';

describe('NGSIv2QUERYService', () => {
  let service: NGSIv2QUERYService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NGSIv2QUERYService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
