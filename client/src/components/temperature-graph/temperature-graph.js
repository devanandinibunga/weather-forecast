import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
} from "recharts";
import Cookies from "js-cookie";
import moment from "moment";
import "./temperature-graph.scss";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";

const TemperatureChart = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://weather-forecast-server-one.vercel.app/temperature-data",
        {
          headers: {
            "x-token": Cookies.get("authToken"),
          },
        },
      );
      const processedData = response?.data?.map((item) => ({
        time: item?.time,
        temperature: item?.temperature_2m,
        windSpeed: item?.wind_speed_10m,
        humidity: item?.relative_humidity_2m,
        rain: item?.rain,
      }));
      setData(processedData);
    } catch (err) {
      console.error(err);
      setError("Error fetching data");
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div className="weather-update-wrapper">
      <h2 className="title">Weather Update</h2>
      {error && <p>{error}</p>}
      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="time"
            tickFormatter={(time) => moment(time).format("DD-MM-YYYY")}
          />
          <YAxis />
          <Tooltip />
          <Legend />
          {data?.length > 0 && (
            <>
              {data.some((item) => item.temperature > 0) && (
                <Line type="monotone" dataKey="temperature" stroke="#8884d8" />
              )}
              {data.some((item) => item.windSpeed > 0) && (
                <Line type="monotone" dataKey="windSpeed" stroke="#82ca9d" />
              )}
              {data.some((item) => item.humidity > 0) && (
                <Line type="monotone" dataKey="humidity" stroke="#ff7300" />
              )}
              {data.some((item) => item.rain > 0) && (
                <Line type="monotone" dataKey="rain" stroke="#ff0000" />
              )}
            </>
          )}
        </ComposedChart>
      </ResponsiveContainer>
      <div className="back-btn">
        <Button type="primary" onClick={() => navigate("/dashboard")}>
          Back to Upload
        </Button>
      </div>
    </div>
  );
};

export default TemperatureChart;
