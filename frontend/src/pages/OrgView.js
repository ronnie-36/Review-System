import React, { useState } from "react";
import StarRatings from "react-star-ratings";
import { GoLocation, GoGlobe, GoMail } from "react-icons/go";
import { BsTelephoneFill } from "react-icons/bs";

import "./css/OrgView.css";
import Review from "../components/Review";
import NewReview from "../components/NewReview";

const org = {
  image: "/logo192.png",
  avgRating: 4.25,
  address: "IIT indore",
  phone: "+919010202398",
  website: "https://www.google.com",
  email: "sample@gmail.com",
  reviews: [
    {
      id: 1,
      author: "user 1.2.3",
      text: "text",
      rating: 2,
      videos: [
        {
          url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
          id: 1,
        },
        {
          url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
          id: 2,
        },
      ],
      images: [
        {
          url: "https://picsum.photos/500/300",
          id: 1,
        },
        {
          url: "https://picsum.photos/400/300",
          id: 2,
        },
      ],
      audios: [
        {
          url: "https://www2.cs.uic.edu/~i101/SoundFiles/StarWars60.wav",
          id: 1,
        },
        {
          url: "https://www2.cs.uic.edu/~i101/SoundFiles/StarWars60.wav",
          id: 2,
        },
      ],
    },
    {
      id: 2,
      author: "someone not user",
      text: "I enjoyed the services a lot",
      rating: 4,
      videos: [
        {
          url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
          id: 1,
        },
        {
          url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
          id: 2,
        },
      ],
      images: [
        {
          url: "https://picsum.photos/300/300",
          id: 1,
        },
        {
          url: "https://picsum.photos/400/400",
          id: 2,
        },
      ],
      audios: [],
    },
  ],
};

function OrgView() {
  const [addSection, setAddSection] = useState(false);

  return (
    <div className="min-vh-100">
      <div className="d-flex OrgView p-3">
        <div
          style={{ minHeight: "10rem" }}
          className="w-100 flex-wrap d-flex container-fluid org-dets align-items-center"
        >
          <img src={org.image} alt="Organization Logo" className="mh-100" />
          <div className="">
            <div className="fs-1 fw-bold">Organization Name</div>
            <div className="d-flex align-items-center">
              <StarRatings
                rating={org.avgRating}
                numberOfStars={5}
                starRatedColor="rgb(253,204,13)"
                starDimension="1rem"
              />
              <div className="d-flex ms-2 mt-3 align-items-end">
                <p className="fs-3 fst-italic ">{org.avgRating}</p>
                <p className="fs-4 fst-italic">/5</p>
              </div>
            </div>
          </div>
          <div className="d-flex flex-column">
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
        <div className=" mt-3 d-flex w-75">
          <div
            role="button"
            className={`section p-2 ${addSection ? "" : "selected"}`}
            onClick={() => setAddSection(false)}
          >
            Reviews
          </div>
          <div
            role="button"
            className={`section p-2 ${!addSection ? "" : "selected"}`}
            onClick={() => setAddSection(true)}
          >
            Add Review
          </div>
        </div>
        {!addSection ? (
          <div className=" mt-3 reviews w-100 d-flex flex-column align-items-center">
            {org.reviews.map((value) => {
              return <Review key={value.id} review={value} />;
            })}
          </div>
        ) : (
          <NewReview />
        )}
      </div>
    </div>
  );
}

export default OrgView;
