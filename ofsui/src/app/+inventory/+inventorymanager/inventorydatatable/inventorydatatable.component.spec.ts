import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventorydatatableComponent } from './inventorydatatable.component';

describe('InventorydatatableComponent', () => {
  let component: InventorydatatableComponent;
  let fixture: ComponentFixture<InventorydatatableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventorydatatableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventorydatatableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
