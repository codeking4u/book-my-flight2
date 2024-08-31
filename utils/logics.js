import { getDistance, getCenter, findNearest } from 'geolib';
import aiportData from '../data/airports.json' assert { type: 'json' };

/* this is to reduce multile number of filter functions */
const airportLookup = aiportData.reduce((map, airport) => {
    map[airport.code] = { 'latitude': airport.lat, 'longitude': airport.lon }
    return map;
}, {});
const airportsCordsArr = Object.values(airportLookup);

const calculateDistance = async (source, destination) => {
    return await getDistance(source, destination);
}

const getStraightLinePoints = async (source, destination) => {
    const middleCords = await getCenter([source, destination]);
    const centerSourceToMidCords = await getCenter([source, middleCords]);
    const centerMidToDestinationCords = await getCenter([middleCords, destination]);
    return [centerSourceToMidCords, middleCords, centerMidToDestinationCords]
}

const getShortestRoute = async (sourceCode, destinationCode) => {
    const sourceCoord = airportLookup[sourceCode];
    const destinationCoord = airportLookup[destinationCode];

    const straightLineDistance = await calculateDistance(sourceCoord, destinationCoord);
    const straightLineMultiplePoints = await getStraightLinePoints(sourceCoord, destinationCoord);
    const nearestAirports = getNearestAirports(straightLineMultiplePoints)

    return nearestAirports
}

const getNearestAirports = multiPoints => {
    const nearestAirportsCoords = [];
    const nearestAirportsCodes = [];
    multiPoints.forEach(lineCords => {
        nearestAirportsCoords.push(findNearest(lineCords, airportsCordsArr));
    });
    nearestAirportsCoords.forEach((airportCords) => {
        const airportCode = Object.keys(airportLookup).find(key => {
            return airportLookup[key].latitude === airportCords.latitude && airportLookup[key].longitude === airportCords.longitude;
        })

        if (!nearestAirportsCodes.includes(airportCode)) nearestAirportsCodes.push(airportCode);

    })
    return nearestAirportsCodes
}


export { airportLookup, calculateDistance, getShortestRoute };