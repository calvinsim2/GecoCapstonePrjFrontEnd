import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogOfUserComponent } from './blog-of-user.component';

describe('BlogOfUserComponent', () => {
  let component: BlogOfUserComponent;
  let fixture: ComponentFixture<BlogOfUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlogOfUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BlogOfUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
