import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LockDialogComponent } from './lock-dialog.component';

describe('LockDialogComponent', () => {
  let component: LockDialogComponent;
  let fixture: ComponentFixture<LockDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LockDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LockDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
