# Real-Time Weather Forecast Dashboard with Role-Based Access

A scalable dashboard for visualizing and managing weather forecasts based on role-specific access. The application provides real-time data processing, role-specific views, and dynamic forecasts based on user location or selected region.

## Project Features
- **Authentication:** Registration and login functionality with private routing.
- **Roles:** Three roles—Admin, Manager, and User—each with distinct permissions:
  - **User:** View personal forecast based on latitude and longitude.
  - **Manager:** Select locations from a dropdown for forecast details.
  - **Admin:** Full access to add and select locations, plus manage user roles.
- **Real-Time Weather Forecasts:** Average temperature forecast (for timezone America/New_York) for the upcoming week.
- **CSV Upload & Data Management:** CSV upload feature that saves weather data (temperature, rain, wind speed, humidity, etc.) to MongoDB. After a successful upload, users are redirected to the Weather Details page.
- **Graph Visualizations:** Forecasts for temperature, rain, and other parameters displayed via Recharts.
- **Filterable Forecast Table:** Forecast data table with date, temperature range filters, and pagination.
- **Responsive Design:** Optimized for desktop and mobile devices.
- **Performance Optimizations:** Lazy loading, code splitting, and efficient data fetching.

## Additional UI Features
- **Header & Footer:** Consistent header and footer components across all pages.
- **User Dropdown in Header:** Displays the logged-in user's email and role with an option to log out.
- **Component Naming and Structure:** Code structure and component names follow best practices for clarity and maintainability.

## Technologies Used
- **Frontend:** React.js, Recharts (for data visualization), Ant Design, React Router (for routing)
- **Backend:** Node.js, Express.js, MongoDB
- **API & Data Management:** RESTful APIs, MongoDB schema design
- **Real-Time Data:** Role-based forecast updates based on user location (latitude and longitude)
- **Security:** JWT-based authentication and authorization
- **Deployment:** Vercel for frontend, AWS EC2 for backend

## Setup and Installation
1. **Clone the repository:**
    ```bash
    git clone [https://github.com/devanandinibunga/weather-forecast.git]
    cd weather-forecast
    ```

2. **Run the Backend Server:**
    ```bash
    cd server
    npm install
    npm run server
    ```

3. **Run the Frontend Client:**
    ```bash
    cd client
    npm install
    npm start
    ```

## Usage
- **Admin:** Can add locations, select any location from the dropdown, and view full forecast data (temperature, rain, humidity, soil temperature, snow depth, etc.).
- **Manager:** Can select a location from the dropdown and view forecasts for temperature, rain, and other parameters.
- **User:** Can view a forecast based on their latitude and longitude with visualizations for temperature and rain.

### Main Pages
1. **Dashboard:** Default page for all roles showing average temperature forecast for the upcoming week.
2. **CSV Upload:** Allows CSV file upload for batch data processing.
3. **Weather Details:** Displays comprehensive weather metrics in a table with pagination and filters.

## Key Components
- **Graph Visualizations:** Recharts-based graphs showing various metrics depending on the user role.
- **Forecast Table:** Temperature forecast for the week, filterable by date and temperature range.
- **Dropdown Location Selection:** For Manager and Admin roles to select forecast locations.
- **Location Management (Admin Only):** Add new locations to the database.

## API Endpoints
- **User Authentication:** Register, Login, JWT-based authentication
- **Forecast Data:** CRUD operations for temperature, rain, humidity, and other parameters
- **Location Management:** Add, update, and delete locations (Admin only)

# Project: Role-Based Access Control with Weather Forecast API

This project demonstrates a role-based access control (RBAC) system within an Express API for accessing weather forecast data. Users are assigned one of three roles: **Admin**, **Manager**, or **User**. Each role has specific permissions, which control access to API endpoints and actions.

## Roles and Permissions
### 1. Admin
- **Permissions**: Has full access to manage data, users, and locations.
- **Endpoints**:
  - `/forecast-data`: Accesses all forecast data with filtering.
  - `/api/addLocation`: Adds new locations.
  - `/api/getLocation`: Retrieves all locations.
- **Use case**: The Admin role is responsible for managing locations and settings, with access to all data for comprehensive reporting.
- **Demo Credentials**:
  - **Username**: `alex@gmail.com`
  - **Password**: `alex@123`

### 2. Manager
- **Permissions**: Can retrieve and view location data, forecast data, and user reports but lacks privileges to add locations.
- **Endpoints**:
  - `/forecast-data`: Accesses forecast data with filtering.
  - `/api/getLocation`: Views all locations but cannot add or edit.
- **Use case**: Managers can access data for locations but do not have modification rights, ensuring data security and integrity.
- **Demo Credentials**:
  - **Username**: `johndoe@gmail.com`
  - **Password**: `john@123`

### 3. User
- **Permissions**: Limited to viewing available location and forecast data.
- **Endpoints**:
  - `/forecast-data`: Views weather forecasts for specific queries, excluding confidential data.
  - `/api/getLocation`: Retrieves location data to view forecasts and trends.
- **Use case**: Users monitor general forecast data without administrative access.
- **Demo Credentials**:
  - **Username**: `devanandini@gmail.com`
  - **Password**: `nandini@123`

### Weather Chart Component
The Weather Chart component is a critical part of the dashboard, providing visual insights into weather patterns over time. It utilizes Recharts for rendering various weather metrics based on user role and selected location.

### Component Features:
**Dynamic Data Rendering**: Displays temperature, rain, and other weather parameters dynamically based on the user's selected location and time frame.
**Customizable Charts**: The component can render multiple types of charts, including line charts for temperature and bar charts for rainfall, enabling clear comparisons of different weather conditions.
### Role-Specific Views:
- **Admin**: Can view comprehensive data visualizations for all locations.
- **Manager**: Can view selected location forecasts with relevant metrics.
- **User**: Limited to viewing forecasts for their specific location.
- **Responsive Design**: The chart adjusts to different screen sizes for optimal viewing on both mobile and desktop devices.
- **Interactive Features**: Users can hover over data points to see detailed information, enhancing user engagement and understanding.
### Implementation Details:
- **Data Fetching**: The component retrieves weather data from the backend API based on user role and selected location.
- **Error Handling**: Displays user-friendly error messages in case of data fetch failures or invalid data.
- **Performance Optimization**: Utilizes React’s memoization techniques to prevent unnecessary re-renders and improve performance.
 
## Deployment
- **Frontend:** Deployed on Vercel
- **Backend:** Deployed on Vercel

## Optimizations
- **Performance:** Lazy loading, code splitting, and efficient data fetching.
- **Error Handling:** Graceful error handling with notifications for key actions (e.g., successful location addition).
- **Responsive UI:** Optimized for mobile and desktop views.

## Additional Features
- **Private Routing:** Secures pages based on user roles.
- **Notifications:** Alerts for actions like successful location addition.
- **Data Validation:** Ensures integrity when uploading and managing large datasets.

## Demo
- **Frontend URL:** https://weather-forecast-client-theta.vercel.app/login
- **Backend URL:** https://weather-forecast-server-one.vercel.app

## Contact
For questions or contributions, please contact [Deva Nandini Bunga](mailto:devanandini205@gmail.com).
