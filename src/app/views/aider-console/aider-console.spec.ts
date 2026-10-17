import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AiderConsole } from './aider-console';

describe('AiderConsole', () => {
  let component: AiderConsole;
  let fixture: ComponentFixture<AiderConsole>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AiderConsole],
    }).compileComponents();

    fixture = TestBed.createComponent(AiderConsole);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
