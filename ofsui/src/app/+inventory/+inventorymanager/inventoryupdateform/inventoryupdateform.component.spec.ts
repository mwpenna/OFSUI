import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryupdateformComponent } from './inventoryupdateform.component';

describe('InventoryupdateformComponent', () => {
  let component: InventoryupdateformComponent;
  let fixture: ComponentFixture<InventoryupdateformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventoryupdateformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryupdateformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
