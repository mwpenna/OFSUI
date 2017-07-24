import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventorycreateformComponent } from './inventorycreateform.component';

describe('InventorycreateformComponent', () => {
  let component: InventorycreateformComponent;
  let fixture: ComponentFixture<InventorycreateformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventorycreateformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventorycreateformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
