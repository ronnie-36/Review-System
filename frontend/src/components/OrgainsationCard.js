import React from "react";
import "./OrgainsationCard.css";
import StarRatings from "react-star-ratings";

function OrgainsationCard({ name, rating }) {
  return (
    <>
      <div className="organistaion__card">
        <h2>{name}</h2>
        <StarRatings
          rating={rating}
          numberOfStars={5}
          starRatedColor="rgb(253,204,13)"
          starDimension="2rem"
        />
      </div>
    </>
  );
}

export default OrgainsationCard;
