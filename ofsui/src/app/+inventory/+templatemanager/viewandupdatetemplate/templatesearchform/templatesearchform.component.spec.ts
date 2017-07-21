import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplatesearchformComponent } from './templatesearchform.component';

describe('TemplatesearchformComponent', () => {
  let component: TemplatesearchformComponent;
  let fixture: ComponentFixture<TemplatesearchformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemplatesearchformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplatesearchformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
