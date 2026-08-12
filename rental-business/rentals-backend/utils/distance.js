/**
 * Calculate driving distance between two coordinates using Mapbox Matrix API
 * @param {number} originLat - Business latitude
 * @param {number} originLon - Business longitude
 * @param {number} destLat - Customer latitude
 * @param {number} destLon - Customer longitude
 * @param {string} mapboxToken - Your Mapbox access token
 * @returns {Promise<{distanceMiles: number, distanceKm: number, durationMinutes: number}>}
 */
export async function calculateDrivingDistance(originLat, originLon, destLat, destLon, mapboxToken) {
  try {
    // Mapbox uses [longitude, latitude] format
    const coordinates = `${originLon},${originLat};${destLon},${destLat}`;
    const url = `https://api.mapbox.com/directions-matrix/v1/mapbox/driving/${coordinates}?annotations=distance,duration&access_token=${mapboxToken}`;

    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Mapbox API error: ${response.status}`);
    }

    const data = await response.json();

    // distances[0][1] is the distance from origin to destination (in meters)
    const distanceMeters = data.distances[0][1];
    const durationSeconds = data.durations[0][1];

    // Convert to miles and kilometers
    const distanceMiles = distanceMeters * 0.000621371;
    const distanceKm = distanceMeters / 1000;
    const durationMinutes = Math.round(durationSeconds / 60);

    return {
      distanceMiles: Math.round(distanceMiles * 10) / 10, // Round to 1 decimal
      distanceKm: Math.round(distanceKm * 10) / 10,
      durationMinutes,
    };
  } catch (error) {
    console.error('Error calculating driving distance:', error);
    // Return null on error so you can handle it gracefully
    return null;
  }
}