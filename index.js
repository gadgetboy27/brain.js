document.addEventListener('DOMContentLoaded', () => {
    const gpsLocations = [
        {latitude: 44.498529, longitude: 11.356657},
        {latitude: 44.498500, longitude: 11.356600},
        // Add more GPS locations as needed
    ];

    const scene = document.querySelector('a-scene');
    const entitiesContainer = document.getElementById('dynamic-entities');

    gpsLocations.forEach(location => {
        const arrow = document.createElement('a-entity');
        arrow.setAttribute('gps-entity-place', `latitude: ${location.latitude}; longitude: ${location.longitude};`);
        arrow.setAttribute('gltf-model', '#arrow-model');
        arrow.setAttribute('scale', '1 1 1');
        entitiesContainer.appendChild(arrow);
    });
});
