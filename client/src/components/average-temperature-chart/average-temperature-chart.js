import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";
import "./average-temperature-chart.scss";

const WeatherDashboard = () => {
  const [weatherData, setWeatherData] = useState([]);
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:5000");
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const getAverageTemperaturePerDay = (data) => {
        const averages = {};

        data.hourly.time.forEach((time, index) => {
          const date = time.split("T")[0]; // Get the date part (YYYY-MM-DD)
          const temperature = data.hourly.temperature_2m[index];

          if (!averages[date]) {
            averages[date] = { sum: 0, count: 0 };
          }

          averages[date].sum += temperature;
          averages[date].count += 1;
        });

        // Convert averages object to array format for Recharts
        return Object.entries(averages).map(([date, { sum, count }]) => ({
          date,
          averageTemperature: (sum / count).toFixed(2), // Calculate average
        }));
      };

      const averageTemperatures = getAverageTemperaturePerDay(data);
      setWeatherData(averageTemperatures);
    };

    return () => ws.close();
  }, []);

  return (
    <div className="weather-dashboard-wrapper">
      <h3 className="title">Average Temperature Forecast</h3>
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={weatherData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <Legend />
          <YAxis
            domain={[0, "dataMax + 5"]} // Adjust domain to start from 0 to data max + 10
            ticks={[0, 5, 10, 15, 20, 25, 30, 35, 40, 45]}
          />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="averageTemperature" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
      <p className="note">
        *Note: The average temperature forecast for the upcoming week is
        displayed starting from today.
      </p>
    </div>
  );
};

export default WeatherDashboard;
