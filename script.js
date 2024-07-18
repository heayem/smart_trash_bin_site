const firebaseConfig = {
    apiKey: "AIzaSyAKrvPTDE_YSFrbOLlwaIi-iM9ge-Pchz0",
    authDomain: "training-smart-trash-bin.firebaseapp.com",
    databaseURL: "https://training-smart-trash-bin-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "training-smart-trash-bin",
    storageBucket: "training-smart-trash-bin.appspot.com",
    messagingSenderId: "296309931657",
    appId: "1:296309931657:web:0c7f0c04ed7e66ab44d058",
    measurementId: "G-MPY8Y3K9DJ"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const storage = firebase.storage();

let map;
let directionsRenderer;
let directionsService;
let userMarker = null;
let markers = [];
let bins = [];
let stationMarker = [];
let stations = [];

const lightMode = [ 
    {
        "featureType": "all",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "weight": "2.00"
            }
        ]
    },
    {
        "featureType": "all",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#9c9c9c"
            }
        ]
    },
    {
        "featureType": "all",
        "elementType": "labels.text",
        "stylers": [
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "all",
        "stylers": [
            {
                "color": "#f2f2f2"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "all",
        "stylers": [
            {
                "saturation": -100
            },
            {
                "lightness": 0
            }
        ]
    },
    
    
    {
        "featureType": "road.highway",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "all",
        "stylers": [
            {
                "color": "#46bcec"
            },
            {
                "visibility": "on"
            }
        ]
    }
]

const darkMode = [
    {
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#212121"
            }
        ]
    },
    {
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#757575"
            }
        ]
    },
    {
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "color": "#212121"
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#757575"
            }
        ]
    },
    {
        "featureType": "administrative.country",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#9e9e9e"
            }
        ]
    },
    {
        "featureType": "administrative.land_parcel",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "administrative.locality",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#bdbdbd"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#757575"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#181818"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#616161"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "color": "#1b1b1b"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#2c2c2c"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#8a8a8a"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#373737"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#3c3c3c"
            }
        ]
    },
    {
        "featureType": "road.highway.controlled_access",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#4e4e4e"
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#616161"
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#757575"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#000000"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#3d3d3d"
            }
        ]
    }
];

async function initMap() {
    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();

    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 11.5680, lng: 104.8900 },
        zoom: 12,
        disableDefaultUI: true,
        styles: darkMode,
        gestureHandling: 'greedy',
        keyboardShortcuts: false,
    });
    directionsRenderer.setMap(map);
    getData();
}

function toggleMapMode(isDarkMode) {
    const styles = isDarkMode ? darkMode : lightMode;
    map.setOptions({ styles });

    const modeToggleImage = document.getElementById('mode-toggle-img');
    modeToggleImage.src = isDarkMode ? 'images/dark-mode.png' : 'images/light-mode.png';

    const modeTogglebin = document.getElementById('bins-toggle-img');
    modeTogglebin.src = isDarkMode ? 'images/bin-page-dark.png' : 'images/bin-page-light.png';
}

function updateBins(data) {
    markers.forEach(marker => marker.setMap(null));
    markers = [];
    bins = [];

    Object.keys(data).forEach(binId => {
        const binData = data[binId];
        bins.push({
            id: binId,
            lat: binData.lat,
            lng: binData.lng,
            level: binData.fill,
            status: binData.status
        });
        const marker = new google.maps.Marker({
            position: { lat: binData.lat, lng: binData.lng },
            map: map,
            title: binId
        });
        markers.push(marker);
    });
}

function updateStations(data) {
    stationMarker.forEach(marker => marker.setMap(null));
    stationMarker = [];
    stations = [];

    const stationSelect = document.getElementById('station-option');
    stationSelect.innerHTML = '';

    Object.keys(data).forEach(stationId => {
        const stationData = data[stationId];
        stations.push({
            id: stationId,
            lat: stationData.lat,
            lng: stationData.lng
        });
        const marker = new google.maps.Marker({
            position: { lat: stationData.lat, lng: stationData.lng },
            map: map,
            title: stationId
        });
        const option = document.createElement('option');
        option.value = stationId;
        option.textContent = stationId;
        stationSelect.appendChild(option);
        stationMarker.push(marker);
    });
}

