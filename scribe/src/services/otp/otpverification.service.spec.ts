import { TestBed } from '@angular/core/testing';

import { OtpverificationService } from './otpverification.service';

describe('OtpverificationService', () => {
  let service: OtpverificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OtpverificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
