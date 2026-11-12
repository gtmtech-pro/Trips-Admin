import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateAppSettingComponent } from './create-app-setting.component';

describe('CreateAppSettingComponent', () => {
  let component: CreateAppSettingComponent;
  let fixture: ComponentFixture<CreateAppSettingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateAppSettingComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateAppSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
