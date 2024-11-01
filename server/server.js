const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const axios = require("axios");
const WebSocket = require("ws");
const CSVData = require("./models/csvdatamodel");
const assessmentUserSchema = require("./models/assessmentusermodel");
const { verifyJWT, authorizeRole } = require("./middleware");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const csvParser = require("csv-parser");
const locationSchema = require("./models/locationmodel");

// Initialize Express app
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "*",
  }),
);

const server = require("http").createServer(app);
const wss = new WebSocket.Server({ server });

// Database Connection
mongoose
  .connect(
    "mongodb+srv://devanandini205:nandini402@cluster0.vllqbgr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
  )
  .then(() => console.log("DB connected"))
  .catch((err) => console.log(`DB connection error: ${err.message}`));

// Register API
app.post("/register", async (req, res) => {
  try {
    const { username, email, password, confirmpassword, role } = req.body;
    const exist = await assessmentUserSchema.findOne({ email });
    if (exist) {
      return res.status(400).send("User already exists");
    }
    if (password !== confirmpassword) {
      return res.status(403).send("Passwords do not match");
    }
    const hashedPassword = bcrypt.hashSync(password, 8);
    const newUser = new assessmentUserSchema({
      username,
      email,
      password: hashedPassword,
      role: role,
    });
    await newUser.save();
    return res.status(200).send("User Registered Successfully");
  } catch (err) {
    console.log(err.message);
    return res.status(500).send("Server error");
  }
});

// Login API
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await assessmentUserSchema.findOne({ email });
    if (!user) {
      return res.status(400).send("User doesn't exist");
    }
    if (!bcrypt.compare(password, user.password)) {
      return res.status(403).send("Invalid credentials");
    }
    const payload = {
      user: {
        id: user._id,
        role: user.role,
      },
    };

    const token = jwt.sign(payload, "jwtKey", { expiresIn: 3600000 });
    return res.json({ token, role: user.role });
  } catch (err) {
    console.log(err.message);
    return res.status(500).send("Server error");
  }
});

//Get profile details API
app.get("/profile", verifyJWT, async (req, res) => {
  try {
    const exist = await assessmentUserSchema.findById(req.user.id);
    if (!exist) {
      return res.status(400).send("User not found");
    }
    return res.json(exist);
  } catch (err) {
    console.log(err.message);
    return res.status(500).send("Server not found");
  }
});

// Configure multer to store files in memory
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post("/api/upload", upload.single("file"), async (req, res) => {
  const results = [];
  const fileBuffer = req.file.buffer;

  try {
    await CSVData.deleteMany({});
  } catch (error) {
    console.error("Error clearing data:", error);
    return res.status(500).send("Error clearing existing data");
  }

  const csvStream = require("streamifier").createReadStream(fileBuffer);
  csvStream
    .pipe(csv())
    .on("data", (row) => {
      if (row.time && row["temperature_2m (°C)"]) {
        results.push({
          time: new Date(row.time),
          temperature_2m: row["temperature_2m (°C)"]
            ? parseFloat(row["temperature_2m (°C)"])
            : 0,
          wind_speed_10m: row["wind_speed_10m (km/h)"]
            ? parseFloat(row["wind_speed_10m (km/h)"])
            : 0,
          rain: row["rain (mm)"] ? parseFloat(row["rain (mm)"]) : 0,
          relative_humidity_2m: row["relative_humidity_2m (%)"]
            ? parseFloat(row["relative_humidity_2m (%)"])
            : 0,
        });
      }
    })
    .on("end", async () => {
      try {
        await CSVData.insertMany(results);
        res.status(200).send({
          message: "CSV data processed and stored",
          count: results.length,
        });
      } catch (error) {
        console.error("Error saving data:", error);
        res.status(500).send("Error saving data");
      }
    })
    .on("error", (err) => {
      console.error("Error while processing CSV:", err);
      res.status(500).send("Error processing CSV");
    });
});

