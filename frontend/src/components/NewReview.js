import React, { useState } from "react";
import "react-dropzone-uploader/dist/styles.css";
import { Form, FormGroup, Label, Input, Button } from "reactstrap";
import Dropzone from "react-dropzone-uploader";
import StarRatings from "react-star-ratings";

function NewReview() {
  const [newReview, setNewReview] = useState({
    rating: 0,
    text: "",
    videos: [],
    images: [],
    audios: [],
  });

  const [error, setError] = useState(false);

  const checkImageValidation = () => {
    return true;
  };

  const checkVideoValidation = () => {
    return true;
  };

  const checkAudioValidation = () => {
    return true;
  };

  const submitReview = () => {
    if (newReview.text.length > 20) {
      setError(true);
    }
  };

  const handleChangeStatus = ({ meta, file }, status) => {
    const imagePattern = /image\/\w+/,
      videoPattern = /video\/\w+/,
      audioPattern = /audio\/\w+/;
    if (status === "done") {
      if (imagePattern.test(file.type)) {
        const newFile = { id: meta.id, meta: meta, file: file };
        setNewReview((oldReview) => {
          return { ...oldReview, images: [...oldReview.images, newFile] };
        });
      } else if (videoPattern.test(file.type)) {
        const newFile = { id: meta.id, meta: meta, file: file };
        setNewReview((oldReview) => {
          return { ...oldReview, videos: [...oldReview.videos, newFile] };
        });
      } else if (audioPattern.test(file.type)) {
        const newFile = { id: meta.id, meta: meta, file: file };
        setNewReview((oldReview) => {
          return { ...oldReview, videos: [...oldReview.audios, newFile] };
        });
      }
    } else if (status === "removed") {
      if (imagePattern.test(file.type)) {
        let prevReview = newReview;
        const newImages = prevReview.images.filter(
          (value) => value.id !== meta.id
        );
        setNewReview((oldReview) => {
          return { ...oldReview, images: [...newImages] };
        });
      } else if (videoPattern.test(file.type)) {
        let prevReview = newReview;
        const newVideos = prevReview.videos.filter(
          (value) => value.id !== meta.id
        );
        setNewReview((oldReview) => {
          return { ...oldReview, videos: [...newVideos] };
        });
      } else if (audioPattern.test(file.type)) {
        let prevReview = newReview;
        const newAudios = prevReview.audios.filter(
          (value) => value.id !== meta.id
        );
        setNewReview((oldReview) => {
          return { ...oldReview, audios: [...newAudios] };
        });
      }
    }
    console.log(status, meta, file);
  };

  return (
    <div className="w-75 pt-3">
      <Form className="newReviewSection p-3">
        <FormGroup className="d-flex flex-column">
          <Label for="rating">Rating</Label>
          <StarRatings
            rating={newReview.rating}
            starRatedColor="rgb(253,204,13)"
            changeRating={(newRating, _) =>
              setNewReview((prevReview) => {
                return { ...prevReview, rating: newRating };
              })
            }
            starDimension="2rem"
            numberOfStars={5}
            id="rating"
          />
        </FormGroup>
        <FormGroup>
          <Label for="newReviewText">{`Review (Maximum 200 characters)`}</Label>
          <Input
            id="newReviewText"
            value={newReview.text}
            onChange={(e) => {
              setError(false);
              setNewReview((prevReview) => {
                return { ...prevReview, text: e.target.value };
              });
            }}
            type="textarea"
          />
          <p className="text-danger">
            {error ? "Review cannot be more than 200 characters" : ""}
          </p>
        </FormGroup>
        <FormGroup>
          <Label for="dropzone">Add Photos, Videos or Audio</Label>
          <Dropzone
            id="dropzone"
            onChangeStatus={handleChangeStatus}
            accept={`${checkImageValidation() ? "image/*," : ""}${
              checkVideoValidation() ? "video/*," : ""
            }${checkAudioValidation() ? "audio/*" : ""}`}
            inputContent={(_, extra) => {
              return extra.reject
                ? "Image, audio and video files only"
                : "Add attachments";
            }}
            inputWithFilesContent={(_, extra) => {
              return extra.reject
                ? /image\/\w+/.test(extra.dragged[0].type)
                  ? "Image Limit reached for the review"
                  : /video\/\w+/.test(extra.dragged[0].type)
                  ? "Video Limit Reached"
                  : /audio\/\w+/.test(extra.dragged[0].type)
                  ? "Audio Limit Reached"
                  : "Image, audio and video files only"
                : "Add Files";
            }}
            styles={{
              dropzone: { backgroundColor: "#fff", minHeight: "10rem" },
              dropzoneReject: { borderColor: "red", backgroundColor: "#DAA" },
              inputLabel: (_, extra) => (extra.reject ? { color: "red" } : {}),
            }}
          />
        </FormGroup>

        <Button onClick={() => submitReview()} color="primary">
          Submit
        </Button>
      </Form>
    </div>
  );
}

export default NewReview;
