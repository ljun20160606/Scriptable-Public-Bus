// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: orange; icon-glyph: magic;

// Hangzhou
const cityId = 330100

async function findNearbyStop(latitute, longitude) {
    return await new Request(`https://app.ibuscloud.com/v1/bus/findNearbyStop?city=${cityId}&h5Platform=6&lat=${latitute}&lng=${longitude}&radius=1000`).loadJSON()
}

async function findRouteByName(routeName) {
    return await new Request(`https://app.ibuscloud.com/v1/bus/findRouteByName?city=${cityId}&h5Platform=6&routeName=${encodeURIComponent(routeName)}`).loadJSON()
}

async function findStopByName(stopName) {
    return await new Request(`https://app.ibuscloud.com/v1/bus/findStopByName?city=${cityId}&h5Platform=6&stopName=${encodeURIComponent(stopName)}`).loadJSON()
}

async function getBusPositionByRouteId(latitute, longitude, routeId) {
    return await new Request(`https://app.ibuscloud.com/v1/bus/getBusPositionByRouteId?city=${cityId}&h5Platform=6&userLng=${longitude}&userLat=${latitute}&routeId=${routeId}`).loadJSON()
}

async function getNextBusByRouteStopId(latitute, longitude, stopId, routeId) {
    return await new Request(`https://app.ibuscloud.com/v1/bus/getNextBusByRouteStopId?city=${cityId}&h5Platform=6&routeId=${routeId}&stopId=${stopId}&userLat=${latitute}&userLng=${longitude}`).loadJSON()
}

module.exports = {
    findNearbyStop,
    findRouteByName,
    findStopByName,
    getBusPositionByRouteId,
    getNextBusByRouteStopId
}