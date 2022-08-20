import React from "react";
import StarRatings from "react-star-ratings";
import ModalImage from "./ModalImage";
import ModalVideo from "./ModalVideo";

const review = {
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
      id: 1,
    },
  ],
  images: [
    {
      url: "https://picsum.photos/500/300",
      id: 1,
    },
    {
      url: "https://picsum.photos/500/300",
      id: 2,
    },
  ],
};

function Review() {
  //console.log(review);
  return (
    <div className="review w-50">
      <div className="fw-bold">{review.author}</div>
      <StarRatings
        rating={review.rating}
        numberOfStars={5}
        starRatedColor="rgb(253,204,13)"
        starDimension="1rem"
      />
      <div className="">{review.text}</div>
      <div className="reviewImages d-flex flex-wrap">
        {review.images.map((value) => {
          return <ModalImage key={value.id} image={value} />;
        })}
      </div>
      <div className="reviewVideos d-flex flex-wrap">
        {review.videos.map((value) => {
          return <ModalVideo key={value.id} video={value} />;
        })}
      </div>
    </div>
  );
}

export default Review;
