import { fetchWeatherApi } from 'openmeteo';
import { WeatherData } from './ApiModel';
import { codes } from './weatherCodes';

interface WeatherImageData {
  day: {
    description: string;
    image: string;
  };
  night: {
    description: string;
    image: string;
  };
}

interface Codes {
  [key: string]: WeatherImageData;
}

export async function getData(city: string) {
  const latlong = await getLatLongByCity(city);

  if (latlong === 'no') return null;

  const params = {
    latitude: latlong[0],
    longitude: latlong[1],
    current: [
      'temperature_2m',
      'apparent_temperature',
      'is_day',
      'precipitation',
      'weather_code',
      'wind_speed_10m',
    ],
    hourly: ['temperature_2m', 'precipitation', 'weather_code', 'is_day'],
    daily: [
      'weather_code',
      'temperature_2m_max',
      'temperature_2m_min',
      'precipitation_sum',
    ],
    timezone: 'auto',
  };
  const url = 'https://api.open-meteo.com/v1/forecast';
  const responses = await fetchWeatherApi(url, params);

  if (!responses) {
    alert('Could not fetch weather data');
    return null;
  }

  // Helper function to form time ranges
  const range = (start: number, stop: number, step: number) =>
    Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);

  // Process first location. Add a for-loop for multiple locations or weather models
  const response = responses[0];

  // Attributes for timezone and location
  const utcOffsetSeconds = response.utcOffsetSeconds();
  const timezone = response.timezone();
  const timezoneAbbreviation = response.timezoneAbbreviation();
  const latitude = response.latitude();
  const longitude = response.longitude();

  const current = response.current()!;
  const hourly = response.hourly()!;
  const daily = response.daily()!;

  // Note: The order of weather variables in the URL query and the indices below need to match!
  const weatherData = {
    current: {
      time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
      temperature2m: current.variables(0)!.value(),
      apparentTemperature: current.variables(1)!.value(),
      isDay: current.variables(2)!.value(),
      precipitation: current.variables(3)!.value(),
      weatherCode: current.variables(4)!.value(),
      windSpeed10m: current.variables(5)!.value(),
    },
    hourly: {
      time: range(
        Number(hourly.time()),
        Number(hourly.timeEnd()),
        hourly.interval()
      ).map((t) => new Date((t + utcOffsetSeconds) * 1000)),
      temperature2m: hourly.variables(0)!.valuesArray()!,
      precipitation: hourly.variables(1)!.valuesArray()!,
      weatherCode: hourly.variables(2)!.valuesArray()!,
      isDay: hourly.variables(3)!.valuesArray()!,
    },
    daily: {
      time: range(
        Number(daily.time()),
        Number(daily.timeEnd()),
        daily.interval()
      ).map((t) => new Date((t + utcOffsetSeconds) * 1000)),
      weatherCode: daily.variables(0)!.valuesArray()!,
      temperature2mMax: daily.variables(1)!.valuesArray()!,
      temperature2mMin: daily.variables(2)!.valuesArray()!,
      precipitationSum: daily.variables(3)!.valuesArray()!,
    },
  };

  let times: Date[] = [];
  let temps: number[] = [];
  let pre: number[] = [];
  let c: number[] = [];
  let isdays: number[] = [];

  const currentDate = new Date().getDate();

  weatherData.hourly.time.forEach((value, index) => {
    if (value.getDate() === currentDate && value.getHours() % 3 === 0) {
      times.push(value);
      temps.push(weatherData.hourly.temperature2m[index]);
      pre.push(weatherData.hourly.precipitation[index]);
      c.push(weatherData.hourly.weatherCode[index]);
      isdays.push(weatherData.hourly.isDay[index]);
    }
  });

  weatherData.hourly = {
    time: times,
    temperature2m: new Float32Array(temps),
    precipitation: new Float32Array(pre),
    weatherCode: new Float32Array(c),
    isDay: new Float32Array(isdays),
  };

  const weatherObject = new WeatherData(
    city.toUpperCase(),
    weatherData.current,
    weatherData.hourly,
    weatherData.daily
  );

  return weatherObject;
}

async function getLatLongByCity(city: string) {
  const nominatimUrl = 'https://nominatim.openstreetmap.org/search';

  const url = `${nominatimUrl}?q=${encodeURIComponent(
    city
  )}&format=json&limit=1`;

  let lat = 91,
    long = 181;

  const response = await fetch(url)
    .then((response) => response.json()) // Parse the JSON from the response
    .then((data) => {
      if (data && data.length > 0) {
        // Extract the latitude and longitude from the first result
        const latitude = data[0].lat;
        const longitude = data[0].lon;

        // You can return the coordinates or do further processing here
        lat = latitude;
        long = longitude;
      } else {
      }
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
      alert('Could not fetch location data');
    });

  if (lat > 90 && long > 180) return 'no';

  return [lat, long];
}

export function getImageFromCode(code: number, isDay: number = 1) {
  // Convert the numeric code to a string
  const codeString = code.toString();

  // Assert the `codes` object as `Codes` type
  const weatherData = (codes as Codes)[codeString];

  if (isDay === 0) return weatherData.night.image;
  else return weatherData.day.image;
}
