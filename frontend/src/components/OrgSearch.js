import React, { useEffect, useState, useMemo } from "react";
import "./css/OrgSearch.css";
import initMap from "./js/OrgSearch";
import { Loader } from "@googlemaps/js-api-loader";
import { fetchOrganization } from "../apiHelpers/org";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Spinner } from "reactstrap";

function OrgSearch({ org, setOrg }) {
  const [placeID, setPlaceID] = useState(null);
  const [map, setMap] = useState(null);
  const [orgLoading, setOrgLoading] = useState(false);
  const [marker, setMarker] = useState(null);

  const loader = useMemo(
    () =>
      new Loader({
        apiKey: process.env.REACT_APP_GOOGLE_MAP_API_KEY,
        version: "weekly",
        libraries: ["places"],
      }),
    []
  );

  const navigate = useNavigate();

  useEffect(() => {
    if (map && marker && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setMap((map) => {
          map.setCenter({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });

          map.setZoom(13);
          return map;
        });
        setMarker((marker) => {
          marker.setPosition(
            {
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
            },
            map
          );
        });
      });
    }

    if (!map) {
      (async () => {
        let tempMap = await loader
          .load()
          .then((google) => {
            return initMap(google, setPlaceID);
          })
          .catch((err) => {
            toast.warn("Unable to load map");
          });
        if (tempMap.map) {
          setMap(tempMap.map);
        }
        if (tempMap.mainMarker) {
          setMarker(tempMap.mainMarker);
        }
      })();
    }
  }, [loader, map, marker]);

  const getOrganization = async () => {
    setOrgLoading(true);
    if (placeID) {
      const response = await fetchOrganization(placeID);
      if (response.status === "success") {
        setOrg(response.placeDetails);
        localStorage.setItem("org", JSON.stringify(response.placeDetails));
        navigate("/orgview");
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
    setOrgLoading(false);
  };

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
      {map === null && (
        <div>
          <Spinner>Loading...</Spinner>
        </div>
      )}
      <div id="map"></div>
      <div id="infowindow-content">
        <span id="place-name" className="title"></span>
        <br />
        <p id="place-address"></p>
        <button
          className="btn btn-link vieworgbtn"
          disabled={orgLoading}
          onClick={getOrganization}
        >
          {orgLoading ? <Spinner>Loading...</Spinner> : "View Organization"}
        </button>
      </div>
    </div>
  );
}

export default OrgSearch;
