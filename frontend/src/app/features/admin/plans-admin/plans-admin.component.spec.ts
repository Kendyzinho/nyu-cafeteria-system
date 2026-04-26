import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlansAdminComponent } from './plans-admin.component';

describe('PlansAdminComponent', () => {
  let component: PlansAdminComponent;
  let fixture: ComponentFixture<PlansAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlansAdminComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlansAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
