import React, { useEffect, useState, useMemo } from "react";
import StarRatings from "react-star-ratings";
import { GoLocation, GoGlobe, GoMail } from "react-icons/go";
import { BsTelephoneFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import {
  Pagination,
  PaginationItem,
  PaginationLink,
  Spinner,
} from "reactstrap";
import { toast } from "react-toastify";

import "./css/OrgView.css";
import Review from "../components/Review";
import NewReview from "../components/NewReview";
import Header from "../components/Header";
import { fetchReviewsByOrg } from "../apiHelpers/review";
import { Loader } from "@googlemaps/js-api-loader";
import initMap from "./js/orgMap";

function OrgView({ logged, setLogged, userID, org }) {
  const [addSection, setAddSection] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  const [reviews, setReviews] = useState(null);
  const [avgRating, setavgRating] = useState(0);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  const pageSize = 5;
  const navigate = useNavigate();

  const loader = useMemo(
    () =>
      new Loader({
        apiKey: process.env.REACT_APP_GOOGLE_MAP_API_KEY,
        version: "weekly",
        libraries: ["places"],
      }),
    []
  );

  const getReviews = async () => {
    const response = await fetchReviewsByOrg(org.orgID);
    if (response.status === "success") {
      setReviews(response.reviews);
      setPageCount(Math.ceil(response.reviews.length / pageSize));
      if (response.reviews.length !== 0) {
        setavgRating(
          Math.round((response.reviews.reduce((total, review) => total + review.rating, 0) /
            response.reviews.length) * 100) / 100
        );
      }
    } else {
      toast.error("Unable to fetch reviews");
    }
  };

  useEffect(() => {
    if (org === null) {
      navigate("/");
    } else if (reviews === null) {
      setReviewsLoading(true);
      (async () => {
        // await getReviews();
        const response = await fetchReviewsByOrg(org.orgID);
        if (response.status === "success") {
          setReviews(response.reviews);
          setPageCount(Math.ceil(response.reviews.length / pageSize));
          if (response.reviews.length !== 0) {
            setavgRating(
              Math.round((response.reviews.reduce((total, review) => total + review.rating, 0) /
                response.reviews.length) * 100) / 100
            );
          }
        } else {
          toast.error("Unable to fetch reviews");
        }
      })();
      setReviewsLoading(false);
      (async () => {
        await loader
          .load()
          .then((google) => {
            initMap(google, org.loc_lat, org.loc_long);
          })
          .catch((err) => {
            toast.error("Unable to Load Map");
          });
      })();
    }
  }, [org, addSection, navigate, loader, reviews]);

  const handleClick = (e, index) => {
    e.preventDefault();
    setCurrentPage(index);
  };
  if (!org) {
    return (
      <div className="vw-100 mt-5 d-flex flex-row justify-content-center align-items-center">
        <Spinner>Loading...</Spinner>
      </div>
    );
  }
  return (
    <div className="min-vh-100">
      <Header logged={logged} setLogged={setLogged} />
      {/* org details header */}
      <div className="d-flex OrgView p-3">
        <div
          style={{ minHeight: "10rem" }}
          className="w-100 flex-wrap d-flex container-fluid org-dets align-items-center"
        >
          <div className="">
            <div className="fs-5 fw-bold">{org.name}</div>
            {reviews && (
              <div className="d-flex align-items-center">
                <StarRatings
                  rating={avgRating}
                  numberOfStars={5}
                  starRatedColor="rgb(253,204,13)"
                  starDimension="1rem"
                />
                <div className="d-flex ms-2 mt-3 align-items-end">
                  <p className="fs-3 fst-italic ">{avgRating}</p>
                  <p className="fs-4 fst-italic">/5</p>
                  <p className="fs-5 fst-italic">({reviews.length})</p>
                </div>
              </div>
            )}
          </div>
          <div className="d-flex flex-column small-dets">
            <div className="d-flex">
              <GoLocation />
              <div>{org.address}</div>
            </div>
            <div className="d-flex">
              <BsTelephoneFill />
              <div>{org.phone}</div>
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
              {org.email ? org.email : "NA"}
            </div>
          </div>
          <div id="static-map"></div>
        </div>
      </div>
      <div className="d-flex flex-column align-items-center">
        <div className=" mt-3 d-flex w-75">
          <div
            role="button"
            className={`fw-bold section p-2 ${addSection ? "" : "selected"}`}
            onClick={() => setAddSection(false)}
          >
            Reviews
          </div>
          <div
            role="button"
            className={`fw-bold section p-2 ${!addSection ? "" : "selected"}`}
            onClick={() => {
              if (logged) setAddSection(true);
              else {
                toast.error("Log in to add a review", {
                  position: "top-right",
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                });
              }
            }}
          >
            Add Review
          </div>
        </div>
        {!addSection ? (
          !reviewsLoading && reviews ? (
            <div className=" mt-3 reviews w-100 d-flex flex-column align-items-center">
              {reviews
                .slice(currentPage * pageSize, (currentPage + 1) * pageSize)
                .map((value) => {
                  return <Review key={value.reviewID} review={value} />;
                })}
            </div>
          ) : (
            <Spinner>Loading...</Spinner>
          )
        ) : logged ? (
          <NewReview
            org={org}
            userID={userID}
            setAddSection={setAddSection}
            getReveiws={getReviews}
          />
        ) : (
          <div>Please Log in first to add a review</div>
        )}
        {!addSection && reviews && reviews.length !== 0 && (
          <Pagination aria-label="Page navigation example">
            <PaginationItem disabled={currentPage <= 0}>
              <PaginationLink
                onClick={(e) => handleClick(e, 0)}
                first
                href="#"
              />
            </PaginationItem>
            <PaginationItem disabled={currentPage <= 0}>
              <PaginationLink
                onClick={(e) => handleClick(e, currentPage - 1)}
                previous
                href="#"
              />
            </PaginationItem>
            {[...Array(pageCount)].map((_, i) => (
              <PaginationItem active={i === currentPage} key={i}>
                <PaginationLink onClick={(e) => handleClick(e, i)} href="#">
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem disabled={currentPage >= pageCount - 1}>
              <PaginationLink
                onClick={(e) => handleClick(e, currentPage + 1)}
                next
                href="#"
              />
            </PaginationItem>
            <PaginationItem disabled={currentPage >= pageCount - 1}>
              <PaginationLink
                onClick={(e) => handleClick(e, 0)}
                last
                href="#"
              />
            </PaginationItem>
          </Pagination>
        )}
      </div>
    </div>
  );
}

export default OrgView;
