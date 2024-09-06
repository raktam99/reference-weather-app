export class WeatherData {
  city: string;
  current: CurrentWeather;
  hourly: HourlyWeather;
  daily: DailyWeather;

  constructor(
    city: string = 'No city found with this name',
    current: CurrentWeather = {
      time: new Date(), // Default to the current date and time
      temperature2m: 0, // Default temperature value
      isDay: 1,
      apparentTemperature: 0, // Default apparent temperature value
      precipitation: 0, // Default precipitation value
      weatherCode: 0,
      windSpeed10m: 0, // Default wind speed value
    },
    hourly: HourlyWeather = {
      time: [], // Default to an empty array
      temperature2m: new Float32Array(0), // Default to an empty Float32Array
      weatherCode: new Float32Array(0),
      isDay: new Float32Array(0),
    },
    daily: DailyWeather = {
      time: [], // Default to an empty array
      weatherCode: new Float32Array(0),
      temperature2mMax: new Float32Array(0), // Default to an empty Float32Array
      temperature2mMin: new Float32Array(0), // Default to an empty Float32Array
    }
  ) {
    this.city = city;
    this.current = current;
    this.hourly = hourly;
    this.daily = daily;
  }
}

interface CurrentWeather {
  time: Date;
  temperature2m: number;
  apparentTemperature: number;
  isDay: number;
  precipitation: number;
  weatherCode: number;
  windSpeed10m: number;
}

interface HourlyWeather {
  time: Date[];
  temperature2m: Float32Array;
  weatherCode: Float32Array;
  isDay: Float32Array;
}

interface DailyWeather {
  time: Date[];
  weatherCode: Float32Array;
  temperature2mMax: Float32Array;
  temperature2mMin: Float32Array;
}
