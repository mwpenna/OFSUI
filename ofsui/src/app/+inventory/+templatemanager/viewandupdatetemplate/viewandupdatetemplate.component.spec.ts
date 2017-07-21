import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAndUpdatetemplateComponent } from './viewandupdatetemplate.component';

describe('ViewAndUpdatetemplateComponent', () => {
  let component: ViewAndUpdatetemplateComponent;
  let fixture: ComponentFixture<ViewAndUpdatetemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewAndUpdatetemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAndUpdatetemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
