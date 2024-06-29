// Function to fetch places from Google Places API
async function loadPlaces(position) {
    const apiKey = 'AIzaSyCmwbfesNui8tssantgK50i7pBHWriYHaI'; // Replace with your Google Places API key
    const radius = 1500; // Search places within this radius (in meters)
    const type = 'restaurant'; // Type of places to search for
    const keyword = 'cruise'; // Keyword for the search

    const endpoint = `https://maps.googleapis.com/maps/api/place/nearbysearch/json
        ?location=${position.latitude},${position.longitude}
        &radius=${radius}
        &type=${type}
        &keyword=${keyword}
        &key=${apiKey}`;

    try {
        const res = await fetch(endpoint);
        const data = await res.json();
        return data.results;
    } catch (err) {
        console.error('Error with places API', err);
    }
}

window.onload = () => {
    const scene = document.querySelector('a-scene');

    // Get current user location
    navigator.geolocation.getCurrentPosition(
        async function (position) {
            // Use the current position to load nearby places
            const places = await loadPlaces(position.coords);
            places.forEach((place) => {
                const latitude = place.geometry.location.lat;
                const longitude = place.geometry.location.lng;

                // Add place name
                const placeText = document.createElement('a-link');
                placeText.setAttribute('gps-entity-place', `latitude: ${latitude}; longitude: ${longitude};`);
                placeText.setAttribute('title', place.name);
                placeText.setAttribute('scale', '15 15 15');

                placeText.addEventListener('loaded', () => {
                    window.dispatchEvent(new CustomEvent('gps-entity-place-loaded'));
                });

                scene.appendChild(placeText);
            });
        },
        (err) => console.error('Error in retrieving position', err),
        {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 27000,
        }
    );
};