app.get("/temperature-data", verifyJWT, async (req, res) => {
  try {
    const temperatureData = await CSVData.find();
    res.status(200).json(temperatureData);
  } catch (error) {
    console.error("Error retrieving temperature data:", error);
    res.status(500).send("Error retrieving temperature data");
  }
});

app.get(
  "/forecast-data",
  verifyJWT,
  authorizeRole(["admin", "manager", "user"]),
  async (req, res) => {
    let {
      latitude,
      longitude,
      start_date,
      end_date,
      min_temp,
      max_temp,
      page,
      limit,
    } = req.query;

    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    try {
      const response = await axios.get(
        "https://api.open-meteo.com/v1/forecast",
        {
          params: {
            latitude: latitude,
            longitude: longitude,
            hourly: "temperature_2m",
          },
        },
      );

      const { hourly } = response.data;

      let filteredData = hourly.time.map((time, index) => ({
        time: new Date(time),
        temperature: hourly.temperature_2m[index],
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
      }));
      if (start_date || end_date || min_temp || max_temp) {
        const startDate = start_date ? new Date(start_date) : null;
        const endDate = end_date ? new Date(end_date) : null;
        const minTemp = min_temp ? parseFloat(min_temp) : null;
        const maxTemp = max_temp ? parseFloat(max_temp) : null;

        filteredData = filteredData.filter(({ time, temperature }) => {
          return (
            (!startDate || time >= startDate) &&
            (!endDate || time <= endDate) &&
            (!minTemp || temperature >= minTemp) &&
            (!maxTemp || temperature <= maxTemp)
          );
        });
      }
      const total = filteredData.length;
      const paginatedData = filteredData.slice(
        (page - 1) * limit,
        page * limit,
      );
      res.json({
        total,
        page,
        limit,
        data: paginatedData,
      });
    } catch (error) {
      console.error(
        `Error fetching data for location (${latitude}, ${longitude}):`,
        error,
      );
      res.status(500).json({ error: "Failed to fetch weather summary data" });
    }
  },
);

app.get(
  "/average-temperature",
  verifyJWT,
  authorizeRole(["admin", "manager", "user"]),
  async (req, res) => {
    try {
      const response = await axios.get(
        `https://api.open-meteo.com/v1/forecast`,
        {
          params: {
            latitude: 40.7128,
            longitude: -74.006,
            hourly: "temperature_2m,rain",
            start: new Date().toISOString(),
            timezone: "America/New_York",
          },
        },
      );
      res.json(response?.data);
    } catch (error) {
      console.error("Error fetching weather data:", error);
      res.status(500).json({ error: "Failed to fetch weather chart data" });
    }
  },
);

app.post(
  "/api/addLocation",
  verifyJWT,
  authorizeRole(["admin", "manager", "user"]), // Added manager and user to update current location after their login
  async (req, res) => {
    const { latitude, longitude } = req.body;
    if (latitude && longitude) {
      try {
        // Check if a location with the same latitude and longitude already exists
        const existingLocation = await locationSchema.findOne({
          latitude,
          longitude,
        });

        if (existingLocation) {
          return res.status(409).json({
            message:
              "Location with the same latitude and longitude already exists",
            location: existingLocation,
          });
        }

        // Create and save new location if it doesn't already exist
        const newLocation = new locationSchema({ latitude, longitude });
        await newLocation.save();

        res.status(200).json({
          message: "Location added successfully",
          location: newLocation,
        });
      } catch (error) {
        res.status(500).json({ message: "Error adding location", error });
      }
    } else {
      res.status(400).json({ message: "Latitude and longitude are required" });
    }
  },
);

// GET API to retrieve all locations
app.get(
  "/api/getLocation",
  verifyJWT,
  authorizeRole(["admin", "manager", "user"]),
  async (req, res) => {
    try {
      const locations = await locationSchema.find();
      res.status(200).json({ locations });
    } catch (error) {
      res.status(500).json({ message: "Error retrieving locations", error });
    }
  },
);

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
