import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import WeatherDashboard from "../components/average-temperature-chart/average-temperature-chart";
import { useForm } from "antd/es/form/Form";
import ForecastTable from "../components/forecast-table/forecast-table";
import { moment } from "moment";
import { AddLocation } from "../components/add-location/add-location";
import "./dashboard.scss";
import WeatherChart from "../components/weather-chart/weather-chart";
import { Col, Row } from "antd";
import NotifyStatus from "../components/notify-status/notify-status";

function Dashboard() {
  const [form] = useForm();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [savedLocations, setSavedLocations] = useState([]);
  const [status, setStatus] = useState("");
  const [message, setMessage] = useState("");
  const [visible, setVisible] = useState(false);
  const [filters, setFilters] = useState({});
  const [error, setError] = useState("");
  const [addLocation, setAddLocation] = useState(false);
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please upload a CSV file");
      return;
    }

    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "x-token": Cookies.get("authToken"),
          },
        },
      );
      alert(response.data.message);
      navigate("/temperature-chart");
    } catch (err) {
      console.error(err);
      setError("Error uploading file");
    } finally {
      setLoading(false);
    }
  };

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
    fetchSavedLocations();
  }, []);
  const fetchSavedLocations = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/getLocation",
        {
          headers: {
            "x-token": Cookies.get("authToken"),
          },
        },
      );
      setSavedLocations(response?.data?.locations);
    } catch (error) {
      console.error(
        "Error retrieving locations:",
        error?.response?.data?.message,
      );
    }
  };
  useEffect(() => {
    const addLocation = async () => {
      try {
        await axios
          .post("http://localhost:5000/api/addLocation", location, {
            headers: {
              "x-token": Cookies.get("authToken"),
            },
          })
          .then((response) => {
            setAddLocation(false);
            setStatus("success");
            setMessage("Location added successfully");
          });
        fetchSavedLocations();
        form.resetFields();
      } catch (error) {
        console.error("Error adding location:", error.response.data.message);
      }
    };
    if (location?.latitude !== null) {
      addLocation();
    }
  }, [location]);
  const handleLocationSelect = (value) => {
    const selectedLocation = savedLocations.find(
      (loc) => `${loc.latitude},${loc.longitude}` === value,
    );
    setLocation(selectedLocation);
  };
  const showDrawer = () => setVisible(true);
  const closeDrawer = () => setVisible(false);
  const handleFilterSubmit = (values) => {
    const [start, end] = values.dateRange || [];
    setFilters({
      start_date: start
        ? start.format("YYYY-MM-DD")
        : moment().format("YYYY-MM-DD"),
      end_date: end
        ? end.format("YYYY-MM-DD")
        : moment().add(7, "days").format("YYYY-MM-DD"),
      min_temp: values.min_temp,
      max_temp: values.max_temp,
    });
    closeDrawer();
  };
  return (
    <Row className="dashboard-wrapper">
      <Col span={24}>
        <WeatherDashboard />
      </Col>
      <Col span={24}>
        <div className="upload-location-wrapper">
          <div className="upload-wrapper">
            <input type="file" accept=".csv" onChange={handleFileChange} />
            <button onClick={handleUpload} disabled={loading}>
              {loading ? "Uploading..." : "Upload"}
            </button>
            <p className="note">
              *Note <br /> 1. Once the file uploaded page will be redirected to
              the new page <br />
              2. Please upload the CSV file from website
              <a
                href="https://open-meteo.com/en/docs/historical-weather-api"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://open-meteo.com/en/docs/historical-weather-api
              </a>
              and also remove the metadat from the file before uploading. The
              schema should be temperature, rain, windspeed and humidity.
            </p>
          </div>
        </div>
      </Col>
      <div className="add-location">
        {role === "admin" && (
          <AddLocation
            addLocation={addLocation}
            setAddLocation={setAddLocation}
            setLocation={setLocation}
          />
        )}
      </div>
      <Col span={24}>
        <WeatherChart savedLocations={savedLocations} />
      </Col>
      <Col span={24}>
        <ForecastTable
          location={location}
          filters={filters}
          handleLocationSelect={handleLocationSelect}
          showDrawer={showDrawer}
          handleFilterSubmit={handleFilterSubmit}
          visible={visible}
          closeDrawer={closeDrawer}
          savedLocations={savedLocations}
          setLocation={setLocation}
        />
      </Col>
      {status && <NotifyStatus status={status} message={message} />}
    </Row>
  );
}

export default Dashboard;
