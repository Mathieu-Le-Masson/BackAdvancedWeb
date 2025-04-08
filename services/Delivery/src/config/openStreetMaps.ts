import axios from 'axios';

const openStreetMapsClient = axios.create({
    baseURL: 'https://nominatim.openstreetmap.org',
    headers: {
        'User-Agent': 'DeliveryService/1.0',
    },
    params: {
        format: 'json',
    },
});

export default openStreetMapsClient;
