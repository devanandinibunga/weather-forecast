import { Checkbox, Select } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ComposedChart,
  ResponsiveContainer,
} from "recharts";
import "./weather-chart.scss";
import moment from "moment";

const WeatherChart = ({ savedLocations }) => {
  const [data, setData] = useState([]);
  const [selectedValues, setSelectedValues] = useState([
    "rain",
    "temperature_2m",
  ]);
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const role = localStorage.getItem("role");
  const { Option } = Select;
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          setLocation({ latitude: latitude, longitude: longitude });
          console.log("Latitude:", latitude, "Longitude:", longitude);
        },
        (error) => {
          console.error("Error getting location:", error.message);
        },
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);
  const onChange = (checkedValues) => {
    setSelectedValues(checkedValues);
  };

  useEffect(() => {
    if (selectedValues.length === 0) return;
    const getWeatherAPI = async () => {
      const end_date = moment().subtract(1, "days").format("YYYY-MM-DD");
      const start_date = moment().subtract(30, "days").format("YYYY-MM-DD");
      await axios
        .get(
          `https://archive-api.open-meteo.com/v1/archive?latitude=${
            location?.latitude
          }&longitude=${
            location?.longitude
          }&start_date=${start_date}&end_date=${end_date}&hourly=${selectedValues.join(
            ",",
          )}`,
        )
        .then((response) => {
          console.log(response?.data);
          const hourly = response?.data?.hourly;

          if (!hourly) {
            console.error("Hourly data is missing");
            return;
          }

          const formattedData = hourly?.time?.map((time, index) => ({
            time,
            temperature: hourly.temperature_2m
              ? hourly.temperature_2m[index]
              : null,
            rain: hourly.rain ? hourly.rain[index] : null,
            humidity: hourly.relative_humidity_2m
              ? hourly.relative_humidity_2m[index]
              : null,
            soilTemperature: hourly.soil_temperature_0_to_7cm
              ? hourly.soil_temperature_0_to_7cm[index]
              : null,
            soilMoisture: hourly.soil_moisture_0_to_7cm
              ? hourly.soil_moisture_0_to_7cm[index]
              : null,
            snowDepth: hourly.snow_depth ? hourly.snow_depth[index] : null,
            snowfall: hourly.snowfall ? hourly.snowfall[index] : null,
          }));

          setData(formattedData);
        })
        .catch((error) => console.error("Error fetching weather data:", error));
    };
    if (location?.latitude !== null) {
      getWeatherAPI();
    }
  }, [selectedValues, location]);
  const handleLocationSelect = (value) => {
    const selectedLocation = savedLocations.find(
      (loc) => `${loc.latitude},${loc.longitude}` === value,
    );
    setLocation(selectedLocation);
  };
  const options = [
    { label: "Rain", value: "rain" },
    { label: "Temperature (2 m)", value: "temperature_2m" },
    { label: "Relative Humidity (2 m)", value: "relative_humidity_2m" },
    { label: "Soil Temperature (0-7 cm)", value: "soil_temperature_0_to_7cm" },
    { label: "Soil Moisture (0-7 cm)", value: "soil_moisture_0_to_7cm" },
    { label: "Snow Depth", value: "snow_depth" },
    { label: "Snowfall", value: "snowfall" },
  ];
  return (
    <div className="weather-variables-wrapper">
      <div className="title-location-wrapper">
        <h3 className="title">Weather Data</h3>
        {role !== "user" && (
          <Select
            style={{ width: 200, margin: "20px 0" }}
            placeholder="Select location"
            onChange={handleLocationSelect}
            allowClear
          >
            {savedLocations?.map((loc) => (
              <Option
                key={`${loc.latitude},${loc.longitude}`}
                value={`${loc.latitude},${loc.longitude}`}
              >
                {`Lat: ${loc.latitude}, Lon: ${loc.longitude}`}
              </Option>
            ))}
          </Select>
        )}
      </div>
      {role !== "user" && (
        <div className="checkbox-group">
          <Checkbox.Group
            options={options}
            onChange={onChange}
            value={selectedValues}
          />
        </div>
      )}
      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="time"
            tickFormatter={(time) =>
              moment(time, "YYYY-MM-DDTHH:mm:ss").format("DD-MM")
            }
            interval={20}
            angle={-45}
          />
          <YAxis
            yAxisId="left"
            label={{
              value: "Temperature (°C) / Humidity (%)",
              angle: -90,
              position: "insideLeft",
            }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            label={{
              value: "Rain (mm) / Pressure (hPa)",
              angle: 90,
              position: "insideRight",
            }}
          />
          <Tooltip
            formatter={(value, name) => [
              `${value} ${
                name === "temperature" || name === "soilTemperature"
                  ? "°C"
                  : name === "rain"
                  ? "mm"
                  : name === "pressure"
                  ? "hPa"
                  : "%"
              }`,
              name,
            ]}
          />
          <Legend />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="temperature"
            stroke="#8884d8"
            name="Temperature (°C)"
            dot={false}
          />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="humidity"
            stroke="#ff7300"
            name="Relative Humidity (%)"
            dot={false}
          />
          <Bar yAxisId="right" dataKey="rain" fill="#82ca9d" name="Rain (mm)" />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="soilTemperature"
            stroke="#ffc658"
            name="Soil Temperature (°C)"
            dot={false}
          />
          <Bar
            yAxisId="right"
            dataKey="snowDepth"
            fill="#ff0000"
            name="Snow Depth (mm)"
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="snowfall"
            stroke="#0000ff"
            name="Snowfall (mm)"
            dot={false}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="soilMoisture"
            stroke="#00c49f"
            name="Soil Moisture (%)"
            dot={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WeatherChart;
