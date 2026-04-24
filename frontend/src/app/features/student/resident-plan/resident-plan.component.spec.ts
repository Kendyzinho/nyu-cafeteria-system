import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResidentPlanComponent } from './resident-plan.component';

describe('ResidentPlanComponent', () => {
  let component: ResidentPlanComponent;
  let fixture: ComponentFixture<ResidentPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResidentPlanComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResidentPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
