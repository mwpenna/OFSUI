import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplatecreateformComponent } from './templatecreateform.component';

describe('TemplatecreateformComponent', () => {
  let component: TemplatecreateformComponent;
  let fixture: ComponentFixture<TemplatecreateformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemplatecreateformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplatecreateformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
