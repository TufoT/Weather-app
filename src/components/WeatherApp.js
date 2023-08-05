import React, { useState, useEffect } from 'react';
import { WiDaySunny, WiCloudy, WiRain, WiSnow, WiFog, WiThunderstorm } from 'react-icons/wi';
import { format } from 'date-fns';
import humidity from "../assets/humidity.png";
import thermo from "../assets/thermo.png";
import wind from "../assets/wind.png";

const WeatherApp = () => {
  const apiKey = 'e62065afadf8022c54ee48a0e432139e';
  const [city, setCity] = useState('Tokyo');
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState([]);

  useEffect(() => {
    fetchWeather();   
    fetchForecast();  
  }, []);

  const fetchWeather = () => {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
      .then(response => response.json())
      .then(data => setWeatherData(data))
      .catch(error => console.error('Error fetching weather data:', error));
  };

  const fetchForecast = () => {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`)
      .then(response => response.json())
      .then(data => {
        console.log('Forecast API Response:', data);
        
        const dailyForecast = data.list.filter(item => {
          const date = new Date(item.dt_txt);
          const hours = date.getUTCHours() + 2;
          return hours === 12;
        });
        console.log('Daily Forecast:', dailyForecast)
        dailyForecast.forEach(item => {
          const date = new Date(item.dt_txt);
          item.dayName = format(date, 'EEEE');
        });
        
  
        const sevenDayForecast = dailyForecast.slice(0, 7);
  
        setForecastData(dailyForecast);
        console.log('Forecast Data After SetState:', forecastData);
      })
      .catch(error => console.error('Error fetching forecast data:', error));
  };

  const getWeatherIcon = iconCode => {
    switch (iconCode) {
      case '01d':
        return <WiDaySunny className='icon' />;
      case '02d':
        return <WiCloudy className='icon' />;
      case '03d':
      case '04d':
        return <WiCloudy className='icon' />;
      case '09d':
      case '10d':
        return <WiRain className='icon' />;
      case '11d':
        return <WiThunderstorm className='icon' />;
      case '13d':
        return <WiSnow className='icon' />;
      case '50d':
        return <WiFog className='icon' />;
      default:
        return <WiDaySunny className='icon' />;
    }
  };

  const handleSubmit = event => {
    event.preventDefault();
    fetchWeather();
    fetchForecast();
    setCity("");
  };

  return (
    <div className="weather-app">
      {weatherData && (
        <div className="current-weather">
        <div className='current-weather-sec'>
        <h2>{weatherData.name}</h2>
          <p>{Math.floor(weatherData.main.temp)}°C</p>
          {getWeatherIcon(weatherData.weather[0].icon)}
        </div>
          <div className="weather-details">
          <div className='humid'><img src={humidity} /><p>Humidity</p></div>
          <p className='humid-txt'>{weatherData.main.humidity}%</p>
            <div className='wind'><img src={wind} /><p>Wind Speed</p></div>
            <p className='wind-txt'>{weatherData.wind.speed} m/s</p>
          </div>
        </div>
      )}
        <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter city name"
          value={city}
          onChange={event => setCity(event.target.value)}
        />
        <button type="submit"><i className="icon-srch fa-solid fa-magnifying-glass"></i></button>
      </form>
      {forecastData.length > 0 && (
        <div className="forecast">
          <h2>Forecast</h2>
          <div className="forecast-cards">
          {forecastData.map((item, index) => (
            <div className="forecast-card" key={index}>
                <p>{item.dayName}</p>
                {getWeatherIcon(item.weather[0].icon)}
                <p className='forecast-temp'>{Math.floor(item.main.temp)} °C</p>
            </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherApp;
