/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { IconLiteComponent } from './icon-lite.component';

describe('IconLiteComponent', () => {
  let component: IconLiteComponent;
  let fixture: ComponentFixture<IconLiteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IconLiteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IconLiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
