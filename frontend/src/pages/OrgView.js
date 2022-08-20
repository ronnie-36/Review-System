import React from "react";
import StarRatings from "react-star-ratings";
import { GoLocation, GoGlobe, GoMail } from "react-icons/go";
import { BsTelephoneFill } from "react-icons/bs";

import "./css/OrgView.css";
import Review from "../components/Review";

const org = {
  image: "/logo192.png",
  avgRating: 4.25,
  address: "IIT indore",
  phone: "+919010202398",
  website: "https://www.google.com",
  email: "sample@gmail.com",
  reviews: [],
};

function OrgView() {
  return (
    <div className="min-vh-100">
      <div className="d-flex OrgView p-3">
        <div
          style={{ height: "10rem" }}
          className="ms-5 w-100 d-flex container-fluid org-dets align-items-center"
        >
          <img src={org.image} alt="Organization Logo" className="h-100" />
          <div className="ms-5">
            <div className="fs-1 fw-bold">Organization Name</div>
            <div className="d-flex align-items-center">
              <StarRatings
                rating={org.avgRating}
                numberOfStars={5}
                starRatedColor="rgb(253,204,13)"
                starDimension="2rem"
              />
              <div className="d-flex ms-2 mt-3 align-items-end">
                <p className="fs-3 fst-italic ">{org.avgRating}</p>
                <p className="fs-4 fst-italic">/5</p>
              </div>
            </div>
          </div>
          <div className="d-flex flex-column ms-5">
            <div>
              <GoLocation />
              {org.address}
            </div>
            <div>
              <BsTelephoneFill />
              {org.phone}
            </div>
            <div>
              <GoGlobe />
              <a
                target="_blank"
                rel="noreferrer"
                style={{ color: "rgb(33, 37, 41)" }}
                href={`${org.website}`}
              >
                Website
              </a>
            </div>
            <div>
              <GoMail />
              {org.email}
            </div>
          </div>
        </div>
      </div>
      <div className="d-flex flex-column align-items-center">
        <div className="fs-2">Reviews</div>
        <div className="reviews w-100 d-flex flex-column align-items-center">
          <Review />
        </div>
      </div>
    </div>
  );
}

export default OrgView;
