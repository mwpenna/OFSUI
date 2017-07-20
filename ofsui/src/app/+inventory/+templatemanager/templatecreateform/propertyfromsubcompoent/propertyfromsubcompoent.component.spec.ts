import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyfromsubcompoentComponent } from './propertyfromsubcompoent.component';

describe('PropertyfromsubcompoentComponent', () => {
  let component: PropertyfromsubcompoentComponent;
  let fixture: ComponentFixture<PropertyfromsubcompoentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PropertyfromsubcompoentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertyfromsubcompoentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
