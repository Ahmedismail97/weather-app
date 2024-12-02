# Weather App

A modern weather application built with Vue 3 and TypeScript, featuring real-time weather data, location search, and personalized weather tracking.

## Features

- 🌡️ Real-time weather data with current conditions
- 🔍 Location search with city and airport support
- 📍 Automatic current location detection
- 📱 Responsive design for all devices
- 📊 Hourly and weekly weather forecasts
- 💾 Save favorite locations
- 👤 User profile management
- 🌈 Dynamic weather-based UI themes

## Tech Stack

- Vue 3 with Composition API
- TypeScript
- Vite
- Pinia for state management
- Vue Router
- Axios for API calls
- Lucide Icons
- OpenWeather API

## Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager
- OpenWeather API key

## Installation

1. Clone the repository:
   git clone https://github.com/Ahmedismail97/weather-app.git
   cd weather-app

2. Install dependencies:
   npm install

3. Create a .env file in the root directory and add your OpenWeather API key:
   VITE_OPENWEATHER_API_KEY=your_api_key_here

## Development

To start the development server:
   npm run dev

The application will be available at http://localhost:5173

## Building for Production

To create a production build:
   npm run build

To preview the production build locally:
   npm run preview

## Project Structure

src/
├── assets/        # Static assets and background configurations
├── components/    # Vue components
│   ├── atoms/     # Basic UI components
│   ├── molecules/ # Composite components
│   └── organisms/ # Complex components
├── pages/         # Route pages
├── services/      # API services
├── stores/        # Pinia stores
├── types/         # TypeScript type definitions
└── router/        # Vue Router configuration

## Features in Detail

### Weather Data
- Current weather conditions
- Temperature (current, high, low)
- Feels like temperature
- Humidity and wind speed
- UV index
- Hourly forecast (24 hours)
- Weekly forecast (7 days)

### Location Management
- Search for cities worldwide
- Automatic current location detection
- Save favorite locations
- Remove saved locations

### User Interface
- Dynamic weather-based backgrounds
- Responsive design
- Loading states
- Error handling
- Smooth animations