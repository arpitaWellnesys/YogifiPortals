import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BestSessionComponent } from './best-session.component';

describe('BestSessionComponent', () => {
  let component: BestSessionComponent;
  let fixture: ComponentFixture<BestSessionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BestSessionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BestSessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
