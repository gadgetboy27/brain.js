window.onload = () => {
    let method = 'dynamic';

    // if you want to statically add places, de-comment following line
    method = 'static';

    if (method === 'static') {
        let places = staticLoadPlaces();
        renderPlaces(places);
    }

    if (method !== 'static') {

        // first get current user location
        return navigator.geolocation.getCurrentPosition(function (position) {

            // than use it to load from remote APIs some places nearby
            dynamicLoadPlaces(position.coords)
                .then((places) => {
                    renderPlaces(places);
                })
        },
            (err) => console.error('Error in retrieving position', err),
            {
                enableHighAccuracy: true,
                maximumAge: 0,
                timeout: 27000,
            }
        );
    }
};

function staticLoadPlaces() {
    return [
        {
            name: "Your place name",
            location: {
                lat: -36.912300, // add here latitude if using static data
                lng: 174.739000, // add here longitude if using static data
            }
        },
        {
            name: 'Another place name',
            location: {
                lat: 0,
                lng: 0,
            }
        }
    ];
}

// getting places from REST APIs
function dynamicLoadPlaces(position) {
    let params = {
        radius: 300,    // search places not farther than this value (in meters)
        clientId: 'UK32CEVITYO5AMHU3ZRAASDZ25QCODXPSJ2P0LW3ANSJ55E5',   // add your credentials here
        clientSecret: 'TZY0JD4AY2QZFNK124NEW2DGMRFVH34EHJ1CF1A42FTFIGHG',   // add your credentials here
        version: '20300101',    // foursquare versioning, required but unuseful for this demo
    };

    const url = 'https://api.foursquare.com/v2/venues/search?oauth_token=YCZDQUTGLMWRTP5Y2MAAKUVBVOMFOU3XYMEB2QKSKYDI333N';
        const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'fsq3G3x+p/7LzoDS8jxsrhOegdXrYM8uBuDL1bBauE75NfU='
        }
        };

        fetch(url, params, options)
        .then(res => res.json())
        .then(json => console.log(json))
        .catch(err => console.error('error:' + err));
};

function renderPlaces(places) {
    let scene = document.querySelector('a-scene');

    places.forEach((place) => {
        const latitude = place.location.lat;
        const longitude = place.location.lng;

        // add place icon
        const icon = document.createElement('a-image');
        icon.setAttribute('gps-entity-place', `latitude: ${latitude}; longitude: ${longitude}`);
        icon.setAttribute('name', place.name);
        icon.setAttribute('src', '../assets/map-marker.png');

        // for debug purposes, just show in a bigger scale, otherwise I have to personally go on places...
        icon.setAttribute('scale', '20, 20');

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