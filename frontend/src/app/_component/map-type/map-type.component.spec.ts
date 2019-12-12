import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapTypeComponent } from './map-type.component';

describe('MapTypeComponent', () => {
  let component: MapTypeComponent;
  let fixture: ComponentFixture<MapTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
