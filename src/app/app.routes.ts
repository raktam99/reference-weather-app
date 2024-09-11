import { RouterModule, Routes } from '@angular/router';
import { WeatherComponent } from './components/weather/weather.component';
import { WeatherMatchComponent } from './components/weather-match/weather-match.component';

export const routes: Routes = [
  { path: 'weather', component: WeatherComponent },
  { path: 'game', component: WeatherMatchComponent },
  { path: '**', redirectTo: 'weather' },
];
