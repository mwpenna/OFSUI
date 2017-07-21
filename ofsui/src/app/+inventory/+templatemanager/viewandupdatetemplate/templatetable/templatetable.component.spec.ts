import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplatetableComponent } from './templatetable.component';

describe('TemplatetableComponent', () => {
  let component: TemplatetableComponent;
  let fixture: ComponentFixture<TemplatetableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemplatetableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplatetableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
