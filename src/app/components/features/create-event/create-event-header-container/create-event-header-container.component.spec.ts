import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEventHeaderContainerComponent } from './create-event-header-container.component';

describe('CreateEventHeaderContainerComponent', () => {
  let component: CreateEventHeaderContainerComponent;
  let fixture: ComponentFixture<CreateEventHeaderContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateEventHeaderContainerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateEventHeaderContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
