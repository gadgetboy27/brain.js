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
    });
};

function dynamicLoadPlaces(coords) {
    return new Promise((resolve, reject) => {
        // Example data, replace with your dynamic fetching logic
        const places = [
            {latitude: -36.912300, longitude: 174.739000},
            // {latitude: 44.498500, longitude: 11.356600},
            // Add more GPS locations as needed
        ];
        resolve(places);
    });
}

function renderPlaces(places) {
    const scene = document.querySelector('a-scene');
    const entitiesContainer = document.getElementById('dynamic-entities');

    places.forEach(location => {
        const arrow = document.createElement('a-entity');
        arrow.setAttribute('gps-entity-place', `latitude: ${location.latitude}; longitude: ${location.longitude};`);
        arrow.setAttribute('src', '#arrow-model');
        arrow.setAttribute('scale', '1 1 1');
        entitiesContainer.appendChild(arrow);
    });
}
