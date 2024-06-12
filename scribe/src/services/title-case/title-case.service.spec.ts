import { TestBed } from '@angular/core/testing';

import { TitleCaseService } from './title-case.service';

describe('TitleCaseService', () => {
  let service: TitleCaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TitleCaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
