import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnterNewPasswordComponent } from './enter-new-password.component';

describe('EnterNewPasswordComponent', () => {
  let component: EnterNewPasswordComponent;
  let fixture: ComponentFixture<EnterNewPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EnterNewPasswordComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EnterNewPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
