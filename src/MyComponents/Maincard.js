import React, { useState, useEffect } from 'react';
import './Maincard.css';
import { MoveRight } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS } from "chart.js/auto";


const Maincard = ({ weatherForecast }) => {

  const [selectedDay, setSelectedDay] = useState(null);
  // State to keep track of the window width
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // useEffect to update the window width state on window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const getWeatherIcon = (iconCode) => {
    return `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  // Get the current date in YYYY-MM-DD format
  const currentDate = new Date().toISOString().split('T')[0];

  // Filter the weatherForecast array to include only the 8 time stamp data
  const currentDayData = weatherForecast.filter((forecast, index) => index < 8);

  // Filter the weatherForecast array to include only the data for the upcoming days at 12:00:00 time
  const upcomingDaysData = weatherForecast.filter(forecast => {
    const forecastDate = forecast.dt_txt.split(' ')[0];
    const forecastTime = forecast.dt_txt.split(' ')[1];
    return forecastDate !== currentDate && forecastTime === '12:00:00';
  });

  useEffect(() => {
    if (upcomingDaysData.length > 0 && !selectedDay) {
      setSelectedDay(upcomingDaysData[0].dt_txt.split(' ')[0]);
    }
  }, [upcomingDaysData, selectedDay]);

  const handleDayClick = (day) => {
    setSelectedDay(day);
  };

  const getDayOfWeek = (date) => {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayIndex = new Date(date).getDay();
    return daysOfWeek[dayIndex];
  };

  const getAbbreviatedDayOfWeek = (date) => {
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayIndex = new Date(date).getDay();
    return daysOfWeek[dayIndex];
  };

  const getTime12Data = (data) => {
    return data.filter(forecast => forecast.dt_txt.split(' ')[1] === '12:00:00');
  };


  // Extract the hourly temperature data
  const currentDayHourlyData = currentDayData.map((forecast) => {
    return {
      time: forecast.dt_txt.split(' ')[1].slice(0, -3),
      temperature: (forecast.main.temp - 273.15).toFixed(),
    };
  });



  // Chart data for the line graph
  const chartData = {
    labels: currentDayHourlyData.map((data) => data.time),
    datasets: [
      {
        label: 'Hourly Temperature (°C)',
        data: currentDayHourlyData.map((data) => data.temperature),
        borderColor: 'rgba(75,192,192,1)',
        pointBackgroundColor: 'white',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          // usePointStyle: true,
          color: 'white',
        },
      },
    },

    scales: {
      y: {
        ticks: { color: 'white', stepSize: 2, },
        // grid: {
        //   color: 'white',
        // }
      },
      x: {
        ticks: { color: 'white', },
        // grid: {
        //   color: 'white',
        // }
      }
    }
  };

  return (
    <div className='main-card'>
      <div className='cdcontain'>
        <h2>Weather Details</h2>
        <div className="moving-arrow-container"><MoveRight size={36} color="#ffffff" /></div>
      </div>

      {/* Weather Card */}
      <div className='row'>
        {currentDayData.map((forecast, index) => (
          <div key={index} className='weather-card'>
            <p className='text-center'>{(forecast.dt_txt.split(' ')[1]).slice(0, -3)}</p>
            <img src={getWeatherIcon(forecast.weather[0].icon)} style={{}} />
            <p className='text-center'>{(forecast.main.temp - 273.15).toFixed()}°C</p>
          </div>
        ))}
      </div>

      {/* Line graph of hourly temperature data */}
      {currentDayHourlyData.length > 0 && (
        <div className="line-chart-container">
          <Line data={chartData} options={options} />
        </div>
      )}


      {/* Upcoming Days Buttons */}
      <div className='day-buttons'>
        {getTime12Data(weatherForecast).map((forecast, index) => (
          <button
            key={index}
            onClick={() => handleDayClick(forecast.dt_txt.split(' ')[0])}
            className={selectedDay === forecast.dt_txt.split(' ')[0] ? 'day-button selected zoom' : 'day-button zoom'}>
            {window.innerWidth < 560 ? getAbbreviatedDayOfWeek(forecast.dt_txt) : getDayOfWeek(forecast.dt_txt)}
          </button>
        ))}
      </div>

      {/* Upcoming Days Data Card */}
      <div>
        {getTime12Data(weatherForecast).map((forecast, index) => {
          if (forecast.dt_txt.includes(selectedDay)) {
            return (
              <>
                <div className='specday' >
                  <div key={index} className='specday1'>
                    <p className='s'>Humidity:  {forecast.main.humidity}%</p>
                    <p className='s'>Feels like: {('\t' + forecast.main.feels_like - 273.15).toFixed()}°C</p>
                    <p className='s'>Desc.:  {forecast.weather[0].description}</p>
                  </div>
                  <div className='specday2'>
                    <img src={getWeatherIcon(forecast.weather[0].icon)} />
                    <p>{(forecast.main.temp_min - 273.15).toFixed()}°/{(forecast.main.temp_max - 273.15).toFixed()}°C</p>
                  </div>
                </div>
              </>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
};

export default Maincard;
