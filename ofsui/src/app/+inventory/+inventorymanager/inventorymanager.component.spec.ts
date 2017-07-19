import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventorymanagerComponent } from './inventorymanager.component';

describe('InventorymanagerComponent', () => {
  let component: InventorymanagerComponent;
  let fixture: ComponentFixture<InventorymanagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventorymanagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventorymanagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
