import React, { useState } from "react";
import StarRatings from "react-star-ratings";
import {
  BsFillArrowLeftCircleFill,
  BsFillArrowRightCircleFill,
} from "react-icons/bs";

import ModalImage from "./ModalImage";
import ModalVideo from "./ModalVideo";
import "./css/Review.css";
import { parseTime } from "./js/utils";

function Review({ review }) {
  const path = useState(window.location.pathname);

  const [index, setIndex] = useState(
    review.images.length + review.videos.length + review.audios.length
      ? 0
      : null
  );

  const getPrevMedia = () => {
    if (index === 0) {
      setIndex(
        review.images.length + review.videos.length + review.audios.length - 1
      );
    } else {
      setIndex((prevIndex) => prevIndex - 1);
    }
  };

  const getNextMedia = () => {
    if (
      index ===
      review.images.length + review.videos.length + review.audios.length - 1
    ) {
      setIndex(0);
    } else {
      setIndex((prevIndex) => prevIndex + 1);
    }
  };

  return (
    <div className="review p-5">
      <StarRatings
        rating={review.rating}
        numberOfStars={5}
        starRatedColor="rgb(253,204,13)"
        starDimension="1rem"
      />
      <div>{parseTime(review.time)}</div>
      <div className="">{review.text}</div>
      <div className="justify-content-around">Media</div>
      {review.images.length + review.videos.length + review.audios.length && (
        <div className="d-flex justify-content-between align-items-center">
          <BsFillArrowLeftCircleFill onClick={getPrevMedia} />
          {index < review.images.length ? (
            <ModalImage image={review.images[index]} />
          ) : index < review.images.length + review.videos.length ? (
            <ModalVideo video={review.videos[index - review.images.length]} />
          ) : (
            index <
              review.images.length +
                review.videos.length +
                review.audios.length && (
              <div
                className="mw-100 p-1 d-flex flex-column justify-content-center"
                style={{ height: "9rem" }}
              >
                <audio className="mw-100" controls>
                  <source
                    src={
                      review.audios[
                        index - review.images.length - review.videos.length
                      ].url
                    }
                  />
                </audio>
                <p style={{ textAlign: "center" }}>
                  {
                    review.audios[
                      index - review.images.length - review.videos.length
                    ].caption
                  }
                </p>
              </div>
            )
          )}
          <BsFillArrowRightCircleFill onClick={getNextMedia} />
        </div>
      )}
      {/* <div className="reviewImages d-flex flex-wrap">
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
      </div> */}
    </div>
  );
}

export default Review;
