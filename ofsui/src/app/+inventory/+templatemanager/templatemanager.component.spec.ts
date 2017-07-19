import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplatemanagerComponent } from './templatemanager.component';

describe('TemplateManagerComponent', () => {
  let component: TemplatemanagerComponent;
  let fixture: ComponentFixture<TemplatemanagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemplatemanagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplatemanagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
