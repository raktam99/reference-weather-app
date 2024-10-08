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
  isLoading: boolean = false;
  city = '';
  weatherData: WeatherData = new WeatherData();

  ngOnInit() {
    //If true, renders a loading overlay
    this.isLoading = true;

    const savedJSONData = localStorage.getItem('savedWeatherData');

    //If local storage contains weather data, it loads, if not, it loads Nagyvenyim's weather
    if (savedJSONData) {
      this.weatherData = JSON.parse(savedJSONData);
      this.setBackground(this.weatherData.current.isDay);
      this.isLoading = false;
    } else {
      getData('nagyvenyim').then((data) => {
        if (data) {
          this.weatherData = data;
          this.setBackground(this.weatherData.current.isDay);
          localStorage.setItem('savedWeatherData', JSON.stringify(data));
          this.isLoading = false;
        }
      });
    }
  }

  getWeatherData() {
    this.isLoading = true;
    getData(this.city)
      .then((data) => {
        if (data) {
          this.weatherData = data;
          localStorage.setItem('savedWeatherData', JSON.stringify(data));
          this.setBackground(this.weatherData.current.isDay);
        }
      })
      .then(() => {
        //Empties the input field
        this.city = '';
        this.isLoading = false;
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
    return [
      dateObj.toUTCString().slice(0, 17),
      dateObj.toUTCString().slice(17, dateObj.toUTCString().length - 3),
    ];
  }

  getImage(code: number, is_day: number = 1) {
    return getImageFromCode(code, is_day);
  }

  setBackground(isDay: number) {
    if (isDay === 0) {
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
