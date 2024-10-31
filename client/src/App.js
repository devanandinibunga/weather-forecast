import React, { Suspense, lazy } from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import "./App.css";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import Spinner from "./components/spinner/spinner";

// Lazy load the components
const Login = lazy(() => import("./components/login/login"));
const Register = lazy(() => import("./components/register/register"));
const Dashboard = lazy(() => import("./Dashboard/dashboard"));
const TemperatureChart = lazy(() =>
  import("./components/temperature-graph/temperature-graph"),
);
const MainLayout = lazy(() => import("./layout/layout"));

function App() {
  return (
    <Router>
      <Suspense fallback={<Spinner />}>
        <Routes>
          <Route path="*" element={<Navigate to={`/login`} replace />} />
          <Route path="/register" element={<Register />} exact />
          <Route path="/login" element={<Login />} exact />
          <Route element={<MainLayout />} exact>
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
              exact
            />
            <Route
              path="/temperature-chart"
              element={
                <PrivateRoute>
                  <TemperatureChart />
                </PrivateRoute>
              }
              exact
            />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
