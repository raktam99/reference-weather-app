import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeatherMatchComponent } from './weather-match.component';

describe('WeatherMatchComponent', () => {
  let component: WeatherMatchComponent;
  let fixture: ComponentFixture<WeatherMatchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeatherMatchComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WeatherMatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
