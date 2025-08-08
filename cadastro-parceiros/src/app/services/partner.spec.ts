import { TestBed } from '@angular/core/testing';

import { Partner } from './partner';

describe('Partner', () => {
  let service: Partner;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Partner);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
