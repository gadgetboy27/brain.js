window.onload = () => {
    navigator.geolocation.getCurrentPosition(function (position) {
        dynamicLoadPlaces(position.coords)
            .then((places) => {
                renderPlaces(places);
            });
    },
        (err) => console.error('Error in retrieving position', err),
        {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 27000,
        }
    );

    navigator.geolocation.watchPosition(position => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;

        document.querySelectorAll('a-entity[gps-entity-place]').forEach(entity => {
            const place = entity.getAttribute('gps-entity-place');
            const placeLat = parseFloat(place.latitude);
            const placeLng = parseFloat(place.longitude);

            const bearing = calculateBearing(userLat, userLng, placeLat, placeLng);
            entity.setAttribute('rotation', `0 ${bearing} 0`);
        });
    }, error => console.error('Error watching position', error), {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 27000,
    });
};

async function dynamicLoadPlaces(coords) {
    const params = {
        radius: 300, // search places not farther than this value (in meters)
        clientId: 'YOUR_FOURSQUARE_CLIENT_ID',
        clientSecret: 'YOUR_FOURSQUARE_CLIENT_SECRET',
        version: '20230623',
    };

    const corsProxy = 'https://cors-anywhere.herokuapp.com/';
    const endpoint = `${corsProxy}https://api.foursquare.com/v2/venues/search?intent=checkin
        &ll=${coords.latitude},${coords.longitude}
        &radius=${params.radius}
        &client_id=${params.clientId}
        &client_secret=${params.clientSecret}
        &limit=15
        &v=${params.version}`;

    return fetch(endpoint)
        .then((res) => res.json())
        .then((resp) => resp.response.venues)
        .catch((err) => {
            console.error('Error with places API', err);
            throw err;
        });
}

function renderPlaces(places) {
    let scene = document.querySelector('a-scene');

    places.forEach((place) => {
        const latitude = place.location.lat;
        const longitude = place.location.lng;

        const icon = document.createElement('a-image');
        icon.setAttribute('gps-entity-place', `latitude: ${latitude}; longitude: ${longitude}`);
        icon.setAttribute('name', place.name);
        icon.setAttribute('src', 'assets/models/arrow-model.glb'); // Update with correct path
        icon.setAttribute('scale', '20 20 20');

        icon.addEventListener('loaded', () => window.dispatchEvent(new CustomEvent('gps-entity-place-loaded')));

        const clickListener = function (ev) {
            ev.stopPropagation();
            ev.preventDefault();

            const name = ev.target.getAttribute('name');
            const el = ev.detail.intersection && ev.detail.intersection.object.el;

            if (el && el === ev.target) {
                const label = document.createElement('span');
                const container = document.createElement('div');
                container.setAttribute('id', 'place-label');
                label.innerText = name;
                container.appendChild(label);
                document.body.appendChild(container);

                setTimeout(() => {
                    container.parentElement.removeChild(container);
                }, 1500);
            }
        };

        icon.addEventListener('click', clickListener);
        scene.appendChild(icon);
    });
}

function calculateBearing(lat1, lon1, lat2, lon2) {
    const toRadians = degrees => degrees * Math.PI / 180;
    const toDegrees = radians => radians * 180 / Math.PI;

    const φ1 = toRadians(lat1);
    const φ2 = toRadians(lat2);
    const Δλ = toRadians(lon2 - lon1);

    const y = Math.sin(Δλ) * Math.cos(φ2);
    const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
    const θ = Math.atan2(y, x);
    return (toDegrees(θ) + 360) % 360;
}
