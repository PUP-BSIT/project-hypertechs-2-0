import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypingEffectComponent } from './typing-effect.component';

describe('TypingEffectComponent', () => {
  let component: TypingEffectComponent;
  let fixture: ComponentFixture<TypingEffectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TypingEffectComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TypingEffectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
