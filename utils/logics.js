import { getDistance, getCenter, findNearest, orderByDistance } from 'geolib';
import aiportData from '../data/airports.json' assert { type: 'json' };

const distanceCache = {};

/* this is to reduce multile number of filter functions */
const airportLookup = aiportData.reduce((map, airport) => {
    map[airport.code] = { 'latitude': airport.lat, 'longitude': airport.lon }
    return map;
}, {});
const airportsCordsArr = Object.values(airportLookup);


const reverseAirportLookupByCoords = Object.keys(airportLookup).reduce((map, code) => {
    const { latitude, longitude } = airportLookup[code];
    const key = `${latitude},${longitude}`;
    map[key] = code;
    return map;
}, {});



const calculateDistance = (source, destination) => {
    const cacheKey = `${source.latitude},${source.longitude}-${destination.latitude},${destination.longitude}`;
    if (distanceCache[cacheKey]) {
        return distanceCache[cacheKey];
    }
    const distance = getDistance(source, destination);
    distanceCache[cacheKey] = distance;
    return distance;
}

const getStraightLinePoints = (source, destination) => {
    const middleCords = getCenter([source, destination]);
    const centerSourceToMidCords = getCenter([source, middleCords]);
    const centerMidToDestinationCords = getCenter([middleCords, destination]);
    return [source, centerSourceToMidCords, middleCords, centerMidToDestinationCords, destination]
}

const getShortestRoute = async (sourceCode, destinationCode, bonus = false) => {
    const sourceCoord = airportLookup[sourceCode];
    const destinationCoord = airportLookup[destinationCode];

    const straightLineMultiplePoints = getStraightLinePoints(sourceCoord, destinationCoord);
    let nearestAirports = getNearestAirports(straightLineMultiplePoints);

    /* bonus part */
    let hoppingInfo = {}
    if (bonus) {
        const { modifiedAirportList, hoppingLegs } = checkAirportsWithin100kms(nearestAirports);
        nearestAirports = modifiedAirportList
        hoppingInfo = hoppingLegs

    }
    /* bonus part */

    const airportCombinations = generateAirportCombinations(nearestAirports);
    const shortDistData = await findShortestPath(airportCombinations);
    return bonus ? { ...shortDistData, hoppingInfo } : shortDistData;
}

const getNearestAirports = multiPoints => {
    const nearestAirportsCodes = [];

    multiPoints.forEach(lineCords => {
        const nearestAirport = findNearest(lineCords, airportsCordsArr);
        const airportCode = reverseAirportLookupByCoords[`${nearestAirport.latitude},${nearestAirport.longitude}`];
        if (airportCode && !nearestAirportsCodes.includes(airportCode)) {
            nearestAirportsCodes.push(airportCode);
        }
    });

    return nearestAirportsCodes;
}



const generateAirportCombinations = (airportArr) => {
    if (airportArr.length === 2) return [airportArr];
    const start = airportArr[0];
    const end = airportArr[airportArr.length - 1];
    const middle = airportArr.slice(1, airportArr.length - 1);
    const results = [];

    const combine = (current, remaining) => {
        if (current.length > 0) {
            results.push([start, ...current, end]);
        }
        for (let i = 0; i < remaining.length; i++) {
            combine(current.concat(remaining[i]), remaining.slice(i + 1));
        }
    };

    combine([], middle);

    return results;
};

const findShortestPath = paths => {
    let shortestPath;
    let shortestDistance = Infinity;
    const allPathDist = [];

    for (const path of paths) {
        const distance = calculatePathDistance(path);
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

const calculatePathDistance = path => {
    let totalDistance = 0;

    for (let i = 0; i < path.length - 1; i++) {
        totalDistance += calculateDistance(airportLookup[path[i]], airportLookup[path[i + 1]]);
    }

    return totalDistance;
}

const checkAirportsWithin100kms = airportList => {
    const modifiedAirportList = [...airportList]
    const hoppingLegs = [];
    for (let ap = 1; ap < airportList.length - 1; ap++) {
        let currAirportCode = airportList[ap];
        let currAirportCoord = airportLookup[currAirportCode]
        const nearAirportList = orderByDistance(currAirportCoord, airportsCordsArr);
        let nearAirport = nearAirportList[1];
        let nearAirportDistance = calculateDistance(currAirportCoord, nearAirport)
        if (nearAirportDistance < 100000) {
            const airportCode = reverseAirportLookupByCoords[`${nearAirport.latitude},${nearAirport.longitude}`];
            modifiedAirportList.splice(ap + 1, 0, airportCode);
            console.log('Found Airport for ground hop - ' + airportCode)
            hoppingLegs.push({ from: currAirportCode, to: airportCode, distance: nearAirportDistance / 1000 + 'km' });
            console.log(hoppingLegs)
        }
    }
    return { modifiedAirportList, hoppingLegs };
}

const generateURL = path => `https://www.greatcirclemap.com/?routes=${path.join("-")}`;



export { getShortestRoute };