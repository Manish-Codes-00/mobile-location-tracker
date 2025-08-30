import React, { useState } from "react";
import Navigation from "./components/Navigation";
import LocationForm from "./components/LocationForm";
import MapDisplay from "./components/MapDisplay";
import Footer from "./components/Footer";

export default function App() {
  const [info, setInfo] = useState(null);
  const [error, setError] = useState("");

  const handleSearch = async (number) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/lookup?number=${encodeURIComponent(number)}`
      );
      const data = await response.json();

      if (data.error) {
        setError(data.error);
        setInfo(null);
      } else {
        setInfo(data);
        setError("");
      }
    } catch (err) {
      console.error(err);
      setError("❌ Error fetching location");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />

      <main className="flex-grow container mx-auto p-6 text-center">
        <h1 className="text-3xl font-bold mb-6 text-blue-700">
          📍 Mobile Location Checker
        </h1>

        {/* Input Form */}
        <LocationForm onSearch={handleSearch} />

        {/* Error Message */}
        {error && <p className="text-red-500 mt-2">{error}</p>}

        {/* Show details + map only when info is available */}
        {info && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold">Details:</h2>
            <p>📞 Number: {info.number}</p>
            <p>🌍 Country: {info.country}</p>
            <p>🏙️ Location: {info.location}</p>
            <p>📡 Carrier: {info.carrier}</p>
            <p>
              📍 Coordinates: {info.latitude}, {info.longitude}
            </p>

            <MapDisplay
              latitude={info.latitude}
              longitude={info.longitude}
              location={info.location}
              country={info.country}
            />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
