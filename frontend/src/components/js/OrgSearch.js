const fields = [
  "accounting",
  "airport",
  "lawyer",
  "library",
  "light_rail_station",
  "university",
  "hospital",
  "subway_station",
  "fire_station",
  "embassy",
  "secondary_school",
  "school",
  "courthouse",
  "primary_school",
  "post_office",
  "city_hall",
  "police",
  "pharmacy",
  "park",
  "museum",
  "bus_station",
  "bank",
  "atm",
  "local_government_office",
];

export default function initMap(google, setPlaceID) {
  const map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 22.520657021229354, lng: 75.92093767747048 },
    zoom: 13,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false,
  });

  const input = document.getElementById("pac-input");
  const button = document.getElementById("submitPlace");

  // Specify just the place data fields that you need.
  const autocomplete = new google.maps.places.Autocomplete(input, {
    fields: ["place_id", "geometry", "formatted_address", "name"],
  });

  autocomplete.bindTo("bounds", map);

  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
  map.controls[google.maps.ControlPosition.LEFT_TOP].push(button);

  const infowindow = new google.maps.InfoWindow();
  const infowindowContent = document.getElementById("infowindow-content");

  infowindow.setContent(infowindowContent);

  let markers = [];

  function callback(results, status) {
    markers.forEach((marker) => marker.setMap(null));
    markers = [];
    // console.log(results);
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      results.forEach((result) => {
        const image = {
          url: result.icon,
          size: new google.maps.Size(71, 71),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(17, 34),
          scaledSize: new google.maps.Size(25, 25),
        };
        //console.log(result);
        let marker = new google.maps.Marker({
          icon: image,
          position: result.geometry.location,
          map,
        });
        markers.push(marker);
        marker.setVisible(true);

        marker.addListener("click", () => {
          //console.log(e);
          infowindowContent.children.namedItem("place-name").textContent =
            result.name;
          if (result.plus_code) {
            infowindowContent.children.namedItem("place-address").textContent =
              result.plus_code.compound_code;
          }
          infowindow.open(map, marker);
          setPlaceID(result.place_id);
        });
      });
    }
  }

  let i = 0;

  map.addListener("center_changed", () => {
    if (i > 0) {
      return;
    }
    if (markers.some((marker) => marker.position === map.getCenter())) {
      return;
    }
    i++;
    let request = {
      location: map.getCenter(),
      radius: "200",
    };
    const service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, callback);
  });

  if (markers.some((marker) => marker.position === map.getCenter())) {
    return;
  }

  let request = {
    location: map.getCenter(),
    radius: "200",
  };

  const service = new google.maps.places.PlacesService(map);
  service.nearbySearch(request, callback);

  map.addListener("click", (place) => {
    if (markers.some((marker) => marker.position === place.latLng)) {
      return;
    }

    let request = {
      location: place.latLng,
      radius: "200",
    };

    const service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, callback);
  });

  autocomplete.addListener("place_changed", () => {
    infowindow.close();

    const place = autocomplete.getPlace();

    if (!place.geometry || !place.geometry.location) {
      return;
    }

    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport);
    } else {
      map.setCenter(place.geometry.location);
      map.setZoom(14);
    }

    let request = {
      location: place.geometry.location,
      radius: "200",
      fields: fields,
    };

    const service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, callback);
  });

  return map;
}
