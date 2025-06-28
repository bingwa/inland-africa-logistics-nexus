
// Simple distance calculation between two cities in Kenya
// This is a mock implementation - in a real system you'd use Google Maps API or similar

interface CityCoordinates {
  [key: string]: { lat: number; lng: number };
}

const kenyaCities: CityCoordinates = {
  'Nairobi': { lat: -1.2921, lng: 36.8219 },
  'Mombasa': { lat: -4.0435, lng: 39.6682 },
  'Kisumu': { lat: -0.0917, lng: 34.7680 },
  'Eldoret': { lat: 0.5143, lng: 35.2698 },
  'Nakuru': { lat: -0.3031, lng: 36.0800 },
  'Meru': { lat: 0.0469, lng: 37.6505 },
  'Thika': { lat: -1.0332, lng: 37.0692 },
  'Malindi': { lat: -3.2194, lng: 40.1169 },
  'Kitale': { lat: 1.0158, lng: 35.0062 },
  'Garissa': { lat: -0.4536, lng: 39.6401 }
};

// Haversine formula to calculate distance between two points
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  return Math.round(distance);
}

export const getDistanceBetweenCities = (origin: string, destination: string): number => {
  const originCoords = kenyaCities[origin];
  const destinationCoords = kenyaCities[destination];
  
  if (!originCoords || !destinationCoords) {
    return 0; // Return 0 if cities not found
  }
  
  return calculateDistance(
    originCoords.lat, 
    originCoords.lng, 
    destinationCoords.lat, 
    destinationCoords.lng
  );
};

export const getAvailableCities = (): string[] => {
  return Object.keys(kenyaCities);
};
