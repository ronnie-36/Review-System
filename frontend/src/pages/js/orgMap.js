export default function initMap(google, lat, lang) {
  const map = new google.maps.Map(document.getElementById("static-map"), {
    center: { lat: Number(lat), lng: Number(lang) },
    zoom: 11,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false,
  });

  new google.maps.Marker({
    position: { lat: Number(lat), lng: Number(lang) },
    map: map,
  });
}
