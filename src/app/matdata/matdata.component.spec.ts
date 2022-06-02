import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatdataComponent } from './matdata.component';

describe('MatdataComponent', () => {
  let component: MatdataComponent;
  let fixture: ComponentFixture<MatdataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MatdataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MatdataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
