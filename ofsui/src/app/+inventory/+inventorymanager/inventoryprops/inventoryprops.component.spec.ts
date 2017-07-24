import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventorypropsComponent } from './inventoryprops.component';

describe('InventorypropsComponent', () => {
  let component: InventorypropsComponent;
  let fixture: ComponentFixture<InventorypropsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventorypropsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventorypropsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
