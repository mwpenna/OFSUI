import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventorypropssubcomponentComponent } from './inventorypropssubcomponent.component';

describe('InventorypropssubcomponentComponent', () => {
  let component: InventorypropssubcomponentComponent;
  let fixture: ComponentFixture<InventorypropssubcomponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventorypropssubcomponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventorypropssubcomponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
