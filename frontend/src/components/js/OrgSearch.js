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

  const marker = new google.maps.Marker({ map: map });

  marker.addListener("click", () => {
    infowindow.open(map, marker);
  });

  map.addListener("click", (place) => {
    console.log(place);
    if (place.placeId) {
      map.setCenter(place.latLng);
      map.setZoom(13);
      marker.setPlace({
        placeId: place.placeId,
        location: place.latLng,
      });
      setPlaceID(place.placeId);
    }

    marker.setVisible(true);
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

    // Set the position of the marker using the place ID and location.
    // @ts-ignore This should be in @typings/googlemaps.
    marker.setPlace({
      placeId: place.place_id,
      location: place.geometry.location,
    });

    setPlaceID(place.place_id);

    marker.setVisible(true);

    infowindowContent.children.namedItem("place-name").textContent = place.name;
    infowindowContent.children.namedItem("place-address").textContent =
      place.formatted_address;
    infowindow.open(map, marker);
  });

  return map;
}
