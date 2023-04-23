import { TestBed } from '@angular/core/testing';

import { ImageGetServiceService } from './image-get-service.service';

describe('ImageGetServiceService', () => {
  let service: ImageGetServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImageGetServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
