import aiportData from '../data/airports.json' assert { type: 'json' };

/* this is to reduce multile number of filter functions */
const airportLookup = aiportData.reduce((map, airport) => {
    map[airport.code] = [airport.lat, airport.lon];
    return map;
}, {});


export default airportLookup;