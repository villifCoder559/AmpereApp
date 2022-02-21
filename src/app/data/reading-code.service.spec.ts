import { TestBed } from '@angular/core/testing';

import { ReadingCodeService } from './reading-code.service';

describe('ReadingCodeService', () => {
  let service: ReadingCodeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReadingCodeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
