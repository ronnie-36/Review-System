import React, { useEffect, useState, useMemo } from "react";
import "./css/OrgSearch.css";
import initMap from "./js/OrgSearch";
import { Loader } from "@googlemaps/js-api-loader";
import { fetchOrganization } from "../apiHelpers/org";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";

function OrgSearch({ org, setOrg }) {
  const [placeID, setPlaceID] = useState(null);
  const [map, setMap] = useState(null);

  const loader = useMemo(
    () =>
      new Loader({
        apiKey: process.env.REACT_APP_GOOGLE_MAP_API_KEY,
        version: "weekly",
        libraries: ["places"],
      }),
    []
  );

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
            return initMap(google, setPlaceID);
          })
          .catch((err) => {
            toast.warn("Unable to load map");
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
      if (response.status === "success") {
        setOrg(response.placeDetails);
      } else if (response.status === "unauthorized") {
        toast.warn(
          "Organization does not exist in our database Login to add Organization"
        );
      } else {
        toast.error("Unable to fetch organization details");
      }
    } else {
      toast.error("Please select an organization");
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
      </div>
      <div id="map"></div>
      <div id="infowindow-content">
        <span id="place-name" className="title"></span>
        <br />
        <span id="place-address"></span>
        <button className="btn btn-link" onClick={getOrganization}>
          View Organization
        </button>
      </div>
    </div>
  );
}

export default OrgSearch;
