import { TestBed } from '@angular/core/testing';

import { UserContextService } from './user.service';

describe('User', () => {
  let service: UserContextService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserContextService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
