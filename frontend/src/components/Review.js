import React from "react";
import StarRatings from "react-star-ratings";
import ModalImage from "./ModalImage";
import ModalVideo from "./ModalVideo";
import "./css/Review.css";

import { parseTime } from "./js/utils";

function Review({ review }) {
  //console.log(review);
  return (
    <div className="review p-5">
      <div className="fw-bold">{review.author}</div>
      <div>{parseTime(review.time)}</div>
      <StarRatings
        rating={review.rating}
        numberOfStars={5}
        starRatedColor="rgb(253,204,13)"
        starDimension="1rem"
      />
      <div className="">{review.text}</div>
      <div className="reviewImages d-flex flex-wrap">
        {review.images.map((value) => {
          return <ModalImage key={value.url} image={value} />;
        })}
      </div>
      <div className="reviewVideos d-flex flex-wrap">
        {review.videos.map((value) => {
          return <ModalVideo key={value.url} video={value} />;
        })}
      </div>
      <div className="reviewAudios d-flex flex-wrap">
        {review.audios.map((value) => {
          return (
            <div key={value.url} className="mw-100 p-1">
              <audio className="mw-100" controls>
                <source src={value.url} />
              </audio>
              <p>{value.caption}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Review;
