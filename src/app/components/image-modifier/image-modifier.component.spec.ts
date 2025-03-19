import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageModifierComponent } from './image-modifier.component';

describe('ImageModifierComponent', () => {
  let component: ImageModifierComponent;
  let fixture: ComponentFixture<ImageModifierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageModifierComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImageModifierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
