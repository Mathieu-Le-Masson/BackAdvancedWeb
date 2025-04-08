import openStreetMapsClient from '../config/openStreetMaps';
import DeliveryZone from '../models/DeliveryZone';

export const geocodeAddress = async (address: string) => {
    const response = await openStreetMapsClient.get('/search', {
        params: {
            q: address,
        },
    });

    const location = response.data[0];
    return location ? { lat: parseFloat(location.lat), lng: parseFloat(location.lon) } : null;
};

export const calculateRoute = async (origin: string, destination: string) => {

    const address1Tab = await geocodeAddress(origin);
    const address2Tab = await geocodeAddress(destination);
    if (!address1Tab || !address2Tab) {
        throw new Error("Impossible de récupérer les coordonnées GPS des adresses.");
    }

    const { lat: latitude1, lng: longitude1 } = address1Tab;
    const { lat: latitude2, lng: longitude2 } = address2Tab;



    const routingUrl = `https://routing.openstreetmap.de/routed-car/route/v1/driving/${longitude1},${latitude1};${longitude2},${latitude2}?overview=false&geometries=polyline`;
    const routingResponse = await fetch(routingUrl);

    if (!routingResponse.ok) {
        throw new Error("Erreur lors de la récupération de la distance via OpenStreetMap.");
    }

    const routingData = await routingResponse.json();
    const route = routingData.routes?.[0];

    if (!route) {
        throw new Error("Aucune route trouvée entre les deux points.");
    }

    const distanceRoute = route.distance / 1000; // Distance en km

    //retourner la distance et le temps de trajet
    return {
        distance: distanceRoute,
        duration: route.duration / 60, // Durée en minutes
    };



};

export const isPositionInDeliveryZone = async (position: { lat: number; lng: number }, zoneId: string) => {
    const zone = await DeliveryZone.findByPk(zoneId);

    if (!zone) {
        throw new Error('Zone de livraison introuvable');
    }

    return zone.coordinates.some(coord => coord.lat === position.lat && coord.lng === position.lng);
};
