import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockAdminComponent } from './stock-admin.component';

describe('StockAdminComponent', () => {
  let component: StockAdminComponent;
  let fixture: ComponentFixture<StockAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockAdminComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StockAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
