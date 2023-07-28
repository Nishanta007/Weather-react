import './App.css';
import Maincard from "./MyComponents/Maincard";
import WeatherData from "./MyComponents/WeatherData";
import { useState, useEffect } from 'react';
import back3 from './assets/videos/back4.mp4';
// import logo from './assets/images/rain.png';
import { ThermometerSun } from 'lucide-react';
import { SunSnow } from 'lucide-react';



function App() {
  const [query, setQuery] = useState('');
  const [cond, setCond] = useState([]);
  const [weatherForecast, setWeatherForecast] = useState([]);
  const [weatherImages, setWeatherImages] = useState([]);

  const apiKey = 'a469fed6353b5b6b9243b1f011ca79ea';

  useEffect(() => {
    fetchWeatherData('London'); // Default city for initial load
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (query) {
      fetchWeatherData(query);
      setQuery('');
    }
  };

  const fetchWeatherData = (city) => {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

    fetch(url)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Failed to fetch weather data');
        }
      })
      .then(data => {
        console.log(data);
        setCond(data);
        weatherReport(data);
      })
      .catch(error => {
        console.error(error);
      });
  };

  const weatherReport = (data) => {
    const urlcast = `https://api.openweathermap.org/data/2.5/forecast?q=${data.name}&appid=${apiKey}`;

    fetch(urlcast)
      .then(res => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error('Failed to fetch weather data');
        }
      })
      .then(forecast => {
        console.log(forecast);
        const filteredForecast = forecast.list.filter(item => {
          const forecastDate = new Date(item.dt_txt);
          const currentDate = new Date();
          const nextSevenDays = new Date().setDate(currentDate.getDate() + 7);
          return forecastDate <= nextSevenDays;
        });
        setWeatherForecast(filteredForecast);

        // Extract weather icon codes from forecast data
        const weatherIcons = filteredForecast.map(item => item.weather[0].icon);
        setWeatherImages(weatherIcons);
      })
      .catch(error => {
        console.error(error);
      });
  };

  return (
    <>
      <video autoPlay loop muted style={{ position: 'fixed', width: '100vw', height: '100vh', objectFit: 'cover', zIndex: '-1', }}>
        <source src={back3} />
      </video>
      <div className='header'>
        <div className='brandlogo'>
          <SunSnow className='logo' color="#ffffff" size={36}/>
          <h1>Weather Forecast</h1>
        </div>
        <form onSubmit={handleSubmit}>
          <input className='inputfield' type="text" placeholder="Search a City" value={query} onChange={(event) => setQuery(event.target.value)} />
          <button type="submit" className='submit'>Search</button>
        </form>
      </div>

      <div className='fullpage'>
        <div className='section'>
          <WeatherData cond={cond} />
        </div>
        <div className='section'>
          <Maincard weatherForecast={weatherForecast} weatherImages={weatherImages} />
        </div>
      </div>
    </>
  );
}

export default App;
