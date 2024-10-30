import React from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import { Login } from "./components/login/login";
import { Register } from "./components/register/register";
import "./App.css";
import Dashboard from "./Dashboard/dashboard";
import TemperatureChart from "./components/temperature-graph/temperature-graph";
import { MainLayout } from "./layout/layout";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to={`/login`} replace />} />
        <Route path="/register" element={<Register />} exact />
        <Route path="/login" element={<Login />} exact />
        <Route element={<MainLayout />} exact>
          <Route path="/dashboard" element={<Dashboard />} exact />
          <Route
            path="/temperature-chart"
            element={<TemperatureChart />}
            exact
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
