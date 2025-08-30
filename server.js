import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const NUMVERIFY_API_KEY = process.env.NUMVERIFY_KEY;
const OPENCAGE_API_KEY = process.env.OPENCAGE_KEY;

app.get("/api/lookup", async (req, res) => {
  const { number } = req.query;
  if (!number) return res.status(400).json({ error: "Phone number required" });

  try {

    // 1. Lookup phone number with NumVerify
    const numverifyResponse = await fetch(
      `http://apilayer.net/api/validate?access_key=${NUMVERIFY_API_KEY}&number=${encodeURIComponent(
        number
      )}`
    );
    const numverifyData = await numverifyResponse.json();

    if (!numverifyData.valid) {
      return res.status(400).json({ error: "Invalid phone number" });
    }

    // 2. Use OpenCage to get coordinates (bias results using NumVerify country code)
    const location = `${numverifyData.location || ""}, ${
      numverifyData.country_name || ""
    }`;
    const countryCode = numverifyData.country_code?.toLowerCase() || "in";

    const geoResponse = await fetch(
      `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
        location
      )}&key=${OPENCAGE_API_KEY}&countrycode=${countryCode}`
    );
    const geoData = await geoResponse.json();

    if (!geoData.results.length) {
      return res
        .status(404)
        .json({ error: "Could not find coordinates for this location" });
    }

    const { lat, lng } = geoData.results[0].geometry;

    res.json({
      number: numverifyData.international_format,
      location: numverifyData.location,
      country: numverifyData.country_name,
      carrier: numverifyData.carrier,
      latitude: lat,
      longitude: lng,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching location" });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
