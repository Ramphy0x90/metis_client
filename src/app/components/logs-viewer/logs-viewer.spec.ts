import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogsViewer } from './logs-viewer';

describe('LogsViewer', () => {
  let component: LogsViewer;
  let fixture: ComponentFixture<LogsViewer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LogsViewer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LogsViewer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
