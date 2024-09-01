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
    return [source, centerSourceToMidCords, middleCords, centerMidToDestinationCords, destination]
}

const getShortestRoute = async (sourceCode, destinationCode) => {
    const sourceCoord = airportLookup[sourceCode];
    const destinationCoord = airportLookup[destinationCode];

    const straightLineDistance = await calculateDistance(sourceCoord, destinationCoord);
    const straightLineMultiplePoints = await getStraightLinePoints(sourceCoord, destinationCoord);
    const nearestAirports = getNearestAirports(straightLineMultiplePoints);
    const airportCombinations = generateAirportCombinations(nearestAirports);

    const shortDistData = await findShortestPath(airportCombinations);
    return shortDistData;
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


const generateAirportCombinations = (airportArr) => {
    const start = airportArr[0];
    const end = airportArr[airportArr.length - 1];
    const middle = airportArr.slice(1, airportArr.length - 1);
    const results = [];

    function combine(current, remaining) {
        if (remaining.length === 0) {
            results.push(current);
        } else {
            for (let i = 0; i < remaining.length; i++) {
                combine(
                    current.concat(remaining[i]),
                    remaining.slice(i + 1)
                );
            }
        }
    }

    combine([start], middle);

    return results.map(combination => combination.concat(end));
}

const findShortestPath = async (paths) => {
    let shortestPath;
    let shortestDistance = Infinity;
    const allPathDist = [];

    for (const path of paths) {
        const distance = await calculatePathDistance(path);
        allPathDist.push({ path, "distance": distance / 1000 + 'km', "view": generateURL(path) })
        if (distance < shortestDistance) {
            shortestDistance = distance;
            shortestPath = path;
        }
    }
    const shortestPathView = generateURL(shortestPath);

    return {
        shortestPath,
        'shortestDistance': shortestDistance / 1000 + 'km',
        shortestPathView,
        allPathDist
    };
}

const calculatePathDistance = async (path) => {
    let totalDistance = 0;

    for (let i = 0; i < path.length - 1; i++) {
        totalDistance += await calculateDistance(airportLookup[path[i]], airportLookup[path[i + 1]]);
    }

    return totalDistance;
}

const generateURL = (path) => {
    return `https://www.greatcirclemap.com/?routes=${path.join("-")}`
}


export { airportLookup, calculateDistance, getShortestRoute };