function getData() {
    const binsRef = firebase.database().ref('/trash-bin-database/');
    binsRef.on('value', (snapshot) => {
        const data = snapshot.val();
        if (data) {
            updateBins(data);
        } else {
            console.log("No data available at this path.");
        }
    });

    const stationsRef = firebase.database().ref('/station-database/');
    stationsRef.on('value', (snapshot) => {
        const data = snapshot.val();
        if (data) {
            updateStations(data);
        } else {
            console.log("No stations data available at this path.");
        }
    });
}

function getRoute() {
    const routeOption = document.getElementById('route-option').value;
    const stationId = document.getElementById('station-option').value;
    const station = stations.find(s => s.id === stationId);

    if (!station) {
        console.log('Invalid station selected.');
        return;
    }

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const userLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            updateUserLocation(userLocation);

            if (routeOption === 'shortest') {
                calculateShortestRoute(userLocation, station);
            } else if (routeOption === 'fill') {
                calculateRouteBasedOnFill(userLocation, station);
            } else if (routeOption === 'openai') {
                getAISuggestion(userLocation, bins, stations, '');
            }
        }, error => {
            console.log('Error getting location: ' + error);
        });
    } else {
        console.log('Geolocation is not supported by this browser.');
    }
}

function updateUserLocation(userLocation) {
    if (userMarker) {
        userMarker.setPosition(userLocation);
    } else {
        userMarker = new google.maps.Marker({
            position: userLocation,
            map: map,
            title: 'Your Location',
            icon: {
                url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
            }
        });
    }
    map.setCenter(userLocation);
}

function calculateShortestRoute(userLocation, station) {
    console.log("Calculating shortest route...");
    document.getElementById('route-summary').textContent = '';

    const waypoints = bins.map(bin => ({
        location: new google.maps.LatLng(bin.lat, bin.lng),
        stopover: true
    }));

    const request = {
        origin: new google.maps.LatLng(userLocation.lat, userLocation.lng),
        destination: new google.maps.LatLng(station.lat, station.lng),
        waypoints: waypoints,
        travelMode: 'DRIVING',
        optimizeWaypoints: true,
        unitSystem: google.maps.UnitSystem.METRIC
    };

    directionsService.route(request, (result, status) => {
        if (status === 'OK') {
            directionsRenderer.setOptions({ suppressMarkers: true });
            directionsRenderer.setDirections(result);

            const route = result.routes[0];
            let routeSummary = 'Route Summary: Start - \n';
            let totalDistance = 0;

            route.legs.forEach(leg => {
                totalDistance += leg.distance.value; // distance in meters
            });

            route.waypoint_order.forEach(index => {
                routeSummary += `${bins[index].id} - \n`;
            });

            routeSummary += `End at ${station.id}`;
            totalDistance /= 1000; // Convert to kilometers

            document.getElementById('route-summary').textContent = routeSummary;
            document.getElementById('total-distance').textContent = `Total Distance: ${totalDistance.toFixed(2)} km`;
        } else {
            console.log('Error getting directions: ' + status);
        }
    });
}

