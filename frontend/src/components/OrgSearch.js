import React, { useEffect, useState } from "react";
import "./css/OrgSearch.css";
import initMap from "./js/OrgSearch";
import { Loader } from "@googlemaps/js-api-loader";
import { Button } from "reactstrap";
import { fetchOrganization } from "../apiHelpers/org";
import { Navigate } from "react-router-dom";
// import "dotenv/config";

function OrgSearch({ org, setOrg }) {
  const [placeID, setPlaceID] = useState(null);
  const [map, setMap] = useState(null);

  const loader = new Loader({
    apiKey: process.env.REACT_APP_GOOGLE_MAP_API_KEY,
    version: "weekly",
    libraries: ["places"],
  });

  useEffect(() => {
    if (map && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setMap((map) => {
          map.setCenter({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
          map.setZoom(13);
          return map;
        });
      });
    }

    if (!map) {
      (async () => {
        const tempMap = await loader
          .load()
          .then((google) => {
            // new google.maps.Map(document.getElementById("map"), mapOptions);
            return initMap(google, setPlaceID);
          })
          .catch((err) => {
            console.log(err);
          });

        if (tempMap) {
          setMap(tempMap);
        }
      })();
    }
  }, [loader, map]);

  const getOrganization = async () => {
    if (placeID) {
      const response = await fetchOrganization(placeID);
      if (response.status == "success") {
        setOrg(response.placeDetails);
      } else {
        //Error Handling
      }
    } else {
      console.log("Select a organization");
    }
  };

  if (org) {
    return <Navigate to="/orgview" />;
  }

  return (
    <div className="mapContainer">
      <div style={{ display: "none" }}>
        <input
          id="pac-input"
          className="controls"
          type="text"
          placeholder="Enter an Organization"
        />
        <Button
          onClick={getOrganization}
          id="submitPlace"
          className="text-wrap"
          color="primary"
        >
          View the organization
        </Button>
      </div>
      <div id="map"></div>
      <div id="infowindow-content">
        <span id="place-name" className="title"></span>
        <br />
        <span id="place-address"></span>
      </div>
    </div>
  );
}

export default OrgSearch;
