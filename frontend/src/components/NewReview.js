import React, { useState } from "react";
import "react-dropzone-uploader/dist/styles.css";
import { Form, FormGroup, Label, Input, Button, Spinner } from "reactstrap";
import Dropzone from "react-dropzone-uploader";
import StarRatings from "react-star-ratings";
import PreviewMedia from "./PreviewMedia";
import { postReview, getIPFSclient } from "../apiHelpers/review";
import { toast } from "react-toastify";

function NewReview({ org, setAddSection, reviews, setReviews }) {
  const [newReview, setNewReview] = useState({
    rating: 0,
    text: "",
    videos: [],
    images: [],
    audios: [],
  });
  const [addReviewLoading, setAddReviewLoading] = useState(false);

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

  const submitReview = async () => {
    setAddReviewLoading(true);
    console.log(newReview);
    if (newReview.text.length > 200) {
      setError(true);
    }

    let ipfs = await getIPFSclient();
    const result = await ipfs.add(newReview.text);
    if (!result) {
      toast.error("Error adding review text.");
      setAddReviewLoading(false);
      return;
    }

    let review = {
      text: result.path,
      rating: newReview.rating,
      org: org.orgID,
      images: [], //{mediaref:"",caption:""}
      videos: [],
      audios: [],
    };

    let dummyReview = {
      text: newReview.text,
      rating: newReview.rating,
      org: org.orgID,
      time: new Date().toISOString(),
      images: [], //{url:"",caption:""}
      videos: [],
      audios: [],
    };

    //image upload section for reviews
    for (const image of newReview.images) {
      if (ipfs) {
        const fileResult = await ipfs.add(image.file);
        const captionResult = await ipfs.add(image.caption);
        if (fileResult && captionResult) {
          review.images.push({ mediaref: fileResult.path, caption: captionResult.path });
          dummyReview.images.push({
            url: process.env.REACT_APP_IPFS_URL.concat(fileResult.path),
            caption: image.caption
          });
        } else {
          toast.error("Unable to upload images");
          setAddReviewLoading(false);
          return;
        }
      } else {
        toast.error("Unable to upload images");
        setAddReviewLoading(false);
        return;
      }
    }

    //video upload
    for (const video of newReview.videos) {
      if (ipfs) {
        const fileResult = await ipfs.add(video.file);
        const captionResult = await ipfs.add(video.caption);
        if (fileResult && captionResult) {
          review.videos.push({ mediaref: fileResult.path, caption: captionResult.path });
          dummyReview.videos.push({
            url: process.env.REACT_APP_IPFS_URL.concat(fileResult.path),
            caption: video.caption
          });
        } else {
          toast.error("Unable to upload videos");
          setAddReviewLoading(false);
          return;
        }
      } else {
        toast.error("Unable to upload videos");
        setAddReviewLoading(false);
        return;
      }
    }

    //audio upload
    for (const audio of newReview.audios) {
      if (ipfs) {
        const fileResult = await ipfs.add(audio.file);
        const captionResult = await ipfs.add(audio.caption);
        if (fileResult && captionResult) {
          review.audios.push({ mediaref: fileResult.path, caption: captionResult.path });
          dummyReview.audios.push({
            url: process.env.REACT_APP_IPFS_URL.concat(fileResult.path),
            caption: audio.caption
          });
        } else {
          toast.error("Unable to upload audios");
          setAddReviewLoading(false);
          return;
        }
      } else {
        toast.error("Unable to upload audios");
        setAddReviewLoading(false);
        return;
      }
    }

    const response = await postReview(review);

    if (response.status === "success") {
      await setReviews([...reviews, dummyReview]);
      setNewReview({
        rating: 0,
        text: "",
        videos: [],
        images: [],
        audios: [],
      });
      toast.success("Review added successfully");
      setAddSection(false);
    } else {
      toast.error("unable to add the review");
    }

    setAddReviewLoading(false);
  };

  const handleChangeStatus = ({ meta, file }, status) => {
    const imagePattern = /image\/\w+/,
      videoPattern = /video\/\w+/,
      audioPattern = /audio\/\w+/;
    if (status === "done") {
      if (imagePattern.test(file.type)) {
        const newFile = { id: meta.id, meta: meta, file: file, caption: "" };
        setNewReview((oldReview) => {
          return { ...oldReview, images: [...oldReview.images, newFile] };
        });
      } else if (videoPattern.test(file.type)) {
        const newFile = { id: meta.id, meta: meta, file: file, catption: "" };
        setNewReview((oldReview) => {
          return { ...oldReview, videos: [...oldReview.videos, newFile] };
        });
      } else if (audioPattern.test(file.type)) {
        const newFile = { id: meta.id, meta: meta, file: file, caption: "" };
        setNewReview((oldReview) => {
          return { ...oldReview, audios: [...oldReview.audios, newFile] };
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
          <Label for="rating" className="fw-bold">
            Rating
          </Label>
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
          <Label
            className="fw-bold"
            for="newReviewText"
          >{`Review (Maximum 200 characters)`}</Label>
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
          <Label className="fw-bold" for="dropzone">
            Add Photos, Videos or Audio
          </Label>
          <Dropzone
            id="dropzone"
            onChangeStatus={handleChangeStatus}
            PreviewComponent={(props) => {
              return PreviewMedia({
                ...props,
                newReview: newReview,
                setNewReview: setNewReview,
              });
            }}
            accept={`${checkImageValidation() ? "image/*," : ""}${checkVideoValidation() ? "video/*," : ""
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

        <Button
          disabled={addReviewLoading}
          onClick={() => submitReview()}
          color="primary"
        >
          {addReviewLoading ? <Spinner>Adding..</Spinner> : "Submit"}
        </Button>
      </Form>
    </div>
  );
}

export default NewReview;
