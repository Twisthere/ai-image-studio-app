import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Modify } from './modify';

describe('Modify', () => {
  let component: Modify;
  let fixture: ComponentFixture<Modify>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Modify]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Modify);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
