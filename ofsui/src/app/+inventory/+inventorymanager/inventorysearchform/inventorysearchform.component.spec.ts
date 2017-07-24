import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventorysearchformComponent } from './inventorysearchform.component';

describe('InventorysearchformComponent', () => {
  let component: InventorysearchformComponent;
  let fixture: ComponentFixture<InventorysearchformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventorysearchformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventorysearchformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