function calculateRouteBasedOnFill(userLocation, station) {
    console.log("Calculating route based on fill and status...");
    document.getElementById('route-summary').textContent = '';

    const relevantBins = bins.filter(bin => bin.level >= 75);

    const waypoints = relevantBins.map(bin => ({
        location: new google.maps.LatLng(bin.lat, bin.lng),
        stopover: true
    }));

    const request = {
        origin: new google.maps.LatLng(userLocation.lat, userLocation.lng),
        destination: new google.maps.LatLng(station.lat, station.lng),
        waypoints: waypoints,
        travelMode: 'DRIVING',
        optimizeWaypoints: true,
        unitSystem: google.maps.UnitSystem.METRIC
    };

    directionsService.route(request, (result, status) => {
        if (status === 'OK') {
            directionsRenderer.setOptions({ suppressMarkers: true });
            directionsRenderer.setDirections(result);

            const route = result.routes[0];
            let routeFillSummary = 'Route Based on Level: Start - \n';
            let totalDistance = 0;

            route.legs.forEach(leg => {
                totalDistance += leg.distance.value; // distance in meters
            });

            route.waypoint_order.forEach(index => {
                routeFillSummary += `${relevantBins[index].id} - \n`;
            });

            routeFillSummary += `End at ${station.id}`;
            totalDistance /= 1000; // Convert to kilometers

            document.getElementById('route-summary').textContent = routeFillSummary;
            document.getElementById('total-distance').textContent = `Total Distance: ${totalDistance.toFixed(2)} km`;
        } else {
            console.log('Error getting directions: ' + status);
        }
    });
}
function cancelRoute() {
    directionsRenderer.set('directions', null);
    document.getElementById('route-summary').textContent = '';
    document.getElementById('route-summary').textContent = '';
    document.getElementById('total-distance').textContent = '';
    console.log("Route canceled.");
}
/*
async function getAISuggestion(userLocation, bins, stations, message) {
    const data = {
        userLocation,
        bins,
        stations,
        message
    };

    console.log(data);

    try {
        const response = await fetch('http://localhost:3000/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`${errorText}`);
        }

        const result = await response.json();
        document.getElementById('route-summary').textContent = result.reply;
        console.log(result.reply);
    } catch (error) {
        console.error('Error fetching AI suggestion:', error);
        document.getElementById('route-summary').textContent = `${error.message}`;
    }
}
*/

async function getAISuggestion(userLocation, bins, stations, message) {
    const data = {
        userLocation,
        bins,
        stations,
        message
    };

    console.log(data);

    try {
        const response = await fetch('https://smart-trash-bin-service.vercel.app/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`${errorText}`);
        }

        const result = await response.json();
        document.getElementById('route-summary').textContent = result.reply;
        console.log(result.reply);

        parseAndDisplayAISuggestedRoute(result.reply, userLocation, bins, stations);
    } catch (error) {
        console.error('Error fetching AI suggestion:', error);
        document.getElementById('route-summary').textContent = `${error.message}`;
    }
}

function parseAndDisplayAISuggestedRoute(reply, userLocation, bins, stations) {
    try {
        const routeDetails = reply.match(/Start - (.*) - End at (.*), Total Distance: (.*) km/);
        if (!routeDetails) throw new Error('Invalid AI response format');

        const binsOrder = routeDetails[1].split(' - ');
        const endStationId = routeDetails[2];

        const waypoints = binsOrder.map(binId => {
            const bin = bins.find(b => b.id === binId.trim());
            if (!bin) throw new Error(`Bin ${binId} not found`);
            return {
                location: new google.maps.LatLng(bin.lat, bin.lng),
                stopover: true
            };
        });

        const station = stations.find(s => s.id === endStationId.trim());
        if (!station) throw new Error(`Station ${endStationId} not found`);

        const request = {
            origin: new google.maps.LatLng(userLocation.lat, userLocation.lng),
            destination: new google.maps.LatLng(station.lat, station.lng),
            waypoints: waypoints,
            travelMode: 'DRIVING',
            optimizeWaypoints: false,
            unitSystem: google.maps.UnitSystem.METRIC
        };

        directionsService.route(request, (result, status) => {
            if (status === 'OK') {
                directionsRenderer.setOptions({ suppressMarkers: true });
                directionsRenderer.setDirections(result);
            } else {
                console.log('Error getting directions: ' + status);
            }
        });
    } catch (error) {
        console.error('Error parsing AI suggestion:', error);
        document.getElementById('route-summary').textContent = `${error.message}`;
    }
}


document.getElementById('mode-tog').addEventListener('click', () => {
    const isDarkMode = document.body.classList.toggle('dark-mode');
    toggleMapMode(isDarkMode);
});

document.getElementById('route-tog').addEventListener('click', () => {
    const routeModeActive = document.body.classList.toggle('route-mode');
    if (routeModeActive) {
        getRoute();
        document.getElementById('route-tog').textContent = 'Cancel';
    } else {
        cancelRoute();
        document.getElementById('route-tog').textContent = 'Search Route';
    }
});
