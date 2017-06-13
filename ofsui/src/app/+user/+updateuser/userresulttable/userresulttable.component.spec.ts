import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserresulttableComponent } from './userresulttable.component';

describe('UserresulttableComponent', () => {
  let component: UserresulttableComponent;
  let fixture: ComponentFixture<UserresulttableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserresulttableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserresulttableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
