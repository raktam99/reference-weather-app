import { Component } from '@angular/core';
import { getData, getImageFromCode } from '../../API usage/getData';
import { WeatherData } from '../../API usage/ApiModel';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-weather',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './weather.component.html',
  styleUrl: './weather.component.scss',
})
export class WeatherComponent {
  city = 'Nagyvenyim';
  weatherData: WeatherData = new WeatherData();

  ngOnInit() {
    const savedJSONData = localStorage.getItem('savedWeatherData');

    if (savedJSONData) {
      this.weatherData = JSON.parse(savedJSONData);
      this.setBackground(this.weatherData);
    } else {
      getData('nagyvenyim').then((data) => {
        if (data) {
          this.weatherData = data;
          this.setBackground(this.weatherData);
          localStorage.setItem('savedWeatherData', JSON.stringify(data));
        }
      });
    }
  }

  getWeatherData(e: Event) {
    getData(this.city)
      .then((data) => {
        if (data) {
          this.weatherData = data;
          localStorage.setItem('savedWeatherData', JSON.stringify(data));
          this.setBackground(this.weatherData);
        } else this.weatherData = new WeatherData();
      })
      .then(() => {
        (e.target as HTMLInputElement).value = '';
      });
  }

  changeCity(e: Event) {
    this.city = (e.target as HTMLInputElement).value;
  }

  roundValue(number: number) {
    return Math.round(number);
  }

  getDay(date: Date) {
    const dateObj = new Date(date);
    return dateObj.toDateString().split(' ')[0];
  }

  getHour(date: Date) {
    const dateObj = new Date(date);
    return dateObj.getHours();
  }

  getFormattedDate(date: Date) {
    const dateObj = new Date(date);
    return dateObj.toUTCString();
  }

  getImage(code: number, is_day: number = 1) {
    return getImageFromCode(code, is_day);
  }

  setBackground(data: WeatherData) {
    if (data.current.isDay === 0) {
      document.documentElement.style.setProperty(
        '--main-bg-color',
        'url("https://wallpapercave.com/wp/wp7113104.jpg")'
      );
    } else {
      document.documentElement.style.setProperty(
        '--main-bg-color',
        'url("https://i.pinimg.com/originals/b2/70/f3/b270f3e63427ab6c431f33013d5f425a.jpg")'
      );
    }
  }
}
