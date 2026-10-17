import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RepositoryWorkspace } from './repository-workspace';

describe('RepositoryWorkspace', () => {
  let component: RepositoryWorkspace;
  let fixture: ComponentFixture<RepositoryWorkspace>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RepositoryWorkspace],
    }).compileComponents();

    fixture = TestBed.createComponent(RepositoryWorkspace);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
