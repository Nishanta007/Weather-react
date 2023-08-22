import React from 'react';
import './WeatherData.css'; // Import the CSS file
import { Droplets } from 'lucide-react';
import { ThermometerSun } from 'lucide-react';
import { ThermometerSnowflake } from 'lucide-react';
import { SunSnow } from 'lucide-react';
import { Sunrise } from 'lucide-react';
import { Sunset } from 'lucide-react';
import { Wind } from 'lucide-react';
import { Eye } from 'lucide-react';
import { Gauge } from 'lucide-react';


const WeatherData = ({ cond }) => {

  const getWeatherIcon = (iconCode) => {
    return `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const amOrPm = hours >= 12 ? 'PM' : 'AM';
    hours %= 12;
    hours = hours || 12;
    return `${hours}:${minutes.toString().padStart(2, '0')} ${amOrPm}`;
  };

  return (
    <div className="currentday">
      {cond.main && cond.sys && cond.weather && cond.weather[0] && cond.wind &&(
        <>
          <div className='city'>
            <div className='text-center'>
              <img src={getWeatherIcon(cond.weather[0].icon)} style={{ aspectRatio: 1 / 1, width: '150px' }} />
              {/* <p >{cond.weather[0].main}</p> */}
            </div>
            <div className='citytemp'>
              <p>{(cond.main.temp - 273.15).toFixed()}°</p>
              <h2>{cond.name}, {cond.sys.country}</h2>
            </div>
          </div>
          <div className='infocontain'>
            <div className='info'>
              <p><Droplets color="#ffffff" />   {cond.main.humidity}%</p>
              <p>Humidity</p>
            </div>
            <div className='info'>
              <p><ThermometerSun color="#ffffff" />   {(cond.main.temp_max - 273.15).toFixed()}°C</p>
              <p>Max-Temp</p>
            </div>
            <div className='info'>
              <p><ThermometerSnowflake color="#ffffff" />   {(cond.main.temp_min - 273.15).toFixed()}°C</p>
              <p>Min-Temp</p>
            </div>
            <div className='info'>
              <p><SunSnow color="#ffffff" />   {(cond.main.feels_like - 273.15).toFixed()}°C</p>
              <p>Feels like</p>
            </div>
            <div className='info'>
              <p><Sunrise color="#ffffff" />   {formatTime(cond.sys.sunrise)}</p>
              <p>Sunrise Time</p>
            </div>
            <div className='info'>
              <p><Sunset color="#ffffff" />   {formatTime(cond.sys.sunset)}</p>
              <p>Sunset Time</p>
            </div>
            <div className='info'>
              <p><Wind color="#ffffff" />   {cond.wind.speed}km/h</p>
              <p>Wind Speed</p>
            </div>
            <div className='info'>
              <p><Eye color="#ffffff" />   {(cond.visibility/1000)}km</p>
              <p>Visibility</p>
            </div>
            <div className='info'>
              <p><Gauge color="#ffffff" />   {cond.main.pressure}hPa</p>
              <p>Air Pressure</p>
            </div>
          </div> 
        </>
      )}
    </div>
  )
}

export default WeatherData